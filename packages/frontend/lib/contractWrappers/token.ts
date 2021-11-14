import { useContractCall, useContractFunction } from '@usedapp/core'
import { utils, Contract } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import ERC721DAOTokenABI from '../../artifacts/contracts/token/ERC721DAOToken.sol/ERC721DAOToken.json'
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

export const useBaseURIEnabled = () => {
  const [baseURIEnabled] =
    useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'baseURIEnabled',
      args: [],
    }) || []
  return baseURIEnabled
}

export const useBaseURI = () => {
  const [baseURI] =
    useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'baseURI',
      args: [],
    }) || []
  return baseURI
}

export const useSetBaseURIEnabled = () => {
  const contract = new Contract(config.tokenAddress, tokenAbi)
  return useContractFunction(contract, 'setBaseURIEnabled')
}

export const useSetBaseURI = () => {
  const contract = new Contract(config.tokenAddress, tokenAbi)
  return useContractFunction(contract, 'setBaseURI')
}

export const useContractInfoURI = () => {
  const [contractInfoURI] =
    useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'contractInfoURI',
      args: [],
    }) || []
  return contractInfoURI
}

export const useSetContractInfoURI = () => {
  const contract = new Contract(config.tokenAddress, tokenAbi)
  return useContractFunction(contract, 'setContractInfoURI')
}
