import { ChainId } from '@usedapp/core'

interface Config {
  minterAddress: string
  tokenAddress: string
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    minterAddress: '0xEd46dE7A5F16D09b02fF3890DB11C91316196182',
    tokenAddress: '0xA14d9C7a916Db01cCA55ec21Be1F7665C326928F',
  },
  [ChainId.Rinkeby]: {
    minterAddress: '0x81A28E5516555A7fCDF8e3E76Ca2c1E74e1116Ed',
    tokenAddress: '0xb153801c3d00cca97ef97Bdb843e17a38c434d4C',
  },
}

export default config[CHAIN_ID]
