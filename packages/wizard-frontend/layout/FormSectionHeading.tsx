import { Heading, Text } from '@chakra-ui/react'

export const FormSectionHeader = ({ number, text }): JSX.Element => {
  return (
    <Heading as="h2" display="flex" fontSize="36px" mb="26px">
      <Text color="brand.300">{number}.&nbsp;</Text>
      <Text>{text}</Text>
    </Heading>
  )
}
