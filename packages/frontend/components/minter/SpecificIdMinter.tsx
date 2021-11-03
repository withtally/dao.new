import { HStack } from '@chakra-ui/react'
import React from 'react'
import {
  useIsSaleActive,
  useSpecificIdMinterMintPrice,
} from '../../lib/contractWrappers/minter'
import { MinterDetailsTable } from './MinterDetailsTable'
import { SpecificIdMinterMintForm } from './SpecificIdMinterMintForm'

export const SpecificIdMinter = () => {
  const isSaleActive = useIsSaleActive()
  const tokenPrice = useSpecificIdMinterMintPrice()

  return (
    <HStack spacing="20">
      <MinterDetailsTable isSaleActive={isSaleActive} tokenPrice={tokenPrice} />
      <SpecificIdMinterMintForm tokenPrice={tokenPrice} />
    </HStack>
  )
}
