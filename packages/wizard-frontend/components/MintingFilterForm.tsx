import { Heading, VStack } from '@chakra-ui/react'
import { MintingFilterToggle } from 'create-nft-dao-shared-frontend'
import { MintingFilterNFTsInputs } from 'create-nft-dao-shared-frontend'

export const MintingFilterForm = ({ values, onValuesChange }) => {
  const onSwitchChange = (newValue) => {
    const newValues = Object.assign({}, values)

    newValues.useMintingFilter = newValue

    onValuesChange(newValues)
  }

  const onTokenInputsChange = (newTokensValue) => {
    const newValues = Object.assign({}, values)

    newValues.tokens = newTokensValue

    onValuesChange(newValues)
  }

  return (
    <>
      <Heading as="h3" size="lg" mb={6} mt={6}>
        2.1 Buyer Filtering
      </Heading>
      <VStack spacing={6} alignItems="flex-start">
        <MintingFilterToggle
          value={values.useMintingFilter}
          onValueChange={onSwitchChange}
        />
        {values.useMintingFilter ? (
          <>
            <MintingFilterNFTsInputs
              values={values.tokens}
              onValuesChange={onTokenInputsChange}
            />
          </>
        ) : (
          <></>
        )}
      </VStack>
    </>
  )
}
