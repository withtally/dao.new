import { Box } from '@chakra-ui/react'

export const FormSection = ({ children }): JSX.Element => {
  return (
    <Box
      borderRadius="3px"
      boxShadow="0px 15px 30px rgba(42, 33, 163, 0.03)"
      p="40px"
      background="white"
    >
      {children}
    </Box>
  )
}
