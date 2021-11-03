import { HStack, Link, Table, Tbody, Td, Tr } from '@chakra-ui/react'

import React from 'react'
import {
  useIncrementalMinterMintPrice,
  useIsSaleActive,
} from '../../lib/contractWrappers/minter'
import { IncrementalMinterMintForm } from './IncrementalMinterMintForm'
import { MinterDetailsTable } from './MinterDetailsTable'

export const IncrementalMinter = () => {
  const isSaleActive = useIsSaleActive()
  const tokenPrice = useIncrementalMinterMintPrice()

  return (
    <HStack spacing="20">
      <MinterDetailsTable isSaleActive={isSaleActive} tokenPrice={tokenPrice} />

      <IncrementalMinterMintForm tokenPrice={tokenPrice} />
    </HStack>
  )
}
