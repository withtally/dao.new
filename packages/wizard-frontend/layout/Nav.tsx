import {
  Image,
  Flex,
  Menu,
  MenuButton,
  SimpleGrid,
  Button,
  MenuList,
  MenuItem,
  Text,
  HStack,
  Spacer,
  Box,
  Img,
} from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { Balance } from '../components/Balance'
import blockies from 'blockies-ts'
import { truncateHash } from '../lib/utils'
import { ConnectWallet } from '../components/ConnectWallet'

export const Nav = (): JSX.Element => {
  const { account, deactivate } = useEthers()

  let blockieImageSrc
  if (typeof window !== 'undefined') {
    blockieImageSrc = blockies.create({ seed: account }).toDataURL()
  }

  return (
    <Flex
      m={{ base: '0', md: '0 50px', lg: '0 100px' }}
      pt="10px"
      flexWrap="wrap"
    >
      <Img src="./images/dao.new_logo.svg" />
      <Spacer />
      <Flex alignItems={'center'} id="connect-wallet-container">
        {account ? (
          <>
            <Balance />
            <Image ml="4" src={blockieImageSrc} alt="blockie" />
            <Menu placement="bottom-end">
              <MenuButton as={Button} ml="4">
                {truncateHash(account)}
              </MenuButton>
              <MenuList>
                <MenuItem
                  onClick={() => {
                    deactivate()
                  }}
                >
                  Disconnect
                </MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <ConnectWallet />
        )}
      </Flex>
    </Flex>
  )
}
