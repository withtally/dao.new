import { Layout } from '../components/layout/Layout'
import { Box, Container, Heading } from '@chakra-ui/react'
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
      <Container maxW="container.lg">
        <Heading size="xl">Admin</Heading>
        <Heading size="lg">Minter contract</Heading>
        <MinterAdmin />
        <Heading size="lg">NFT contract</Heading>
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
      </Container>
    </Layout>
  )
}

export default Mint
