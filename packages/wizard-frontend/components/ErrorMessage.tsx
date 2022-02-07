import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@chakra-ui/react'

export const ErrorMessage = ({ title, description, ...props }) => (
  <Alert status="error" {...props}>
    <AlertIcon />
    <AlertTitle mr={2}>{title}</AlertTitle>
    <AlertDescription>{description}</AlertDescription>
  </Alert>
)
