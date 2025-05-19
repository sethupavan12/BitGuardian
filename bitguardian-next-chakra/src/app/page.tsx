'use client'

import { 
  Box, 
  Container, 
  Heading, 
  Text, 
  Button, 
  Flex, 
  Link as ChakraLink,
  VStack,
  HStack,
  Icon,
  Grid,
  GridItem,
  Card,
  CardBody,
  Image,
  useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaShieldAlt, FaLock, FaClock } from 'react-icons/fa'

export default function Home() {
  // Theme-aware colors
  const bgGradient = useColorModeValue(
    'linear(to-b, brand.50, white)',
    'linear(to-b, gray.900, dark.background)'
  )
  const cardBg = useColorModeValue('white', 'dark.surface')
  const cardBorder = useColorModeValue('gray.100', 'dark.border')
  const highlightColor = useColorModeValue('brand.500', 'brand.400')
  
  return (
    <Box as="main">
      {/* Hero Section */}
      <Box 
        bgGradient={bgGradient}
        py={20}
        px={4}
      >
        <Container maxW="container.xl">
          <Grid templateColumns={{ base: "1fr", lg: "1fr 1fr" }} gap={10} alignItems="center">
            <GridItem>
              <VStack spacing={6} align="flex-start" maxW="600px">
                <Box>
                  <Text 
                    color={highlightColor} 
                    fontWeight="semibold" 
                    letterSpacing="wide"
                    textTransform="uppercase"
                    mb={3}
                  >
                    Bitcoin Inheritance Platform
          </Text>
                  <Heading 
                    as="h1" 
                    size="2xl" 
                    fontWeight="extrabold" 
                    lineHeight="1.2"
                    mb={4}
                  >
            Secure Your Bitcoin Legacy
                    <Box as="span" color={highlightColor}> For Generations</Box>
          </Heading>
                  <Text fontSize="xl" color={useColorModeValue('gray.600', 'gray.300')}>
            BitGuardian helps you create inheritance plans to ensure your 
            Bitcoin is passed to your heirs securely and according to your wishes.
          </Text>
                </Box>
          
                <HStack spacing={4} pt={4}>
            <Button 
              as={Link}
              href="/dashboard" 
              size="lg"
                    colorScheme="brand"
                    px={8}
                    height="56px"
            >
              Go to Dashboard
            </Button>
            
            <Button 
              as={Link}
              href="/create" 
              size="lg"
                    variant="outline"
                    px={8}
                    height="56px"
            >
              Create Inheritance Plan
            </Button>
                </HStack>
              </VStack>
            </GridItem>
            
            <GridItem display={{ base: 'none', lg: 'block' }}>
              <Box 
                boxShadow="xl" 
                borderRadius="2xl" 
                overflow="hidden"
                height="400px"
                position="relative"
              >
                {/* Placeholder for a nice illustration or screenshot */}
                <Box 
                  bg="brand.100" 
                  height="100%" 
                  width="100%" 
                  position="relative"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FaShieldAlt} color="brand.500" fontSize="9xl" opacity={0.8} />
                </Box>
              </Box>
            </GridItem>
          </Grid>
        </Container>
      </Box>
      
      {/* Demo Mode Notice */}
      <Box bg={useColorModeValue('yellow.50', 'yellow.900')} borderBottom="1px" borderColor={useColorModeValue('yellow.100', 'yellow.800')}>
        <Container maxW="container.xl" py={3}>
          <Flex justify="center" align="center">
            <Text fontWeight="medium" color={useColorModeValue('yellow.800', 'yellow.200')}>
              DEMO MODE — This application is running in a local Polar Bitcoin testnet environment
            </Text>
          </Flex>
        </Container>
      </Box>

      {/* Features Section */}
      <Box py={20} px={4}>
        <Container maxW="container.xl">
          <VStack spacing={16}>
            <VStack spacing={4} textAlign="center" maxW="800px" mx="auto">
              <Heading as="h2" size="xl">
                Key Features
              </Heading>
              <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.300')}>
                BitGuardian provides everything you need to create secure, reliable Bitcoin inheritance plans
              </Text>
            </VStack>
            
            <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={8}>
              {/* Feature 1 */}
              <Card bg={cardBg} borderRadius="xl" boxShadow="md" height="100%" borderColor={cardBorder} borderWidth="1px">
                <CardBody>
                  <VStack spacing={5} align="flex-start">
                    <Flex 
                      w={12} 
                      h={12} 
                      bg={useColorModeValue('brand.50', 'brand.900')} 
                      color={highlightColor}
                      borderRadius="lg"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaShieldAlt} fontSize="24px" />
                    </Flex>
                    <Heading as="h3" size="md">
                      Secure Inheritance
                    </Heading>
                    <Text>
                      Create plans that automatically distribute your Bitcoin to designated heirs
                      based on preset conditions, ensuring your legacy remains protected.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
              
              {/* Feature 2 */}
              <Card bg={cardBg} borderRadius="xl" boxShadow="md" height="100%" borderColor={cardBorder} borderWidth="1px">
                <CardBody>
                  <VStack spacing={5} align="flex-start">
                    <Flex 
                      w={12} 
                      h={12} 
                      bg={useColorModeValue('brand.50', 'brand.900')} 
                      color={highlightColor}
                      borderRadius="lg"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaLock} fontSize="24px" />
                    </Flex>
                    <Heading as="h3" size="md">
                      Multi-level Verification
                    </Heading>
                    <Text>
                      Configure multiple verification methods including email, blockchain activity
                      monitoring, and trusted contacts to prevent unauthorized access.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
              
              {/* Feature 3 */}
              <Card bg={cardBg} borderRadius="xl" boxShadow="md" height="100%" borderColor={cardBorder} borderWidth="1px">
                <CardBody>
                  <VStack spacing={5} align="flex-start">
                    <Flex 
                      w={12} 
                      h={12} 
                      bg={useColorModeValue('brand.50', 'brand.900')} 
                      color={highlightColor}
                      borderRadius="lg"
                      align="center"
                      justify="center"
                    >
                      <Icon as={FaClock} fontSize="24px" />
                    </Flex>
                    <Heading as="h3" size="md">
                      Time-based Execution
                    </Heading>
                    <Text>
                      Set plans to automatically execute after specified periods of inactivity,
                      or schedule them for specific future dates when you want assets transferred.
                    </Text>
                  </VStack>
                </CardBody>
              </Card>
            </Grid>
            
            {/* CTA */}
            <Box pt={10}>
              <Button 
                as={Link}
                href="/create" 
                size="lg"
                colorScheme="brand"
                px={8}
                height="56px"
              >
                Get Started Now
              </Button>
        </Box>
          </VStack>
      </Container>
      </Box>
    </Box>
  )
}
