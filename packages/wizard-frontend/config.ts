import { ChainId } from '@usedapp/core'

type SupportedChains =
  | ChainId.Rinkeby
  | ChainId.Localhost
  | ChainId.OptimismKovan
  | ChainId.ArbitrumRinkeby
  | ChainId.Mumbai

export const secrets = {
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY,
}

interface ContractAddresses {
  deployerAddress: string
  svgPlaceholderAddress: string
}

export const chainIdToContracts: Record<SupportedChains, ContractAddresses> = {
  [ChainId.Localhost]: {
    deployerAddress: process.env.NEXT_PUBLIC_LOCAL_DEPLOYER_CONTRACT,
    svgPlaceholderAddress:
      process.env.NEXT_PUBLIC_LOCAL_SVG_PLACEHOLDER_CONTRACT,
  },
  [ChainId.Rinkeby]: {
    deployerAddress: '0x3D0830242D42952ac873F7e698eA200eAAB44a28',
    svgPlaceholderAddress: '0x3f32c41c58e91f38bD0F199174e8e8E8fd44b8b3',
  },
  [ChainId.OptimismKovan]: {
    deployerAddress: '0xD8aaf7d29F0EbDaeBC08774c9f7F639245C21735',
    svgPlaceholderAddress: '0x3E99ED4C79d8Ba58C88B116619E425486B39b37A',
  },
  [ChainId.ArbitrumRinkeby]: {
    deployerAddress: '0x660fC5AbA193Ed6eE7ECD73E8A120F5e1a0B036F',
    svgPlaceholderAddress: '0x3dA476C416d2eAA61e38EdD54c399C12C3a70548',
  },
  [ChainId.Mumbai]: {
    deployerAddress: '0x06e80B9A26237b51A7DBf284ec8d0988c345E0F7',
    svgPlaceholderAddress: '0x3CA8A5f8024FF330D0A6CEF6dFfF152d18dB316b',
  },
}

export const chainIdToTallyApiURIConfig: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'http://localhost:5000/query',
  [ChainId.Rinkeby]: 'https://api.withtally.com/query',
  [ChainId.OptimismKovan]: 'https://api.withtally.com/query',
  [ChainId.ArbitrumRinkeby]: 'https://api.withtally.com/query',
  [ChainId.Mumbai]: 'https://api.withtally.com/query',
}

export const tallyWebBaseURI = 'https://alpha.withtally.com/governance/'

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const etherscanEndpoints: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'https://api-rinkeby.etherscan.io/',
  [ChainId.Rinkeby]: 'https://api-rinkeby.etherscan.io/',
  [ChainId.OptimismKovan]: 'https://api-kovan-optimistic.etherscan.io/',
  [ChainId.ArbitrumRinkeby]: 'https://api-testnet.arbiscan.io/',
  [ChainId.Mumbai]: 'https://api-mumbai.polygonscan.com/',
}

export const etherscanApiKeys: Record<SupportedChains, string> = {
  [ChainId.Localhost]: '',
  [ChainId.Rinkeby]: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
  [ChainId.OptimismKovan]: process.env.NEXT_PUBLIC_ETHERSCAN_OPTIMISM_API_KEY,
  [ChainId.ArbitrumRinkeby]: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY,
  [ChainId.Mumbai]: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY,
}
