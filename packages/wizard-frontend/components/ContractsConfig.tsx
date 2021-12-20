import { Box } from '@chakra-ui/layout'
import { getChainById } from '@usedapp/core'
import React from 'react'
import { CHAIN_ID, contractsAddresses } from '../config'

export const ContractsConfig = () => {
  return (
    <Box maxWidth="container.sm" mt={16} ms={4}>
      <Box>Chain: {getChainById(CHAIN_ID).chainName}</Box>
      <Box>Deployer contract: {contractsAddresses.deployerAddress}</Box>
      <Box>
        SVGPlaceholder contract: {contractsAddresses.svgPlaceholderAddress}
      </Box>
    </Box>
  )
}
