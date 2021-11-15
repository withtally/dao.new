import { VStack } from '@chakra-ui/layout'
import { Button } from '@chakra-ui/react'
import { useState } from 'react'
import {
  useGetTokenFilters,
  useMintingFilterFunction,
} from '../lib/contractWrappers/mintingFilter'
import { MintingFilterForm } from './MintingFilterForm'

export const MintingFilterEditForm = ({ mintingFilterAddress }) => {
  // This component assumes there is a minting filter.
  // It does not support adding a filter when there wasn't one before.
  // TODO: add support for cloning and setting a new filter.

  const [waitingForTokenFilters, setWaitingForTokenFilters] = useState(true)
  const [mintingFilterFormValues, setMintingFilterFormValues] = useState({
    useMintingFilter: true,
    tokens: [],
  })
  const tokenFilters = useGetTokenFilters(mintingFilterAddress)
  const { send: setTokenFilters, state: setTokenFiltersState } =
    useMintingFilterFunction(mintingFilterAddress, 'setTokenFilters')

  if (waitingForTokenFilters && tokenFilters !== undefined) {
    setMintingFilterFormValues({
      useMintingFilter: true,
      tokens: tokenFilters.map((tokenAndBalance) => {
        return {
          address: tokenAndBalance[0],
          minBalance: tokenAndBalance[1],
        }
      }),
    })

    setWaitingForTokenFilters(false)
  }

  const onFormValuesChange = (newValues) => {
    setMintingFilterFormValues(newValues)
  }

  const onUpdateClick = () => {
    if (mintingFilterFormValues.useMintingFilter) {
      const addresses = mintingFilterFormValues.tokens.map((t) => t.address)
      const balances = mintingFilterFormValues.tokens.map((t) => t.minBalance)
      setTokenFilters(addresses, balances)
    } else {
      setTokenFilters([], [])
    }
  }

  return (
    <VStack spacing={4} alignItems="flex-start">
      <MintingFilterForm
        values={mintingFilterFormValues}
        onValuesChange={onFormValuesChange}
      />

      <Button
        onClick={onUpdateClick}
        isLoading={setTokenFiltersState.status === 'Mining'}
      >
        Update buyer filtering
      </Button>
    </VStack>
  )
}
