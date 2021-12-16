import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { CHAIN_ID, multicallOnLocalhost } from '../config'

const config: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Mainnet]: process.env.NEXT_PUBLIC_MAINNET_JSON_RPC,
    [ChainId.Rinkeby]: process.env.NEXT_PUBLIC_RINKEBY_JSON_RPC,
    [69]: 'https://kovan.optimism.io',
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Rinkeby,
    ChainId.Localhost,
    ChainId.Hardhat,
    69,
  ],
  multicallAddresses: {
    [ChainId.Localhost]: multicallOnLocalhost,
    [69]: '0xE71bf4622578c7d1526A88CD3060f03030E99a04',
    ...MULTICALL_ADDRESSES,
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
