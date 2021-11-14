import { Layout } from '../components/layout/Layout'
import { Box, Container, Heading, VStack } from '@chakra-ui/react'
import React from 'react'
import { MinterAdmin } from '../components/admin/MinterAdmin'
import { TokenAdmin } from '../components/admin/TokenAdmin'
import { GovernanceAdmin } from '../components/admin/GovernanceAdmin'
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
      <VStack maxW="container.lg" spacing={16} alignItems="flex-start" px={4}>
        <Heading as="h1" size="2xl">
          Admin
        </Heading>
        <Heading as="h2" size="xl">
          Minter contract
        </Heading>
        <MinterAdmin />
        <Heading as="h2" size="xl">
          NFT contract
        </Heading>
        <TokenAdmin />
        <Heading as="h2" size="xl">
          Governance
        </Heading>
        <GovernanceAdmin />
        <Box mt={20} pt={20}>
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
