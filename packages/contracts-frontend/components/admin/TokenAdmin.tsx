import { HStack, VStack } from '@chakra-ui/layout'
import { Heading, Text, Button, Input } from '@chakra-ui/react'
import config from '../../config'
import { OpenSeaLink } from '../OpenSeaLink'
import { RaribleLink } from '../RaribleLink'
import {
  useNFTName,
  useTotalSupply,
  useBaseURIEnabled,
  useBaseURI,
  useSetBaseURIEnabled,
  useSetBaseURI,
  useContractInfoURI,
  useSetContractInfoURI,
} from '../../lib/contractWrappers/token'
import { useState } from 'react'

export const TokenAdmin = () => {
  const totalSupply = useTotalSupply()
  const tokenName = useNFTName()
  const isBaseURIEnabled = useBaseURIEnabled()
  const baseURI = useBaseURI()
  const contractInfoURI = useContractInfoURI()

  const [baseURIFormValue, setBaseURIFormValue] = useState('')
  const [contractInfoURIFormValue, setContractInfoURIFormValue] = useState('')

  const { send: setBaseURIEnabled, state: setBaseURIEnabledState } =
    useSetBaseURIEnabled()
  const { send: setBaseURI, state: setBaseURIState } = useSetBaseURI()
  const { send: setContractInfoURI, state: setContractInfoURIState } =
    useSetContractInfoURI()

  const onBaseURIToggleClick = () => {
    if (isBaseURIEnabled === undefined) {
      return
    }
    setBaseURIEnabled(!isBaseURIEnabled)
  }

  const onBaseURISubmit = (e) => {
    e.preventDefault()
    setBaseURI(baseURIFormValue)
  }

  const onContractInfoURISubmit = (e) => {
    e.preventDefault()
    setContractInfoURI(contractInfoURIFormValue)
  }

  return (
    <VStack spacing={16} alignItems="flex-start">
      <VStack spacing={4} alignItems="flex-start">
        <Heading as="h3" size="lg">
          Name: {tokenName}
        </Heading>
        <Text>Contract address: {config.tokenAddress}</Text>
        <HStack spacing={4}>
          <OpenSeaLink linkText="View on OpenSea" />
          <RaribleLink linkText="View on Rarible" />
        </HStack>
        <Text>Total supply: {totalSupply && totalSupply.toString()}</Text>
      </VStack>
      <VStack spacing={4} alignItems="flex-start">
        <Heading as="h3" size="lg">
          Assets URI
        </Heading>
        <VStack alignItems="flex-start">
          <Heading as="h4" size="md">
            Base URI Enabled
          </Heading>
          <HStack spacing={4}>
            <Text>
              Current value: {isBaseURIEnabled ? 'Enabled' : 'Disabled'}
            </Text>
            <Button
              onClick={onBaseURIToggleClick}
              isLoading={setBaseURIEnabledState.status === 'Mining'}
            >
              {isBaseURIEnabled ? 'Disable' : 'Enable'}
            </Button>
          </HStack>
          <Text fontSize="sm" color="gray.400">
            When Base URI is disabled, your NFTs use an auto-generated
            placeholder image that contains the name of your NFT and the ID of
            the asset.
          </Text>
        </VStack>
        <VStack alignItems="flex-start">
          <Heading as="h4" size="md">
            Base URI
          </Heading>
          <Text>Current value: {baseURI}</Text>
          <form onSubmit={onBaseURISubmit}>
            <HStack minW="md">
              <Input
                type="text"
                value={baseURIFormValue}
                onChange={(e) => {
                  setBaseURIFormValue(e.target.value)
                }}
              />
              <Button
                minW="min"
                type="submit"
                isDisabled={!baseURIFormValue}
                isLoading={setBaseURIState.status === 'Mining'}
              >
                Update Base URI
              </Button>
            </HStack>
          </form>
        </VStack>
        <VStack alignItems="flex-start">
          <Heading as="h4" size="md">
            Contract Info URI
          </Heading>
          <Text>Current value: {contractInfoURI}</Text>
          <form onSubmit={onContractInfoURISubmit}>
            <HStack minW="md">
              <Input
                type="text"
                value={contractInfoURIFormValue}
                onChange={(e) => {
                  setContractInfoURIFormValue(e.target.value)
                }}
              />
              <Button
                minW="min"
                type="submit"
                isDisabled={!contractInfoURIFormValue}
                isLoading={setContractInfoURIState.status === 'Mining'}
              >
                Update Contract Info URI
              </Button>
            </HStack>
          </form>
        </VStack>
      </VStack>
    </VStack>
  )
}
