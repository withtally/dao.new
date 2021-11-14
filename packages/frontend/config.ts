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
  governorAddress: string
  minterType: MinterType
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    tokenAddress: '0x0F9019Dd30C7Cc5774d4883fba933aA0Caba9424',
    minterAddress: '0xFBec6C619Bd3D9adc2b13bE16ab79Ba66E607374',
    governorAddress: '0xCeB5f7D6404389B0Fc4e2C87b125Ecfed2Bfd462',
    timelockAddress: '0x6e374a88Ca77981Ca2c6502F164ADb8ACe9f7BB6',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.Rinkeby]: {
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    governorAddress: '',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = { alchemyApiKey: allSecrets.alchemyApiKey }

export default config[CHAIN_ID]
