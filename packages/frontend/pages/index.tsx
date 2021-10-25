import { Box, Button, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils, BigNumberish } from 'ethers'
import React, { useReducer } from 'react'
import { CloneFactoryAddress as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import { Layout } from '../components/layout/Layout'
import {
  cloneContract,
  minterInitCallData,
  tokenInitCallData,
  DEFAULT_TOKEN_SUPPLY,
  DEFAULT_TOKEN_PRICE,
  DEFAULT_MAX_MINTS,
  DEFAULT_SALE_START_DELAY,
  FOUNDER_SHARES,
  DAO_SHARES,
  timelockInitCallData,
  TIMELOCK_DELAY,
  govInitCallData,
  PROP_THRESHOLD,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_NUMERATOR,
} from '../lib/contractUtils'
import {
  CloneFactory__factory,
  ERC721DAOToken__factory,
} from '../types/typechain'
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
} from '@chakra-ui/react'

/**
 * Constants & Helpers
 */
const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

const ROPSTEN_CONTRACT_ADDRESS = '0x6b61a52b1EA15f4b8dB186126e980208E1E18864'

/**
 * Prop Types
 */
type StateType = {
  greeting: string
  inputValue: string
  isLoading: boolean
  tokenCloneAddress: string
  timelockCloneAddress: string
  govCloneAddress: string
  minterCloneAddress: string
}
type ActionType =
  | {
      type: 'SET_GREETING'
      greeting: StateType['greeting']
    }
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: StateType['inputValue']
    }
  | {
      type: 'SET_LOADING'
      isLoading: StateType['isLoading']
    }
  | {
      type: 'SET_TOKEN_CLONE_ADDRESS'
      tokenCloneAddress: StateType['tokenCloneAddress']
    }
  | {
      type: 'SET_TIMELOCK_CLONE_ADDRESS'
      timelockCloneAddress: StateType['timelockCloneAddress']
    }
  | {
      type: 'SET_GOV_CLONE_ADDRESS'
      govCloneAddress: StateType['govCloneAddress']
    }
  | {
      type: 'SET_MINTER_CLONE_ADDRESS'
      minterCloneAddress: StateType['minterCloneAddress']
    }

/**
 * Component
 */
const initialState: StateType = {
  greeting: '',
  inputValue: '',
  isLoading: false,
  tokenCloneAddress: '',
  timelockCloneAddress: '',
  govCloneAddress: '',
  minterCloneAddress: '',
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_GREETING':
      return {
        ...state,
        greeting: action.greeting,
      }
    case 'SET_INPUT_VALUE':
      return {
        ...state,
        inputValue: action.inputValue,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case 'SET_TOKEN_CLONE_ADDRESS':
      return {
        ...state,
        tokenCloneAddress: action.tokenCloneAddress,
      }
    case 'SET_TIMELOCK_CLONE_ADDRESS':
      return {
        ...state,
        timelockCloneAddress: action.timelockCloneAddress,
      }
    case 'SET_GOV_CLONE_ADDRESS':
      return {
        ...state,
        govCloneAddress: action.govCloneAddress,
      }
    case 'SET_MINTER_CLONE_ADDRESS':
      return {
        ...state,
        minterCloneAddress: action.minterCloneAddress,
      }
    default:
      throw new Error()
  }
}

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, chainId, library } = useEthers()

  const isLocalChain =
    chainId === ChainId.Localhost || chainId === ChainId.Hardhat

  const CONTRACT_ADDRESS =
    chainId === ChainId.Ropsten
      ? ROPSTEN_CONTRACT_ADDRESS
      : LOCAL_CONTRACT_ADDRESS

  // Use the localProvider as the signer to send ETH to our wallet
  const { sendTransaction } = useSendTransaction({
    signer: localProvider.getSigner(),
  })

  async function deployClones() {
    if (library) {
      dispatch({
        type: 'SET_LOADING',
        isLoading: true,
      })

      try {
        const signer = library.getSigner()
        const cloneFactory = new CloneFactory__factory(signer).attach(
          CONTRACT_ADDRESS
        )

        const tokenCloneAddress = await cloneContract(
          cloneFactory,
          0,
          tokenInitCallData('NewToken', 'NT', 'baseURI', account)
        )
        dispatch({
          type: 'SET_TOKEN_CLONE_ADDRESS',
          tokenCloneAddress: tokenCloneAddress,
        })

        const proposers: string[] = []
        const executors: string[] = []
        const timelockCloneAddress = await cloneContract(
          cloneFactory,
          1,
          timelockInitCallData(TIMELOCK_DELAY, account, proposers, executors)
        )
        dispatch({
          type: 'SET_TIMELOCK_CLONE_ADDRESS',
          timelockCloneAddress: timelockCloneAddress,
        })

        const govCloneAddress = await cloneContract(
          cloneFactory,
          2,
          govInitCallData(
            'GovName',
            tokenCloneAddress,
            timelockCloneAddress,
            PROP_THRESHOLD,
            VOTING_DELAY,
            VOTING_PERIOD,
            QUORUM_NUMERATOR
          )
        )
        dispatch({
          type: 'SET_GOV_CLONE_ADDRESS',
          govCloneAddress: govCloneAddress,
        })

        const payees: string[] = [account, timelockCloneAddress]
        const shares: BigNumberish[] = [FOUNDER_SHARES, DAO_SHARES]
        const startingBlock =
          signer.provider.blockNumber + DEFAULT_SALE_START_DELAY

        const minterCloneAddress = await cloneContract(
          cloneFactory,
          3,
          minterInitCallData(
            tokenCloneAddress,
            DEFAULT_TOKEN_SUPPLY,
            DEFAULT_TOKEN_PRICE,
            DEFAULT_MAX_MINTS,
            startingBlock,
            payees,
            shares
          )
        )
        dispatch({
          type: 'SET_MINTER_CLONE_ADDRESS',
          minterCloneAddress: minterCloneAddress,
        })
      } catch (e) {
        console.log(e)
      }

      dispatch({
        type: 'SET_LOADING',
        isLoading: false,
      })
    }
  }

  function sendFunds(): void {
    sendTransaction({
      to: account,
      value: utils.parseEther('1'),
    })
  }

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Create NFT DAO Wizard 🧙‍♀️
      </Heading>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        <Box>
          <Button
            mt="2"
            colorScheme="teal"
            isLoading={state.isLoading}
            onClick={deployClones}
          >
            Deploy Clones
          </Button>
        </Box>
        {state.tokenCloneAddress !== '' ? (
          <>
            <Divider my="8" borderColor="gray.400" />
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Contract</Th>
                  <Th>Address</Th>
                </Tr>
              </Thead>
              <Tbody>
                <Tr>
                  <Td>NFT</Td>
                  <Td>{state.tokenCloneAddress}</Td>
                </Tr>
                <Tr>
                  <Td>Minter</Td>
                  <Td>{state.minterCloneAddress}</Td>
                </Tr>
                <Tr>
                  <Td>Governor</Td>
                  <Td>{state.govCloneAddress}</Td>
                </Tr>
                <Tr>
                  <Td>Timelock</Td>
                  <Td>{state.timelockCloneAddress}</Td>
                </Tr>
              </Tbody>
            </Table>
          </>
        ) : (
          <></>
        )}

        <Divider my="8" borderColor="gray.400" />
        <Text mb="4">This button only works on a Local Chain.</Text>
        <Button
          colorScheme="teal"
          onClick={sendFunds}
          isDisabled={!isLocalChain}
        >
          Send Funds From Local Hardhat Chain
        </Button>
      </Box>
    </Layout>
  )
}

export default HomeIndex
