import {
  Arbitrum,
  ArbitrumRinkeby,
  Mainnet,
  Mumbai,
  Optimism,
  OptimismKovan,
  Polygon,
  Rinkeby,
} from '@usedapp/core'

export interface SupportedNetwork {
  chainId: number
  isDeployed: boolean
  isTallySupported: boolean
  displayName: string
}

export const supportedNetworks: SupportedNetwork[] = [
  {
    chainId: Mainnet.chainId,
    isDeployed: true,
    isTallySupported: true,
    displayName: 'Ethereum mainnet',
  },
  {
    chainId: Rinkeby.chainId,
    isDeployed: true,
    isTallySupported: true,
    displayName: 'Rinkeby',
  },
  {
    chainId: Mumbai.chainId,
    isDeployed: true,
    isTallySupported: true,
    displayName: 'Mumbai (polygon testnet)',
  },
  {
    chainId: OptimismKovan.chainId,
    isDeployed: false,
    isTallySupported: true,
    displayName: 'Optimism Kovan',
  },
  {
    chainId: ArbitrumRinkeby.chainId,
    isDeployed: false,
    isTallySupported: false,
    displayName: 'Arbitrum Rinkeby',
  },
  {
    chainId: Optimism.chainId,
    isDeployed: false,
    isTallySupported: true,
    displayName: 'Optimism',
  },
  {
    chainId: Arbitrum.chainId,
    isDeployed: false,
    isTallySupported: false,
    displayName: 'Arbitrum',
  },
  {
    chainId: Polygon.chainId,
    isDeployed: false,
    isTallySupported: true,
    displayName: 'Polygon',
  },
]

export const isChainSupportedByTally = (chainId) => {
  return supportedNetworks.find((c) => c.chainId === chainId)?.isTallySupported
}
