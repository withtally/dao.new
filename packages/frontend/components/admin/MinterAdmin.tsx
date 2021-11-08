import { Box, HStack } from '@chakra-ui/layout'
import { Button, NumberInput, NumberInputField } from '@chakra-ui/react'
import { BigNumberish } from '@ethersproject/bignumber'
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils'
import React, { useState } from 'react'
import config from '../../config'
import {
  useFixedPriceSupplyMinterFunction,
  useIncrementalMinterMintPrice,
  useIsSaleActive,
} from '../../lib/contractWrappers/minter'
import { MinterDetailsTable } from '../minter/MinterDetailsTable'

export const MinterAdmin = () => {
  const tokenPrice = useIncrementalMinterMintPrice()
  const isSaleActive = useIsSaleActive()
  const {
    send: updateContractTokenPrice,
    state: updateContractTokenPriceState,
  } = useFixedPriceSupplyMinterFunction('setTokenPrice')

  const {
    send: updateContractLockTokenPrice,
    state: updateContractLockTokenPriceState,
  } = useFixedPriceSupplyMinterFunction('lockTokenPrice')

  const [formTokenPrice, setFormTokenPrice] = useState('')

  const showEther = (wei: BigNumberish) => {
    if (wei) {
      return `Ξ ${formatEther(wei)}`
    }
  }

  const updateTokenPrice = (e) => {
    e.preventDefault()
    updateContractTokenPrice(parseEther(formTokenPrice))
  }

  return (
    <>
      <Box>Contract address: {config.minterAddress}</Box>
      <HStack>
        <Box>Token price: {showEther(tokenPrice)}</Box>
        <form onSubmit={updateTokenPrice}>
          <HStack>
            <NumberInput
              min={0}
              value={formTokenPrice}
              onChange={(s) => {
                setFormTokenPrice(s)
              }}
            >
              <NumberInputField />
            </NumberInput>
            <Button
              type="submit"
              isLoading={updateContractTokenPriceState.status === 'Mining'}
            >
              Update
            </Button>
          </HStack>
        </form>
        <Button>Lock</Button>
      </HStack>
    </>
  )
}
