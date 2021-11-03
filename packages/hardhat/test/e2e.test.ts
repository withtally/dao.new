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
  MINTER_ADMIN_ROLE,
  BURNER_ADMIN_ROLE,
  BASE_URI_ADMIN_ROLE,
  MINTER_ROLE,
  BURNER_ROLE,
  BASE_URI_ROLE,
  DEFAULT_ADMIN_ROLE,
} from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  FixedPriceSequentialMinter,
  ERC721DAOToken,
  ERC721Governor,
  ERC721Timelock,
  ERC721Timelock__factory,
  ERC721DAOToken__factory,
  ERC721Governor__factory,
  FixedPriceSequentialMinter__factory,
  FixedPriceSpecificIDMinter__factory,
  FixedPriceSpecificIDMinter,
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

let tokenImpl: ERC721DAOToken;
let timelockImpl: ERC721Timelock;
let governorImpl: ERC721Governor;
let simpleMinterImpl: FixedPriceSequentialMinter;
let idMinterImpl: FixedPriceSpecificIDMinter;

let token: ERC721DAOToken;
let timelock: ERC721Timelock;
let governor: ERC721Governor;
let simpleMinter: FixedPriceSequentialMinter;
let idMinter: FixedPriceSpecificIDMinter;
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
  tokenImpl = await deployToken(signer);
  timelockImpl = await deployTimelock(signer);
  governorImpl = await deployGovernor(signer);
  simpleMinterImpl = await deployMinter(signer);
  idMinterImpl = await new FixedPriceSpecificIDMinter__factory(signer).deploy();
  deployer = await deployAndInitDeployer(
    signer,
    tokenImpl,
    timelockImpl,
    governorImpl,
    [simpleMinterImpl.address, idMinterImpl.address]
  );
};

const cloneWithFixedPriceSequentialMinter = async () => {
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
      implementationIndex: 0,
      startingBlock: STARTING_BLOCK,
      creatorShares: FOUNDER_SHARES,
      daoShares: DAO_SHARES,
      extraInitCallData: simpleMinterImpl.interface.encodeFunctionData("init", [
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
  simpleMinter = new FixedPriceSequentialMinter__factory(signer).attach(
    event?.args?.minter
  );

  await simpleMinter.connect(creator).unpause();
};

const cloneWithIDMinter = async () => {
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
      implementationIndex: 1,
      startingBlock: STARTING_BLOCK,
      creatorShares: FOUNDER_SHARES,
      daoShares: DAO_SHARES,
      extraInitCallData: idMinterImpl.interface.encodeFunctionData("init", [
        MAX_TOKENS,
        TOKEN_PRICE,
      ]),
    }
  );
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  token = new ERC721DAOToken__factory(signer).attach(event?.args?.token);
  timelock = new ERC721Timelock__factory(signer).attach(event?.args?.timelock);
  governor = new ERC721Governor__factory(signer).attach(event?.args?.governor);
  idMinter = new FixedPriceSpecificIDMinter__factory(signer).attach(
    event?.args?.minter
  );

  await idMinter.connect(creator).unpause();
};

describe("End to end flows", () => {
  before(deploy);

  describe("Using FixedPriceSequentialMinter", async () => {
    before(cloneWithFixedPriceSequentialMinter);

    it("lets users mint", async () => {
      let expectedMinterBalance = 0;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      await simpleMinter.connect(user1).mint(4, {
        value: TOKEN_PRICE * 4,
      });
      expectedMinterBalance += TOKEN_PRICE * 4;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      await simpleMinter.connect(user2).mint(1, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        expectedMinterBalance
      );

      await simpleMinter.connect(user3).mint(1, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
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
      expect(await ethers.provider.getBalance(simpleMinter.address)).to.equal(
        totalProceeds
      );
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(0);
      const expectedFounderProfit = FOUNDER_REWARD * totalProceeds;
      const expectedDAOProfit = totalProceeds - expectedFounderProfit;

      await expect(() =>
        simpleMinter.release(creator.address)
      ).to.changeEtherBalance(creator, expectedFounderProfit);
      await simpleMinter.release(timelock.address);
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

  describe("Using FixedPriceSpecificIDMinter", async () => {
    before(cloneWithIDMinter);

    it("lets users mint", async () => {
      let expectedMinterBalance = 0;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      await idMinter.connect(user1).mint(0, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      await idMinter.connect(user2).mint(1, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      await idMinter.connect(user3).mint(2, {
        value: TOKEN_PRICE,
      });
      expectedMinterBalance += TOKEN_PRICE;
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        expectedMinterBalance
      );

      expect(await token.ownerOf(0)).equals(user1.address);
      expect(await token.ownerOf(1)).equals(user2.address);
      expect(await token.ownerOf(2)).equals(user3.address);
    });

    it("allows founder and DAO to withdraw minting funds", async () => {
      const totalSupply = await token.totalSupply();
      const totalProceeds = TOKEN_PRICE * totalSupply.toNumber();
      expect(await ethers.provider.getBalance(idMinter.address)).to.equal(
        totalProceeds
      );
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(0);
      const expectedFounderProfit = FOUNDER_REWARD * totalProceeds;
      const expectedDAOProfit = totalProceeds - expectedFounderProfit;

      await expect(() =>
        idMinter.release(creator.address)
      ).to.changeEtherBalance(creator, expectedFounderProfit);
      await idMinter.release(timelock.address);
      expect(await ethers.provider.getBalance(timelock.address)).to.equal(
        expectedDAOProfit
      );
    });
  });

  describe("Token Roles", async () => {
    before(cloneWithIDMinter);

    it("creator is admin of all roles: minter, burner and base URI, and doesn't have default admin", async () => {
      expect(await token.hasRole(MINTER_ADMIN_ROLE, creator.address)).to.be
        .true;
      expect(await token.hasRole(BURNER_ADMIN_ROLE, creator.address)).to.be
        .true;
      expect(await token.hasRole(BASE_URI_ADMIN_ROLE, creator.address)).to.be
        .true;

      // DEFAULT_ADMIN_ROLE can be risky, best not to have it.
      expect(await token.hasRole(DEFAULT_ADMIN_ROLE, creator.address)).to.be
        .false;
    });

    it("creator can assign minter, burner and base URI roles", async () => {
      await token.connect(creator).grantRole(MINTER_ROLE, rando.address);
      await token.connect(creator).grantRole(BURNER_ROLE, user3.address);
      await token.connect(creator).grantRole(BASE_URI_ROLE, user2.address);
    });

    it("creator can renounce admin roles and then cannot assign them any longer", async () => {
      await token
        .connect(creator)
        .renounceRole(MINTER_ADMIN_ROLE, creator.address);
      await token
        .connect(creator)
        .renounceRole(BURNER_ADMIN_ROLE, creator.address);
      await token
        .connect(creator)
        .renounceRole(BASE_URI_ADMIN_ROLE, creator.address);

      await expect(
        token.connect(creator).grantRole(MINTER_ROLE, user1.address)
      ).to.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0x70480ee89cb38eff00b7d23da25713d52ce19c6ed428691d22c58b2f615e3d67`
      );
      await expect(
        token.connect(creator).grantRole(BURNER_ROLE, user2.address)
      ).to.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0xc8d1ad9d415224b751d781cc8214ccfe7c47716e13229475443f04f1ebddadc6`
      );
      await expect(
        token.connect(creator).grantRole(BASE_URI_ROLE, user3.address)
      ).to.revertedWith(
        `AccessControl: account ${creator.address.toLowerCase()} is missing role 0xe0d0d9e49dfab9a7a7b34707b3c82b3f11c47969a80cdc398ea138bce37e99a9`
      );
    });
  });
});
