import { Box, Heading, Text } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Td, Th } from '@chakra-ui/react'
import { ConnectToTally } from './ConnectToTally'
import { CHAIN_ID } from '../config'

export const ClonesView = ({ clones, clonesBlockNumber, governorName }) => {
  return (
    <>
      <Box maxWidth="container.sm" p={4} ms={4} mt={8} bg="gray.100">
        <Heading as="h2" size="lg" mb={4}>
          Your NFT DAO contracts:
        </Heading>
        <Text color="gray.600" fontSize="sm">
          Save these addresses so you can easily find contracts later. You can
          always find them again on Etherscan, in the transaction you just sent.
        </Text>
        <Table variant="unstyled" mt={8}>
          <Thead>
            <Tr>
              <Th>Contract</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td>NFT</Td>
              <Td>{clones.token}</Td>
            </Tr>
            <Tr>
              <Td>Minter</Td>
              <Td>{clones.minter}</Td>
            </Tr>
            <Tr>
              <Td>Governor</Td>
              <Td>{clones.governor}</Td>
            </Tr>
            <Tr>
              <Td>Timelock</Td>
              <Td>{clones.timelock}</Td>
            </Tr>
          </Tbody>
        </Table>
        <Heading as="h3" size="md" mb={4}>
          Manage your DAO on Tally
        </Heading>
        <ConnectToTally
          orgName={governorName}
          tokenAddress={clones.token}
          chainId={CHAIN_ID}
          startBlock={clonesBlockNumber}
          governanceAddress={clones.governor}
        />
      </Box>
    </>
  )
}
