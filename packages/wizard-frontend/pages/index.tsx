import { Box, Button, Heading, Text } from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { providers, utils } from 'ethers'
import React, { useReducer, useState } from 'react'
import { Layout } from 'create-nft-dao-shared-frontend'
import {
  DEFAULT_TOKEN_SUPPLY,
  DEFAULT_TOKEN_PRICE,
  DEFAULT_MAX_MINTS,
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
import { RoyaltiesParams } from 'create-nft-dao-shared-frontend'
import { MintingFilterParmas, StateType } from '../lib/wizardTypes'
import { wizardReducer } from '../lib/wizardReducerEventHandlers'
import { clone } from '../lib/deployer'
import { TokenInputs } from '../components/TokenInputs'
import { MinterInputs } from '../components/MinterInputs'
import { GovernorInputs } from '../components/GovernorInputs'

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

  function onTokenConfigChange(newValues) {
    dispatch({
      type: 'SET_TOKEN_CONFIG',
      tokenConfig: newValues,
    })
  }

  function onRoyaltiesConfigChange(newValues: RoyaltiesParams) {
    dispatch({
      type: 'SET_ROYALTIES_CONFIG',
      royaltiesConfig: newValues,
    })
  }

  function onMinterConfigChange(newValues) {
    dispatch({
      type: 'SET_MINTER_CONFIG',
      minterConfig: newValues,
    })
  }

  function onGovernorConfigChange(newValues) {
    dispatch({
      type: 'SET_GOVERNOR_CONFIG',
      governorConfig: newValues,
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
          <TokenInputs
            tokenConfig={state.tokenConfig}
            onTokenConfigChange={onTokenConfigChange}
            royaltiesConfig={state.royaltiesConfig}
            onRoyaltiesConfigChange={onRoyaltiesConfigChange}
          />
          <MinterInputs
            minterConfig={state.minterConfig}
            onMinterConfigChange={onMinterConfigChange}
          />

          <MintingFilterForm
            values={state.mintingFilterConfig}
            onValuesChange={onMintingFilterConfigChange}
          />
          <GovernorInputs
            governorConfig={state.governorConfig}
            onGovernorConfigChange={onGovernorConfigChange}
          />
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
