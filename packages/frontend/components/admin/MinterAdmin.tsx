import { Box, HStack, VStack } from '@chakra-ui/layout'
import {
  Button,
  NumberInput,
  NumberInputField,
  Heading,
  Text,
} from '@chakra-ui/react'
import { BigNumberish } from '@ethersproject/bignumber'
import { formatEther, parseEther, parseUnits } from 'ethers/lib/utils'
import React, { useState } from 'react'
import config from '../../config'
import {
  useFixedPriceSupplyMinterFunction,
  useIncrementalMinterMintPrice,
  useIsSaleActive,
  useIncrementalMinterIsTokenPriceLocked,
} from '../../lib/contractWrappers/minter'
import { MinterDetailsTable } from '../minter/MinterDetailsTable'

export const MinterAdmin = () => {
  const tokenPrice = useIncrementalMinterMintPrice()
  const isTokenPriceLocked = useIncrementalMinterIsTokenPriceLocked()
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

  const lockTokenPrice = () => {
    updateContractLockTokenPrice()
  }

  return (
    <>
      <Box>Contract address: {config.minterAddress}</Box>
      <VStack spacing={4} alignItems="flex-start">
        <Heading as="h3" size="sm">
          Token price
        </Heading>
        <HStack>
          <Text>Current: {showEther(tokenPrice)}</Text>
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
                isDisabled={isTokenPriceLocked}
              >
                Update
              </Button>
            </HStack>
          </form>
        </HStack>
        <HStack>
          <Text>Lock status: {isTokenPriceLocked ? 'Locked' : 'Unlocked'}</Text>
          <Button
            isDisabled={isTokenPriceLocked}
            onClick={lockTokenPrice}
            isLoading={updateContractLockTokenPriceState.status === 'Mining'}
          >
            Lock
          </Button>
        </HStack>
      </VStack>
    </>
  )
}
