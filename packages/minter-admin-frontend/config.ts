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
  | ChainId.Mumbai

export const CHAIN_ID: SupportedChains = ChainId.Rinkeby

const allConfigs: Record<SupportedChains, ContractsConfig> = {
  [ChainId.Localhost]: {
    deployerAddress: '0x610178dA211FEF7D417bC0e6FeD39F05609AD788',
    tokenAddress: '0x6F1216D1BFe15c98520CA1434FC1d9D57AC95321',
    minterAddress: '0x40a87c555319e8bD334b209CA3fA22615b9c619e',
    governorAddress: '0xCBd5431cC04031d089c90E7c83288183A6Fe545d',
    timelockAddress: '0xdAD42D43ecE0f6e8da8c2BCbC6A25FF6b3922C58',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.Rinkeby]: {
    deployerAddress: '0xA74d716054120f75c86dC3E2de1E879926657C1f',
    tokenAddress: '0xCc1c746d03c576a6adBecA5539ef4fd55407206F',
    minterAddress: '0xd71451F4f1c040d74c506f61ED011814A081e7Fe',
    governorAddress: '0xc5FD13678d71EEd122c1c39d32f6d4F8A816592B',
    timelockAddress: '0xF30C873F74f63e217001afe7bF4731C2E9709049',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.OptimismKovan]: {
    deployerAddress: '0xD8aaf7d29F0EbDaeBC08774c9f7F639245C21735',
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
  [ChainId.Mumbai]: {
    deployerAddress: '0x06e80B9A26237b51A7DBf284ec8d0988c345E0F7',
    tokenAddress: '0xCFF32c604dEAC41fC0Fa3045cb51d98E3Db3EA91',
    minterAddress: '0x5396E4F9a163019EE92AEa372F7D727b395c2D4c',
    governorAddress: '0x887d17E9Ff630DC457E27B96DB9B5731A176BF72',
    timelockAddress: '0x43fb63CeCf2Cb17a199E6cF62360a99E59cd0193',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
}
export const config = allConfigs[CHAIN_ID]

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'
