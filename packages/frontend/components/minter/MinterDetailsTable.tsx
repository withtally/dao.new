import { Button, Link, Table, Tbody, Td, Tr } from '@chakra-ui/react'
import { ChainId, useEtherBalance, useEthers } from '@usedapp/core'
import { formatEther } from 'ethers/lib/utils'
import React, { useEffect, useState } from 'react'
import config from '../../config'
import {
  usePauseSale,
  useStartingBlock,
  useUnpauseSale,
} from '../../lib/contractWrappers/minter'
import { useNFTName, useTotalSupply } from '../../lib/contractWrappers/token'

export const MinterDetailsTable = ({ isSaleActive, tokenPrice }) => {
  const etherscanLink = (address: string) => {
    // TODO: support mainnet
    return `https://rinkeby.etherscan.io/address/${address}`
  }

  const timelockEthBalance = useEtherBalance(config.timelockAddress)
  const minterEthBalance = useEtherBalance(config.minterAddress)
  const nftName = useNFTName()
  const totalSupply = useTotalSupply()
  const [openseaLink, setOpenseaLink] = useState('')
  const { chainId } = useEthers()
  const pauseSale = usePauseSale()
  const unpauseSale = useUnpauseSale()
  const startingBlock = useStartingBlock()

  useEffect(() => {
    // TODO: support mainnet
    if (chainId !== ChainId.Rinkeby) {
      return
    }

    fetch(
      `https://rinkeby-api.opensea.io/api/v1/asset_contract/${config.tokenAddress}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.collection) {
          setOpenseaLink(
            `https://testnets.opensea.io/collection/${data.collection.slug}`
          )
        }
      })
  }, [])

  const raribleLink = () => {
    // TODO: support mainnet
    return `https://rinkeby.rarible.com/collection/${config.tokenAddress}`
  }

  const flipSaleActiveStatus = () => {
    if (isSaleActive) {
      pauseSale()
    } else {
      unpauseSale()
    }
  }

  return (
    <Table>
      <Tbody>
        <Tr>
          <Td>
            Treasury (funds in{' '}
            <Link
              color="teal.500"
              isExternal
              href={etherscanLink(config.timelockAddress)}
            >
              timelock contract
            </Link>
            )
          </Td>
          <Td>{timelockEthBalance && formatEther(timelockEthBalance)}Ξ</Td>
        </Tr>
        <Tr>
          <Td>
            Funds in{' '}
            <Link
              color="teal.500"
              isExternal
              href={etherscanLink(config.minterAddress)}
            >
              minter contract
            </Link>
          </Td>
          <Td>{minterEthBalance && formatEther(minterEthBalance)}Ξ</Td>
        </Tr>
        <Tr>
          <Td>Sale status</Td>
          <Td>
            {isSaleActive ? '' : 'Not '}Active
            <Button onClick={flipSaleActiveStatus} ml={3}>
              {isSaleActive ? 'pause' : 'unpause'}
            </Button>
          </Td>
        </Tr>
        <Tr>
          <Td>Starting block</Td>
          <Td>{startingBlock}</Td>
        </Tr>
        <Tr>
          <Td>NFT name</Td>
          <Td>{nftName}</Td>
        </Tr>
        <Tr>
          <Td>Price per NFT</Td>
          <Td>{tokenPrice && formatEther(tokenPrice)}Ξ</Td>
        </Tr>
        <Tr>
          <Td>Total minted</Td>
          <Td>{totalSupply && totalSupply.toNumber()}</Td>
        </Tr>
        <Tr>
          <Td>
            <Link color="teal.500" href={openseaLink}>
              Opensea
            </Link>
          </Td>
        </Tr>
        <Tr>
          <Td>
            <Link color="teal.500" href={raribleLink()}>
              Rarible
            </Link>
          </Td>
        </Tr>
      </Tbody>
    </Table>
  )
}
