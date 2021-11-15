import { ChainId } from '@usedapp/core'
import allSecrets from '../hardhat/secrets.json'

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

export const secrets = { alchemyApiKey: allSecrets.alchemyApiKey }
