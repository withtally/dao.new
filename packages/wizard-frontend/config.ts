import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
  etherscanApiKey: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
}

const tallyApiURIConfig: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'http://localhost:5000/query',
  [ChainId.Rinkeby]: 'https://api2.withtally.com/query',
}

export const tallyApiURI = tallyApiURIConfig[CHAIN_ID]
export const tallyWebBaseURI = 'https://hackathon.withtally.com/governance/'

const deployerAddresses: Record<SupportedChains, string> = {
  [ChainId.Localhost]: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  [ChainId.Rinkeby]: '0x8E3694516d4709b51A386cF294e1711CF51EDBd7',
}
export const deployerAddress = deployerAddresses[CHAIN_ID]

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

const etherscanEndpoints: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'https://api-rinkeby.etherscan.io/',
  [ChainId.Rinkeby]: 'https://api-rinkeby.etherscan.io/',
}
export const etherscanEndpoint = etherscanEndpoints[CHAIN_ID]
