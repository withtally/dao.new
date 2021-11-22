import { ChainId } from '@usedapp/core'

export enum MinterType {
  FixedPriceSequentialMinter,
  FixedPriceSpecificIDMinter,
}
interface ContractsConfig {
  deployerAddress: string
  minterAddress: string
  tokenAddress: string
  timelockAddress: string
  governorAddress: string
  minterType: MinterType
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

const allConfigs: Record<SupportedChains, ContractsConfig> = {
  [ChainId.Localhost]: {
    deployerAddress: '0x8A791620dd6260079BF849Dc5567aDC3F2FdC318',
    tokenAddress: '0x88577731Cc84560fE297792ab784b600A54728E2',
    minterAddress: '0x1910F44C232F040b63251E5B27970c254A74A1c7',
    governorAddress: '0x5B8B621aB7f02Ef3DD5d06718dADcAeD59818257',
    timelockAddress: '0xD605c48ae0C94D0A510Ae053F62042b7D467918E',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.Rinkeby]: {
    deployerAddress: '0x842D5060c91a2d7edfDA1c7735D59DEd65b798D9',
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    governorAddress: '',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = { alchemyApiKey: process.env.ALCHEMY_API_KEY }
export const config = allConfigs[CHAIN_ID]
