import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  ERC721DAOToken,
  ERC721DAOToken__factory,
  CloneFactory,
  CloneFactory__factory,
  FixedPriceMinter,
  FixedPriceMinter__factory,
} from "../../frontend/types/typechain";
import { BigNumberish } from "@ethersproject/bignumber";

const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;
const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
const BURNER_ROLE = keccak256(toUtf8Bytes("BURNER_ROLE"));
const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
const BASE_URI_ROLE = keccak256(toUtf8Bytes("BASE_URI_ROLE"));

export const roles = [ADMIN_ROLE, MINTER_ROLE, BURNER_ROLE, BASE_URI_ROLE];

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

export const attachToken = (deployer: SignerWithAddress, instance: string) => {
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

  await token.initialize("AwesomeToken", "ASM", roles, rolesAssignees);
  return token;
};
