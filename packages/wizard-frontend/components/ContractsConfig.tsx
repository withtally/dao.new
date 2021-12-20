import { Box } from '@chakra-ui/layout'
import { getChainById, useEthers } from '@usedapp/core'
import React from 'react'
import { chainIdToContracts } from '../config'

export const ContractsConfig = () => {
  const { chainId } = useEthers()

  return (
    <Box maxWidth="container.sm" mt={16} ms={4}>
      {chainId ? (
        <>
          <Box>Chain: {getChainById(chainId).chainName}</Box>
          <Box>
            Deployer contract: {chainIdToContracts[chainId].deployerAddress}
          </Box>
          <Box>
            SVGPlaceholder contract:{' '}
            {chainIdToContracts[chainId].svgPlaceholderAddress}
          </Box>
        </>
      ) : (
        <Box>Please connect your wallet</Box>
      )}
    </Box>
  )
}
