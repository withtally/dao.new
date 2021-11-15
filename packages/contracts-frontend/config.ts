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
    tokenAddress: '0x0996d1CAb49374E20aA115ca3DB4986b65313B48',
    minterAddress: '0x19025910C948A47047D2188B67928fFce89Ea258',
    governorAddress: '0x94f34C4d1ceF4a6987852d9160949607a6C350Ce',
    timelockAddress: '0x6923982Eba5A3d3BEC6de1ac4bA2263842FE2BdA',
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
