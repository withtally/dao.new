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
    deployerAddress: '0x02CB117254a82E2401B8c341CE668eDfF2f268FD',
    svgPlaceholderAddress: '0x0c57B1b12831c20Be166b300aff4DE5d7F5A479a',
  },
  [ChainId.OptimismKovan]: {
    deployerAddress: '0xee48904C8Ad275993779E079142C964395d6aF01',
    svgPlaceholderAddress: '0x34ceC65033aA345Ee2BAbe13529a5648cA7B3F4C',
  },
  [ChainId.ArbitrumRinkeby]: {
    deployerAddress: '0x660fC5AbA193Ed6eE7ECD73E8A120F5e1a0B036F',
    svgPlaceholderAddress: '0x3dA476C416d2eAA61e38EdD54c399C12C3a70548',
  },
  [ChainId.Mumbai]: {
    deployerAddress: '0x34ceC65033aA345Ee2BAbe13529a5648cA7B3F4C',
    svgPlaceholderAddress: '0xcF838d105700F7AF3D5FfeF0D310EDcAC6d5EbdD',
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
