import { Layout } from '../components/layout/Layout'
import { Minter } from '../components/Minter'
import { Center, Container } from '@chakra-ui/react'

const Mint = () => {
  const layoutProps = {
    title: 'Mint',
  }

  return (
    <Layout customMeta={layoutProps}>
      <Container maxW="container.lg">
        <Center>
          <Minter />
        </Center>
      </Container>
    </Layout>
  )
}

export default Mint
