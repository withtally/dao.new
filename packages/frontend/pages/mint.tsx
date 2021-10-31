import { Layout } from "../components/layout/Layout"
import { Minter } from "../components/Minter"
import { Center, Container } from "@chakra-ui/react"

const Mint = () => {
  return (
  <Layout>
    <Container maxW="container.sm">
      <Center>
        <Minter />
      </Center>
    </Container>
  </Layout>
  )
}

export default Mint