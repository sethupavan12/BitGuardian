'use client'

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  Flex,
  Icon,
  HStack,
  Divider,
  useColorModeValue
} from '@chakra-ui/react'
import { FaGithub, FaTwitter, FaShieldAlt } from 'react-icons/fa'

export default function Footer() {
  const year = new Date().getFullYear()
  const bgColor = useColorModeValue('gray.50', 'gray.900')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const textColor = useColorModeValue('gray.600', 'gray.400')
  const linkColor = useColorModeValue('brand.500', 'brand.400')

  return (
    <Box
      bg={bgColor}
      color={textColor}
      borderTop="1px"
      borderColor={borderColor}
      py={8}
    >
      <Container maxW="container.xl">
        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={8}
          justify="space-between"
          align="center"
        >
          <Flex
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'center', md: 'flex-start' }}
            justify="center"
          >
            <HStack mb={{ base: 2, md: 0 }} mr={{ md: 6 }}>
              <Icon as={FaShieldAlt} color={linkColor} boxSize={5} />
              <Text fontWeight="bold" fontSize="lg">
                BitGuardian
              </Text>
            </HStack>
            <Text textAlign={{ base: 'center', md: 'left' }}>
              Secure your Bitcoin legacy with time-based inheritance plans
            </Text>
          </Flex>

          <HStack spacing={4}>
            <Link
              href="https://github.com"
              isExternal
              aria-label="GitHub"
              color={textColor}
              _hover={{ color: linkColor }}
            >
              <Icon as={FaGithub} boxSize={5} />
            </Link>
            <Link
              href="https://twitter.com"
              isExternal
              aria-label="Twitter"
              color={textColor}
              _hover={{ color: linkColor }}
            >
              <Icon as={FaTwitter} boxSize={5} />
            </Link>
          </HStack>
        </Stack>

        <Divider my={6} borderColor={borderColor} />

        <Stack
          direction={{ base: 'column', md: 'row' }}
          spacing={{ base: 4, md: 6 }}
          justify="space-between"
          align="center"
          fontSize="sm"
        >
          <Text>© {year} BitGuardian. All rights reserved.</Text>
          <HStack spacing={6} justify="center" wrap="wrap">
            <Link href="#" _hover={{ color: linkColor }}>Privacy Policy</Link>
            <Link href="#" _hover={{ color: linkColor }}>Terms of Service</Link>
            <Link href="#" _hover={{ color: linkColor }}>Documentation</Link>
            <Link href="#" _hover={{ color: linkColor }}>FAQ</Link>
          </HStack>
        </Stack>
      </Container>
    </Box>
  )
} 