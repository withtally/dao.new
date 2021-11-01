import { FormControl, FormLabel } from "@chakra-ui/form-control"
import { VStack, Box, HStack, Spacer, Link } from "@chakra-ui/layout"
import { NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from "@chakra-ui/number-input"
import { Button, Table, Tr, Td } from "@chakra-ui/react"
import { useContractCall, useContractFunction, useEtherBalance, useEthers, useTokenBalance } from "@usedapp/core"
import FixedPriceMinterABI from '../artifacts/contracts/FixedPriceMinter.sol/FixedPriceMinter.json'
import ERC721DAOTokenABI from '../artifacts/contracts/ERC721DAOToken.sol/ERC721DAOToken.json'
import { BigNumber, Contract, utils } from 'ethers';
import config from "../config"
import { formatEther, Interface } from "ethers/lib/utils"
import { useEffect, useState } from "react"


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
  const minterEthBalance = useEtherBalance(config.minterAddress);
  const timelockEthBalance = useEtherBalance(config.timelockAddress);
  const [openseaLink, setOpenseaLink] = useState('');

  const contract = new Contract(config.minterAddress, minterAbi);
  const { state, send: mintFunction } = useContractFunction(contract, 'mint', {transactionName: 'minttx'})
  const { state: state2, send: setSaleActiveFunction } = useContractFunction(contract, 'setSaleActive', {transactionName: 'minttx'})

  const mint = async (tokensToMint: number) => {
    mintFunction(tokensToMint, { value: tokenPrice.mul(tokensToMint) })
  }


  const mintClicked = async () => {
    mint(tokensToMint)
  }

  const activateSaleClicked = async () => {
    setSaleActiveFunction(true)
  }

  const etherscanLink = address => {
    // TODO: support mainnet
    return `https://rinkeby.etherscan.io/address/${address}`;
  }

  useEffect(() => {
    // TODO: support mainnet
    fetch(`https://rinkeby-api.opensea.io/api/v1/asset_contract/${config.tokenAddress}`)
      .then(response => response.json())
      .then(data => setOpenseaLink(`https://testnets.opensea.io/collection/${data.collection.slug}`))
  })

  const raribleLink = () => {
    // TODO: support mainnet
    return `https://rinkeby.rarible.com/collection/${config.tokenAddress}`
  }

  return (
    <>
    <HStack spacing="20">
      <Table>
        <Tr>
          <Td>Treasury (funds in <Link color="teal.500" isExternal href={etherscanLink(config.timelockAddress)}>timelock contract</Link>)</Td>
          <Td>{timelockEthBalance && formatEther(timelockEthBalance)}Ξ</Td>
        </Tr>
        <Tr>
          <Td>Funds in <Link color="teal.500" isExternal href={etherscanLink(config.minterAddress)}>minter contract</Link></Td>
          <Td>{minterEthBalance && formatEther(minterEthBalance)}Ξ</Td>
        </Tr>
        <Tr>
          <Td>Sale status</Td>
          <Td>
            {isSaleActive ? '' : 'Not '}Active
            {!isSaleActive ? <Button onClick={activateSaleClicked}>Activate sale</Button> : ''}
          </Td>
        </Tr>
        <Tr><Td>NFT name</Td><Td>{nftName}</Td></Tr>
        <Tr><Td>Max mint per tx</Td><Td>{maxMintPerTx}</Td></Tr>
        <Tr><Td>Price per NFT</Td><Td>{tokenPrice && formatEther(tokenPrice)} ETH</Td></Tr>
        <Tr><Td>Total minted</Td><Td>{totalSupply && totalSupply.toNumber()}</Td></Tr>
        <Tr><Td><Link color="teal.500" href={openseaLink}>Opensea</Link></Td></Tr>
        <Tr><Td><Link color="teal.500" href={raribleLink()}>Rarible</Link></Td></Tr>
      </Table>
    <Spacer />
    <VStack>
      
      
      <FormControl>
        <FormLabel>Tokens to mint:</FormLabel>
        <NumberInput
          step={1}
          min={0}
          max={maxMintPerTx}
          value={tokensToMint}
          onChange={(_, n) => setTokensToMint(n)}
        >
          <NumberInputField 
            fontSize="30px" 
            textAlign="center"
            padding={6}
             />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </FormControl>
      <Button w="100%" onClick={mintClicked}>MINT</Button>
    </VStack>

    </HStack>
    </>
  )
}