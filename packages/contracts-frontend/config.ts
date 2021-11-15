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
    tokenAddress: '0x069ac113538C7d4FCA9A17A9BeFfD2e2c67017ba',
    minterAddress: '0x549bdA90d62Cd7E21e45977cf6d09A714E0B56a8',
    governorAddress: '0x2eEE99E70E28946E42BC8663897899E4DC754571',
    timelockAddress: '0x5021943762EaF1e21640D6BdFFb3DcA140520491',
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
