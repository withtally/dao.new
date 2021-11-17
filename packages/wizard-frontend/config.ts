import { ChainId } from '@usedapp/core'
import allSecrets from '../hardhat/secrets.json'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

export const secrets = { alchemyApiKey: allSecrets.alchemyApiKey }

export const tallyApiURI = 'http://localhost:5000/query'
// export const tallyApiURI = 'https://api2.withtally.com/query'
export const tallyWebBaseURI = 'https://hackathon.withtally.com/governance/'
