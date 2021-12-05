import { VStack, Button, Text, Flex, Spacer, Heading } from '@chakra-ui/react'
import { verifyProxy, checkProxyVerification } from '../lib/etherscan'
import { useState } from 'react'
import { RepeatIcon } from '@chakra-ui/icons'

export const EtherscanVerifyProxy = ({ name, address }) => {
  const [isStartLoading, setIsStartLoading] = useState(false)
  const [verifyGuid, setGovVerifyGuid] = useState('')
  const [verifyStatus, setGovVerifyStatus] = useState('Not verified.')
  const [isCheckLoading, setIsCheckLoading] = useState(false)
  const [isVerificationSuccessful, setIsVerificationSuccessful] =
    useState(false)

  const checkVerification = async () => {
    setIsCheckLoading(true)
    try {
      const checkResponse = await checkProxyVerification(verifyGuid)
      if (checkResponse.success) {
        setGovVerifyStatus('Verification succeeded!')
        setIsVerificationSuccessful(true)
      } else {
        setGovVerifyStatus(checkResponse.message)
      }
    } catch (e) {
      setGovVerifyStatus(`Error: ${e}`)
    } finally {
      setIsCheckLoading(false)
    }
  }

  const startVerification = async () => {
    setIsStartLoading(true)
    try {
      const verifyResult = await verifyProxy(address)
      if (!verifyResult.success) {
        setGovVerifyStatus(`Verification failed: ${verifyResult.messageOrGuid}`)
      } else {
        setGovVerifyGuid(verifyResult.messageOrGuid)
        setGovVerifyStatus(
          'Verification queued. Click refresh until you get a final success/failure status.'
        )
      }
    } catch (e) {
      setGovVerifyStatus(`Error: ${e}`)
    } finally {
      setIsStartLoading(false)
    }
  }

  return (
    <VStack spacing={4} alignItems="flex-start" width="100%">
      <Heading as="h4" size="sm">
        {name}
      </Heading>
      <Button
        colorScheme="teal"
        onClick={startVerification}
        isLoading={isStartLoading}
        isDisabled={isStartLoading}
      >
        Verify {name}
      </Button>
      <Flex width="100%" alignItems="center">
        <Text>Status: {verifyStatus}</Text>
        <Spacer />
        <Button
          leftIcon={<RepeatIcon />}
          colorScheme="teal"
          isLoading={isCheckLoading}
          isDisabled={isCheckLoading || !verifyGuid || isVerificationSuccessful}
          onClick={checkVerification}
        >
          Refresh Status
        </Button>
      </Flex>
    </VStack>
  )
}
