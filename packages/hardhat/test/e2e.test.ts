import chai from "chai";
import { ethers } from "hardhat";
import { solidity } from "ethereum-waffle";
import {
  deployToken,
  deployFixedPriceMinter,
  initToken,
  deployTimelock,
  deployGovernor,
  deployMinter,
  deployCloneFactory,
  cloneToken,
  ADMIN_ROLE,
  cloneTimelock,
  cloneGovernor,
  cloneMinter,
} from "./utils";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  FixedPriceMinter,
  ERC721DAOToken,
  TimelockControllerUpgradeable,
  ERC721Governor,
  CloneFactory,
  ERC721Timelock,
} from "../../frontend/types/typechain";
import { BigNumberish } from "@ethersproject/bignumber";
import { Signer } from "crypto";

chai.use(solidity);
const { expect } = chai;
const zeroAddress = "0x0000000000000000000000000000000000000000";

// Token Config
const BASE_URI =
  "ipfs://bafybeif4s7oom2ch6iv42yn7la4b3dnkud2dgujmnhuxuswekx4l6yz4me/";

// Minter Config
const MAX_TOKENS = 10;
const TOKEN_PRICE_ETH = 0.1;
const TOKEN_PRICE = ethers.utils.parseEther(TOKEN_PRICE_ETH.toString());
const MAX_MINTS_PER_WALLET = 10;
const TOTAL_SHARES = 10000;
const FOUNDER_REWARD = 0.05;
const FOUNDER_SHARES = FOUNDER_REWARD * TOTAL_SHARES;
const DAO_SHARES = TOTAL_SHARES - FOUNDER_SHARES;

// Governance Config
const QUORUM_NUMERATOR = 1; // 1%
const VOTING_PERIOD = 5_760; // About 24 hours with 15s blocks
const VOTING_DELAY = 1; // 1 block
const TIMELOCK_DELAY = 172_800; // 2 days

let deployer: SignerWithAddress;
let founder: SignerWithAddress;
let user1: SignerWithAddress;
let user2: SignerWithAddress;
let user3: SignerWithAddress;

let token: ERC721DAOToken;
let timelock: ERC721Timelock;
let governor: ERC721Governor;
let minter: FixedPriceMinter;
let factory: CloneFactory;

const deploy = async () => {
  [deployer, founder, user1, user2, user3] = await ethers.getSigners();

  // Deploy logic contracts
  const tokenImpl = await deployToken(deployer);
  const timelockImpl = await deployTimelock(deployer);
  const governorImpl = await deployGovernor(deployer);
  const minterImpl = await deployMinter(deployer);
  factory = await deployCloneFactory(deployer);

  await factory.addImplementation(tokenImpl.address, "token");
  await factory.addImplementation(timelockImpl.address, "timelock");
  await factory.addImplementation(governorImpl.address, "governor");
  await factory.addImplementation(minterImpl.address, "minter");

  token = await cloneToken(
    deployer,
    factory,
    tokenImpl,
    0,
    BASE_URI,
    [ADMIN_ROLE],
    [deployer.address]
  );

  timelock = await cloneTimelock(
    deployer,
    factory,
    timelockImpl,
    1,
    TIMELOCK_DELAY,
    [],
    []
  );

  governor = await cloneGovernor(
    deployer,
    factory,
    governorImpl,
    2,
    token.address,
    timelock.address,
    VOTING_DELAY,
    VOTING_PERIOD,
    QUORUM_NUMERATOR
  );

  const payees: string[] = [founder.address, timelock.address];
  const shares: BigNumberish[] = [FOUNDER_SHARES, DAO_SHARES];

  minter = await cloneMinter(
    deployer,
    factory,
    minterImpl,
    3,
    token.address,
    MAX_TOKENS,
    TOKEN_PRICE,
    MAX_MINTS_PER_WALLET,
    payees,
    shares
  );

  // Token permissions
  await token.grantRole(await token.ADMIN_ROLE(), timelock.address);
  await token.grantRole(await token.MINTER_ROLE(), minter.address);
  await token.revokeRole(await token.ADMIN_ROLE(), deployer.address);

  // Timelock permissions: DAO is admin and proposer; executor remains open
  await timelock.grantRole(await timelock.PROPOSER_ROLE(), governor.address);
  await timelock.revokeRole(
    await timelock.TIMELOCK_ADMIN_ROLE(),
    deployer.address
  );
};

describe("End to end flows", () => {
  before(deploy);

  it("lets users mint", async () => {
    await minter.connect(user1).mint(4, {
      value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 4).toString()),
    });
    await minter.connect(user2).mint(1, {
      value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 1).toString()),
    });
    await minter.connect(user3).mint(1, {
      value: ethers.utils.parseEther((TOKEN_PRICE_ETH * 1).toString()),
    });

    expect(await token.ownerOf(1)).equals(user1.address);
    expect(await token.ownerOf(2)).equals(user1.address);
    expect(await token.ownerOf(3)).equals(user1.address);
    expect(await token.ownerOf(4)).equals(user1.address);
    expect(await token.ownerOf(5)).equals(user2.address);
    expect(await token.ownerOf(6)).equals(user3.address);
  });
});
