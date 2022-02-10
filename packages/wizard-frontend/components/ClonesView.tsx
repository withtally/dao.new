import { ExternalLinkIcon } from '@chakra-ui/icons'
import { VStack, Heading, Text, Box, Link } from '@chakra-ui/react'
import { Table, Thead, Tbody, Tr, Td, Th } from '@chakra-ui/react'
import { getChainById, useEthers } from '@usedapp/core'
import { isChainSupportedByTally } from '../lib/networks'
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
        textAlign="center"
        fontSize="36px"
        mt="38px"
        mb="28px"
      >
        Your NFT DAO is deployed!
      </Heading>
      <Text mb="10px" fontSize="14px">
        Your contracts were successfully deployed to the{' '}
        {getChainById(chainId).chainName} network.
      </Text>
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
            {[
              ['NFT', clones.token],
              ['Minter', clones.minter],
              ['Governor', clones.governor],
              ['Timelock', clones.timelock],
            ].map((x) => (
              <Tr key={x[0]}>
                <FirstTd>{x[0]}</FirstTd>
                <Td>
                  <Link
                    isExternal
                    href={getChainById(chainId).getExplorerAddressLink(x[1])}
                  >
                    {x[1]}
                    <ExternalLinkIcon mx="2px" />
                  </Link>
                </Td>
              </Tr>
            ))}
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
        {isChainSupportedByTally(chainId) ? (
          <ConnectToTally
            orgName={governorName}
            tokenAddress={clones.token}
            chainId={chainId}
            startBlock={clonesBlockNumber}
            governanceAddress={clones.governor}
          />
        ) : (
          <Text fontSize="14px">
            This network not yet supported by Tally, please send an email to{' '}
            <Link isExternal href="mailto:hello@withTally.com">
              hello@withTally.com
            </Link>{' '}
            to request support
          </Text>
        )}
      </VStack>
    </Box>
  )
}
