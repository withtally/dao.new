import { Container, Image, Heading, Box } from '@chakra-ui/react'
import { Nav } from './Nav'

export const Header = (): JSX.Element => {
  return (
    <header>
      <Container maxW="100%" h="440px" p="0">
        <Box bg="#F7FAFC" h="440px" w="100%" zIndex="-1" position="absolute">
          <Image
            src="./images/bg_shape05.svg"
            w="242px"
            h="440px"
            position="absolute"
            right="0"
          />
          <Image
            src="./images/bg_shape06.svg"
            position="absolute"
            left="139px"
            top="185px"
          />
          {/* <Image
            src="./images/bg_shape07.svg"
            position="absolute"
            left="885px"
            bottom="50px"
          /> */}
        </Box>

        <Nav />

        <Heading
          color="brand.100"
          fontSize="4.5em"
          textAlign="center"
          mt="79px"
        >
          Create NFT DAO
        </Heading>
      </Container>
    </header>
  )
}
