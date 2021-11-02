import { ChainId } from '@usedapp/core'
import allSecrets from '../hardhat/secrets.json'

interface Config {
  minterAddress: string
  tokenAddress: string
  timelockAddress: string
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    minterAddress: '0xc8CB5439c767A63aca1c01862252B2F3495fDcFE',
    tokenAddress: '0x3B02fF1e626Ed7a8fd6eC5299e2C54e1421B626B',
    timelockAddress: '0xBA12646CC07ADBe43F8bD25D83FB628D29C8A762',
  },
  [ChainId.Rinkeby]: {
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
  },
}

export const secrets = { alchemyApiKey: allSecrets.alchemyApiKey }

export default config[CHAIN_ID]
