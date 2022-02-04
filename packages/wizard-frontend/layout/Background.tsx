import { Box, Image } from '@chakra-ui/react'

export const Background = () => {
  return (
    <Box
      position="absolute"
      w="100%"
      h="100%"
      id="background"
      bg="brandGray.200"
      zIndex="-1"
    >
      <Box h="440px" w="100%">
        <Image
          src="./images/bg_shape06.svg"
          position="absolute"
          left="185px"
          top="185px"
        />
        <Image
          src="./images/bg_shape07.svg"
          position="absolute"
          right="447px"
          top="281px"
        />
        <Image src="./images/bg_shape05.svg" position="absolute" right="0" />
      </Box>
      <Box position="relative" h="2260px" backgroundColor="#fff">
        <Image
          src="./images/bg_shape01.svg"
          position="absolute"
          right="132px"
        />
        <Image
          src="./images/bg_shape04.svg"
          position="absolute"
          top="480px"
          right="390px"
        />
        <Image src="./images/bg_shape08.svg" position="absolute" top="917px" />
        <Image
          src="./images/bg_shape09.svg"
          position="absolute"
          top="1206px"
          right="172px"
        />
        <Image
          src="./images/bg_shape03.svg"
          position="absolute"
          top="1492px"
          right="276px"
        />
        <Image
          src="./images/bg_shape04.svg"
          position="absolute"
          top="1666px"
          right="194px"
        />
      </Box>
      <Box
        h="614px"
        bg="linear-gradient(180deg, #FFFFFF 11.46%, #F4F0FF 100%);"
      >
        <Image src="./images/bg_shape02.svg" position="relative" top="146px" />
      </Box>
      <Box h="240px"></Box>
    </Box>
  )
}
