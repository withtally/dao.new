import {
  Box,
  Button,
  Divider,
  Heading,
  Input,
  Text,
  FormControl,
  FormLabel,
  FormHelperText,
  VStack,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Link,
} from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils, BigNumberish } from 'ethers'
import React, { ChangeEvent, useReducer } from 'react'
import { ERC721DAODeployerAddress as LOCAL_CONTRACT_ADDRESS } from '../artifacts/contracts/contractAddress'
import { Layout } from '../components/layout/Layout'
import {
  DEFAULT_TOKEN_SUPPLY,
  DEFAULT_TOKEN_PRICE,
  DEFAULT_MAX_MINTS,
  DEFAULT_SALE_START_DELAY,
  FOUNDER_SHARES,
  DAO_SHARES,
  DEFAULT_TIMELOCK_DELAY,
  DEFAULT_PROP_THRESHOLD,
  DEFAULT_VOTING_DELAY,
  DEFAULT_VOTING_PERIOD,
  DEFAULT_QUORUM_NUMERATOR,
  DEFAULT_CREATOR_PERCENTAGE,
  getSharesByCreatorPercentage,
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

type TokenParams = {
  name: string
  symbol: string
  baseURI: string
}

type GovernorParams = {
  name: string
  proposalThreshold: number
  votingDelay: number
  votingPeriod: number
  quorumNumerator: number
  timelockDelay: number
}

type MinterParams = {
  maxTokens: number
  tokenPrice: BigNumberish
  maxMintsPerTx: number
  creatorPercentage: number
  startingBlock: BigNumberish
}

type StateType = {
  isLoading: boolean
  tokenConfig: TokenParams
  governorConfig: GovernorParams
  minterConfig: MinterParams
  clones: CloneAddresses
}
type ActionType =
  | {
      type: 'SET_LOADING'
      isLoading: StateType['isLoading']
    }
  | {
      type: 'SET_TOKEN_CONFIG'
      tokenConfig: StateType['tokenConfig']
    }
  | {
      type: 'SET_MINTER_CONFIG'
      minterConfig: StateType['minterConfig']
    }
  | {
      type: 'SET_GOVERNOR_CONFIG'
      governorConfig: StateType['governorConfig']
    }
  | {
      type: 'SET_CLONES'
      clones: StateType['clones']
    }

/**
 * Component
 */

const initialState: StateType = {
  isLoading: false,
  tokenConfig: {
    name: '',
    symbol: '',
    baseURI: '',
  },
  minterConfig: {
    maxTokens: DEFAULT_TOKEN_SUPPLY,
    tokenPrice: DEFAULT_TOKEN_PRICE,
    maxMintsPerTx: DEFAULT_MAX_MINTS,
    creatorPercentage: DEFAULT_CREATOR_PERCENTAGE,
    startingBlock: 0,
  },
  governorConfig: {
    name: '',
    proposalThreshold: DEFAULT_PROP_THRESHOLD,
    votingDelay: DEFAULT_VOTING_DELAY,
    votingPeriod: DEFAULT_VOTING_PERIOD,
    quorumNumerator: DEFAULT_QUORUM_NUMERATOR,
    timelockDelay: DEFAULT_TIMELOCK_DELAY,
  },
  clones: null,
}

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    // Track the greeting from the blockchain
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.isLoading,
      }
    case 'SET_TOKEN_CONFIG':
      return {
        ...state,
        tokenConfig: action.tokenConfig,
      }
    case 'SET_MINTER_CONFIG':
      return {
        ...state,
        minterConfig: action.minterConfig,
      }
    case 'SET_GOVERNOR_CONFIG':
      return {
        ...state,
        governorConfig: action.governorConfig,
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

  async function deployClones(e) {
    e.preventDefault()
    if (!library) {
      // TODO
    }

    dispatch({
      type: 'SET_LOADING',
      isLoading: true,
    })

    try {
      const signer = library.getSigner()
      const deployer = new ERC721DAODeployer__factory(signer).attach(
        CONTRACT_ADDRESS
      )

      const tx = await deployer.clone(
        account,
        state.tokenConfig,
        state.governorConfig,
        {
          ...state.minterConfig,
          tokenPrice: ethers.utils.parseEther(
            state.minterConfig.tokenPrice.toString()
          ),
          ...getSharesByCreatorPercentage(state.minterConfig.creatorPercentage),
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
      // TODO
    }

    dispatch({
      type: 'SET_LOADING',
      isLoading: false,
    })
  }

  function sendFunds(): void {
    sendTransaction({
      to: account,
      value: utils.parseEther('1'),
    })
  }
  const startBlockMinValue = library
    ? library.getSigner().provider.blockNumber
    : 0

  function onTokenNameChange(e) {
    dispatch({
      type: 'SET_TOKEN_CONFIG',
      tokenConfig: {
        ...state.tokenConfig,
        name: e.target.value,
      },
    })
  }

  function onTokenSymbolChange(e) {
    dispatch({
      type: 'SET_TOKEN_CONFIG',
      tokenConfig: {
        ...state.tokenConfig,
        symbol: e.target.value,
      },
    })
  }

  function onTokenBaseURIChange(e) {
    dispatch({
      type: 'SET_TOKEN_CONFIG',
      tokenConfig: {
        ...state.tokenConfig,
        baseURI: e.target.value,
      },
    })
  }

  function onMinterMaxTokensChange(e) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: {
        ...state.minterConfig,
        maxTokens: e,
      },
    })
  }

  function onMinterPriceChange(e) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: {
        ...state.minterConfig,
        tokenPrice: e,
      },
    })
  }

  function onMinterMaxMintsChange(e) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: {
        ...state.minterConfig,
        maxMintsPerTx: e,
      },
    })
  }

  function onMinterCreatorSharesChange(e) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: {
        ...state.minterConfig,
        creatorPercentage: e,
      },
    })
  }

  function onMinterStartBlockChange(e) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: {
        ...state.minterConfig,
        startingBlock: e,
      },
    })
  }

  function onGovernorNameChange(e) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: {
        ...state.governorConfig,
        name: e.target.value,
      },
    })
  }

  function onGovernorProposalThresholdChange(v) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: {
        ...state.governorConfig,
        proposalThreshold: v,
      },
    })
  }

  function onGovernorVotingDelayChange(v) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: {
        ...state.governorConfig,
        votingDelay: v,
      },
    })
  }

  function onGovernorVotingPeriodChange(v) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: {
        ...state.governorConfig,
        votingPeriod: v,
      },
    })
  }

  function onGovernorQuorumNumeratorChange(v) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: {
        ...state.governorConfig,
        quorumNumerator: v,
      },
    })
  }

  function onGovernorTimelockDelayChange(v) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: {
        ...state.governorConfig,
        timelockDelay: v,
      },
    })
  }

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Create NFT DAO Wizard 🧙‍♀️
      </Heading>
      <Box maxWidth="container.sm">
        <form onSubmit={deployClones}>
          <Heading as="h2" mb={6} mt={6}>
            Token
          </Heading>
          <VStack spacing={4}>
            <FormControl id="token-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={state.tokenConfig.name}
                onChange={onTokenNameChange}
              />
              <FormHelperText>
                The same as collection name in OpenSea, e.g. Nouns.
              </FormHelperText>
            </FormControl>
            <FormControl id="token-symbol" isRequired>
              <FormLabel>Symbol</FormLabel>
              <Input
                type="text"
                value={state.tokenConfig.symbol}
                onChange={onTokenSymbolChange}
              />
              <FormHelperText>e.g. LOOT.</FormHelperText>
            </FormControl>
            <FormControl id="token-baseuri" isRequired>
              <FormLabel>Base URI</FormLabel>
              <Input
                type="text"
                value={state.tokenConfig.baseURI}
                onChange={onTokenBaseURIChange}
              />
              <FormHelperText>
                A link to an IPFS folder with all the token descriptors and
                project descriptor. E.g.{' '}
                <Link
                  href="ipfs://bafybeif4s7oom2ch6iv42yn7la4b3dnkud2dgujmnhuxuswekx4l6yz4me/"
                  isExternal
                >
                  ipfs://bafybeif4s7oom2ch6iv42yn7la4b3dnkud2dgujmnhuxuswekx4l6yz4me/
                </Link>
              </FormHelperText>
            </FormControl>
          </VStack>
          <Heading as="h2" mb={6} mt={6}>
            Minter
          </Heading>
          <VStack spacing={4}>
            <FormControl id="minter-totalsupply" isRequired>
              <FormLabel>Total supply</FormLabel>
              <NumberInput
                defaultValue={10000}
                step={100}
                min={1}
                value={state.minterConfig.maxTokens}
                onChange={onMinterMaxTokensChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The maximum number of tokens that can be minted, including
                tokens minted by the creator and the project's users.
              </FormHelperText>
            </FormControl>
            <FormControl id="minter-price" isRequired>
              <FormLabel>Price (ETH)</FormLabel>
              <NumberInput
                defaultValue={0.01}
                step={0.01}
                min={0.000001}
                value={state.minterConfig.tokenPrice.toString()}
                onChange={onMinterPriceChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The price your users will need to pay in ETH in order to mint a
                token.
              </FormHelperText>
            </FormControl>
            <FormControl id="minter-maxmints" isRequired>
              <FormLabel>Max mints per transaction</FormLabel>
              <NumberInput
                defaultValue={10}
                step={1}
                min={1}
                value={state.minterConfig.maxMintsPerTx}
                onChange={onMinterMaxMintsChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                This is meant to add some friction against those who would want
                to mint many tokens at once. This friction is helpful in
                ensuring a more diverse set of token owners.
              </FormHelperText>
            </FormControl>
            <FormControl id="minter-creatorshares" isRequired>
              <FormLabel>Creator shares %</FormLabel>
              <NumberInput
                defaultValue={5}
                step={1}
                min={0}
                max={100}
                value={state.minterConfig.creatorPercentage}
                onChange={onMinterCreatorSharesChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                How to split the ETH revenue pie? Enter how much you'd like to
                receive in percents, and the rest will go to the DAO treasury.
              </FormHelperText>
            </FormControl>
            <FormControl id="minter-startblock" isRequired>
              <FormLabel>Sale start block</FormLabel>
              <NumberInput
                defaultValue={startBlockMinValue + DEFAULT_SALE_START_DELAY}
                step={300} // a bit more than an hour
                min={startBlockMinValue}
                value={state.minterConfig.startingBlock.toString()}
                onChange={onMinterStartBlockChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                Each block is roughly 13 seconds. 24 hours is roughly 6646
                blocks. Remember the final number should be the latest block
                plus the delay you want to add.
              </FormHelperText>
            </FormControl>
          </VStack>
          <Heading as="h2" mb={6} mt={6}>
            Governor
          </Heading>
          <VStack spacing={4}>
            <FormControl id="governor-name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                type="text"
                value={state.governorConfig.name}
                onChange={onGovernorNameChange}
              />
              <FormHelperText>e.g. Awesome DAO</FormHelperText>
            </FormControl>
            <FormControl id="governor-propthreshold" isRequired>
              <FormLabel>Proposal threshold</FormLabel>
              <NumberInput
                defaultValue={1}
                step={1}
                min={0}
                value={state.governorConfig.proposalThreshold}
                onChange={onGovernorProposalThresholdChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                How many tokens much someone own before they can submit a
                proposal to the DAO?
              </FormHelperText>
            </FormControl>
            <FormControl id="governor-votingdelay" isRequired>
              <FormLabel>Voting delay (blocks)</FormLabel>
              <NumberInput
                defaultValue={13300}
                step={300}
                min={0}
                value={state.governorConfig.votingDelay}
                onChange={onGovernorVotingDelayChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The time between proposal submission and when voting starts.
                This is important time for DAO members to make sense of
                proposals and form an opinion.
              </FormHelperText>
            </FormControl>
            <FormControl id="governor-votingperiod" isRequired>
              <FormLabel>Voting period (blocks)</FormLabel>
              <NumberInput
                defaultValue={46500}
                step={6650}
                min={0}
                value={state.governorConfig.votingPeriod}
                onChange={onGovernorVotingPeriodChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The time between proposal when voting starts and ends. This is
                important time for DAO members to make sense of proposals and
                form an opinion.
              </FormHelperText>
            </FormControl>
            <FormControl id="governor-quorumnumerator" isRequired>
              <FormLabel>Quorum numerator (%)</FormLabel>
              <NumberInput
                defaultValue={1}
                step={1}
                min={0}
                max={100}
                value={state.governorConfig.quorumNumerator}
                onChange={onGovernorQuorumNumeratorChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The minimal percentage of DAO votes that is required for a
                proposal to succeed.
              </FormHelperText>
            </FormControl>
            <FormControl id="governor-timelockdelay" isRequired>
              <FormLabel>Timelock delay (seconds)</FormLabel>
              <NumberInput
                defaultValue={172800}
                step={3600}
                min={0}
                value={state.governorConfig.timelockDelay}
                onChange={onGovernorTimelockDelayChange}
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
              <FormHelperText>
                The delay between a proposal's success and when its transactions
                can be executed.
              </FormHelperText>
            </FormControl>
          </VStack>
          <Box>
            <Button
              name="submit"
              mt={8}
              isLoading={state.isLoading}
              onClick={deployClones}
              isDisabled={!library}
            >
              Deploy Clones
            </Button>
          </Box>
        </form>
      </Box>
      {state.clones !== null ? (
        <Box maxWidth="container.sm" p="8" mt={8} bg="gray.100">
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
        </Box>
      ) : (
        <></>
      )}
      <Box maxWidth="container.sm" mt={16}>
        <Text mb="4">This button only works on a Local Chain.</Text>
        <Button onClick={sendFunds} isDisabled={!isLocalChain}>
          Send Funds From Local Hardhat Chain
        </Button>
      </Box>
    </Layout>
  )
}

export default HomeIndex
