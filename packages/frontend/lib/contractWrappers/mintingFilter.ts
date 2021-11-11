import { useContractCall, useContractFunction } from '@usedapp/core'
import { utils, Contract } from 'ethers'
import { Interface } from 'ethers/lib/utils'
import NFTsMintingFilterABI from '../../artifacts/contracts/minters/filters/NFTsMintingFilter.sol/NFTsMintingFilter.json'

const NFTsMintingFilterAbi: Interface = new utils.Interface(
  NFTsMintingFilterABI.abi
)

export const useGetTokenFilters = (address: string) => {
  const [tokenFilters] =
    useContractCall({
      abi: NFTsMintingFilterAbi,
      address: address,
      method: 'getTokenFilters',
      args: [],
    }) || []
  return tokenFilters
}

export const useMintingFilterFunction = (
  address: string,
  functionName: string
) => {
  const contract = new Contract(address, NFTsMintingFilterAbi)
  return useContractFunction(contract, functionName)
}
