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
    <Flex>
      <Flex alignItems="baseline">
        <Text color="brand.100" fontWeight="bold" fontSize="2.8em" ml="100px">
          DAO
        </Text>
        <Text color="brand.200" fontWeight="bold" fontSize="1.5em">
          .new
        </Text>
      </Flex>
      <Spacer />
      <Flex
        order={[-1, null, null, 2]}
        alignItems={'center'}
        justifyContent={['flex-start', null, null, 'flex-end']}
        mr="90px"
      >
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
