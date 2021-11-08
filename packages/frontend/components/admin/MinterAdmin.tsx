import { Box, HStack } from '@chakra-ui/layout'
import { Button, NumberInput, NumberInputField } from '@chakra-ui/react'
import { BigNumberish } from '@ethersproject/bignumber'
import { formatEther } from 'ethers/lib/utils'
import React from 'react'
import config from '../../config'
import {
  useIncrementalMinterMintPrice,
  useIsSaleActive,
} from '../../lib/contractWrappers/minter'
import { MinterDetailsTable } from '../minter/MinterDetailsTable'

export const MinterAdmin = () => {
  const tokenPrice = useIncrementalMinterMintPrice()
  const isSaleActive = useIsSaleActive()

  const showEther = (wei: BigNumberish) => {
    if (wei) {
      return `Ξ ${formatEther(wei)}`
    }
  }

  return (
    <>
      {/* <Box>Contract address: {config.minterAddress}</Box>
      <HStack>
        <Box>Token price: {showEther(tokenPrice)}</Box>
        <form onSubmit={}>
          <HStack>
            <NumberInput min={0} defaultValue={tokenPrice}>
              <NumberInputField />
            </NumberInput>
            <Button>Update</Button>
          </HStack>
        </form>
        <Button>Lock</Button>
      </HStack> */}
      <MinterDetailsTable isSaleActive={isSaleActive} tokenPrice={tokenPrice} />
    </>
  )
}
