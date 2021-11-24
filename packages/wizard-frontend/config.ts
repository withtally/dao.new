import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
}

const tallyApiURIConfig: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'http://localhost:5000/query',
  [ChainId.Rinkeby]: 'https://api2.withtally.com/query',
}

export const tallyApiURI = tallyApiURIConfig[CHAIN_ID]
export const tallyWebBaseURI = 'https://hackathon.withtally.com/governance/'

const deployerAddresses: Record<SupportedChains, string> = {
  [ChainId.Localhost]: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  [ChainId.Rinkeby]: '0x3d40Df8d069df12c841e19A40BC5487251315068',
}
export const deployerAddress = deployerAddresses[CHAIN_ID]

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
