import { Heading, Text } from '@chakra-ui/react'

export const ModalHeading = ({ number, text }) => (
  <Heading as="h3" size="md" display="flex">
    <Text color="brand.300">{number}&nbsp;</Text>
    <Text color="darkText.100">{text}</Text>
  </Heading>
)
