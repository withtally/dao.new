import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Image,
} from '@chakra-ui/react'
import { getErrorMessage } from '@create-nft-dao/shared'
import { useEthers, useNotifications } from '@usedapp/core'
import React from 'react'
import { truncateHash } from '../lib/utils'
import { Background } from './Background'
import { Footer } from './Footer'
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
      <Background />
      <Header />
      <main>
        <Box ml="100px" position="relative">
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
        </Box>
      </main>
      <Footer />
    </>
  )
}
