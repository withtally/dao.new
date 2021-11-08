import { Layout } from '../components/layout/Layout'
import {
  Center,
  Container,
  Heading,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import React from 'react'
import { MinterAdmin } from '../components/admin/MinterAdmin'
import { ContractsTable } from '../components/admin/ContractsTable'

const Mint = () => {
  return (
    <Layout>
      <Container maxW="container.lg">
        <ContractsTable />
        <Heading size="xl">Admin</Heading>
        <Heading size="lg">Minter contract</Heading>
        <MinterAdmin />
        <Heading size="lg">NFT contract</Heading>
        TODO
      </Container>
    </Layout>
  )
}

export default Mint
