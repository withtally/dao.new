import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { VStack } from "@chakra-ui/layout"
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/number-input"
import { Button } from "@chakra-ui/react"

export const Minter = () => {
  return (
    <>
    <VStack>
      <FormControl>
        <FormLabel>Tokens to mint</FormLabel>
        <NumberInput
          defaultValue={0}
          step={1}
          min={0}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <div>Price: TODO ETH</div>
      <Button>MINT</Button>
    </VStack>
    </>
  )
}