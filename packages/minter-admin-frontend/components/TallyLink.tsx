import { useEthers } from '@usedapp/core'
import { Link } from '@chakra-ui/react'
import { config } from '../config'

export const TallyLink = ({ linkText }) => {
  const { chainId } = useEthers()

  const tallyLink = `https://withtally.com/governance/eip155:${chainId}:${config.governorAddress}`

  return (
    <Link isExternal href={tallyLink}>
      {linkText}
    </Link>
  )
}
