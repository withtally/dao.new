import { ChainId } from '@usedapp/core'
import { alchemyApiKey } from '../hardhat/secrets.json'

interface Config {
  minterAddress: string
  tokenAddress: string
  timelockAddress: string
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    minterAddress: '0xEd46dE7A5F16D09b02fF3890DB11C91316196182',
    tokenAddress: '0xA14d9C7a916Db01cCA55ec21Be1F7665C326928F',
    timelockAddress: '0x1c8d7d133c0c4AC780Fc1a4f71913FB6625F7De5',
  },
  [ChainId.Rinkeby]: {
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
  },
}

export const secrets = { alchemyApiKey: alchemyApiKey }

export default config[CHAIN_ID]
