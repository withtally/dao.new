import { config } from '@create-nft-dao/shared'
import { useEtherBalance } from '@usedapp/core'

export const useTimelockETHBalance = () => {
  return useEtherBalance(config.timelockAddress)
}
