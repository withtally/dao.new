import { VStack, Heading, Text, Box } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Td, Th } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { ConnectToTally } from './ConnectToTally'
import { EtherscanVerifyProxies } from './EtherscanVerifyProxies'
import { FirstTd } from './FirstTd'
import { ModalHeading } from './ModalHeading'

export const ClonesView = ({
  clones,
  clonesBlockNumber,
  governorName,
  needsVerification,
}) => {
  const { chainId } = useEthers()

  const tallyHeadingIndex = needsVerification ? '3.' : '2.'
  return (
    <Box mx={{ base: 0, md: '80px' }} mb="58px">
      <Heading
        as="h1"
        size="xl"
        mb={4}
        textAlign="center"
        fontSize="36px"
        my="38px"
      >
        Your NFT DAO is deployed!
      </Heading>
      <Box mb="35px">
        <ModalHeading number="1." text="Save your contract addresses" />
        <Text color="brandGray.400" fontSize="12px" mt="3px">
          So you can easily find contracts later. You can always find them again
          on Etherscan, in the transaction you just sent.
        </Text>
        <Table variant="modalTable" mt={8}>
          <Thead>
            <Tr>
              <Th>Contract</Th>
              <Th>Address</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <FirstTd>NFT</FirstTd>
              <Td>{clones.token}</Td>
            </Tr>
            <Tr>
              <FirstTd>Minter</FirstTd>
              <Td>{clones.minter}</Td>
            </Tr>
            <Tr>
              <FirstTd>Governor</FirstTd>
              <Td>{clones.governor}</Td>
            </Tr>
            <Tr>
              <FirstTd>Timelock</FirstTd>
              <Td>{clones.timelock}</Td>
            </Tr>
          </Tbody>
        </Table>
      </Box>
      {needsVerification ? (
        <VStack spacing={4} alignItems="flex-start" width="100%">
          <Heading as="h3" size="md">
            2. Verify your contracts on Etherscan
          </Heading>
          <EtherscanVerifyProxies
            governorAddress={clones.governor}
            timelockAddress={clones.timelock}
          />
        </VStack>
      ) : (
        <></>
      )}
      <VStack spacing={4} alignItems="flex-start">
        <ModalHeading
          number={tallyHeadingIndex}
          text="Manage your DAO on Tally"
        />
        <ConnectToTally
          orgName={governorName}
          tokenAddress={clones.token}
          chainId={chainId}
          startBlock={clonesBlockNumber}
          governanceAddress={clones.governor}
        />
      </VStack>
    </Box>
  )
}
