import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Container,
  Image,
} from '@chakra-ui/react'
import { getErrorMessage } from '@create-nft-dao/shared'
import { useEthers, useNotifications } from '@usedapp/core'
import React from 'react'
import { truncateHash } from '../lib/utils'
import { Head } from './Head'
import { Header } from './Header'

// Extends `window` to add `ethereum`.
declare global {
  interface Window {
    ethereum: any
  }
}

const TRANSACTION_TITLES = {
  transactionStarted: 'Transaction Started',
  transactionSucceed: 'Transaction Completed',
}

interface LayoutProps {
  children: React.ReactNode
}

export const Layout = ({ children }: LayoutProps): JSX.Element => {
  const { error } = useEthers()
  const { notifications } = useNotifications()

  return (
    <>
      <Head />
      <Header />
      <main>
        <Image src="./images/bg_shape01.svg" position="absolute" left="572px" />
        <Container maxWidth="100%" ml="100px" top="-98px" position="relative">
          <Image
            src="./images/bg_shape07.svg"
            position="absolute"
            left="801px"
            top="-50px"
            zIndex={-1}
          />
          {error && (
            <Alert status="error" mb="8">
              <AlertIcon />
              <AlertTitle mr={2}>Error:</AlertTitle>
              <AlertDescription>{getErrorMessage(error)}</AlertDescription>
            </Alert>
          )}
          {children}
          {notifications.map((notification) => {
            if (notification.type === 'walletConnected') {
              return null
            }
            return (
              <Alert
                key={notification.id}
                status="success"
                position="fixed"
                bottom="8"
                right="8"
                width="400px"
              >
                <AlertIcon />
                <Box>
                  <AlertTitle>
                    {TRANSACTION_TITLES[notification.type]}
                  </AlertTitle>
                  <AlertDescription overflow="hidden">
                    Transaction Hash:{' '}
                    {truncateHash(notification.transaction.hash, 61)}
                  </AlertDescription>
                </Box>
              </Alert>
            )
          })}
        </Container>
      </main>
      <footer>
        <Container mt="8" py="8" maxWidth="container.xl"></Container>
      </footer>
    </>
  )
}
