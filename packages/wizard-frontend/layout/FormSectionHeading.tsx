import { Heading, Text } from '@chakra-ui/react'

export const FormSectionHeader = ({ number, text }): JSX.Element => {
  return (
    <Heading as="h2" display="flex" fontSize="36px" mb="26px" fontWeight={600}>
      <Text color="brand.300">{number}.&nbsp;</Text>
      <Text color="darkText.100">{text}</Text>
    </Heading>
  )
}
