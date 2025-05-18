'use client'

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Link as ChakraLink
} from '@chakra-ui/react'
import Link from 'next/link'

export default function Home() {
  return (
    <Box as="main">
      <Box 
        bg="brand.500" 
        color="white" 
        py={4} 
        mb={8}
      >
        <Container maxW="container.lg">
          <Heading as="h1" size="xl">BitGuardian</Heading>
          <Text fontSize="lg">Bitcoin Inheritance Platform</Text>
        </Container>
      </Box>
      
      <Container maxW="container.lg">
        <Box 
          p={5} 
          mb={8}
          border="1px" 
          borderColor="yellow.400" 
          borderRadius="md"
          bg="yellow.50"
        >
          <Text fontWeight="bold">DEMO MODE</Text>
          <Text>
            This application is running in a local Polar Bitcoin testnet environment
          </Text>
        </Box>

        <Box textAlign="center" py={10}>
          <Heading as="h2" size="xl" mb={6}>
            Secure Your Bitcoin Legacy
          </Heading>
          
          <Text fontSize="xl" mb={6}>
            BitGuardian helps you create inheritance plans to ensure your 
            Bitcoin is passed to your heirs securely and according to your wishes.
          </Text>
          
          <Flex gap={4} justify="center" wrap="wrap">
            <Button 
              as={Link}
              href="/dashboard" 
              colorScheme="blue" 
              size="lg"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              as={Link}
              href="/create" 
              colorScheme="green" 
              size="lg"
            >
              Create Inheritance Plan
            </Button>
          </Flex>
        </Box>
      </Container>
    </Box>
  )
}
