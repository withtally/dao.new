import {
  Box,
  Button,
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
  Radio,
  RadioGroup,
  HStack,
} from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { providers, utils } from 'ethers'
import React, { useReducer, useState } from 'react'
import { config, Layout } from 'create-nft-dao-shared-frontend'
import {
  DEFAULT_TOKEN_SUPPLY,
  DEFAULT_TOKEN_PRICE,
  DEFAULT_MAX_MINTS,
  DEFAULT_SALE_START_DELAY,
  DEFAULT_TIMELOCK_DELAY,
  DEFAULT_PROP_THRESHOLD,
  DEFAULT_VOTING_DELAY,
  DEFAULT_VOTING_PERIOD,
  DEFAULT_QUORUM_NUMERATOR,
  DEFAULT_CREATOR_PERCENTAGE,
} from '../lib/contractUtils'
import { Table, Thead, Tbody, Tr, Td, Th } from '@chakra-ui/react'
import { MintingFilterForm } from '../components/MintingFilterForm'
import { ConnectToTally } from '../components/ConnectToTally'
import { CHAIN_ID } from '../config'
import { RoyaltiesForm, RoyaltiesParams } from 'create-nft-dao-shared-frontend'
import { MintingFilterParmas, StateType } from '../lib/wizardTypes'
import { wizardReducer } from '../lib/wizardReducerEventHandlers'
import { clone } from '../lib/deployer'

/**
 * Constants & Helpers
 */
const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8545'
)

/**
 * Component
 */

const initialState: StateType = {
  isLoading: false,
  tokenConfig: {
    name: '',
    symbol: '',
    baseURI: '',
    contractInfoURI: '',
  },
  minterConfig: {
    implementationIndex: 0,
    maxTokens: DEFAULT_TOKEN_SUPPLY,
    tokenPrice: DEFAULT_TOKEN_PRICE,
    maxMintsPerTx: DEFAULT_MAX_MINTS,
    creatorPercentage: DEFAULT_CREATOR_PERCENTAGE,
    startingBlock: 0,
    extraInitCallData: '',
  },
  governorConfig: {
    name: '',
    proposalThreshold: DEFAULT_PROP_THRESHOLD,
    votingDelay: DEFAULT_VOTING_DELAY,
    votingPeriod: DEFAULT_VOTING_PERIOD,
    quorumNumerator: DEFAULT_QUORUM_NUMERATOR,
    timelockDelay: DEFAULT_TIMELOCK_DELAY,
  },
  mintingFilterConfig: {
    useMintingFilter: false,
    tokens: [],
  },
  royaltiesConfig: {
    royaltiesBPs: 0,
    isRoyaltiesRecipientOverrideEnabled: false,
    royaltiesRecipientOverride: '',
  },
  clones: null,
}

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(wizardReducer, initialState)
  const { account, chainId, library } = useEthers()
  const [clonesBlockNumber, setClonesBlockNumber] = useState(0)

  const isLocalChain =
    chainId === ChainId.Localhost || chainId === ChainId.Hardhat

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
      const cloneResult = await clone(account, library, state)

      setClonesBlockNumber(cloneResult.clonesBlockNumber)
      dispatch({
        type: 'SET_CLONES',
        clones: cloneResult.clones,
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

  function onTokenContractInfoURIChange(e) {
    dispatch({
      type: 'SET_TOKEN_CONFIG',
      tokenConfig: {
        ...state.tokenConfig,
        contractInfoURI: e.target.value,
      },
    })
  }

  function onRoyaltiesConfigChange(newValues: RoyaltiesParams) {
    dispatch({
      type: 'SET_ROYALTIES_CONFIG',
      royaltiesConfig: newValues,
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

  function onMinterTypeChange(e) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: {
        ...state.minterConfig,
        implementationIndex: e,
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

  function onMintingFilterConfigChange(newValues: MintingFilterParmas) {
    dispatch({
      type: 'SET_MINTING_FILTER_CONFIG',
      mintingFilterConfig: newValues,
    })
  }

  const layoutProps = {
    title: 'Create NFT DAO: Wizard',
  }
  const navbarLinks = [
    {
      href: '/',
      label: 'Home',
    },
  ]

  return (
    <Layout customMeta={layoutProps} navbarLinks={navbarLinks}>
      <Heading as="h1" mb="8" px={4}>
        Create NFT DAO 🧙‍♀️
      </Heading>
      <Box maxWidth="container.sm" px={4}>
        <form onSubmit={deployClones}>
          <Heading as="h2" mb={6} mt={6}>
            1. Token
          </Heading>
          <VStack spacing={6}>
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
            <FormControl id="token-baseuri">
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
                <br />
                <br />
                If you don't yet have art on IPFS, you can leave this empty and
                your NFTs will have a placeholder image.
              </FormHelperText>
            </FormControl>
            <FormControl id="token-contractinfouri">
              <FormLabel>Contract Info URI (optional)</FormLabel>
              <Input
                type="text"
                value={state.tokenConfig.contractInfoURI}
                onChange={onTokenContractInfoURIChange}
              />
              <FormHelperText>
                A URL to a JSON file describing storefront-level metadata for
                your token. See more details on{' '}
                <Link
                  href="https://docs.opensea.io/docs/contract-level-metadata"
                  isExternal
                >
                  https://docs.opensea.io/docs/contract-level-metadata
                </Link>
              </FormHelperText>
            </FormControl>
            <RoyaltiesForm
              values={state.royaltiesConfig}
              onValuesChange={onRoyaltiesConfigChange}
            />
          </VStack>
          <Heading as="h2" mb={6} mt={6}>
            2. Minter
          </Heading>
          <VStack spacing={6}>
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
            <FormControl id="minter-type" isRequired>
              <FormLabel>Minting strategy</FormLabel>
              <RadioGroup
                defaultValue="0"
                value={state.minterConfig.implementationIndex.toString()}
                onChange={onMinterTypeChange}
              >
                <HStack spacing={8}>
                  <Radio value="0">In sequence</Radio>
                  <Radio value="1">By token ID</Radio>
                </HStack>
              </RadioGroup>
              <FormHelperText>
                In sequence means a buyer's only input is how many tokens to
                mint. By token ID, means buyers will mint one-at-a-time, and get
                to choose a specific token ID to mint.
              </FormHelperText>
            </FormControl>
            {state.minterConfig.implementationIndex == 0 ? (
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
                  This is meant to add some friction against those who would
                  want to mint many tokens at once. This friction is helpful in
                  ensuring a more diverse set of token owners.
                </FormHelperText>
              </FormControl>
            ) : (
              <></>
            )}
          </VStack>
          <Heading as="h3" size="lg" mb={6} mt={6}>
            2.1 Buyer Filtering
          </Heading>
          <MintingFilterForm
            values={state.mintingFilterConfig}
            onValuesChange={onMintingFilterConfigChange}
          />
          <Heading as="h2" mb={6} mt={6}>
            3. Governor
          </Heading>
          <VStack spacing={6}>
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
              type="submit"
              mt={8}
              size="lg"
              colorScheme="teal"
              isLoading={state.isLoading}
              isDisabled={!library}
            >
              Deploy Clones
            </Button>
          </Box>
        </form>
      </Box>
      {state.clones !== null ? (
        <>
          <Box maxWidth="container.sm" p={4} ms={4} mt={8} bg="gray.100">
            <Heading as="h2" size="lg" mb={4}>
              Your NFT DAO contracts:
            </Heading>
            <Text color="gray.600" fontSize="sm">
              Save these addresses so you can easily find contracts later. You
              can always find them again on Etherscan, in the transaction you
              just sent.
            </Text>
            <Table variant="unstyled" mt={8}>
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
            <Heading as="h3" size="md" mb={4}>
              Manage your DAO on Tally
            </Heading>
            <ConnectToTally
              orgName={state.governorConfig.name}
              tokenAddress={state.clones.token}
              chainId={CHAIN_ID}
              startBlock={clonesBlockNumber}
              governanceAddress={state.clones.governor}
            />
          </Box>
        </>
      ) : (
        <></>
      )}
      <Box maxWidth="container.sm" mt={16} ms={4}>
        <Text mb="4">This button only works on a Local Chain.</Text>
        <Button onClick={sendFunds} isDisabled={!isLocalChain}>
          Send Funds From Local Hardhat Chain
        </Button>
      </Box>
    </Layout>
  )
}

export default HomeIndex
