import { HStack, VStack } from '@chakra-ui/layout'
import { Heading, Text } from '@chakra-ui/react'
import config from '../../config'
import { OpenSeaLink } from '../OpenSeaLink'
import { RaribleLink } from '../RaribleLink'
import { useNFTName, useTotalSupply } from '../../lib/contractWrappers/token'

export const TokenAdmin = () => {
  const totalSupply = useTotalSupply()
  const tokenName = useNFTName()

  return (
    <VStack spacing={16} alignItems="flex-start">
      <VStack spacing={4} alignItems="flex-start">
        <Heading as="h3" size="lg">
          {tokenName}
        </Heading>
        <Text>Contract address: {config.tokenAddress}</Text>
        <HStack spacing={4}>
          <OpenSeaLink linkText="View on OpenSea" />
          <RaribleLink linkText="View on Rarible" />
        </HStack>
        <Text>Total supply: {totalSupply && totalSupply.toString()}</Text>
      </VStack>
    </VStack>
  )
}
