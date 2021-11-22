import { ChainId } from '@usedapp/core'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

export const secrets = { alchemyApiKey: process.env.ALCHEMY_API_KEY }

export const tallyApiURI = 'http://localhost:5000/query'
export const tallyWebBaseURI = 'https://hackathon.withtally.com/governance/'

const deployerAddresses: Record<SupportedChains, string> = {
  [ChainId.Localhost]: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
  [ChainId.Rinkeby]: '0x842D5060c91a2d7edfDA1c7735D59DEd65b798D9',
}
export const deployerAddress = deployerAddresses[CHAIN_ID]
