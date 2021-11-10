import {
  Button,
  Input,
  Text,
  FormControl,
  FormLabel,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  Switch,
} from '@chakra-ui/react'
import { AddIcon, DeleteIcon } from '@chakra-ui/icons'
import { IconButton } from '@chakra-ui/button'

import { MintingFilterParmas } from '../pages/index'

type MintingFilterFormProps = {
  values: MintingFilterParmas
  onValuesChange: (newValues: MintingFilterParmas) => void
}

export const MintingFilterForm = ({
  values,
  onValuesChange,
}: MintingFilterFormProps) => {
  const onSwitchChange = (e) => {
    const newValues = Object.assign({}, values)

    newValues.useMintingFilter = e.target.checked

    onValuesChange(newValues)
  }

  const onAddClick = (e) => {
    const newValues = Object.assign({}, values)

    newValues.tokens.push({
      address: '',
      minBalance: 1,
    })

    onValuesChange(newValues)
  }

  const onContractAddressChange = (e) => {
    const newValues = Object.assign({}, values)

    const index = parseInt(e.target.id.split('-')[1])
    newValues.tokens[index].address = e.target.value

    onValuesChange(newValues)
  }

  const onMinBalanceChange = (index: number, v: string) => {
    const newValues = Object.assign({}, values)

    newValues.tokens[index].minBalance = parseInt(v)

    onValuesChange(newValues)
  }

  const onDeleteToken = (index: number) => {
    const newValues = Object.assign({}, values)

    newValues.tokens.splice(index, 1)

    onValuesChange(newValues)
  }

  const tokenInputs = values.tokens.map((t, index) => (
    <HStack key={index} alignItems="flex-end">
      <FormControl id={`address-${index}`} isRequired>
        <FormLabel>NFT contract address</FormLabel>
        <Input
          name={`address-${index}`}
          type="text"
          value={t.address}
          onChange={onContractAddressChange}
        />
      </FormControl>
      <FormControl id={`minbalance-${index}`} isRequired>
        <FormLabel>Minimal balance</FormLabel>
        <NumberInput
          name={`minbalance-${index}`}
          defaultValue={1}
          step={1}
          min={0}
          value={t.minBalance}
          onChange={(v) => onMinBalanceChange(index, v)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <IconButton
        aria-label=""
        variant="ghost"
        icon={<DeleteIcon />}
        onClick={() => onDeleteToken(index)}
      />
    </HStack>
  ))

  return (
    <VStack spacing={6} alignItems="flex-start">
      <FormControl display="flex" alignItems="center">
        <FormLabel htmlFor="buyer-filtering" mb="0">
          Enable buyer filtering?
        </FormLabel>
        <Switch
          id="buyer-filtering"
          onChange={onSwitchChange}
          checked={values.useMintingFilter}
        />
      </FormControl>
      <Text color="gray.500" fontSize="sm">
        Use this if you want to only allow certain NFT holders to mint your
        token. <br />
        To find the NFT contract address, find it on rarible.com, and copy the
        address just below the collection name.
      </Text>
      {values.useMintingFilter ? (
        <>
          <Button leftIcon={<AddIcon />} onClick={onAddClick}>
            Add NFT
          </Button>
          {tokenInputs}
        </>
      ) : (
        <></>
      )}
    </VStack>
  )
}
