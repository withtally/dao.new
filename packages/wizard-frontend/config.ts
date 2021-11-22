import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = { alchemyApiKey: process.env.ALCHEMY_API_KEY }

const tallyApiURIConfig: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'http://localhost:5000/query',
  [ChainId.Rinkeby]: 'https://api2.withtally.com/query',
}

export const tallyApiURI = tallyApiURIConfig[CHAIN_ID]
export const tallyWebBaseURI = 'https://hackathon.withtally.com/governance/'
