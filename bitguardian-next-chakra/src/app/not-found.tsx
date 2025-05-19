'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Icon,
  Flex,
  useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaShieldAlt, FaHome } from 'react-icons/fa'

export default function NotFound() {
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.50, white)',
    'linear(to-b, gray.900, dark.background)'
  )
  const highlightColor = useColorModeValue('brand.500', 'brand.400')
  const textColor = useColorModeValue('gray.600', 'gray.300')

  return (
    <Box
      bgGradient={bgGradient}
      minH="calc(100vh - 150px)"
      display="flex"
      alignItems="center"
      justifyContent="center"
      py={20}
      px={4}
    >
      <Container maxW="container.md">
        <VStack spacing={8} textAlign="center">
          <Flex
            bg={useColorModeValue('white', 'gray.800')}
            borderRadius="full"
            w={24}
            h={24}
            alignItems="center"
            justifyContent="center"
            boxShadow="md"
          >
            <Icon as={FaShieldAlt} color={highlightColor} fontSize="5xl" />
          </Flex>
          
          <VStack spacing={3}>
            <Heading as="h1" size="2xl">404 - Page Not Found</Heading>
            <Text fontSize="xl" color={textColor} maxW="600px">
              The page you're looking for doesn't exist or has been moved.
            </Text>
          </VStack>
          
          <Button
            as={Link}
            href="/"
            size="lg"
            colorScheme="brand"
            leftIcon={<Icon as={FaHome} />}
            px={8}
            h={14}
          >
            Go Home
          </Button>
        </VStack>
      </Container>
    </Box>
  )
} 