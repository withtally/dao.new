import { VStack, HStack } from '@chakra-ui/layout'
import { Button, Text } from '@chakra-ui/react'
import { showEther } from '../../lib/utils'
import {
  useMinterETHBalance,
  usePayeeGetter,
  useSharesGetter,
  useTotalShares,
  useFixedPriceSupplyMinterFunction,
} from '../../lib/contractWrappers/minter'

export const PaymentSplitterAdminForm = () => {
  const ethBalance = useMinterETHBalance()

  const creatorPayeeAddress = usePayeeGetter(0)
  const daoPayeeAddress = usePayeeGetter(1)

  const creatorShares = useSharesGetter(creatorPayeeAddress)
  const daoShares = useSharesGetter(daoPayeeAddress)
  const totalShares = useTotalShares()

  const { send: releaseFunds, state: releaseFundsState } =
    useFixedPriceSupplyMinterFunction('release')

  const releaseCreatorFunds = () => {
    releaseFunds(creatorPayeeAddress)
  }

  const releaseDAOFunds = () => {
    releaseFunds(daoPayeeAddress)
  }

  return (
    <VStack spacing={4} alignItems="flex-start">
      <Text>Current minter balance: {showEther(ethBalance)}</Text>
      <HStack>
        <Text>Creator shares: {`${(creatorShares / totalShares) * 100}%`}</Text>
        <Button
          onClick={releaseCreatorFunds}
          isLoading={releaseFundsState.status == 'Mining'}
        >
          Release funds to creator
        </Button>
      </HStack>
      <HStack>
        <Text>DAO shares: {`${(daoShares / totalShares) * 100}%`}</Text>
        <Button
          onClick={releaseDAOFunds}
          isLoading={releaseFundsState.status == 'Mining'}
        >
          Release funds to DAO
        </Button>
      </HStack>
    </VStack>
  )
}