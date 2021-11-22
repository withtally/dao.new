import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = { alchemyApiKey: process.env.ALCHEMY_API_KEY }

export const tallyApiURI = 'http://localhost:5000/query'
// export const tallyApiURI = 'https://api2.withtally.com/query'
export const tallyWebBaseURI = 'https://hackathon.withtally.com/governance/'
