import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
}

interface ContractAddresses {
  deployerAddress: string
  svgPlaceholderAddress: string
}

const contractsConfig: Record<SupportedChains, ContractAddresses> = {
  [ChainId.Localhost]: {
    deployerAddress: process.env.NEXT_PUBLIC_LOCAL_DEPLOYER_CONTRACT,
    svgPlaceholderAddress:
      process.env.NEXT_PUBLIC_LOCAL_SVG_PLACEHOLDER_CONTRACT,
  },
  [ChainId.Rinkeby]: {
    deployerAddress: '0xA1B37128AEfa079CD6A8E41b8bBE9dD807297BBc',
    svgPlaceholderAddress: '0x77f679EF9FD87849D8860e49609A85Bec0E7Aba7',
  },
}

const tallyApiURIConfig: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'http://localhost:5000/query',
  [ChainId.Rinkeby]: 'https://api2.withtally.com/query',
}

export const tallyApiURI = tallyApiURIConfig[CHAIN_ID]
export const tallyWebBaseURI = 'https://alpha.withtally.com/governance/'

export const contractsAddresses = contractsConfig[CHAIN_ID]

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
