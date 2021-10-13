import chai from 'chai';
import { ethers } from 'hardhat';
import { solidity } from 'ethereum-waffle';
import { deployDAOToken } from './utils';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { ERC721DAOToken } from '../../frontend/types/typechain';

chai.use(solidity);
const { expect } = chai;

const zeroAddress = "0x0000000000000000000000000000000000000000";

describe('ERC721DAOToken', () => {
  let token: ERC721DAOToken
  let deployer: SignerWithAddress
  let user: SignerWithAddress
  let snapshotId: number

  before(async () => {
    [deployer, user] = await ethers.getSigners()
    token = await deployDAOToken(deployer)
  })

  beforeEach(async () => {
    snapshotId = await ethers.provider.send('evm_snapshot', [])
  });

  afterEach(async () => {
    await ethers.provider.send('evm_revert', [snapshotId])
  })

  it('should mint', async () => {
    const userAddress = await user.getAddress()
    expect(await token.totalSupply()).to.be.equal(0);

    const txn = await token.mint(userAddress, 0)

    expect(txn).to.emit(token, "Transfer").withArgs(zeroAddress, userAddress, 0)
  })
})