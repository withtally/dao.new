import { Text, Box, Flex, Img, HStack, Link, VStack } from '@chakra-ui/react'

export const Footer = () => (
  <Flex
    as="footer"
    px={{ base: '40px', md: '140px' }}
    py="10"
    bg="#fff"
    minH="250px"
    justifyContent={'space-between'}
    color="brandGray.300"
    fontSize="14px"
    fontWeight="400"
    flexWrap={'wrap'}
  >
    <Box>
      <Flex>
        <Box>
          <Img src="./images/footer/brand_logo.svg" />
          <Text mt="10px">&copy; 2022 Tally</Text>
        </Box>
        <Box ml="140px" flexShrink={0}>
          <VStack alignItems="start">
            <Text fontWeight="600">LINKS</Text>
            <Link isExternal href="https://careers.withtally.com/">
              Jobs
            </Link>
            <Link isExternal href="https://docs.withtally.com/">
              Documentation
            </Link>
            <Link isExternal href="https://wiki.withtally.com/docs">
              Governance wiki
            </Link>
            <Link isExternal href="https://discord.com/invite/sCGnpWH3m4">
              Support
            </Link>
            <Link isExternal href="https://medium.com/tally-blog">
              Blog
            </Link>
          </VStack>
        </Box>
      </Flex>
    </Box>
    <Box mb="50px">
      <Text fontWeight="600">Join our Community!</Text>
      <HStack mt="15px" spacing="15px">
        <Link isExternal href="https://discord.com/invite/sCGnpWH3m4">
          <Img src="./images/footer/discord.svg" />
        </Link>
        <Link isExternal href="https://twitter.com/make_a_new_dao">
          <Img src="./images/footer/twitter.svg" />
        </Link>
        <Link isExternal href="https://github.com/withtally/dao.new">
          <Img src="./images/footer/github.svg" />
        </Link>
      </HStack>
    </Box>
  </Flex>
)
