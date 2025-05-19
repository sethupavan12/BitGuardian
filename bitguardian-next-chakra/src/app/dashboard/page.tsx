'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  SimpleGrid,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Divider,
  Badge,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  StatGroup,
  IconButton,
  useToast,
  VStack,
  HStack,
  Icon,
  useColorModeValue
} from '@chakra-ui/react'
import Link from 'next/link'

// Icons
import { RepeatIcon, AddIcon } from '@chakra-ui/icons'
import { FaClock, FaUserFriends, FaPercent, FaShieldAlt } from 'react-icons/fa'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface Heir {
  name: string;
  share: number;
}

interface VerificationSettings {
  inactivityPeriod: number;
  useBlockchainVerification: boolean;
  useEmailVerification: boolean;
  useTrustedContacts: boolean;
}

interface Distribution {
  heir: string;
  amount: number;
  address: string;
  txid: string;
}

interface InheritancePlan {
  id: string;
  ownerName: string;
  heirs: Heir[];
  status: string;
  createdAt: string;
  verificationSettings: VerificationSettings;
  distributions?: Distribution[];
  allocationPercentage?: number;
  scheduledExecution?: {
    type: 'inactivity' | 'scheduled';
    inactivityPeriod?: number;
    scheduledDate?: string;
  };
}

export default function Dashboard() {
  const [plans, setPlans] = useState<InheritancePlan[]>([]) // Initialize as empty array
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  // Theme colors
  const headerBg = useColorModeValue('gray.50', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const statBg = useColorModeValue('gray.50', 'gray.800')
  const activeBadgeBg = useColorModeValue('green.500', 'green.400')
  const inactiveBadgeBg = useColorModeValue('gray.500', 'gray.400')
  const txBg = useColorModeValue('gray.50', 'gray.800')
  const mainBg = useColorModeValue('white', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  const highlightColor = useColorModeValue('brand.500', 'brand.400')

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async (retryCount = 0) => {
    try {
      setLoading(true)
      setError(null)
      
      try {
        const response = await axios.get(`${API_URL}/inheritance/plans`)
        // Ensure data.data is an array, use empty array if not
        setPlans(Array.isArray(response.data.data) ? response.data.data : [])
      } catch (apiError) {
        console.warn('Using mock data due to API error:', apiError)
        // Mock data if API fails
        setPlans([
          {
            id: "plan1",
            ownerName: "alice",
            status: "active",
            createdAt: new Date().toISOString(),
            heirs: [
              { name: "bob", share: 70 },
              { name: "carol", share: 30 }
            ],
            verificationSettings: {
              inactivityPeriod: 180,
              useBlockchainVerification: true,
              useEmailVerification: true,
              useTrustedContacts: false
            },
            allocationPercentage: 75,
            scheduledExecution: {
              type: "inactivity",
              inactivityPeriod: 180
            }
          }
        ])
      }
    } catch (error) {
      console.error('Error fetching plans:', error)
      
      // Add retry logic - retry up to 3 times with increasing delays
      if (retryCount < 3) {
        console.log(`Retrying fetch (${retryCount + 1}/3) in ${(retryCount + 1) * 1000}ms...`)
        setTimeout(() => {
          fetchPlans(retryCount + 1)
        }, (retryCount + 1) * 1000)
        return
      }
      
      setError('Failed to fetch inheritance plans. Please try again.')
      setPlans([]) // Ensure plans is always an array even on error
    } finally {
      setLoading(false)
    }
  }

  const executePlan = async (planId: string) => {
    try {
      setLoading(true)
      setError(null)
      await axios.post(`${API_URL}/inheritance/plans/${planId}/execute`)
      toast({
        title: 'Plan executed',
        description: 'Inheritance plan executed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      fetchPlans() // Refresh plans after execution
    } catch (error) {
      console.error('Error executing plan:', error)
      toast({
        title: 'Execution failed',
        description: 'Failed to execute inheritance plan. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box as="main" bg={mainBg} minH="calc(100vh - 64px)">
      <Box 
        bgGradient={`linear(to-r, ${highlightColor}, ${useColorModeValue('brand.600', 'brand.500')})`}
        color="white" 
        py={10}
        mb={8}
      >
        <Container maxW="container.xl">
          <Heading as="h1" size="xl" fontWeight="extrabold">Your BitGuardian Dashboard</Heading>
          <Text fontSize="lg" opacity={0.9} mt={2}>Manage your Bitcoin inheritance plans</Text>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={12}>
        <Flex 
          justify="space-between" 
          align={{ base: "flex-start", md: "center" }} 
          mb={6} 
          direction={{ base: "column", md: "row" }}
          gap={{ base: 4, md: 0 }}
        >
          <VStack align="flex-start" spacing={1}>
            <Heading as="h2" size="lg">Inheritance Plans</Heading>
            <Text color={subTextColor}>Manage and monitor your active plans</Text>
          </VStack>
          
          <HStack spacing={3}>
            <Button
              as={Link}
              href="/create"
              colorScheme="brand"
              leftIcon={<AddIcon />}
              px={6}
            >
              Create New Plan
            </Button>
            <IconButton
              icon={<RepeatIcon />}
              aria-label="Refresh plans"
              onClick={() => fetchPlans()}
              isLoading={loading}
              colorScheme="gray"
            />
          </HStack>
        </Flex>

        {error && (
          <Alert status="error" mb={6} borderRadius="lg" variant="subtle">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && (!plans || plans.length === 0) ? (
          <Flex justify="center" py={20} direction="column" align="center">
            <Spinner size="xl" thickness="4px" color={highlightColor} mb={4} />
            <Text color={subTextColor}>Loading your plans...</Text>
          </Flex>
        ) : (!plans || plans.length === 0) ? (
          <Card
            p={8}
            textAlign="center"
            borderWidth="1px"
            borderRadius="xl"
            borderColor={cardBorder}
            bg={cardBg}
            boxShadow="md"
          >
            <VStack spacing={6}>
              <Icon as={FaShieldAlt} fontSize="6xl" color={highlightColor} opacity={0.7} />
              <VStack spacing={2}>
                <Heading size="md">No inheritance plans found</Heading>
                <Text color={subTextColor} maxW="500px">
                  Create your first BitGuardian plan to protect your Bitcoin legacy and ensure it passes to your heirs securely.
                </Text>
              </VStack>
            <Button
              as={Link}
              href="/create"
                colorScheme="brand"
                size="lg"
                leftIcon={<AddIcon />}
                px={8}
            >
              Create Your First Plan
            </Button>
            </VStack>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={6}>
            {plans.map((plan) => (
              <Card 
                key={plan.id} 
                borderRadius="xl" 
                overflow="hidden" 
                boxShadow="md"
                borderColor={cardBorder}
                borderWidth="1px"
                bg={cardBg}
              >
                <CardHeader bg={headerBg} py={4} px={6}>
                  <Flex justify="space-between" align="center">
                    <HStack>
                      <Icon as={FaShieldAlt} color={highlightColor} boxSize={5} />
                    <Heading size="md">{plan.ownerName}'s Plan</Heading>
                    </HStack>
                    <Badge
                      colorScheme={plan.status === 'active' ? 'green' : 'gray'}
                      fontSize="sm"
                      borderRadius="full"
                      px={3}
                      py={1}
                    >
                      {plan.status}
                    </Badge>
                  </Flex>
                </CardHeader>
                
                <CardBody py={5} px={6}>
                  <Text color={subTextColor} fontSize="sm" mb={4}>
                    Created: {new Date(plan.createdAt).toLocaleDateString()} at {new Date(plan.createdAt).toLocaleTimeString()}
                  </Text>
                  
                  <SimpleGrid columns={2} spacing={4} mb={6}>
                    <Stat bg={statBg} p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color={subTextColor}>
                        <HStack spacing={1}>
                          <Icon as={FaClock} />
                          <Text>Inactivity Period</Text>
                        </HStack>
                      </StatLabel>
                      <StatNumber fontSize="lg">
                        {plan.verificationSettings?.inactivityPeriod 
                          ? `${Math.floor(plan.verificationSettings.inactivityPeriod)} days` 
                          : 'Not set'}
                      </StatNumber>
                    </Stat>
                    
                    <Stat bg={statBg} p={3} borderRadius="lg">
                      <StatLabel fontSize="xs" color={subTextColor}>
                        <HStack spacing={1}>
                          <Icon as={FaUserFriends} />
                          <Text>Heirs</Text>
                        </HStack>
                      </StatLabel>
                      <StatNumber fontSize="lg">{plan.heirs?.length || 0}</StatNumber>
                    </Stat>
                  </SimpleGrid>
                  
                  <Box mb={6}>
                    <Text fontWeight="semibold" mb={3} fontSize="md">Heirs Distribution</Text>
                    <VStack spacing={2} align="stretch">
                    {plan.heirs?.map((heir, idx) => (
                        <Flex 
                          key={idx} 
                          justify="space-between" 
                          bg={statBg} 
                          p={2} 
                          borderRadius="md"
                          align="center"
                        >
                          <Text fontWeight="medium">{heir.name}</Text>
                          <HStack>
                            <Icon as={FaPercent} fontSize="xs" color={subTextColor} />
                            <Text fontWeight="semibold">{heir.share}</Text>
                          </HStack>
                      </Flex>
                    ))}
                    </VStack>
                  </Box>
                  
                  {plan.distributions && plan.distributions.length > 0 && (
                    <Box>
                      <Text fontWeight="semibold" mb={3} fontSize="md">Executed Distributions</Text>
                      <VStack spacing={3} align="stretch">
                      {plan.distributions.map((dist, idx) => (
                        <Box 
                          key={idx}
                            p={3}
                            bg={txBg}
                            borderRadius="lg"
                        >
                            <Flex justify="space-between" mb={2}>
                              <Text fontWeight="semibold">{dist.heir}</Text>
                              <Badge colorScheme="green" borderRadius="full" px={2}>
                                {dist.amount} sats
                              </Badge>
                          </Flex>
                            <VStack spacing={1} align="stretch" fontSize="xs" color={subTextColor}>
                              <Text>
                                Address: <Box as="span" fontFamily="mono">{dist.address}</Box>
                          </Text>
                              <Text>
                                Tx: <Box as="span" fontFamily="mono">{dist.txid?.substring(0, 10)}...</Box>
                          </Text>
                            </VStack>
                        </Box>
                      ))}
                      </VStack>
                    </Box>
                  )}
                </CardBody>
                
                <CardFooter 
                  bg={headerBg} 
                  borderTop="1px" 
                  borderColor={cardBorder}
                  py={4} 
                  px={6}
                >
                  <HStack spacing={4} width="100%" justify="flex-end">
                    <Button 
                      variant="outline" 
                      size="sm"
                      as={Link}
                      href={`/plans/${plan.id}`}
                      colorScheme="gray"
                    >
                      View Details
                    </Button>
                    <Button
                      colorScheme="brand"
                      size="sm"
                      isDisabled={plan.status !== 'active'}
                      onClick={() => executePlan(plan.id)}
                    >
                      Execute Plan
                    </Button>
                  </HStack>
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
} 