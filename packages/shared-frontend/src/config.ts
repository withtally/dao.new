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
    deployerAddress: '0x85b03fba4362D0C468D6fd1EB222B8049baffd9d',
    tokenAddress: '0x8Ea3c6b1b6d130e0B6B5eF9c69c43EBa19b653FB',
    minterAddress: '0xF5b5850DE3d239A0DA079FB56D9376494bF1a6c7',
    governorAddress: '0x1e17E92BbCa1c14cF1ac3B32c35c626e6E57418A',
    timelockAddress: '0xC279683194AE3CB7ff8994b59fA86f6fe46e6Fde',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = { alchemyApiKey: process.env.ALCHEMY_API_KEY }
export const config = allConfigs[CHAIN_ID]
