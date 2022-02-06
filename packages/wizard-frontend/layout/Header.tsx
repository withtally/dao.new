import { Container, Image, Heading, Box } from '@chakra-ui/react'
import { Nav } from './Nav'

export const Header = (): JSX.Element => {
  return (
    <header>
      <Container maxW="100%" h="342px" p="0">
        <Nav />

        <Heading
          color="brand.300"
          fontSize={{ base: '2.5em', md: '4.5em' }}
          textAlign="center"
          mt="79px"
        >
          Create NFT DAO
        </Heading>
      </Container>
    </header>
  )
}
