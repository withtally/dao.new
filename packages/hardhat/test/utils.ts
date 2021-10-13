import { ethers, network } from 'hardhat';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC721DAOToken, ERC721DAOToken__factory } from '../../frontend/types/typechain'

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
  deployer?: SignerWithAddress
): Promise<ERC721DAOToken> => {
  const signer = deployer || (await getSigners()).deployer;
  const factory = new ERC721DAOToken__factory(signer);

  return factory.deploy();
};