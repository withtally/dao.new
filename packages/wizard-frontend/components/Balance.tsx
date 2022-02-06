import { Text } from '@chakra-ui/react'
import { useEtherBalance, useEthers } from '@usedapp/core'
import { utils } from 'ethers'

export function Balance(): JSX.Element {
  const { account } = useEthers()
  const etherBalance = useEtherBalance(account)
  let finalBalance = ''
  if (etherBalance) {
    const roundedBalance = etherBalance.sub(etherBalance.mod(1e14))
    finalBalance = utils.formatEther(roundedBalance)
  }

  return <Text>{finalBalance} ETH</Text>
}
