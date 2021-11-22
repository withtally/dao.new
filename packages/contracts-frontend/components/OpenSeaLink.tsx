import { useEffect, useState } from 'react'
import { ChainId, useEthers } from '@usedapp/core'
import { Link } from '@chakra-ui/react'
import { config } from '@create-nft-dao/shared'

export const OpenSeaLink = ({ linkText }) => {
  const { chainId } = useEthers()
  const [openseaLink, setOpenseaLink] = useState('')

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
  }, [chainId])

  return (
    <Link isExternal href={openseaLink}>
      {linkText}
    </Link>
  )
}
