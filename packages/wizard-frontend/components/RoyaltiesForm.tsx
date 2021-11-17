import {
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Radio,
  RadioGroup,
  HStack,
} from '@chakra-ui/react'

export type RoyaltiesParams = {
  royaltiesBPs: number
  isRoyaltiesRecipientOverrideEnabled: boolean
  royaltiesRecipientOverride: string
}

export const RoyaltiesForm = ({ values, onValuesChange }) => {
  function onTokenRoyaltiesBPsChange(e) {
    const newValues = Object.assign({}, values)

    newValues.royaltiesBPs = parseFloat(e) * 100

    onValuesChange(newValues)
  }

  function onTokenRoyaltiesRecipientOverrideEnabledChange(e) {
    const newValues = Object.assign({}, values)

    newValues.isRoyaltiesRecipientOverrideEnabled = parseInt(e) === 1

    onValuesChange(newValues)
  }

  function onTokenRoyaltiesRecipientOverrideChange(e) {
    const newValues = Object.assign({}, values)

    newValues.royaltiesRecipientOverride = e.target.value

    onValuesChange(newValues)
  }

  return (
    <VStack>
      <FormControl id="token-royaltypercent">
        <FormLabel>Resell royalties %</FormLabel>
        <NumberInput
          defaultValue={0}
          step={0.1}
          min={0}
          max={100}
          value={values.royaltiesBPs ? values.royaltiesBPs / 100 : 0}
          onChange={onTokenRoyaltiesBPsChange}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText>
          The maximum number of tokens that can be minted, including tokens
          minted by the creator and the project's users.
        </FormHelperText>
      </FormControl>
      <FormControl id="token-royaltiesoverrideradio" isRequired>
        <FormLabel>Royalties recipient</FormLabel>
        <RadioGroup
          defaultValue="0"
          value={values.isRoyaltiesRecipientOverrideEnabled ? '1' : '0'}
          onChange={onTokenRoyaltiesRecipientOverrideEnabledChange}
        >
          <HStack spacing={8}>
            <Radio value="0">Your DAO (default)</Radio>
            <Radio value="1">Override with a different address</Radio>
          </HStack>
        </RadioGroup>
        <FormHelperText>
          Minting revenue is configured in the section below. This is only about
          where resell royalties should go. By default resell royalties are
          directed to the DAO. If you'd like another address to received
          royalties choose to override and add the recipient's address.
        </FormHelperText>
      </FormControl>
      {values.isRoyaltiesRecipientOverrideEnabled ? (
        <FormControl id="token-royaltiesRecipientOverride" isRequired>
          <FormLabel>Royalties recipient override</FormLabel>
          <Input
            type="text"
            value={values.royaltiesRecipientOverride}
            onChange={onTokenRoyaltiesRecipientOverrideChange}
          />
          <FormHelperText>e.g. your MetaMask address.</FormHelperText>
        </FormControl>
      ) : (
        <></>
      )}
    </VStack>
  )
}
