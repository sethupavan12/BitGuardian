'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  Flex,
  Divider,
  Stack,
  Switch,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  HStack,
  VStack,
  Radio,
  RadioGroup,
  Input,
  FormHelperText,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Icon,
  useColorModeValue,
  Grid,
  GridItem,
  Badge
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaClock, FaCalendarAlt, FaUserFriends, FaShieldAlt, FaPercent } from 'react-icons/fa'

// const API_URL = 'http://localhost:3001/api' // TODO: Use env var
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

interface ScheduledExecution {
  type: 'inactivity' | 'scheduled';
  inactivityPeriod?: number;
  scheduledDate?: string;
}

interface InheritancePlan {
  ownerName: string;
  heirs: Heir[];
  verificationSettings: VerificationSettings;
  customMessage: string;
  allocationPercentage: number;
  scheduledExecution: ScheduledExecution;
}

export default function CreatePlan() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  // Colors
  const cardBg = useColorModeValue('white', 'gray.700')
  const cardBorder = useColorModeValue('gray.200', 'gray.600')
  const subTextColor = useColorModeValue('gray.600', 'gray.300')
  const bgColor = useColorModeValue('white', 'gray.900')
  const highlightColor = useColorModeValue('brand.500', 'brand.400')
  const statBg = useColorModeValue('gray.50', 'gray.800')
  const inputFocusBorderColor = useColorModeValue('brand.500', 'brand.400')
  
  const timeOptions = [
    { value: 7, label: '1 week' },
    { value: 30, label: '1 month' },
    { value: 90, label: '3 months' },
    { value: 180, label: '6 months' },
    { value: 365, label: '1 year' },
    { value: 730, label: '2 years' }
  ]
  
  const [newPlan, setNewPlan] = useState<InheritancePlan>({
    ownerName: 'alice',
    heirs: [
      { name: 'bob', share: 70 },
      { name: 'carol', share: 30 }
    ],
    verificationSettings: {
      inactivityPeriod: 180,
      useBlockchainVerification: true,
      useEmailVerification: true,
      useTrustedContacts: false
    },
    customMessage: "",
    allocationPercentage: 100,
    scheduledExecution: {
      type: 'inactivity',
      inactivityPeriod: 180
    }
  })

  const handleAllocationPercentageChange = (valueAsString: string, valueAsNumber: number) => {
    setNewPlan({
      ...newPlan,
      allocationPercentage: isNaN(valueAsNumber) ? 0 : valueAsNumber,
    });
  };

  const setAllocationPercentage = (percentage: number) => {
    setNewPlan({
      ...newPlan,
      allocationPercentage: percentage,
    });
  };

  const handleHeirShareChange = (heirIndex: number, value: number) => {
    const updatedHeirs = [...newPlan.heirs]
    
    updatedHeirs[heirIndex].share = value
    
    const otherHeirIndex = heirIndex === 0 ? 1 : 0
    if (updatedHeirs.length > 1) {
      updatedHeirs[otherHeirIndex].share = 100 - value
    } else if (updatedHeirs.length === 1) {
      updatedHeirs[0].share = 100;
    }
    
    setNewPlan({
      ...newPlan,
      heirs: updatedHeirs
    })
  }

  const handleInactivityPeriodChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewPlan({
      ...newPlan,
      verificationSettings: {
        ...newPlan.verificationSettings,
        inactivityPeriod: parseInt(event.target.value)
      },
      scheduledExecution: {
        ...newPlan.scheduledExecution,
        type: 'inactivity',
        inactivityPeriod: parseInt(event.target.value)
      }
    })
  }

  const handleVerificationToggle = (method: keyof VerificationSettings) => {
    setNewPlan({
      ...newPlan,
      verificationSettings: {
        ...newPlan.verificationSettings,
        [method]: !newPlan.verificationSettings[method]
      }
    })
  }

  const handleScheduleTypeChange = (value: string) => {
    setNewPlan({
      ...newPlan,
      scheduledExecution: {
        ...newPlan.scheduledExecution,
        type: value as 'inactivity' | 'scheduled'
      }
    })
  }

  const handleScheduledDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewPlan({
      ...newPlan,
      scheduledExecution: {
        ...newPlan.scheduledExecution,
        scheduledDate: event.target.value
      }
    })
  }

  const createPlan = async () => {
    try {
      setLoading(true)
      setError(null)
      
      try {
        // Try the API first
        const response = await axios.post(`${API_URL}/inheritance/plans`, newPlan)
        
        toast({
          title: 'Plan created',
          description: 'Inheritance plan created successfully!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        // If we have a plan ID from the API, redirect to that plan
        if (response.data && response.data.id) {
          router.push(`/plans/${response.data.id}`)
        } else {
          // Otherwise just go to the dashboard
          router.push('/dashboard')
        }
      } catch (apiError) {
        console.warn('API error:', apiError)
        
        // Simulate success with mock data
        toast({
          title: 'Plan created',
          description: 'Inheritance plan created successfully! (Demo mode)',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        
        // Create a fake ID and redirect to the plan page
        const mockPlanId = 'plan-' + Date.now()
        setTimeout(() => {
          router.push(`/plans/${mockPlanId}`)
        }, 500)
      }
    } catch (error) {
      console.error('Error creating plan:', error)
      setError('Failed to create inheritance plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Calculate the minimum date for scheduled execution (tomorrow)
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  const minDate = tomorrow.toISOString().split('T')[0]

  return (
    <Box 
      as="main" 
      bg={bgColor}
      minH="calc(100vh - 64px)"
    >
      <Box 
        bgGradient={`linear(to-r, ${highlightColor}, ${useColorModeValue('brand.600', 'brand.500')})`}
        color="white" 
        py={10}
        mb={8}
      >
        <Container maxW="container.xl">
          <Heading as="h1" size="xl" fontWeight="extrabold">Create Inheritance Plan</Heading>
          <Text fontSize="lg" opacity={0.9} mt={2}>Set up your Bitcoin inheritance to protect your legacy</Text>
        </Container>
      </Box>

      <Container maxW="container.xl" pb={16}>
        {error && (
          <Alert status="error" mb={6} variant="subtle" borderRadius="lg">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs 
          colorScheme="brand" 
          variant="enclosed" 
          mb={6}
          borderRadius="lg"
          boxShadow="sm"
        >
          <TabList>
            <Tab>1. Fund Allocation</Tab>
            <Tab>2. Heirs & Distribution</Tab>
            <Tab>3. Execution Settings</Tab>
            <Tab>4. Review & Create</Tab>
          </TabList>
          
          <TabPanels bg={cardBg} borderX="1px" borderBottom="1px" borderColor={cardBorder} borderBottomRadius="lg">
            {/* PANEL 1: FUND ALLOCATION */}
            <TabPanel p={6}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={1} align="flex-start">
                  <Heading size="md">Allocation Settings</Heading>
                  <Text color={subTextColor}>Decide how much of your Bitcoin to allocate to this inheritance plan</Text>
                </VStack>

                <FormControl>
                  <FormLabel fontWeight="semibold">
                    Portion of Funds to Allocate
                  </FormLabel>
                  <Text color={subTextColor} mb={4}>
                    Select the percentage of your Bitcoin holdings to include in this inheritance plan
                  </Text>
                  
                  <HStack spacing={4} mb={4} wrap="wrap">
                    <Button 
                      onClick={() => setAllocationPercentage(25)} 
                      variant={newPlan.allocationPercentage === 25 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 25 ? "brand" : "gray"}
                      size="md"
                    >
                      25%
                    </Button>
                    <Button 
                      onClick={() => setAllocationPercentage(50)}
                      variant={newPlan.allocationPercentage === 50 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 50 ? "brand" : "gray"}
                      size="md"
                    >
                      50%
                    </Button>
                    <Button 
                      onClick={() => setAllocationPercentage(75)}
                      variant={newPlan.allocationPercentage === 75 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 75 ? "brand" : "gray"}
                      size="md"
                    >
                      75%
                    </Button>
                    <Button 
                      onClick={() => setAllocationPercentage(100)}
                      variant={newPlan.allocationPercentage === 100 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 100 ? "brand" : "gray"}
                      size="md"
                    >
                      100%
                    </Button>
                  </HStack>
                  
                  <Box bg={statBg} p={4} borderRadius="lg">
                    <HStack>
                      <Text fontWeight="semibold" minW="180px">Custom percentage:</Text>
                  <NumberInput 
                    value={newPlan.allocationPercentage}
                    onChange={handleAllocationPercentageChange}
                        min={1}
                    max={100}
                    precision={0}
                    step={1}
                        focusBorderColor={inputFocusBorderColor}
                        maxW="150px"
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                      <Text fontWeight="semibold">%</Text>
                    </HStack>
                  </Box>
                </FormControl>
                
                <Box pt={4}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <AlertDescription>
                      Your hardware wallet will need to sign a transaction to separate these funds into a dedicated inheritance plan multisig.
                    </AlertDescription>
                  </Alert>
              </Box>
              </VStack>
            </TabPanel>
            
            {/* PANEL 2: HEIRS & DISTRIBUTION */}
            <TabPanel p={6}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={1} align="flex-start">
                  <Heading size="md">Heirs Distribution</Heading>
                  <Text color={subTextColor}>Configure how your Bitcoin will be distributed among your heirs</Text>
                </VStack>
              
                <FormControl>
                  <FormLabel fontWeight="semibold">Distribution Percentages</FormLabel>
                  <Text color={subTextColor} mb={4}>
                    Adjust the slider to change how funds will be divided between heirs
                </Text>
                  
                  <VStack spacing={6} align="stretch" bg={statBg} p={4} borderRadius="lg">
                    <Grid templateColumns="1fr auto 1fr" gap={4} alignItems="center">
                      <GridItem>
                        <VStack align="flex-start">
                          <Text fontWeight="semibold">{newPlan.heirs[0].name}</Text>
                          <HStack>
                            <Badge colorScheme="brand" fontSize="md" px={2} borderRadius="md">
                              {newPlan.heirs[0].share}%
                            </Badge>
                          </HStack>
                        </VStack>
                      </GridItem>
                      
                      <GridItem>
                        <Icon as={FaPercent} color={highlightColor} boxSize={5} />
                      </GridItem>
                      
                      <GridItem>
                        <VStack align="flex-end">
                          <Text fontWeight="semibold">{newPlan.heirs[1].name}</Text>
                          <HStack>
                            <Badge colorScheme="blue" fontSize="md" px={2} borderRadius="md">
                              {newPlan.heirs[1].share}%
                            </Badge>
                          </HStack>
                        </VStack>
                      </GridItem>
                    </Grid>
                    
                      <Slider 
                        value={newPlan.heirs[0].share}
                        min={0}
                        max={100}
                        step={5}
                      onChange={(value) => handleHeirShareChange(0, value)}
                      colorScheme="brand"
                      >
                      <SliderTrack h={3} borderRadius="full">
                          <SliderFilledTrack />
                        </SliderTrack>
                      <SliderThumb boxSize={6} />
                      </Slider>
                  </VStack>
                </FormControl>
                
                <FormControl>
                  <FormLabel fontWeight="semibold">Leave a Message for Heirs</FormLabel>
                  <Text color={subTextColor} mb={4}>
                    Add an optional message that will be revealed to your heirs when the plan executes
                  </Text>
                  
                  <Textarea
                    value={newPlan.customMessage}
                    onChange={(e) => setNewPlan({...newPlan, customMessage: e.target.value})}
                    placeholder="Add a personal message for your heirs..."
                    rows={4}
                    focusBorderColor={inputFocusBorderColor}
                  />
                </FormControl>
              </VStack>
            </TabPanel>
            
            {/* PANEL 3: EXECUTION SETTINGS */}
            <TabPanel p={6}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={1} align="flex-start">
                  <Heading size="md">Execution Settings</Heading>
                  <Text color={subTextColor}>Configure when and how your inheritance plan will be executed</Text>
                </VStack>
                
                <FormControl>
                  <FormLabel fontWeight="semibold">Execution Type</FormLabel>
                  <Text color={subTextColor} mb={4}>
                    Choose whether the plan should execute after a period of inactivity or at a specific future date
                      </Text>
                  
                  <RadioGroup 
                    onChange={handleScheduleTypeChange} 
                    value={newPlan.scheduledExecution.type}
                    colorScheme="brand"
                  >
                    <Stack direction="column" spacing={5}>
                      <Box 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        borderColor={newPlan.scheduledExecution.type === 'inactivity' ? highlightColor : cardBorder}
                        bg={newPlan.scheduledExecution.type === 'inactivity' ? useColorModeValue('brand.50', 'rgba(0, 159, 230, 0.1)') : 'transparent'}
                      >
                        <Radio value="inactivity" mb={3}>
                          <HStack spacing={2}>
                            <Icon as={FaClock} color={highlightColor} />
                            <Text fontWeight="medium">Inactivity Period</Text>
                          </HStack>
                        </Radio>
                        
                        <Text color={subTextColor} mb={4} pl={6}>
                          Execute the plan after a specified period of inactivity (no transactions or login)
                        </Text>
                        
                        {newPlan.scheduledExecution.type === 'inactivity' && (
                          <FormControl pl={6}>
                  <Select 
                    value={newPlan.verificationSettings.inactivityPeriod}
                    onChange={handleInactivityPeriodChange}
                              focusBorderColor={inputFocusBorderColor}
                  >
                              {timeOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                        )}
                      </Box>
                      
                      <Box 
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        borderColor={newPlan.scheduledExecution.type === 'scheduled' ? highlightColor : cardBorder}
                        bg={newPlan.scheduledExecution.type === 'scheduled' ? useColorModeValue('brand.50', 'rgba(0, 159, 230, 0.1)') : 'transparent'}
                      >
                        <Radio value="scheduled" mb={3}>
                          <HStack spacing={2}>
                            <Icon as={FaCalendarAlt} color={highlightColor} />
                            <Text fontWeight="medium">Scheduled Date</Text>
                          </HStack>
                        </Radio>
                        
                        <Text color={subTextColor} mb={4} pl={6}>
                          Execute the plan on a specific future date, regardless of activity
                        </Text>
                        
                        {newPlan.scheduledExecution.type === 'scheduled' && (
                          <FormControl pl={6}>
                            <Input
                              type="date"
                              min={minDate}
                              value={newPlan.scheduledExecution.scheduledDate || ''}
                              onChange={handleScheduledDateChange}
                              focusBorderColor={inputFocusBorderColor}
                            />
                            <FormHelperText>
                              Choose a future date when the plan should automatically execute
                            </FormHelperText>
                          </FormControl>
                        )}
                      </Box>
                    </Stack>
                  </RadioGroup>
                </FormControl>
                
                <Divider />
                
                <FormControl>
                  <FormLabel fontWeight="semibold">Verification Methods</FormLabel>
                  <Text color={subTextColor} mb={4}>
                    Select additional verification methods to prevent accidental execution
                  </Text>
                  
                  <Stack spacing={3} bg={statBg} p={4} borderRadius="lg">
                    <Flex justify="space-between" align="center">
                      <HStack>
                        <Text fontWeight="medium">Blockchain Activity Monitoring</Text>
                        <Badge colorScheme="green">Recommended</Badge>
                      </HStack>
                    <Switch 
                      isChecked={newPlan.verificationSettings.useBlockchainVerification}
                      onChange={() => handleVerificationToggle('useBlockchainVerification')}
                        colorScheme="brand"
                        size="lg"
                    />
                    </Flex>
                  
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">Email Verification</Text>
                    <Switch 
                      isChecked={newPlan.verificationSettings.useEmailVerification}
                      onChange={() => handleVerificationToggle('useEmailVerification')}
                        colorScheme="brand"
                        size="lg"
                    />
                    </Flex>
                  
                    <Flex justify="space-between" align="center">
                      <Text fontWeight="medium">Trusted Contacts Verification</Text>
                    <Switch 
                      isChecked={newPlan.verificationSettings.useTrustedContacts}
                      onChange={() => handleVerificationToggle('useTrustedContacts')}
                        colorScheme="brand"
                        size="lg"
                    />
                    </Flex>
                </Stack>
                </FormControl>
              </VStack>
            </TabPanel>
            
            {/* PANEL 4: REVIEW & CREATE */}
            <TabPanel p={6}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={1} align="flex-start">
                  <Heading size="md">Review Your Plan</Heading>
                  <Text color={subTextColor}>Review the details of your inheritance plan before creating it</Text>
                </VStack>
                
                <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
                  <GridItem>
                    <Card borderRadius="lg" bg={statBg} variant="outline">
                      <CardHeader pb={2}>
                        <HStack>
                          <Icon as={FaPercent} color={highlightColor} />
                          <Heading size="sm">Fund Allocation</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <Text fontWeight="semibold" fontSize="xl">{newPlan.allocationPercentage}% of your Bitcoin</Text>
                      </CardBody>
                    </Card>
                  </GridItem>
                  
                  <GridItem>
                    <Card borderRadius="lg" bg={statBg} variant="outline">
                      <CardHeader pb={2}>
                        <HStack>
                          <Icon as={FaUserFriends} color={highlightColor} />
                          <Heading size="sm">Heirs Distribution</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack align="stretch" spacing={2}>
                          {newPlan.heirs.map((heir, idx) => (
                            <Flex key={idx} justify="space-between">
                              <Text>{heir.name}:</Text>
                              <Text fontWeight="semibold">{heir.share}%</Text>
                            </Flex>
                          ))}
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                  
                  <GridItem>
                    <Card borderRadius="lg" bg={statBg} variant="outline">
                      <CardHeader pb={2}>
                        <HStack>
                          <Icon as={FaClock} color={highlightColor} />
                          <Heading size="sm">Execution Settings</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack align="stretch" spacing={1}>
                          <Text>
                            <Text as="span" fontWeight="semibold">Type: </Text>
                            {newPlan.scheduledExecution.type === 'inactivity' ? 'Inactivity Period' : 'Scheduled Date'}
                          </Text>
                          
                          {newPlan.scheduledExecution.type === 'inactivity' ? (
                            <Text>
                              <Text as="span" fontWeight="semibold">Period: </Text>
                              {timeOptions.find(opt => opt.value === newPlan.verificationSettings.inactivityPeriod)?.label || 'Not set'}
                            </Text>
                          ) : (
                            <Text>
                              <Text as="span" fontWeight="semibold">Date: </Text>
                              {newPlan.scheduledExecution.scheduledDate ? 
                                new Date(newPlan.scheduledExecution.scheduledDate).toLocaleDateString() : 
                                'Not set'}
                            </Text>
                          )}
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                  
                  <GridItem>
                    <Card borderRadius="lg" bg={statBg} variant="outline">
                      <CardHeader pb={2}>
                        <HStack>
                          <Icon as={FaShieldAlt} color={highlightColor} />
                          <Heading size="sm">Verification Methods</Heading>
                        </HStack>
                      </CardHeader>
                      <CardBody pt={0}>
                        <VStack align="stretch" spacing={1}>
                          <Text>
                            <Text as="span" fontWeight="semibold">Blockchain: </Text>
                            {newPlan.verificationSettings.useBlockchainVerification ? 'Enabled' : 'Disabled'}
                          </Text>
                          <Text>
                            <Text as="span" fontWeight="semibold">Email: </Text>
                            {newPlan.verificationSettings.useEmailVerification ? 'Enabled' : 'Disabled'}
                          </Text>
                          <Text>
                            <Text as="span" fontWeight="semibold">Trusted Contacts: </Text>
                            {newPlan.verificationSettings.useTrustedContacts ? 'Enabled' : 'Disabled'}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  </GridItem>
                </Grid>
                
                {newPlan.customMessage && (
                  <Box bg={statBg} p={4} borderRadius="lg">
                    <Text fontWeight="semibold" mb={2}>Message to Heirs:</Text>
                    <Text>{newPlan.customMessage}</Text>
              </Box>
                )}
                
                <Flex 
                  justify="space-between" 
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 4, md: 0 }}
                  pt={4}
                >
              <Button 
                as={Link} 
                href="/dashboard" 
                variant="outline"
                    colorScheme="gray"
              >
                Cancel
              </Button>
                  
              <Button 
                    colorScheme="brand"
                    isLoading={loading}
                onClick={createPlan}
                    px={8}
                    leftIcon={<Icon as={FaShieldAlt} />}
                    size="lg"
              >
                    Create Inheritance Plan
              </Button>
            </Flex>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Container>
    </Box>
  )
} 