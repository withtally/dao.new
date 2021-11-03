import { useContractCall } from '@usedapp/core'
import { utils } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import ERC721DAOTokenABI from '../../artifacts/contracts/ERC721DAOToken.sol/ERC721DAOToken.json'
import config from '../../config'

const tokenAbi: Interface = new utils.Interface(ERC721DAOTokenABI.abi)

export const useNFTName = () => {
  const [nftName] =
    useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'name',
      args: [],
    }) || []
  return nftName
}

export const useTotalSupply = () => {
  const [totalSupply] =
    useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'totalSupply',
      args: [],
    }) || []
  return totalSupply
}
