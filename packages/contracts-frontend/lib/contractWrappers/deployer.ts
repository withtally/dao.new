import { useContractFunction } from '@usedapp/core'
import { Contract, utils } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import { ERC721DAODeployerABI } from 'nextjs-ethereum-starter-hardhat'
import { config } from 'create-nft-dao-shared-frontend'

export const NEW_MINTING_FILTER_CLONE_EVENT = 'NewMintingFilterClone'

const ERC721DAODeployerAbi: Interface = new utils.Interface(
  ERC721DAODeployerABI.abi
)

export const useCloneAndInitMintingFilter = () => {
  const contract = new Contract(config.deployerAddress, ERC721DAODeployerAbi)
  return useContractFunction(contract, 'cloneAndInitMintingFilter')
}
