import { Container, ListItem, UnorderedList } from '@chakra-ui/layout'
import { ChainId } from '@usedapp/core'
import React, { useState } from 'react'
import { ConnectToTally } from '../components/ConnectToTally'

const TestTally = () => {
  const [orgName, setOrgName] = useState('ternary test org')
  const [tokenAddress, setTokenAddress] = useState(
    '0x688013AceF13602B3a60358406c530Ac6AE5ca7F'
  )
  const [chainId, setChainId] = useState(ChainId.Rinkeby)
  const [startBlock, setStartBlock] = useState(9651609)
  const [governanceAddress, setGovernanceAddress] = useState(
    '0x16f6cd4023AF7528BbE071Ed9dC0a0EE2AA52F9c'
  )

  return (
    <Container mt={10}>
      <UnorderedList>
        <ListItem>orgName: {orgName}</ListItem>
        <ListItem>tokenAddress: {tokenAddress}</ListItem>
        <ListItem>governanceAddress: {governanceAddress}</ListItem>
        <ListItem>chainId: {chainId}</ListItem>
        <ListItem>startBlock: {startBlock}</ListItem>
      </UnorderedList>
      <ConnectToTally
        orgName={orgName}
        tokenAddress={tokenAddress}
        chainId={chainId}
        startBlock={startBlock}
        governanceAddress={governanceAddress}
      />
    </Container>
  )
}

export default TestTally
