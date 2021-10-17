import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC721DAOToken, ERC721DAOToken__factory } from '../../frontend/types/typechain'

const keccak256 = ethers.utils.keccak256;
const toUtf8Bytes = ethers.utils.toUtf8Bytes;
const MINTER_ROLE = keccak256(toUtf8Bytes("MINTER_ROLE"));
const BURNER_ROLE = keccak256(toUtf8Bytes("BURNER_ROLE"));
const ADMIN_ROLE = keccak256(toUtf8Bytes("ADMIN_ROLE"));
const BASE_URI_ROLE = keccak256(toUtf8Bytes("BASE_URI_ROLE"));

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

export const deployDAOToken = async (
  deployer: SignerWithAddress,
  admin?: SignerWithAddress,
  minter?: SignerWithAddress,
  burner?: SignerWithAddress,
  baseURIer?: SignerWithAddress
): Promise<ERC721DAOToken> => {
  const actualAdmin = await (admin || deployer).getAddress()
  const actualMinter = await (minter || deployer).getAddress()
  const actualBurner = await (burner || deployer).getAddress()
  const actualBaseURIer = await (baseURIer || deployer).getAddress()

  const roles = [ADMIN_ROLE, MINTER_ROLE, BURNER_ROLE, BASE_URI_ROLE];
  const rolesAssignees = [actualAdmin, actualMinter, actualBurner, actualBaseURIer];

  const token = await new ERC721DAOToken__factory(deployer).deploy();
  await token.initialize("AwesomeToken", "ASM", roles, rolesAssignees)
  return token
};