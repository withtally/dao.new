import { Text } from '@chakra-ui/react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { utils } from 'ethers'

export function Balance(): JSX.Element {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  const finalBalance = etherBalance ? utils.formatEther(etherBalance) : ''

  return <Text>{finalBalance} ETH</Text>
}
