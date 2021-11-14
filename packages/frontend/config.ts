import { ChainId } from '@usedapp/core'
import allSecrets from '../hardhat/secrets.json'

export enum MinterType {
  FixedPriceSequentialMinter,
  FixedPriceSpecificIDMinter,
}
interface Config {
  minterAddress: string
  tokenAddress: string
  timelockAddress: string
  minterType: MinterType
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    minterAddress: '0x4A94A6E187aD7Ec240477bC323Cb09a4009dE4f3',
    tokenAddress: '0x2F68354deC4C21D5E38a20de57D32C4164336585',
    timelockAddress: '0xD759EB708B9Eb7271Af848E7D99Ac4957B7F3c14',
    minterType: MinterType.FixedPriceSpecificIDMinter,
  },
  [ChainId.Rinkeby]: {
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = { alchemyApiKey: allSecrets.alchemyApiKey }

export default config[CHAIN_ID]
