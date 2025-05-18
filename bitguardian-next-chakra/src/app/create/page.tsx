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
  useColorModeValue,
} from '@chakra-ui/react'
import Link from 'next/link'

// const API_URL = 'http://localhost:3000/api' // TODO: Use env var
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

interface InheritancePlan {
  ownerName: string;
  heirs: Heir[];
  verificationSettings: VerificationSettings;
  customMessage: string;
  allocationPercentage: number;
}

export default function CreatePlan() {
  const router = useRouter()
  const toast = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
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

  const createPlan = async () => {
    try {
      setLoading(true)
      setError(null)
      await axios.post(`${API_URL}/inheritance/plans`, newPlan)
      
      toast({
        title: 'Plan created',
        description: 'Inheritance plan created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
      
      router.push('/dashboard')
    } catch (error) {
      console.error('Error creating plan:', error)
      setError('Failed to create inheritance plan. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box 
      as="main" 
      bg={useColorModeValue('light.background', 'dark.background')} 
      color={useColorModeValue('light.text', 'dark.text')}
      minH="100vh"
    >
      <Box 
        bg={useColorModeValue('light.primary', 'dark.primary')} 
        color={useColorModeValue('white', 'dark.text')}
        py={4} 
        mb={8}
      >
        <Container maxW="container.lg">
          <Heading as="h1" size="xl">Create Inheritance Plan</Heading>
          <Text fontSize="lg" color={useColorModeValue('gray.100', 'dark.textSecondary')}>Set up your Bitcoin inheritance</Text>
        </Container>
      </Box>

      <Container maxW="container.lg" pb={10}>
        {error && (
          <Alert status="error" mb={6} variant="subtle">
            <AlertIcon />
            <AlertTitle>Error!</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card mb={6} bg={useColorModeValue('light.surface', 'dark.surface')} variant="outline" borderColor={useColorModeValue('light.border', 'dark.border')}>
          <CardHeader borderBottom="1px" borderColor={useColorModeValue('light.border', 'dark.border')}>
            <Heading size="md">Configure Inheritance Distribution</Heading>
          </CardHeader>
          <CardBody>
            <Stack spacing={6}>
              <Box>
                <FormControl>
                  <FormLabel fontWeight="bold" mb={3}>
                    Portion of Funds to Allocate
                  </FormLabel>
                  <HStack spacing={4} mb={2}>
                    <Button 
                      onClick={() => setAllocationPercentage(25)} 
                      variant={newPlan.allocationPercentage === 25 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 25 ? "primary" : "gray"}
                    >
                      25%
                    </Button>
                    <Button 
                      onClick={() => setAllocationPercentage(50)}
                      variant={newPlan.allocationPercentage === 50 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 50 ? "primary" : "gray"}
                    >
                      50%
                    </Button>
                    <Button 
                      onClick={() => setAllocationPercentage(75)}
                      variant={newPlan.allocationPercentage === 75 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 75 ? "primary" : "gray"}
                    >
                      75%
                    </Button>
                    <Button 
                      onClick={() => setAllocationPercentage(100)}
                      variant={newPlan.allocationPercentage === 100 ? "solid" : "outline"}
                      colorScheme={newPlan.allocationPercentage === 100 ? "primary" : "gray"}
                    >
                      100%
                    </Button>
                  </HStack>
                  <NumberInput 
                    value={newPlan.allocationPercentage}
                    onChange={handleAllocationPercentageChange}
                    min={0}
                    max={100}
                    precision={0}
                    step={1}
                    borderColor={useColorModeValue('light.border', 'dark.border')}
                    _hover={{ borderColor: useColorModeValue('light.primary', 'dark.primary')}}
                    focusBorderColor={useColorModeValue('light.primary', 'dark.primary')}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>
                  <Text fontSize="sm" mt={1} color={useColorModeValue('light.textSecondary', 'dark.textSecondary')}>
                    Specify the percentage of your total available funds to include in this inheritance plan.
                  </Text>
                </FormControl>
              </Box>

              <Divider borderColor={useColorModeValue('light.border', 'dark.border')} />
              
              <Box>
                <Text fontWeight="bold" mb={3}>Heir Distribution</Text>
                <Text fontSize="sm" mb={3} color={useColorModeValue('light.textSecondary', 'dark.textSecondary')}>
                  Define how the allocated funds ({newPlan.allocationPercentage}%) will be distributed among your heirs.
                </Text>
                <Stack spacing={4}>
                  {newPlan.heirs.length > 0 && (
                  <Box>
                    <Flex justify="space-between" mb={2}>
                      <Text>{newPlan.heirs[0].name}: {newPlan.heirs[0].share}%</Text>
                      {newPlan.heirs.length > 1 && <Text>{newPlan.heirs[1].name}: {newPlan.heirs[1].share}%</Text>}
                    </Flex>
                    {newPlan.heirs.length > 1 ? (
                      <Slider 
                        value={newPlan.heirs[0].share}
                        onChange={(value) => handleHeirShareChange(0, value)}
                        min={0}
                        max={100}
                        step={5}
                        colorScheme="primary"
                      >
                        <SliderTrack bg={useColorModeValue('gray.200', 'gray.600')}>
                          <SliderFilledTrack />
                        </SliderTrack>
                        <SliderThumb boxSize={6}>
                            <Box color="primary.500" />
                        </SliderThumb>
                      </Slider>
                    ) : (
                      <Text fontStyle="italic" color={useColorModeValue('light.textSecondary', 'dark.textSecondary')}>
                        {newPlan.heirs[0].name} will receive 100% of the allocated funds.
                      </Text>
                    )}
                  </Box>
                  )}
                </Stack>
              </Box>

              <Divider borderColor={useColorModeValue('light.border', 'dark.border')} />

              <Box>
                <Text fontWeight="bold" mb={3}>Verification Settings</Text>
                <FormControl mb={4}>
                  <FormLabel>Inactivity Period</FormLabel>
                  <Select 
                    value={newPlan.verificationSettings.inactivityPeriod}
                    onChange={handleInactivityPeriodChange}
                    borderColor={useColorModeValue('light.border', 'dark.border')}
                    _hover={{ borderColor: useColorModeValue('light.primary', 'dark.primary')}}
                    focusBorderColor={useColorModeValue('light.primary', 'dark.primary')}
                  >
                    {timeOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <Text mb={2}>Verification Methods</Text>
                <Stack spacing={2}>
                  <FormControl display="flex" alignItems="center">
                    <Switch 
                      id="blockchain-verification"
                      isChecked={newPlan.verificationSettings.useBlockchainVerification}
                      onChange={() => handleVerificationToggle('useBlockchainVerification')}
                      mr={3}
                      colorScheme="primary"
                    />
                    <FormLabel htmlFor="blockchain-verification" mb={0}>
                      Blockchain Activity
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Switch 
                      id="email-verification"
                      isChecked={newPlan.verificationSettings.useEmailVerification}
                      onChange={() => handleVerificationToggle('useEmailVerification')}
                      mr={3}
                      colorScheme="primary"
                    />
                    <FormLabel htmlFor="email-verification" mb={0}>
                      Email Verification
                    </FormLabel>
                  </FormControl>
                  
                  <FormControl display="flex" alignItems="center">
                    <Switch 
                      id="trusted-contacts"
                      isChecked={newPlan.verificationSettings.useTrustedContacts}
                      onChange={() => handleVerificationToggle('useTrustedContacts')}
                      mr={3}
                      colorScheme="primary"
                    />
                    <FormLabel htmlFor="trusted-contacts" mb={0}>
                      Trusted Contacts
                    </FormLabel>
                  </FormControl>
                </Stack>
              </Box>

              <Box>
                <FormControl>
                  <FormLabel>Custom Message to Heirs (Optional)</FormLabel>
                  <Textarea
                    value={newPlan.customMessage}
                    onChange={(e) => setNewPlan({...newPlan, customMessage: e.target.value})}
                    placeholder="Add a personal message to your heirs..."
                    rows={3}
                  />
                </FormControl>
              </Box>
            </Stack>
          </CardBody>
          <CardFooter borderTop="1px" borderColor={useColorModeValue('light.border', 'dark.border')}>
            <Flex justify="space-between" w="full">
              <Button 
                as={Link} 
                href="/dashboard" 
                variant="outline"
                borderColor={useColorModeValue('light.border', 'dark.border')}
              >
                Cancel
              </Button>
              <Button 
                colorScheme="primary"
                onClick={createPlan}
                isLoading={loading}
              >
                Create Plan
              </Button>
            </Flex>
          </CardFooter>
        </Card>
      </Container>
    </Box>
  )
} 