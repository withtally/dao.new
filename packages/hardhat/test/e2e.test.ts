import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import {
  deployToken,
  deployTimelock,
  deployGovernor,
  deployMinter,
  propose,
  hashString,
  advanceBlocks,
  setNextBlockTimestamp,
  createTransferProp,
  deployAndInitDeployer,
} from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  FixedPriceMinter,
  ERC721DAOToken,
  ERC721Governor,
  ERC721Timelock,
  ERC721Timelock__factory,
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  FixedPriceMinter__factory,
} from "../../frontend/types/typechain";
import { ERC721DAODeployer } from "../../frontend/types/typechain/ERC721DAODeployer";
import { Wallet } from "@ethersproject/wallet";

chai.use(solidity);
const { expect } = chai;
const zeroAddress = "0x0000000000000000000000000000000000000000";

// Token Config
const BASE_URI =
  "ipfs://bafybeif4s7oom2ch6iv42yn7la4b3dnkud2dgujmnhuxuswekx4l6yz4me/";

// Minter Config
const MAX_TOKENS = 10;
const TOKEN_PRICE = 100;
const MAX_MINTS_PER_WALLET = 10;
const STARTING_BLOCK = 1;
const TOTAL_SHARES = 10000;
const FOUNDER_REWARD = 0.05;
const FOUNDER_SHARES = FOUNDER_REWARD * TOTAL_SHARES;
const DAO_SHARES = TOTAL_SHARES - FOUNDER_SHARES;

// Governance Config
const PROP_THRESHOLD = 1;
const QUORUM_NUMERATOR = 1; // 1%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block
const TIMELOCK_DELAY = 172_800; // 2 days

let signer: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;
let rando: SignerWithAddress;
let creator: Wallet;

let token: ERC721DAOToken;
let timelock: ERC721Timelock;
let governor: ERC721Governor;
let minter: FixedPriceMinter;
let deployer: ERC721DAODeployer;

const deploy = async () => {
  [signer, user1, user2, user3, rando] = await ethers.getSigners();

  creator = new Wallet(Wallet.createRandom().privateKey, signer.provider);

  const giveCreatorEth = {
    to: creator.address,
    value: ethers.utils.parseEther("50"),
  };
  await user1.sendTransaction(giveCreatorEth);

  // Deploy logic contracts
  const tokenImpl = await deployToken(signer);
  const timelockImpl = await deployTimelock(signer);
  const governorImpl = await deployGovernor(signer);
  const minterImpl = await deployMinter(signer);
  deployer = await deployAndInitDeployer(
    signer,
    tokenImpl,
    timelockImpl,
    governorImpl,
    minterImpl
  );

  const tx = await deployer.clone(
    creator.address,
    {
      name: "MyToken",
      symbol: "MT",
      baseURI: BASE_URI,
    },
    {
      name: "GovName",
      proposalThreshold: PROP_THRESHOLD,
      votingDelay: VOTING_DELAY,
      votingPeriod: VOTING_PERIOD,
      quorumNumerator: QUORUM_NUMERATOR,
      timelockDelay: TIMELOCK_DELAY,
    },
    {
      startingBlock: STARTING_BLOCK,
      creatorShares: FOUNDER_SHARES,
      daoShares: DAO_SHARES,
      extraInitCallData: minterImpl.interface.encodeFunctionData("init", [
        MAX_TOKENS,
        TOKEN_PRICE,
        MAX_MINTS_PER_WALLET,
      ]),
    }
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  token = new ERC721DAOToken__factory(signer).attach(event?.args?.token);
  timelock = new ERC721Timelock__factory(signer).attach(event?.args?.timelock);
  governor = new ERC721Governor__factory(signer).attach(event?.args?.governor);
  minter = new FixedPriceMinter__factory(signer).attach(event?.args?.minter);

  await minter.connect(creator).unpause();
};

describe("End to end flows", () => {
  before(deploy);

  it("lets users mint", async () => {
    let expectedMinterBalance = 0;
    expect(await ethers.provider.getBalance(minter.address)).to.equal(
      expectedMinterBalance
    );

    await minter.connect(user1).mint(4, {
      value: TOKEN_PRICE * 4,
    });
    expectedMinterBalance += TOKEN_PRICE * 4;
    expect(await ethers.provider.getBalance(minter.address)).to.equal(
      expectedMinterBalance
    );

    await minter.connect(user2).mint(1, {
      value: TOKEN_PRICE,
    });
    expectedMinterBalance += TOKEN_PRICE;
    expect(await ethers.provider.getBalance(minter.address)).to.equal(
      expectedMinterBalance
    );

    await minter.connect(user3).mint(1, {
      value: TOKEN_PRICE,
    });
    expectedMinterBalance += TOKEN_PRICE;
    expect(await ethers.provider.getBalance(minter.address)).to.equal(
      expectedMinterBalance
    );

    expect(await token.ownerOf(1)).equals(user1.address);
    expect(await token.ownerOf(2)).equals(user1.address);
    expect(await token.ownerOf(3)).equals(user1.address);
    expect(await token.ownerOf(4)).equals(user1.address);
    expect(await token.ownerOf(5)).equals(user2.address);
    expect(await token.ownerOf(6)).equals(user3.address);
  });

  it("allows founder and DAO to withdraw minting funds", async () => {
    const totalSupply = await token.totalSupply();
    const totalProceeds = TOKEN_PRICE * totalSupply.toNumber();
    expect(await ethers.provider.getBalance(minter.address)).to.equal(
      totalProceeds
    );
    expect(await ethers.provider.getBalance(timelock.address)).to.equal(0);
    const expectedFounderProfit = FOUNDER_REWARD * totalProceeds;
    const expectedDAOProfit = totalProceeds - expectedFounderProfit;

    await expect(() => minter.release(creator.address)).to.changeEtherBalance(
      creator,
      expectedFounderProfit
    );
    await minter.release(timelock.address);
    expect(await ethers.provider.getBalance(timelock.address)).to.equal(
      expectedDAOProfit
    );
  });

  it("allows DAO to spend via proposals", async () => {
    const targets = [rando.address];
    const values = [TOKEN_PRICE];
    const callDatas = ["0x"];
    const description = "description";
    const descriptionHash = hashString(description);

    const propInfo = createTransferProp(rando.address, TOKEN_PRICE);

    const proposalId = await propose(user1, governor, propInfo);
    await advanceBlocks(VOTING_DELAY);

    await governor.connect(user1).castVote(proposalId, 1);
    await advanceBlocks(VOTING_PERIOD);

    await governor.queue(targets, values, callDatas, descriptionHash);
    const eta = await governor.proposalEta(proposalId);
    await setNextBlockTimestamp(eta.toNumber(), false);

    expect(() =>
      governor.execute(targets, values, callDatas, descriptionHash)
    ).to.changeEtherBalance(rando, TOKEN_PRICE);
  });
});
