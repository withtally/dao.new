import { Box, VStack } from '@chakra-ui/react'
import { MintingFilterToggle } from '@create-nft-dao/shared'
import { MintingFilterNFTsInputs } from '@create-nft-dao/shared'
import { FormSectionContent } from '../layout/FormSectionContent'
import { FormSectionHeader } from '../layout/FormSectionHeading'

export const MintingFilterInputs = ({ values, onValuesChange, ...props }) => {
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
    <Box {...props}>
      <FormSectionHeader number="3.1" text="Buyer Filtering" />
      <FormSectionContent>
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
      </FormSectionContent>
    </Box>
  )
}
