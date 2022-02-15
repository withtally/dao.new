import { ChainId } from '@usedapp/core'

type SupportedChains =
  | ChainId.Rinkeby
  | ChainId.Localhost
  | ChainId.OptimismKovan
  | ChainId.ArbitrumRinkeby
  | ChainId.Mumbai
  | ChainId.Mainnet

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
    deployerAddress: '0xA74d716054120f75c86dC3E2de1E879926657C1f',
    svgPlaceholderAddress: '0x3BF4a00F50412eCC029deD3174b7E795766A018d',
  },
  [ChainId.OptimismKovan]: {
    deployerAddress: '0x93224E01Cf6daFEDF1b4dECDf4a7910b125A5C77',
    svgPlaceholderAddress: '0x45FC7aC7405106A978D2CD0153B85594fA57fF4c',
  },
  [ChainId.ArbitrumRinkeby]: {
    deployerAddress: '0xD72d09fBFf4b3C67CF64c66529e4EFE6C3AD5d63',
    svgPlaceholderAddress: '0x636fcBf709674865563520e8A812C2d0d9367911',
  },
  [ChainId.Mumbai]: {
    deployerAddress: '0x3DBAf0deB5D8340d035C3f19a4a6f4a056D6F06b',
    svgPlaceholderAddress: '0x6a9C04B487cF087B408584D70eddAab4Cf9D10ab',
  },
  [ChainId.Mainnet]: {
    deployerAddress: '0x473cCDb5B5C6378572dcd14F56BFc05220eEBD74',
    svgPlaceholderAddress: '0x94F09463368CeBC3FB5Fd28F71FFDB7859730003',
  },
}

export const chainIdToTallyApiURIConfig: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'http://localhost:5000/query',
  [ChainId.Rinkeby]: 'https://api.withtally.com/query',
  [ChainId.OptimismKovan]: 'https://api.withtally.com/query',
  [ChainId.ArbitrumRinkeby]: 'https://api.withtally.com/query',
  [ChainId.Mumbai]: 'https://api.withtally.com/query',
  [ChainId.Mainnet]: 'https://api.withtally.com/query',
}

export const tallyWebBaseURI = 'https://withtally.com/governance/'

// Multicall needs to be configured only for Localhost
export const multicallOnLocalhost = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

export const etherscanEndpoints: Record<SupportedChains, string> = {
  [ChainId.Localhost]: 'https://api-rinkeby.etherscan.io/',
  [ChainId.Rinkeby]: 'https://api-rinkeby.etherscan.io/',
  [ChainId.OptimismKovan]: 'https://api-kovan-optimistic.etherscan.io/',
  [ChainId.ArbitrumRinkeby]: 'https://api-testnet.arbiscan.io/',
  [ChainId.Mumbai]: 'https://api-mumbai.polygonscan.com/',
  [ChainId.Mainnet]: 'https://api.etherscan.io/',
}

export const etherscanApiKeys: Record<SupportedChains, string> = {
  [ChainId.Localhost]: '',
  [ChainId.Rinkeby]: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
  [ChainId.OptimismKovan]: process.env.NEXT_PUBLIC_ETHERSCAN_OPTIMISM_API_KEY,
  [ChainId.ArbitrumRinkeby]: process.env.NEXT_PUBLIC_ARBISCAN_API_KEY,
  [ChainId.Mumbai]: process.env.NEXT_PUBLIC_POLYGONSCAN_API_KEY,
  [ChainId.Mainnet]: process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY,
}
