import { Box } from '@chakra-ui/layout'
import { CHAIN_NAMES } from '@usedapp/core'
import React from 'react'
import { CHAIN_ID, contractsAddresses } from '../config'

export const ContractsConfig = () => {
  return (
    <Box maxWidth="container.sm" mt={16} ms={4}>
      <Box>Chain: {CHAIN_NAMES[CHAIN_ID]}</Box>
      <Box>Deployer contract: {contractsAddresses.deployerAddress}</Box>
      <Box>
        SVGPlaceholder contract: {contractsAddresses.svgPlaceholderAddress}
      </Box>
    </Box>
  )
}
