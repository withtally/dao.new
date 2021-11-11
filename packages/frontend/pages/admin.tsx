import { Layout } from '../components/layout/Layout'
import { Box, Container, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { MinterAdmin } from '../components/admin/MinterAdmin'
import { ContractsTable } from '../components/admin/ContractsTable'
import { MinterDetailsTable } from '../components/minter/MinterDetailsTable'
import {
  useIncrementalMinterMintPrice,
  useIsSaleActive,
} from '../lib/contractWrappers/minter'

const Mint = () => {
  const tokenPrice = useIncrementalMinterMintPrice()
  const isSaleActive = useIsSaleActive()

  return (
    <Layout>
      <VStack maxW="container.lg" spacing={4} alignItems="flex-start" px={4}>
        <Heading size="xl">Admin</Heading>
        <Heading size="lg">Minter contract</Heading>
        <MinterAdmin />
        <Heading size="lg" pt={16}>
          NFT contract
        </Heading>
        TODO
        <Box mt={20}>
          <hr></hr>
          <Heading>Old implementation</Heading>
          <ContractsTable />
          <MinterDetailsTable
            isSaleActive={isSaleActive}
            tokenPrice={tokenPrice}
          />
        </Box>
      </VStack>
    </Layout>
  )
}

export default Mint
