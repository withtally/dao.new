import { ChainId } from '@usedapp/core'
import allSecrets from '../hardhat/secrets.json'

export enum MinterType {
  FixedPriceSequentialMinter,
  FixedPriceSpecificIDMinter,
}
interface Config {
  deployerAddress: string
  minterAddress: string
  tokenAddress: string
  timelockAddress: string
  governorAddress: string
  minterType: MinterType
}

type SupportedChains = ChainId.Rinkeby | ChainId.Localhost

export const CHAIN_ID: SupportedChains = ChainId.Localhost

const config: Record<SupportedChains, Config> = {
  [ChainId.Localhost]: {
    deployerAddress: '0x8A93d247134d91e0de6f96547cB0204e5BE8e5D8',
    tokenAddress: '0x3c84c23ba9f9C67474Bf2D93d775528908dE9c72',
    minterAddress: '0xa6B77d7f309C76b2d2D7E3D67283597DffC82568',
    governorAddress: '0x974c9595c0E0c17c73b057BB81A339d0B4B8872E',
    timelockAddress: '0xC5987d5deB9b12e60C93aa3c5B57B15F68504cCb',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
  [ChainId.Rinkeby]: {
    deployerAddress: '0x842D5060c91a2d7edfDA1c7735D59DEd65b798D9',
    tokenAddress: '0x743C9A45Ef6896437895C4d997e0EA15fA032553',
    minterAddress: '0x1b186cD7707c939A839fE176976Da66C2E0C21BD',
    governorAddress: '',
    timelockAddress: '0x3E0772678afD58880acCe775FEf48042889b7399',
    minterType: MinterType.FixedPriceSequentialMinter,
  },
}

export const secrets = { alchemyApiKey: allSecrets.alchemyApiKey }

export default config[CHAIN_ID]
