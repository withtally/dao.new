import { Box, HStack, VStack } from '@chakra-ui/layout'
import {
  Button,
  NumberInput,
  NumberInputField,
  Heading,
  Text,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
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
  useIncrementalMinterMaxTokens,
  useIncrementalMinterIsMaxTokensLocked,
  useStartingBlock,
  useIsStartingBlockLocked,
  useIsOwnerMintLocked,
  useFixedPriceSequentialMinterFunction,
  usePauseSale,
  useUnpauseSale,
  useMintingFilter,
} from '../../lib/contractWrappers/minter'
import { MintingFilterEditForm } from '../MintingFilterEditForm'

export const MinterAdmin = () => {
  const [formTokenPrice, setFormTokenPrice] = useState('')
  const tokenPrice = useIncrementalMinterMintPrice()
  const isTokenPriceLocked = useIncrementalMinterIsTokenPriceLocked()
  const { send: setTokenPrice, state: setTokenPriceState } =
    useFixedPriceSupplyMinterFunction('setTokenPrice')
  const { send: lockTokenPrice, state: lockTokenPriceState } =
    useFixedPriceSupplyMinterFunction('lockTokenPrice')

  const [formMaxTokens, setFormMaxTokens] = useState('')
  const maxTokens = useIncrementalMinterMaxTokens()
  const isMaxTokensLocked = useIncrementalMinterIsMaxTokensLocked()
  const { send: setMaxTokens, state: setMaxTokensState } =
    useFixedPriceSupplyMinterFunction('setMaxTokens')
  const { send: lockMaxTokens, state: lockMaxTokensState } =
    useFixedPriceSupplyMinterFunction('lockMaxTokens')

  const [formStartingBlock, setFormStartingBlock] = useState('')
  const startingBlock = useStartingBlock()
  const isStartingBlockLocked = useIsStartingBlockLocked()
  const { send: setStartingBlock, state: setStartingBlockState } =
    useFixedPriceSupplyMinterFunction('setStartingBlock')
  const { send: lockStartingBlock, state: lockStartingBlockState } =
    useFixedPriceSupplyMinterFunction('lockStartingBlock')

  const [ownerMintTo, setOwnerMintTo] = useState('')
  const [ownerMintAmount, setOwnerMintAmount] = useState('')
  const isOwnerMintLocked = useIsOwnerMintLocked()
  const { send: ownerMint, state: ownerMintState } =
    useFixedPriceSequentialMinterFunction('ownerMint')
  const { send: lockOwnerMint, state: lockOwnerMintState } =
    useFixedPriceSupplyMinterFunction('lockOwnerMint')

  const isSaleActive = useIsSaleActive()
  const { send: pauseSale, state: pauseSaleState } = usePauseSale()
  const { send: unpauseSale, state: unpauseSaleState } = useUnpauseSale()

  const mintingFilterAddress = useMintingFilter()

  const showEther = (wei: BigNumberish) => {
    if (wei) {
      return `Ξ ${formatEther(wei)}`
    }
  }

  const onTokenPriceSubmit = (e) => {
    e.preventDefault()
    setTokenPrice(parseEther(formTokenPrice))
  }

  const onLockTokenPriceClick = () => {
    lockTokenPrice()
  }

  const onMaxTokensSubmit = (e) => {
    e.preventDefault()
    setMaxTokens(parseInt(formMaxTokens))
  }

  const onLockMaxTokensClick = () => {
    lockMaxTokens()
  }

  const onStartingBlockSubmit = (e) => {
    e.preventDefault()
    setStartingBlock(parseInt(formStartingBlock))
  }

  const onLockStartingBlockClick = () => {
    lockStartingBlock()
  }

  const onOwnerMintSubmit = (e) => {
    e.preventDefault()
    ownerMint(ownerMintTo, parseInt(ownerMintAmount))
  }

  const onLockOwnerMintClick = () => {
    lockOwnerMint()
  }

  const onSaleStatusClick = () => {
    if (isSaleActive) {
      pauseSale()
    } else {
      unpauseSale()
    }
  }

  return (
    <>
      <Box>Contract address: {config.minterAddress}</Box>
      <VStack spacing={16} alignItems="flex-start">
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h3" size="md">
            Token price
          </Heading>
          <HStack>
            <Text>Current: {showEther(tokenPrice)}</Text>
            <form onSubmit={onTokenPriceSubmit}>
              <HStack>
                <NumberInput
                  min={0}
                  value={formTokenPrice}
                  isDisabled={isTokenPriceLocked}
                  onChange={(s) => {
                    setFormTokenPrice(s)
                  }}
                >
                  <NumberInputField />
                </NumberInput>
                <Button
                  type="submit"
                  isLoading={setTokenPriceState.status === 'Mining'}
                  isDisabled={isTokenPriceLocked}
                >
                  Update
                </Button>
              </HStack>
            </form>
          </HStack>
          <HStack>
            <Text>
              Lock status: {isTokenPriceLocked ? 'Locked' : 'Unlocked'}
            </Text>
            <Button
              isDisabled={isTokenPriceLocked}
              onClick={onLockTokenPriceClick}
              isLoading={lockTokenPriceState.status === 'Mining'}
            >
              Lock
            </Button>
          </HStack>
        </VStack>
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h3" size="md">
            Max token supply
          </Heading>
          <HStack>
            <Text>
              Current: {maxTokens !== undefined ? maxTokens.toString() : ''}
            </Text>
            <form onSubmit={onMaxTokensSubmit}>
              <HStack>
                <NumberInput
                  min={0}
                  value={formMaxTokens}
                  onChange={(s) => {
                    setFormMaxTokens(s)
                  }}
                >
                  <NumberInputField />
                </NumberInput>
                <Button
                  type="submit"
                  isLoading={setMaxTokensState.status === 'Mining'}
                  isDisabled={isMaxTokensLocked}
                >
                  Update
                </Button>
              </HStack>
            </form>
          </HStack>
          <HStack>
            <Text>
              Lock status: {isMaxTokensLocked ? 'Locked' : 'Unlocked'}
            </Text>
            <Button
              isDisabled={isMaxTokensLocked}
              onClick={onLockMaxTokensClick}
              isLoading={lockMaxTokensState.status === 'Mining'}
            >
              Lock
            </Button>
          </HStack>
        </VStack>
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h3" size="md">
            Sale start block
          </Heading>
          <HStack>
            <Text>
              Current:{' '}
              {startingBlock !== undefined ? startingBlock.toString() : ''}
            </Text>
            <form onSubmit={onStartingBlockSubmit}>
              <HStack>
                <NumberInput
                  min={0}
                  value={formStartingBlock}
                  onChange={(s) => {
                    setFormStartingBlock(s)
                  }}
                >
                  <NumberInputField />
                </NumberInput>
                <Button
                  type="submit"
                  isLoading={setStartingBlockState.status === 'Mining'}
                  isDisabled={isStartingBlockLocked}
                >
                  Update
                </Button>
              </HStack>
            </form>
          </HStack>
          <HStack>
            <Text>
              Lock status: {isStartingBlockLocked ? 'Locked' : 'Unlocked'}
            </Text>
            <Button
              isDisabled={isStartingBlockLocked}
              onClick={onLockStartingBlockClick}
              isLoading={lockStartingBlockState.status === 'Mining'}
            >
              Lock
            </Button>
          </HStack>
        </VStack>
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h3" size="md">
            Owner mint
          </Heading>
          <form onSubmit={onOwnerMintSubmit}>
            <VStack spacing={4} alignItems="flex-start">
              <FormControl>
                <FormLabel>To</FormLabel>
                <Input
                  type="text"
                  value={ownerMintTo}
                  onChange={(s) => {
                    setOwnerMintTo(s.target.value)
                  }}
                />
                <FormHelperText>
                  The Ethereum wallet address of the recipient.
                </FormHelperText>
              </FormControl>
              <FormControl>
                <FormLabel>Amount</FormLabel>
                <NumberInput
                  min={0}
                  value={ownerMintAmount}
                  onChange={(s) => {
                    setOwnerMintAmount(s)
                  }}
                >
                  <NumberInputField />
                </NumberInput>
                <FormHelperText>
                  How many tokens to mint to the recipient.
                </FormHelperText>
              </FormControl>
              <Button
                type="submit"
                isLoading={ownerMintState.status === 'Mining'}
                isDisabled={isOwnerMintLocked}
              >
                Mint
              </Button>
            </VStack>
          </form>
          <HStack>
            <Text>
              Lock status: {isOwnerMintLocked ? 'Locked' : 'Unlocked'}
            </Text>
            <Button
              isDisabled={isOwnerMintLocked}
              onClick={onLockOwnerMintClick}
              isLoading={lockOwnerMintState.status === 'Mining'}
            >
              Lock
            </Button>
          </HStack>
        </VStack>
        <VStack spacing={4} alignItems="flex-start">
          <Heading as="h3" size="md">
            Sale status
          </Heading>
          <HStack>
            <Text>Sale status: {isSaleActive ? 'Open' : 'Paused'}</Text>
            <Button
              onClick={onSaleStatusClick}
              isLoading={
                pauseSaleState.status === 'Mining' ||
                unpauseSaleState.status === 'Mining'
              }
            >
              {isSaleActive ? 'Pause' : 'Open'}
            </Button>
          </HStack>
        </VStack>
        {mintingFilterAddress !== undefined ? (
          <VStack spacing={4} alignItems="flex-start">
            <Heading as="h3" size="md">
              Buyer filtering
            </Heading>
            <MintingFilterEditForm
              mintingFilterAddress={mintingFilterAddress}
            />
          </VStack>
        ) : (
          <></>
        )}
      </VStack>
    </>
  )
}
