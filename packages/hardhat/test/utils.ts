import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ERC721DAOToken,
  ERC721DAOToken__factory,
  CloneFactory,
  CloneFactory__factory,
  FixedPriceMinter,
  FixedPriceMinter__factory,
  ERC721Governor,
  ERC721Governor__factory,
  ERC721Timelock,
  ERC721Timelock__factory,
} from "../../frontend/types/typechain";
import { BigNumberish } from "@ethersproject/bignumber";

const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;
export const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
export const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
export const BURNER_ROLE = keccak256(toUtf8Bytes("BURNER_ROLE"));
export const BASE_URI_ROLE = keccak256(toUtf8Bytes("BASE_URI_ROLE"));

export const defaultRoles = [
  ADMIN_ROLE,
  MINTER_ROLE,
  BURNER_ROLE,
  BASE_URI_ROLE,
];

export type TestSigners = {
  deployer: SignerWithAddress;
  account0: SignerWithAddress;
  account1: SignerWithAddress;
  account2: SignerWithAddress;
};

export const getSigners = async (): Promise<TestSigners> => {
  const [deployer, account0, account1, account2] = await ethers.getSigners();
  return {
    deployer,
    account0,
    account1,
    account2,
  };
};

export const deployToken = async (deployer: SignerWithAddress) => {
  return await new ERC721DAOToken__factory(deployer).deploy();
};

export const deployAndInitDAOToken = async (
  deployer: SignerWithAddress,
  admin?: SignerWithAddress,
  minter?: SignerWithAddress,
  burner?: SignerWithAddress,
  baseURIer?: SignerWithAddress
): Promise<ERC721DAOToken> => {
  const token = await new ERC721DAOToken__factory(deployer).deploy();

  return await initToken(
    token,
    deployer.address,
    admin?.address,
    minter?.address,
    burner?.address,
    baseURIer?.address
  );
};

export const attachToken = (
  deployer: SignerWithAddress,
  instance: string
): ERC721DAOToken => {
  return new ERC721DAOToken__factory(deployer).attach(instance);
};

export const deployFixedPriceMinter = async (
  deployer: SignerWithAddress,
  tokenAddress: string,
  maxTokens: BigNumberish,
  tokenPrice: BigNumberish,
  maxMintsPerTx: BigNumberish,
  payees: string[],
  shares: BigNumberish[]
) => {
  const minter = await new FixedPriceMinter__factory(deployer).deploy();
  await minter.initialize(
    tokenAddress,
    maxTokens,
    tokenPrice,
    maxMintsPerTx,
    payees,
    shares
  );
  return minter;
};

export const deployCloneFactory = async (
  deployer: SignerWithAddress
): Promise<CloneFactory> => {
  const factory = await new CloneFactory__factory(deployer).deploy();
  await factory.initialize();
  return factory;
};

export const defaultAssignees = async (
  deployer: SignerWithAddress
): Promise<string[]> => {
  const addr = await deployer.getAddress();
  return [addr, addr, addr, addr];
};

export const initToken = async (
  token: ERC721DAOToken,
  deployer: string,
  admin?: string,
  minter?: string,
  burner?: string,
  baseURIer?: string
) => {
  const actualAdmin = admin || deployer;
  const actualMinter = minter || deployer;
  const actualBurner = burner || deployer;
  const actualBaseURIer = baseURIer || deployer;

  const rolesAssignees = [
    actualAdmin,
    actualMinter,
    actualBurner,
    actualBaseURIer,
  ];

  await token.initialize(
    "AwesomeToken",
    "ASM",
    "BaseURI",
    defaultRoles,
    rolesAssignees
  );
  return token;
};

export const deployTimelock = async (
  deployer: SignerWithAddress
): Promise<ERC721Timelock> => {
  return await new ERC721Timelock__factory(deployer).deploy();
};

export const deployGovernor = async (
  deployer: SignerWithAddress
): Promise<ERC721Governor> => {
  return await new ERC721Governor__factory(deployer).deploy();
};

export const deployMinter = async (deployer: SignerWithAddress) => {
  return await new FixedPriceMinter__factory(deployer).deploy();
};

export const cloneToken = async (
  deployer: SignerWithAddress,
  factory: CloneFactory,
  tokenImpl: ERC721DAOToken,
  implIndex: number,
  baseURI: string,
  roles: string[],
  assignees: string[]
): Promise<ERC721DAOToken> => {
  const callData = tokenImpl.interface.encodeFunctionData("initialize", [
    "NewToken",
    "NT",
    baseURI,
    roles,
    assignees,
  ]);

  const tx = await factory.clone(implIndex, callData);
  const receipt = await tx.wait();

  const event = receipt.events?.find((e) => e.event == "NewClone");
  return attachToken(deployer, event?.args?.instance);
};

export const cloneTimelock = async (
  deployer: SignerWithAddress,
  factory: CloneFactory,
  timelockImpl: ERC721Timelock,
  implIndex: number,
  minDelay: BigNumberish,
  proposers: string[],
  executors: string[]
): Promise<ERC721Timelock> => {
  const callData = timelockImpl.interface.encodeFunctionData("initialize", [
    minDelay,
    deployer.address,
    proposers,
    executors,
  ]);

  const tx = await factory.clone(implIndex, callData);
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  return new ERC721Timelock__factory(deployer).attach(event?.args?.instance);
};

export const cloneGovernor = async (
  deployer: SignerWithAddress,
  factory: CloneFactory,
  governorImpl: ERC721Governor,
  implIndex: number,
  tokenAddress: string,
  timelockAddress: string,
  votingDelay: number,
  votingPeriod: number,
  quorumNumerator: number
): Promise<ERC721Governor> => {
  const callData = governorImpl.interface.encodeFunctionData("initialize", [
    "GovernorName",
    tokenAddress,
    timelockAddress,
    votingDelay,
    votingPeriod,
    quorumNumerator,
  ]);

  const tx = await factory.clone(implIndex, callData);
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  return new ERC721Governor__factory(deployer).attach(event?.args?.instance);
};

export const cloneMinter = async (
  deployer: SignerWithAddress,
  factory: CloneFactory,
  minterImpl: FixedPriceMinter,
  implIndex: number,
  tokenAddress: string,
  maxTokenSupply: BigNumberish,
  tokenPrice: BigNumberish,
  maxMintsPerTx: BigNumberish,
  payees: string[],
  shares: BigNumberish[]
): Promise<FixedPriceMinter> => {
  const callData = minterImpl.interface.encodeFunctionData("initialize", [
    tokenAddress,
    maxTokenSupply,
    tokenPrice,
    maxMintsPerTx,
    payees,
    shares,
  ]);

  const tx = await factory.clone(implIndex, callData);
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  return new FixedPriceMinter__factory(deployer).attach(event?.args?.instance);
};
