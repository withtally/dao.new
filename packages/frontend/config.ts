import { ChainId } from '@usedapp/core'
import { alchemyApiKey } from '../hardhat/secrets.json'

interface Config {
  minterAddress: string
  tokenAddress: string
  timelockAddress: string
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    minterAddress: '0xCaA29B65446aBF1A513A178402A0408eB3AEee75',
    tokenAddress: '0xD79aE87F2c003Ec925fB7e9C11585709bfe41473',
    timelockAddress: '0xB7aa4c318000BB9bD16108F81C40D02E48af1C42',
  },
  [ChainId.Rinkeby]: {
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
  },
}

export const secrets = { alchemyApiKey: alchemyApiKey }

export default config[CHAIN_ID]
