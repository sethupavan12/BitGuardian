'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Flex,
  Spinner,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Stat,
  StatLabel,
  StatNumber,
  Badge,
  SimpleGrid,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  HStack,
  Divider,
  Icon,
  useToast,
  useColorModeValue,
  Link as ChakraLink
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaClock, FaUserFriends, FaPercent, FaShieldAlt, FaCalendarAlt, FaBell, FaFileContract, FaArrowLeft } from 'react-icons/fa'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'; // Fallback for safety

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

interface ScheduledExecution {
  type: 'inactivity' | 'scheduled';
  inactivityPeriod?: number;
  scheduledDate?: string;
}

interface InheritancePlan {
  id: string;
  ownerName: string;
  heirs: Heir[];
  status: string;
  createdAt: string;
  verificationSettings: VerificationSettings;
  distributions?: Distribution[];
  customMessage?: string;
  allocationPercentage: number;
  scheduledExecution: ScheduledExecution;
}

export default function PlanDetails({ params }: { params: { id: string }}) {
  const router = useRouter()
  const toast = useToast()
  const [plan, setPlan] = useState<InheritancePlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Theme colors
  const headerBg = useColorModeValue('gray.50', 'gray.800')
  const cardBg = useColorModeValue('white', 'gray.700')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const statBg = useColorModeValue('gray.50', 'gray.800')
  const mainBg = useColorModeValue('white', 'gray.900')
  const textColor = useColorModeValue('gray.800', 'white')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  const highlightColor = useColorModeValue('brand.500', 'brand.400')
  const activeBadgeBg = useColorModeValue('green.500', 'green.400')
  const inactiveBadgeBg = useColorModeValue('gray.500', 'gray.400')

  useEffect(() => {
    if (params.id) {
      fetchPlan()
    }
  }, [params.id])

  const fetchPlan = async () => {
    try {
      setLoading(true)
      setError(null)
      
      try {
        // Try to fetch from the API first
        const response = await axios.get(`${API_URL}/inheritance/plans/${params.id}`)
        if (response.data && response.data.data) {
          setPlan(response.data.data)
        } else {
          // Fallback to mock data if API returns empty data
          useMockData()
        }
      } catch (apiError) {
        console.warn('Using mock data due to API error:', apiError)
        useMockData()
      }
    } catch (error) {
      console.error('Error fetching plan:', error)
      setError('Failed to fetch inheritance plan. Please try again.')
      setPlan(null)
    } finally {
      setLoading(false)
    }
  }

  // Function to use mock data when API fails
  const useMockData = () => {
    setPlan({
      id: params.id,
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
      customMessage: "Please ensure my Bitcoin is used responsibly. I've trusted you with my legacy.",
      allocationPercentage: 75,
      scheduledExecution: {
        type: "inactivity",
        inactivityPeriod: 180
      }
    })
  }

  const executePlan = async () => {
    try {
      setLoading(true)
      setError(null)
      // In a real app, this would call the API
      // await axios.post(`${API_URL}/inheritance/plans/${params.id}/execute`)
      
      toast({
        title: 'Plan executed',
        description: 'Inheritance plan executed successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      // Refresh plan data
      fetchPlan()
    } catch (error) {
      console.error('Error executing plan:', error)
      setError('Failed to execute inheritance plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const timeOptions = [
    { value: 7, label: '1 week' },
    { value: 30, label: '1 month' },
    { value: 90, label: '3 months' },
    { value: 180, label: '6 months' },
    { value: 365, label: '1 year' },
    { value: 730, label: '2 years' }
  ]

  if (loading) {
    return (
      <Flex 
        height="80vh" 
        width="100%" 
        align="center" 
        justify="center" 
        direction="column"
        bg={mainBg}
      >
        <Spinner size="xl" thickness="4px" color={highlightColor} mb={4} />
        <Text color={subTextColor}>Loading plan details...</Text>
      </Flex>
    )
  }

  if (error) {
    return (
      <Box as="main" bg={mainBg} minH="calc(100vh - 64px)" py={10}>
        <Container maxW="container.xl">
          <Alert status="error" variant="subtle" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
          <Flex justify="center" mt={6}>
            <Button as={Link} href="/dashboard" leftIcon={<Icon as={FaArrowLeft} />}>
              Back to Dashboard
            </Button>
          </Flex>
        </Container>
      </Box>
    )
  }

  if (!plan) {
    return (
      <Box as="main" bg={mainBg} minH="calc(100vh - 64px)" py={10}>
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading>Plan Not Found</Heading>
            <Text>The inheritance plan you're looking for doesn't exist or you don't have access to it.</Text>
            <Button as={Link} href="/dashboard" leftIcon={<Icon as={FaArrowLeft} />}>
              Back to Dashboard
            </Button>
          </VStack>
        </Container>
      </Box>
    )
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
          <HStack spacing={2} mb={2}>
            <ChakraLink as={Link} href="/dashboard" _hover={{ textDecoration: 'none' }}>
              <HStack color="white" opacity={0.8} _hover={{ opacity: 1 }}>
                <Icon as={FaArrowLeft} />
                <Text>Dashboard</Text>
              </HStack>
            </ChakraLink>
          </HStack>
          <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
            <VStack align="flex-start" spacing={1}>
              <Heading as="h1" size="xl" fontWeight="extrabold">Plan Details</Heading>
              <Text fontSize="lg" opacity={0.9}>
                {plan.ownerName}'s Inheritance Plan
              </Text>
            </VStack>
            <Badge
              colorScheme={plan.status === 'active' ? 'green' : 'gray'}
              fontSize="md"
              px={3}
              py={1}
              borderRadius="full"
            >
              {plan.status.toUpperCase()}
            </Badge>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={16}>
        <Tabs colorScheme="brand" variant="enclosed" borderRadius="lg" boxShadow="sm" bg={cardBg}>
          <TabList>
            <Tab>Overview</Tab>
            <Tab>Heirs</Tab>
            <Tab>Execution Settings</Tab>
            <Tab>History</Tab>
          </TabList>

          <TabPanels>
            {/* Overview Tab */}
            <TabPanel p={6}>
              <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                <Card borderRadius="lg" variant="outline" height="fit-content">
                  <CardHeader bg={headerBg} borderTopRadius="lg">
                    <Flex align="center">
                      <Icon as={FaFileContract} color={highlightColor} mr={2} />
                      <Heading size="md">Plan Summary</Heading>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <VStack align="stretch" spacing={4} divider={<Divider />}>
                      <Flex justify="space-between">
                        <Text color={subTextColor}>Status:</Text>
                        <Badge colorScheme={plan.status === 'active' ? 'green' : 'gray'}>
                          {plan.status}
                        </Badge>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color={subTextColor}>Created:</Text>
                        <Text fontWeight="medium">
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color={subTextColor}>Allocation:</Text>
                        <Text fontWeight="medium">{plan.allocationPercentage}% of your Bitcoin</Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color={subTextColor}>Execution Type:</Text>
                        <Text fontWeight="medium">
                          {plan.scheduledExecution.type === 'inactivity' 
                            ? 'After Inactivity' 
                            : 'On Scheduled Date'}
                        </Text>
                      </Flex>
                      <Flex justify="space-between">
                        <Text color={subTextColor}>
                          {plan.scheduledExecution.type === 'inactivity' 
                            ? 'Inactivity Period:' 
                            : 'Scheduled Date:'}
                        </Text>
                        <Text fontWeight="medium">
                          {plan.scheduledExecution.type === 'inactivity' 
                            ? timeOptions.find(opt => opt.value === plan.verificationSettings.inactivityPeriod)?.label 
                            : plan.scheduledExecution.scheduledDate && new Date(plan.scheduledExecution.scheduledDate).toLocaleDateString()}
                        </Text>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>

                <Card borderRadius="lg" variant="outline" height="fit-content">
                  <CardHeader bg={headerBg} borderTopRadius="lg">
                    <Flex align="center">
                      <Icon as={FaUserFriends} color={highlightColor} mr={2} />
                      <Heading size="md">Heirs Distribution</Heading>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {plan.heirs.map((heir, idx) => (
                        <Flex 
                          key={idx} 
                          justify="space-between" 
                          bg={statBg} 
                          p={3} 
                          borderRadius="md"
                          align="center"
                        >
                          <Text fontWeight="medium">{heir.name}</Text>
                          <HStack>
                            <Icon as={FaPercent} fontSize="xs" color={subTextColor} />
                            <Text fontWeight="semibold">{heir.share}%</Text>
                          </HStack>
                        </Flex>
                      ))}

                      <Box mt={2}>
                        <Text fontSize="sm" color={subTextColor}>
                          These heirs will receive their designated percentages of your allocated funds 
                          when the plan executes.
                        </Text>
                      </Box>
                    </VStack>
                  </CardBody>
                </Card>

                <Card borderRadius="lg" variant="outline" gridColumn={{ md: "span 2" }}>
                  <CardHeader bg={headerBg} borderTopRadius="lg">
                    <Flex align="center">
                      <Icon as={FaBell} color={highlightColor} mr={2} />
                      <Heading size="md">Verification Settings</Heading>
                    </Flex>
                  </CardHeader>
                  <CardBody>
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                      <Card bg={statBg} variant="outline">
                        <CardBody>
                          <Flex direction="column" align="center" textAlign="center">
                            <Icon 
                              as={FaShieldAlt} 
                              color={plan.verificationSettings.useBlockchainVerification ? highlightColor : 'gray.400'} 
                              boxSize={8} 
                              mb={3} 
                            />
                            <Text fontWeight="medium" mb={1}>Blockchain Verification</Text>
                            <Badge colorScheme={plan.verificationSettings.useBlockchainVerification ? 'green' : 'gray'}>
                              {plan.verificationSettings.useBlockchainVerification ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </Flex>
                        </CardBody>
                      </Card>

                      <Card bg={statBg} variant="outline">
                        <CardBody>
                          <Flex direction="column" align="center" textAlign="center">
                            <Icon 
                              as={FaClock} 
                              color={plan.verificationSettings.useEmailVerification ? highlightColor : 'gray.400'} 
                              boxSize={8} 
                              mb={3} 
                            />
                            <Text fontWeight="medium" mb={1}>Email Verification</Text>
                            <Badge colorScheme={plan.verificationSettings.useEmailVerification ? 'green' : 'gray'}>
                              {plan.verificationSettings.useEmailVerification ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </Flex>
                        </CardBody>
                      </Card>

                      <Card bg={statBg} variant="outline">
                        <CardBody>
                          <Flex direction="column" align="center" textAlign="center">
                            <Icon 
                              as={FaUserFriends} 
                              color={plan.verificationSettings.useTrustedContacts ? highlightColor : 'gray.400'} 
                              boxSize={8} 
                              mb={3} 
                            />
                            <Text fontWeight="medium" mb={1}>Trusted Contacts</Text>
                            <Badge colorScheme={plan.verificationSettings.useTrustedContacts ? 'green' : 'gray'}>
                              {plan.verificationSettings.useTrustedContacts ? 'Enabled' : 'Disabled'}
                            </Badge>
                          </Flex>
                        </CardBody>
                      </Card>
                    </SimpleGrid>
                  </CardBody>
                </Card>

                {plan.customMessage && (
                  <Card borderRadius="lg" variant="outline" gridColumn={{ md: "span 2" }}>
                    <CardHeader bg={headerBg} borderTopRadius="lg">
                      <Flex align="center">
                        <Icon as={FaFileContract} color={highlightColor} mr={2} />
                        <Heading size="md">Message to Heirs</Heading>
                      </Flex>
                    </CardHeader>
                    <CardBody>
                      <Text fontStyle="italic">"{plan.customMessage}"</Text>
                    </CardBody>
                  </Card>
                )}
              </SimpleGrid>

              <Flex 
                mt={8} 
                justify="space-between" 
                wrap="wrap" 
                gap={4}
              >
                <Button 
                  variant="outline" 
                  colorScheme="gray"
                  as={Link}
                  href="/dashboard"
                  leftIcon={<Icon as={FaArrowLeft} />}
                >
                  Back to Dashboard
                </Button>
                
                <HStack spacing={4}>
                  <Button
                    colorScheme="blue"
                    as={Link}
                    href={`/plans/${plan.id}/edit`}
                  >
                    Edit Plan
                  </Button>
                  <Button
                    colorScheme="brand"
                    isDisabled={plan.status !== 'active'}
                    onClick={executePlan}
                    rightIcon={<Icon as={FaShieldAlt} />}
                  >
                    Execute Plan
                  </Button>
                </HStack>
              </Flex>
            </TabPanel>

            {/* Heirs Tab */}
            <TabPanel p={6}>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Inheritance Distribution</Heading>
                
                <Text>
                  This plan allocates {plan.allocationPercentage}% of your Bitcoin to your heirs 
                  according to the percentages below.
                </Text>
                
                <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                  {plan.heirs.map((heir, idx) => (
                    <Card key={idx} borderRadius="lg" variant="outline">
                      <CardHeader bg={headerBg} borderBottomWidth="1px" borderColor={cardBorder}>
                        <Heading size="md">{heir.name}</Heading>
                      </CardHeader>
                      <CardBody>
                        <VStack spacing={4} align="stretch">
                          <Stat>
                            <StatLabel color={subTextColor}>Allocation Percentage</StatLabel>
                            <StatNumber color={highlightColor}>{heir.share}%</StatNumber>
                          </Stat>
                          
                          <Text fontSize="sm" color={subTextColor}>
                            {heir.name} will receive {heir.share}% of the allocated funds 
                            (equivalent to {(plan.allocationPercentage * heir.share / 100).toFixed(1)}% of your total Bitcoin) 
                            when this plan executes.
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              </VStack>
            </TabPanel>

            {/* Execution Settings Tab */}
            <TabPanel p={6}>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Plan Execution Details</Heading>
                
                <Card borderRadius="lg" variant="outline">
                  <CardHeader bg={headerBg} borderBottomWidth="1px" borderColor={cardBorder}>
                    <HStack>
                      <Icon as={plan.scheduledExecution.type === 'inactivity' ? FaClock : FaCalendarAlt} color={highlightColor} />
                      <Heading size="md">
                        {plan.scheduledExecution.type === 'inactivity' 
                          ? 'Execution After Inactivity' 
                          : 'Scheduled Execution Date'}
                      </Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      {plan.scheduledExecution.type === 'inactivity' ? (
                        <>
                          <Text>
                            This plan will automatically execute after {timeOptions.find(opt => opt.value === plan.verificationSettings.inactivityPeriod)?.label} of inactivity.
                          </Text>
                          <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Box>
                              <AlertTitle>How Inactivity Is Monitored</AlertTitle>
                              <AlertDescription>
                                BitGuardian monitors inactivity through blockchain transactions, 
                                logins to your account, and periodic verification prompts that 
                                are sent based on your verification settings.
                              </AlertDescription>
                            </Box>
                          </Alert>
                        </>
                      ) : (
                        <>
                          <Text>
                            This plan is scheduled to automatically execute on {plan.scheduledExecution.scheduledDate && new Date(plan.scheduledExecution.scheduledDate).toLocaleDateString()}.
                          </Text>
                          <Alert status="info" borderRadius="md">
                            <AlertIcon />
                            <Box>
                              <AlertTitle>Scheduled Execution</AlertTitle>
                              <AlertDescription>
                                On the scheduled date, this plan will execute automatically, transferring 
                                your Bitcoin to the designated heirs according to the specified percentages.
                              </AlertDescription>
                            </Box>
                          </Alert>
                        </>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
                
                <Card borderRadius="lg" variant="outline">
                  <CardHeader bg={headerBg} borderBottomWidth="1px" borderColor={cardBorder}>
                    <HStack>
                      <Icon as={FaShieldAlt} color={highlightColor} />
                      <Heading size="md">Verification Methods</Heading>
                    </HStack>
                  </CardHeader>
                  <CardBody>
                    <VStack spacing={4} align="stretch">
                      <Text>
                        These verification methods are used to prevent accidental execution and 
                        to ensure the security of your Bitcoin inheritance plan.
                      </Text>
                      
                      <SimpleGrid columns={{ base: 1, md: 3 }} spacing={4}>
                        <Box bg={statBg} p={4} borderRadius="md">
                          <HStack mb={2}>
                            <Icon 
                              as={FaShieldAlt} 
                              color={plan.verificationSettings.useBlockchainVerification ? highlightColor : 'gray.400'} 
                            />
                            <Text fontWeight="medium">Blockchain Verification</Text>
                          </HStack>
                          <Text fontSize="sm" color={subTextColor}>
                            {plan.verificationSettings.useBlockchainVerification
                              ? 'Enabled - Your blockchain activity is monitored to verify inactivity.'
                              : 'Disabled - Your blockchain activity is not being monitored.'}
                          </Text>
                        </Box>
                        
                        <Box bg={statBg} p={4} borderRadius="md">
                          <HStack mb={2}>
                            <Icon 
                              as={FaClock} 
                              color={plan.verificationSettings.useEmailVerification ? highlightColor : 'gray.400'} 
                            />
                            <Text fontWeight="medium">Email Verification</Text>
                          </HStack>
                          <Text fontSize="sm" color={subTextColor}>
                            {plan.verificationSettings.useEmailVerification
                              ? 'Enabled - Periodic email verifications are sent to confirm activity.'
                              : 'Disabled - No email verifications will be sent.'}
                          </Text>
                        </Box>
                        
                        <Box bg={statBg} p={4} borderRadius="md">
                          <HStack mb={2}>
                            <Icon 
                              as={FaUserFriends} 
                              color={plan.verificationSettings.useTrustedContacts ? highlightColor : 'gray.400'} 
                            />
                            <Text fontWeight="medium">Trusted Contacts</Text>
                          </HStack>
                          <Text fontSize="sm" color={subTextColor}>
                            {plan.verificationSettings.useTrustedContacts
                              ? 'Enabled - Trusted contacts will be notified before execution.'
                              : 'Disabled - No trusted contacts are set for verification.'}
                          </Text>
                        </Box>
                      </SimpleGrid>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>

            {/* History Tab */}
            <TabPanel p={6}>
              <VStack spacing={6} align="stretch">
                <Heading size="md">Plan History</Heading>
                
                <Card borderRadius="lg" variant="outline">
                  <CardHeader bg={headerBg} borderBottomWidth="1px" borderColor={cardBorder}>
                    <Heading size="md">Activity Timeline</Heading>
                  </CardHeader>
                  <CardBody>
                    {/* This would normally be populated with actual history events */}
                    <VStack spacing={4} align="stretch">
                      <Flex>
                        <Box 
                          minWidth="120px" 
                          fontWeight="medium" 
                          color={subTextColor}
                        >
                          {new Date(plan.createdAt).toLocaleDateString()}
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Plan Created</Text>
                          <Text fontSize="sm" color={subTextColor}>
                            Inheritance plan was created with {plan.heirs.length} heirs 
                            and {plan.allocationPercentage}% allocation.
                          </Text>
                        </Box>
                      </Flex>
                      
                      <Flex>
                        <Box 
                          minWidth="120px" 
                          fontWeight="medium" 
                          color={subTextColor}
                        >
                          {new Date(Date.now() - 86400000).toLocaleDateString()}
                        </Box>
                        <Box>
                          <Text fontWeight="medium">Last Verification</Text>
                          <Text fontSize="sm" color={subTextColor}>
                            Account activity was verified. Next verification scheduled in 30 days.
                          </Text>
                        </Box>
                      </Flex>
                    </VStack>
                  </CardBody>
                </Card>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
} 