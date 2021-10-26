import { Box, Button, Divider, Heading, Input, Text } from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useReducer } from 'react'
import { ERC721DAODeployerAddress as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import { Layout } from '../components/layout/Layout'
import {
  DEFAULT_TOKEN_SUPPLY,
  DEFAULT_TOKEN_PRICE,
  DEFAULT_MAX_MINTS,
  DEFAULT_SALE_START_DELAY,
  FOUNDER_SHARES,
  DAO_SHARES,
  TIMELOCK_DELAY,
  PROP_THRESHOLD,
  VOTING_DELAY,
  VOTING_PERIOD,
  QUORUM_NUMERATOR,
} from '../lib/contractUtils'
import { ERC721DAODeployer__factory } from '../types/typechain'
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
type CloneAddresses = {
  token: string
  timelock: string
  governor: string
  minter: string
}

type StateType = {
  inputValue: string
  isLoading: boolean
  clones: CloneAddresses
}
type ActionType =
  | {
      type: 'SET_INPUT_VALUE'
      inputValue: StateType['inputValue']
    }
  | {
      type: 'SET_LOADING'
      isLoading: StateType['isLoading']
    }
  | {
      type: 'SET_CLONES'
      clones: StateType['clones']
    }

/**
 * Component
 */
const initialState: StateType = {
  inputValue: '',
  isLoading: false,
  clones: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
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
    case 'SET_CLONES':
      return {
        ...state,
        clones: action.clones,
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
        const deployer = new ERC721DAODeployer__factory(signer).attach(
          CONTRACT_ADDRESS
        )

        const startingBlock =
          signer.provider.blockNumber + DEFAULT_SALE_START_DELAY

        const tx = await deployer.clone(
          account,
          {
            name: 'MyToken',
            symbol: 'MT',
            baseURI: 'BASE_URI',
          },
          TIMELOCK_DELAY,
          {
            name: 'GovName',
            proposalThreshold: PROP_THRESHOLD,
            votingDelay: VOTING_DELAY,
            votingPeriod: VOTING_PERIOD,
            quorumNumerator: QUORUM_NUMERATOR,
          },
          {
            maxTokens: DEFAULT_TOKEN_SUPPLY,
            tokenPrice: DEFAULT_TOKEN_PRICE,
            maxMintsPerTx: DEFAULT_MAX_MINTS,
            startingBlock: startingBlock,
            creatorShares: FOUNDER_SHARES,
            daoShares: DAO_SHARES,
          }
        )
        const receipt = await tx.wait()
        const event = receipt.events?.find((e) => e.event == 'NewClone')

        dispatch({
          type: 'SET_CLONES',
          clones: {
            token: event?.args?.token,
            timelock: event?.args?.timelock,
            governor: event?.args?.governor,
            minter: event?.args?.minter,
          },
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
        {state.clones !== null ? (
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
                  <Td>{state.clones.token}</Td>
                </Tr>
                <Tr>
                  <Td>Minter</Td>
                  <Td>{state.clones.minter}</Td>
                </Tr>
                <Tr>
                  <Td>Governor</Td>
                  <Td>{state.clones.governor}</Td>
                </Tr>
                <Tr>
                  <Td>Timelock</Td>
                  <Td>{state.clones.timelock}</Td>
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
