import { Box } from '@chakra-ui/layout'
import {
  Accordion,
  AccordionButton,
  Text,
  AccordionItem,
  AccordionPanel,
} from '@chakra-ui/react'
import { Select } from '@chakra-ui/select'
import {
  Arbitrum,
  ArbitrumRinkeby,
  Chain,
  getChainById,
  Localhost,
  Mainnet,
  Mumbai,
  Optimism,
  OptimismKovan,
  Polygon,
  Rinkeby,
  useEthers,
} from '@usedapp/core'
import React, { useEffect, useState } from 'react'
import { chainIdToContracts } from '../config'
import { FormSection } from '../layout/FormSection'
import { FormSectionContent } from '../layout/FormSectionContent'
import { FormSectionHeader } from '../layout/FormSectionHeading'
import { ConnectWallet } from './ConnectWallet'
import { ErrorMessage } from './ErrorMessage'

export const ChainSelector = () => {
  interface SupportedNetwork {
    chainId: number
    isDeployed: boolean
    isTallySupported: boolean
    displayName: string
  }

  const supportedNetworks: SupportedNetwork[] = [
    {
      chainId: Rinkeby.chainId,
      isDeployed: true,
      isTallySupported: true,
      displayName: 'Rinkeby',
    },
    {
      chainId: OptimismKovan.chainId,
      isDeployed: true,
      isTallySupported: true,
      displayName: 'Optimism Kovan',
    },
    {
      chainId: ArbitrumRinkeby.chainId,
      isDeployed: true,
      isTallySupported: false,
      displayName: 'Arbitrum Rinkeby',
    },
    {
      chainId: Mumbai.chainId,
      isDeployed: true,
      isTallySupported: true,
      displayName: 'Mumbai (polygon testnet)',
    },
    {
      chainId: Mainnet.chainId,
      isDeployed: false,
      isTallySupported: true,
      displayName: 'Ethereum mainnet',
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

  interface Error {
    title: string
    description: string
  }

  const { chainId, library, account } = useEthers()
  const [error, setError] = useState<Error>()

  useEffect(() => {
    if (supportedNetworks.find((n) => n.chainId === chainId)) {
      setError(null)
    } else {
      setError({
        title: 'Network not supported',
        description: 'Please switch to one of the networks supported below',
      })
    }
  }, [chainId])

  const getAddChainParams = (chainId: number) => {
    const ETHER = {
      name: 'Ether',
      symbol: 'ETH',
      decimals: 18,
    }

    if (chainId == OptimismKovan.chainId) {
      return {
        chainName: OptimismKovan.chainName,
        nativeCurrency: ETHER,
        rpcUrls: ['https://kovan.optimism.io'],
        blockExplorerUrls: ['https://kovan-optimistic.etherscan.io'],
      }
    } else if (chainId == ArbitrumRinkeby.chainId) {
      return {
        chainName: ArbitrumRinkeby.chainName,
        nativeCurrency: ETHER,
        rpcUrls: ['https://rinkeby.arbitrum.io/rpc'],
        blockExplorerUrls: ['https://arbiscan.io'],
      }
    } else if (chainId == Mumbai.chainId) {
      return {
        chainName: Mumbai.chainName,
        nativeCurrency: {
          name: 'Matic',
          symbol: 'MATIC',
          decimals: 18,
        },
        rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
        blockExplorerUrls: ['https://mumbai.polygonscan.com/'],
      }
    }
  }

  const handleChangeNetwork = async (chainId) => {
    const desiredChainIdHex = `0x${chainId.toString(16)}`

    library.provider
      .request({
        method: 'wallet_switchEthereumChain',
        params: [
          {
            chainId: desiredChainIdHex,
          },
        ],
      })
      .catch((error) => {
        if (error.code === 4902) {
          return library.provider.request({
            method: 'wallet_addEthereumChain',
            params: [
              { ...getAddChainParams(chainId), chainId: desiredChainIdHex },
            ],
          })
        } else {
          throw error
        }
      })
  }

  console.log(supportedNetworks)

  return (
    <FormSection>
      <FormSectionHeader number="1" text="Connect wallet & select chain" />
      <FormSectionContent>
        {account ? (
          <>
            {error ? (
              <ErrorMessage
                title={error.title}
                description={error.description}
                mb="20px"
              />
            ) : (
              ''
            )}
            <Select
              value={chainId}
              onChange={(e) => {
                e.preventDefault()

                const desiredChainId = Number.parseInt(e.target.value)
                handleChangeNetwork(desiredChainId)
              }}
            >
              <option disabled={!error}>Select a network</option>

              {supportedNetworks.map((n) => (
                <option value={n.chainId} disabled={!n.isDeployed}>
                  {n.displayName}
                  {n.isDeployed ? '' : ' (coming soon)'}
                  {n.isTallySupported ? '' : ' (not yet supported on Tally)'}
                </option>
              ))}
            </Select>

            <Accordion mt="10px" allowToggle>
              <AccordionItem border="none">
                <AccordionButton w="auto" p="0">
                  <Text fontSize="10px">Contracts info</Text>
                </AccordionButton>
                <AccordionPanel p="0">
                  <Box fontSize={10} mt={4}>
                    <Box>Chain: {getChainById(chainId).chainName}</Box>
                    <Box>
                      Deployer contract:{' '}
                      {chainIdToContracts[chainId]?.deployerAddress}
                    </Box>
                    <Box>
                      SVGPlaceholder contract:{' '}
                      {chainIdToContracts[chainId]?.svgPlaceholderAddress}
                    </Box>
                  </Box>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </>
        ) : (
          <Box>
            <ConnectWallet />
          </Box>
        )}
      </FormSectionContent>
    </FormSection>
  )
}
