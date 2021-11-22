import { VStack, Heading, Text } from '@chakra-ui/react'
import { useMaxMintPerTx } from '../../lib/contractWrappers/minter'

export const MinterAdminMaxMintsView = () => {
  const maxMintsPerTx = useMaxMintPerTx()

  return (
    <VStack spacing={4} alignItems="flex-start">
      <Heading as="h3" size="lg">
        Max mints per transaction
      </Heading>
      <Text>Value: {maxMintsPerTx}</Text>
    </VStack>
  )
}
