import { Text, Box, Flex, Img, HStack, Link, VStack } from '@chakra-ui/react'

export const Footer = () => (
  <Flex
    as="footer"
    px="140px "
    py="10"
    bg="#fff"
    h="250px"
    justifyContent={'space-between'}
    color="brandGray.300"
    fontSize="14px"
    fontWeight="400"
  >
    <Box>
      <Flex>
        <Box>
          <Img src="./images/footer/brand_logo.svg" />
          <Text mt="10px">&copy; 2022 Tally</Text>
        </Box>
        <Box ml="140px">
          <VStack>
            <Text fontWeight="600">LINKS</Text>
            <Link>Link 01</Link>
            <Link>Link 02</Link>
            <Link>Link 03</Link>
            <Link>Link 04</Link>
          </VStack>
        </Box>
      </Flex>
    </Box>
    <Box>
      <Text fontWeight="600">Join our Community!</Text>
      <HStack mt="15px" spacing="15px">
        <Img src="./images/footer/discord.svg" />
        <Img src="./images/footer/twitter.svg" />
        <Img src="./images/footer/github.svg" />
      </HStack>
    </Box>
  </Flex>
)
