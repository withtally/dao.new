import { ethers } from 'ethers'

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
