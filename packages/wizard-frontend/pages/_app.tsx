import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { CHAIN_ID } from '../config'

// scaffold-eth's INFURA_ID, SWAP IN YOURS FROM https://infura.io/dashboard/ethereum
export const INFURA_ID = '460f40a260564ac4a4f4b3fffb032dad'

const config: Config = {
  readOnlyChainId: CHAIN_ID,
  readOnlyUrls: {
    [ChainId.Ropsten]: `https://ropsten.infura.io/v3/${INFURA_ID}`,
    [ChainId.Rinkeby]: `https://eth-rinkeby.alchemyapi.io/v2/${process.env.NEXT_PUBLIC_ALCHEMY_API_KEY}`,
    [ChainId.Hardhat]: 'http://localhost:8545',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [
    ChainId.Mainnet,
    ChainId.Goerli,
    ChainId.Kovan,
    ChainId.Rinkeby,
    ChainId.Ropsten,
    ChainId.xDai,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
  multicallAddresses: {
    [ChainId.Localhost]: '0x5FbDB2315678afecb367f032d93F642f64180aa3',
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
