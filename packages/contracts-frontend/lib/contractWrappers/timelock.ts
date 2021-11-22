import { config } from 'create-nft-dao-shared-frontend'
import { useEtherBalance } from '@usedapp/core'

export const useTimelockETHBalance = () => {
  return useEtherBalance(config.timelockAddress)
}
