import {
  CloneFactory,
  ERC721DAOToken__factory,
  FixedPriceMinter__factory,
  ERC721Timelock__factory,
  ERC721Governor__factory,
} from '../types/typechain'
import { ethers, BigNumberish } from 'ethers'

const keccak256 = ethers.utils.keccak256
const toUtf8Bytes = ethers.utils.toUtf8Bytes
export const hashString = (str: string) => {
  return keccak256(toUtf8Bytes(str))
}

export const ADMIN_ROLE = hashString('ADMIN_ROLE')
export const DEFAULT_TOKEN_SUPPLY = 10000
export const DEFAULT_TOKEN_PRICE = 100000
export const DEFAULT_MAX_MINTS = 10
export const DEFAULT_SALE_START_DELAY = 46523 // 604800 seconds in a week divided by 13 seconds per block
export const TOTAL_SHARES = 10000
export const FOUNDER_REWARD = 0.05
export const FOUNDER_SHARES = FOUNDER_REWARD * TOTAL_SHARES
export const DAO_SHARES = TOTAL_SHARES - FOUNDER_SHARES
export const TIMELOCK_DELAY = 172_800 // 2 days
export const PROP_THRESHOLD = 1
export const VOTING_DELAY = 1 // 1 block
export const VOTING_PERIOD = 5_760 // About 24 hours with 15s blocks
export const QUORUM_NUMERATOR = 1 // 1%

export async function cloneContract(
  factory: CloneFactory,
  implIndex: number,
  callData: string
) {
  const tx = await factory.clone(implIndex, callData)
  const receipt = await tx.wait()
  const event = receipt.events?.find((e) => e.event == 'NewClone')

  console.log('Instance: ', event?.args?.instance)

  return event?.args?.instance
}

export function tokenInitCallData(
  name: string,
  symbol: string,
  baseURI: string,
  adminAddress: string
): string {
  const tokenInterface = ERC721DAOToken__factory.createInterface()
  return tokenInterface.encodeFunctionData('initialize', [
    name,
    symbol,
    baseURI,
    [ADMIN_ROLE],
    [adminAddress],
  ])
}

export function minterInitCallData(
  tokenAddress: string,
  maxTokenSupply: BigNumberish,
  tokenPrice: BigNumberish,
  maxMintsPerTx: BigNumberish,
  startingBlock: BigNumberish,
  payees: string[],
  shares: BigNumberish[]
): string {
  const iFace = FixedPriceMinter__factory.createInterface()
  return iFace.encodeFunctionData('initialize', [
    tokenAddress,
    maxTokenSupply,
    tokenPrice,
    maxMintsPerTx,
    startingBlock,
    payees,
    shares,
  ])
}

export function timelockInitCallData(
  minDelay: BigNumberish,
  deployerAddress: string,
  proposers: string[],
  executors: string[]
): string {
  const iFace = ERC721Timelock__factory.createInterface()
  return iFace.encodeFunctionData('initialize', [
    minDelay,
    deployerAddress,
    proposers,
    executors,
  ])
}

export function govInitCallData(
  govName: string,
  tokenAddress: string,
  timelockAddress: string,
  proposalThreshold: number,
  votingDelay: number,
  votingPeriod: number,
  quorumNumerator: number
): string {
  const iFace = ERC721Governor__factory.createInterface()
  return iFace.encodeFunctionData('initialize', [
    govName,
    tokenAddress,
    timelockAddress,
    proposalThreshold,
    votingDelay,
    votingPeriod,
    quorumNumerator,
  ])
}
