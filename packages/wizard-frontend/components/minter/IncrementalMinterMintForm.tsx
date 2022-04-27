import {
  Box,
  Button,
  FormControl,
  FormLabel,
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  VStack,
} from '@chakra-ui/react'
import { FixedPriceSequentialMinterABI } from '@create-nft-dao/hardhat'
import { useContractFunction } from '@usedapp/core'
import { formatEther } from 'ethers/lib/utils'
import { Contract, utils } from 'ethers'

import React, { useState, useEffect } from 'react'
import { useMaxMintPerTx } from '../../lib/contractWrappers/minter'
import { useRouter } from 'next/router'

export const IncrementalMinterMintForm = ({ tokenPrice }) => {
  const router = useRouter()
  const [minter, setMinter] = useState(null)
  useEffect(() => {
    if (router?.query?.minter) {
      setMinter(router.query.minter)
    }
  }, [router])


  const maxMintPerTx = useMaxMintPerTx({ minterAddress: minter })
  const [tokensToMint, setTokensToMint] = useState(1)
  const valueToSend = tokenPrice && tokenPrice.mul(tokensToMint)

  const [contract, setContract] = useState(null)


  useEffect(() => {
    if (minter) {
      setContract(
        new Contract(
          '0xac23a272C3a1f9F0E6047Ac1B90EffDf51A4071b',
          FixedPriceSequentialMinterABI.abi
        )
      )
    }
  }, [minter])

  const { send: mint, state: mintState } = useContractFunction(contract, 'mint')

  const mintClicked = () => {
    mint(tokensToMint, { value: valueToSend })
  }

  return (
    <VStack>
      <FormControl>
        <FormLabel>Tokens to mint (max {maxMintPerTx}):</FormLabel>
        <NumberInput
          step={1}
          min={0}
          max={maxMintPerTx}
          value={tokensToMint}
          onChange={(_, n) => setTokensToMint(n)}
        >
          <NumberInputField fontSize="30px" textAlign="center" padding={6} />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>

      <Box>ETH: {valueToSend && formatEther(valueToSend)}</Box>
      <Button
        w="100%"
        onClick={mintClicked}
        isLoading={mintState.status === 'Mining'}
      >
        MINT
      </Button>

      <Box>
        {mintState.status !== 'None' ? `tx status: ${mintState.status}` : ''}
      </Box>
      <Box>
        {mintState.status === 'Exception' ? mintState.errorMessage : ''}
      </Box>
    </VStack>
  )
}
