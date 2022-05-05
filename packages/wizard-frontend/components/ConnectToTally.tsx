import { ApolloClient, gql, InMemoryCache } from '@apollo/client'
import { Box, Button, Link, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { chainIdToTallyApiURIConfig, tallyWebBaseURI } from '../config'

interface TallyCreateGovParams {
  name: string
  description: string
  website: string
  icon: string
  color: string
  tokenAddress: string
  governanceAddress: string
  chainIdCAIP: string
  startBlock: number
}

export const ConnectToTally = ({
  orgName,
  tokenAddress,
  governanceAddress,
  chainId,
  startBlock,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [isCreated, setIsCreated] = useState(false)
  const [tallyUrl, setTallyUrl] = useState('')

  const chainIdCAIP = `eip155:${chainId}`

  const client = new ApolloClient({
    uri: chainIdToTallyApiURIConfig[chainId],
    cache: new InMemoryCache(),
  })

  const createGovOnTally = async (params: TallyCreateGovParams) => {
    console.log("Params: ", params)

    const createOrgResponse = await client.mutate({
      mutation: gql`
        mutation {
          createOrganization (
            name: "${params.name}"
            description: "${params.description}"
            website: "${params.website}"
            icon: "${params.icon}"
            color: "${params.color}"
          ) {
            name
            id
          }
        }`,
    })
    const orgId = createOrgResponse['data']['createOrganization']['id']
    const tokenId = `${chainIdCAIP}/erc721:${params.tokenAddress}`
    await client.mutate({
      mutation: gql`
        mutation {
          createToken (
              id: "${tokenId}"
              start: "${params.startBlock}"
            )
        }`,
    })
    await client.mutate({
      mutation: gql`
        mutation {
          createGovernance (
            address: "${params.governanceAddress}"
            chainId: "${chainIdCAIP}"
            type: OPENZEPPELINGOVERNOR
            start: "${startBlock}"
            organization: ${orgId}
            tokenId: "${tokenId}"
          )
        }
      `,
    })
  }

  const getTallyUrl = (chainIdCAIP: string, governanceAddress: string) => {
    return `${tallyWebBaseURI}${chainIdCAIP}:${governanceAddress}`
  }

  const onClick = async () => {
    setIsLoading(true)
    try {
      await createGovOnTally({
        name: orgName,
        description: orgName,
        website: `http://${orgName}`,
        icon: 'https://static.withtally.com/e2548ac8-d99c-495a-b3c7-67ae5e4bfbe1_400x400.jpg',
        color: '#A1DDF1',
        tokenAddress: tokenAddress,
        governanceAddress: governanceAddress,
        chainIdCAIP: chainIdCAIP,
        startBlock: startBlock,
      })
      setIsCreated(true)
      setTallyUrl(getTallyUrl(chainIdCAIP, governanceAddress))
    } catch (error) {
      alert(`Sorry, we encountered an error: ${JSON.stringify(error, null, 2)}`)
    }
    setIsLoading(false)
  }

  return (
    <Box>
      {isCreated ? (
        <Box>
          <Text
            fontSize="10px"
            textTransform="uppercase"
            fontWeight="800"
            color="brandGray.400"
          >
            Manage your DAO here:
          </Text>{' '}
          <Link
            href={tallyUrl}
            isExternal
            fontSize="14px"
            color="brand.300"
            overflowWrap="anywhere"
          >
            {tallyUrl}
          </Link>
        </Box>
      ) : (
        <Button colorScheme="teal" onClick={onClick} isLoading={isLoading}>
          Connect to Tally
        </Button>
      )}
    </Box>
  )
}
