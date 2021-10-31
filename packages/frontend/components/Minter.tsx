import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { VStack, Box } from "@chakra-ui/layout"
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/number-input"
import { Button } from "@chakra-ui/react"
import { useContractCall, useContractFunction, useEthers, useTokenBalance } from "@usedapp/core"
import FixedPriceMinterABI from '../artifacts/contracts/FixedPriceMinter.sol/FixedPriceMinter.json'
import ERC721DAOTokenABI from '../artifacts/contracts/ERC721DAOToken.sol/ERC721DAOToken.json'
import { BigNumber, Contract, utils } from 'ethers';
import config from "../config"
import { formatEther, Interface } from "ethers/lib/utils"
import { useState } from "react"


export const Minter = () => {

  const minterAbi: Interface = new utils.Interface(FixedPriceMinterABI.abi);
  const tokenAbi: Interface = new utils.Interface(ERC721DAOTokenABI.abi);

  const { account } = useEthers()

  const useMintPrice = () => {
    const [tokenPrice] = useContractCall({
      abi: minterAbi,
      address: config.minterAddress,
      method: 'tokenPrice',
      args: []
    }) || [];
    return tokenPrice
  }

  const useTotalSupply = () => {
    const [totalSupply] = useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'totalSupply',
      args: []
    }) || [];
    return totalSupply;
  }

  const useNFTName = () => {
    const [nftName] = useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'name',
      args: []
    }) || [];
    return nftName;
  }

  const useTokenSymbol = () => {
    const [symbol] = useContractCall({
      abi: tokenAbi,
      address: config.tokenAddress,
      method: 'symbol',
      args: []
    }) || [];
    return symbol;
  }

  const useMaxMintPerTxn = () => {
    const [maxMintPerTx] = useContractCall({
      abi: minterAbi,
      address: config.minterAddress,
      method: 'maxMintsPerTx',
      args: []
    }) || [];
    return maxMintPerTx && maxMintPerTx.toNumber();
  }

  const useIsSaleActive = () => {
    const [saleActive] = useContractCall({
      abi: minterAbi,
      address: config.minterAddress,
      method: 'saleActive',
      args: []
    }) || [];
    return saleActive;
  }

  const tokenBalance = useTokenBalance(config.tokenAddress, account);
  const tokenPrice: BigNumber = useMintPrice();
  const totalSupply = useTotalSupply();
  const nftName = useNFTName();
  const nftSymbol = useTokenSymbol();
  const maxMintPerTx = useMaxMintPerTxn();
  const isSaleActive = useIsSaleActive();
  const [tokensToMint, setTokensToMint] = useState(1);

  const contract = new Contract(config.minterAddress, minterAbi);
  const { state, send: mintFunction } = useContractFunction(contract, 'mint', {transactionName: 'minttx'})
  const { state: state2, send: setSaleActiveFunction } = useContractFunction(contract, 'setSaleActive', {transactionName: 'minttx'})

  const mint = async (tokensToMint: number) => {
    console.log('hai', tokensToMint)
    mintFunction(tokensToMint, { value: tokenPrice.mul(tokensToMint) })
  }


  const mintClicked = async () => {
    mint(tokensToMint)
  }

  const activateSaleClicked = async () => {
    setSaleActiveFunction(true)
  }

  return (
    <>
    
    <VStack>
      <Box>Sale is {isSaleActive ? '' : 'not '}active</Box>
      <Box>NFT name: {nftName}</Box>
      <Box>Symbol: {nftSymbol}</Box>
      <Box>Max mint per tx: {maxMintPerTx}</Box>
      <FormControl>
        <FormLabel>Tokens to mint</FormLabel>
        <NumberInput
          step={1}
          min={0}
          max={maxMintPerTx}
          value={tokensToMint}
          onChange={(_, n) => setTokensToMint(n)}
        >
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <div>Total supply: {totalSupply && totalSupply.toNumber()}</div>
      <div>Price: {tokenPrice && formatEther(tokenPrice)} ETH</div>
      <Button onClick={mintClicked}>MINT</Button>
      <Button onClick={activateSaleClicked}>Activate sale</Button>
    </VStack>
    </>
  )
}