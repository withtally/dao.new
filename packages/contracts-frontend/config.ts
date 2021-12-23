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

type SupportedChains =
  | ChainId.Rinkeby
  | ChainId.Localhost
  | ChainId.OptimismKovan
  | ChainId.ArbitrumRinkeby

export const CHAIN_ID: SupportedChains = ChainId.ArbitrumRinkeby

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
    deployerAddress: '0xA1B37128AEfa079CD6A8E41b8bBE9dD807297BBc',
    tokenAddress: '0x8Ea3c6b1b6d130e0B6B5eF9c69c43EBa19b653FB',
    minterAddress: '0xF5b5850DE3d239A0DA079FB56D9376494bF1a6c7',
    governorAddress: '0x1e17E92BbCa1c14cF1ac3B32c35c626e6E57418A',
    timelockAddress: '0xC279683194AE3CB7ff8994b59fA86f6fe46e6Fde',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.OptimismKovan]: {
    deployerAddress: '0x8c49f49B3e5A2a469A09f4d8D11546Bc928c08Aa',
    tokenAddress: '0xf2fc15153d69688cb4Ce4869Afc49bcCcB9AFd3E',
    minterAddress: '0x9A179CC9cB50265cf7655eE11DEba68caC91FAa2',
    governorAddress: '0x35509a349A4871A574D67f148AfC5C7ed9350bAC',
    timelockAddress: '0x25d29e95c62aD053D293eeC14E29abA882B1ee94',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.ArbitrumRinkeby]: {
    deployerAddress: '0x660fC5AbA193Ed6eE7ECD73E8A120F5e1a0B036F',
    tokenAddress: '0x28d760ddC22bf1723d5eba1da192a20d1D90d908',
    minterAddress: '0x661cDc7f0bDE537e917a09C916EF8BA83f56950d',
    governorAddress: '0xE10cEC99859c93EdAdE86c1e01f99518720ad322',
    timelockAddress: '0x15ffE8d137a7Dc7a94FC6C48209ede092B7400Ea',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
}
export const config = allConfigs[CHAIN_ID]

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
