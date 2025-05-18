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
  useToast
} from '@chakra-ui/react'
import Link from 'next/link'

// Icons from @chakra-ui/icons
import { RepeatIcon } from '@chakra-ui/icons'

const API_URL = 'http://localhost:3000/api'

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
}

export default function Dashboard() {
  const [plans, setPlans] = useState<InheritancePlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  useEffect(() => {
    fetchPlans()
  }, [])

  const fetchPlans = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_URL}/inheritance/plans`)
      setPlans(response.data.data)
    } catch (error) {
      console.error('Error fetching plans:', error)
      setError('Failed to fetch inheritance plans. Please try again.')
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
    <Box as="main">
      <Box 
        bg="brand.500" 
        color="white" 
        py={4} 
        mb={8}
      >
        <Container maxW="container.lg">
          <Heading as="h1" size="xl">Dashboard</Heading>
          <Text fontSize="lg">Manage your inheritance plans</Text>
        </Container>
      </Box>

      <Container maxW="container.lg">
        <Flex justify="space-between" align="center" mb={6}>
          <Heading as="h2" size="lg">Your Inheritance Plans</Heading>
          <Flex gap={2}>
            <Button
              as={Link}
              href="/create"
              colorScheme="green"
            >
              Create New Plan
            </Button>
            <IconButton
              icon={<RepeatIcon />}
              aria-label="Refresh plans"
              onClick={fetchPlans}
              isLoading={loading}
            />
          </Flex>
        </Flex>

        {error && (
          <Alert status="error" mb={6}>
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading && plans.length === 0 ? (
          <Flex justify="center" py={10}>
            <Spinner size="xl" />
          </Flex>
        ) : plans.length === 0 ? (
          <Box
            p={10}
            textAlign="center"
            borderWidth="1px"
            borderRadius="lg"
          >
            <Text fontSize="xl" mb={4}>No inheritance plans found</Text>
            <Button
              as={Link}
              href="/create"
              colorScheme="blue"
            >
              Create Your First Plan
            </Button>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {plans.map((plan) => (
              <Card key={plan.id}>
                <CardHeader bg="gray.50">
                  <Flex justify="space-between" align="center">
                    <Heading size="md">{plan.ownerName}'s Plan</Heading>
                    <Badge
                      colorScheme={plan.status === 'active' ? 'green' : 'gray'}
                    >
                      {plan.status}
                    </Badge>
                  </Flex>
                </CardHeader>
                <CardBody>
                  <Text mb={2}>
                    Created: {new Date(plan.createdAt).toLocaleString()}
                  </Text>
                  <Divider my={3} />
                  <StatGroup>
                    <Stat>
                      <StatLabel>Inactivity Period</StatLabel>
                      <StatNumber>
                        {plan.verificationSettings?.inactivityPeriod 
                          ? `${Math.floor(plan.verificationSettings.inactivityPeriod)} days` 
                          : 'Not set'}
                      </StatNumber>
                    </Stat>
                    <Stat>
                      <StatLabel>Heirs</StatLabel>
                      <StatNumber>{plan.heirs?.length || 0}</StatNumber>
                    </Stat>
                  </StatGroup>
                  
                  <Box mt={4}>
                    <Text fontWeight="bold" mb={1}>Heirs Distribution:</Text>
                    {plan.heirs?.map((heir, idx) => (
                      <Flex key={idx} justify="space-between">
                        <Text>{heir.name}:</Text>
                        <Text>{heir.share}%</Text>
                      </Flex>
                    ))}
                  </Box>
                  
                  {plan.distributions && plan.distributions.length > 0 && (
                    <Box mt={4}>
                      <Text fontWeight="bold" mb={1}>Executed Distributions:</Text>
                      {plan.distributions.map((dist, idx) => (
                        <Box 
                          key={idx}
                          p={2}
                          bg="gray.50"
                          borderRadius="md"
                          mt={2}
                        >
                          <Flex justify="space-between">
                            <Text fontWeight="bold">{dist.heir}</Text>
                            <Badge colorScheme="green">{dist.amount} sats</Badge>
                          </Flex>
                          <Text fontSize="sm" mt={1}>
                            Address: <Box as="span" fontFamily="monospace">{dist.address}</Box>
                          </Text>
                          <Text fontSize="sm">
                            Tx: <Box as="span" fontFamily="monospace">{dist.txid?.substring(0, 10)}...</Box>
                          </Text>
                        </Box>
                      ))}
                    </Box>
                  )}
                </CardBody>
                
                <CardFooter>
                  {plan.status === 'active' && (
                    <Button
                      colorScheme="purple"
                      onClick={() => executePlan(plan.id)}
                      isLoading={loading}
                      w="full"
                    >
                      Execute Inheritance (Demo)
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Container>
    </Box>
  )
} 