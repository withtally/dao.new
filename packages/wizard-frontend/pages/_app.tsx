import { ChakraProvider } from '@chakra-ui/react'
import {
  ArbitrumRinkeby,
  ChainId,
  Config,
  DAppProvider,
  Hardhat,
  Localhost,
  Mainnet,
  Mumbai,
  OptimismKovan,
  Rinkeby,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { multicallOnLocalhost } from '../config'

const config: Config = {
  readOnlyChainId: ChainId.Rinkeby,
  readOnlyUrls: {
    [ChainId.Mainnet]: process.env.NEXT_PUBLIC_MAINNET_JSON_RPC,
    [ChainId.Rinkeby]: process.env.NEXT_PUBLIC_RINKEBY_JSON_RPC,
    [ChainId.OptimismKovan]: 'https://kovan.optimism.io',
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  networks: [
    Mainnet,
    Rinkeby,
    Localhost,
    Hardhat,
    OptimismKovan,
    ArbitrumRinkeby,
    Mumbai,
  ],
  multicallAddresses: {
    [ChainId.Localhost]: multicallOnLocalhost,
  },
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    <DAppProvider config={config}>
      <ChakraProvider>
        <Component {...pageProps} />
      </ChakraProvider>
    </DAppProvider>
  )
}

export default MyApp
