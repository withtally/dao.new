import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
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
    deployerAddress: '0x9764c367879c84Ac40B3A07f45750f586131E38E',
    svgPlaceholderAddress: '0xE4DbFdf4b7719deb70BB28F057A3553AF8E1f60A',
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

const etherscanEndpoints: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'https://api-rinkeby.etherscan.io/',
  [ChainId.Rinkeby]: 'https://api-rinkeby.etherscan.io/',
}
export const etherscanEndpoint = etherscanEndpoints[CHAIN_ID]
