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
import { BigNumber, BigNumberish } from "@ethersproject/bignumber";
import { BytesLike } from "@ethersproject/bignumber/node_modules/@ethersproject/bytes";
import { ContractReceipt } from "@ethersproject/contracts";

const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;
export const hashString = (str: string) => {
  return keccak256(toUtf8Bytes(str));
};

export const ADMIN_ROLE = hashString("ADMIN_ROLE");
export const MINTER_ROLE = hashString("MINTER_ROLE");
export const BURNER_ROLE = hashString("BURNER_ROLE");
export const BASE_URI_ROLE = hashString("BASE_URI_ROLE");

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

export type ProposalInfo = {
  targets: string[];
  values: BigNumberish[];
  callDatas: BytesLike[];
  description: string;
  descriptionHash: BytesLike;
};

export const encodeParameters = (
  types: string[],
  values: unknown[]
): string => {
  const abi = new ethers.utils.AbiCoder();
  return abi.encode(types, values);
};

export const address = (n: number): string => {
  return `0x${n.toString(16).padStart(40, "0")}`;
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
  ownerAddress: string,
  tokenAddress: string,
  maxTokens: BigNumberish,
  tokenPrice: BigNumberish,
  maxMintsPerTx: BigNumberish,
  startingBlock: BigNumberish,
  payees: string[],
  shares: BigNumberish[]
) => {
  const minter = await new FixedPriceMinter__factory(deployer).deploy();
  await minter.initialize(
    ownerAddress,
    tokenAddress,
    maxTokens,
    tokenPrice,
    maxMintsPerTx,
    startingBlock,
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
  proposalThreshold: number,
  votingDelay: number,
  votingPeriod: number,
  quorumNumerator: number
): Promise<ERC721Governor> => {
  const callData = governorImpl.interface.encodeFunctionData("initialize", [
    "GovernorName",
    tokenAddress,
    timelockAddress,
    proposalThreshold,
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
  ownerAddress: string,
  tokenAddress: string,
  maxTokenSupply: BigNumberish,
  tokenPrice: BigNumberish,
  maxMintsPerTx: BigNumberish,
  startingBlock: BigNumberish,
  payees: string[],
  shares: BigNumberish[]
): Promise<FixedPriceMinter> => {
  const callData = minterImpl.interface.encodeFunctionData("initialize", [
    ownerAddress,
    tokenAddress,
    maxTokenSupply,
    tokenPrice,
    maxMintsPerTx,
    startingBlock,
    payees,
    shares,
  ]);

  const tx = await factory.clone(implIndex, callData);
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "NewClone");

  return new FixedPriceMinter__factory(deployer).attach(event?.args?.instance);
};

export const propose = async (
  proposer: SignerWithAddress,
  governor: ERC721Governor,
  propInfo: ProposalInfo
): Promise<BigNumber> => {
  const tx = await governor
    .connect(proposer)
    .propose(
      propInfo.targets,
      propInfo.values,
      propInfo.callDatas,
      propInfo.description
    );
  const receipt = await tx.wait();
  const event = receipt.events?.find((e) => e.event == "ProposalCreated");
  return event?.args?.proposalId;
};

export const proposeAndExecute = async (
  proposer: SignerWithAddress,
  governor: ERC721Governor,
  propInfo: ProposalInfo
): Promise<ContractReceipt> => {
  const proposalId = await propose(proposer, governor, propInfo);
  await advanceBlocks((await governor.votingDelay()).toNumber());

  await governor.connect(proposer).castVote(proposalId, 1);
  await advanceBlocks((await governor.votingPeriod()).toNumber());

  await governor.queue(
    propInfo.targets,
    propInfo.values,
    propInfo.callDatas,
    propInfo.descriptionHash
  );
  const eta = await governor.proposalEta(proposalId);
  await setNextBlockTimestamp(eta.toNumber(), false);

  const tx = await governor.execute(
    propInfo.targets,
    propInfo.values,
    propInfo.callDatas,
    propInfo.descriptionHash
  );

  return await tx.wait();
};

export const createTransferProp = (
  targetAddress: string,
  value: number
): ProposalInfo => {
  const description = "description";
  return {
    targets: [targetAddress],
    values: [value],
    callDatas: ["0x"],
    description: description,
    descriptionHash: hashString(description),
  };
};

export const mineBlock = async (): Promise<void> => {
  await network.provider.send("evm_mine");
};

export const advanceBlocks = async (blocks: number): Promise<void> => {
  for (let i = 0; i < blocks; i++) {
    await mineBlock();
  }
};

const rpc = <T = unknown>({
  method,
  params,
}: {
  method: string;
  params?: unknown[];
}): Promise<T> => {
  return network.provider.send(method, params);
};

export const setNextBlockTimestamp = async (
  n: number,
  mine = true
): Promise<void> => {
  await rpc({ method: "evm_setNextBlockTimestamp", params: [n] });
  if (mine) await mineBlock();
};
