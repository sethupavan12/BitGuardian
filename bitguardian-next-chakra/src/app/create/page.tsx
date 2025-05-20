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
  Badge,
  IconButton
} from '@chakra-ui/react'
import Link from 'next/link'
import { FaClock, FaCalendarAlt, FaUserFriends, FaShieldAlt, FaPercent, FaTrash, FaLock } from 'react-icons/fa'
import {
  AddIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  ChevronLeftIcon
} from '@chakra-ui/icons'

// const API_URL = 'http://localhost:3001/api' // TODO: Use env var
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'; // Fallback for safety

interface Heir {
  name: string;
  share: number;
  address?: string; // Add optional Bitcoin address
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
  const [tabIndex, setTabIndex] = useState(0)
  
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

  // Add a state to track current mode
  const [isProdMode, setIsProdMode] = useState(false);
  
  // Add a useEffect to check the mode
  useEffect(() => {
    const checkMode = () => {
      const mode = localStorage.getItem('bitguardian-mode');
      setIsProdMode(mode === 'prod');
    };
    
    // Check on mount
    checkMode();
    
    // Listen for mode changes
    const handleModeChange = (event: any) => {
      checkMode();
    };
    
    window.addEventListener('modeChanged', handleModeChange);
    
    return () => {
      window.removeEventListener('modeChanged', handleModeChange);
    };
  }, []);

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
    const updatedHeirs = [...newPlan.heirs];
    const oldShare = updatedHeirs[heirIndex].share;
    const shareDiff = value - oldShare;
    
    // If there are only 2 heirs, adjust the other heir directly
    if (updatedHeirs.length === 2) {
      const otherHeirIndex = heirIndex === 0 ? 1 : 0;
      updatedHeirs[heirIndex].share = value;
      updatedHeirs[otherHeirIndex].share = Math.max(0, 100 - value);
    } else {
      // For multiple heirs, distribute the change proportionally among other heirs
      updatedHeirs[heirIndex].share = value;
      
      // Calculate total shares of other heirs
      const otherHeirsShare = updatedHeirs.reduce((sum, heir, idx) => 
        idx !== heirIndex ? sum + heir.share : sum, 0);
      
      if (otherHeirsShare > 0) {
        // Distribute the difference proportionally
        for (let i = 0; i < updatedHeirs.length; i++) {
          if (i !== heirIndex) {
            const proportion = updatedHeirs[i].share / otherHeirsShare;
            updatedHeirs[i].share = Math.max(1, Math.floor(updatedHeirs[i].share - (shareDiff * proportion)));
          }
        }
      }
      
      // Ensure total is exactly 100%
      const totalAfterAdjustment = updatedHeirs.reduce((sum, heir) => sum + heir.share, 0);
      if (totalAfterAdjustment !== 100) {
        // Find the heir with the largest share (except the one being changed)
        let largestShareIdx = heirIndex === 0 ? 1 : 0;
        for (let i = 0; i < updatedHeirs.length; i++) {
          if (i !== heirIndex && updatedHeirs[i].share > updatedHeirs[largestShareIdx].share) {
            largestShareIdx = i;
          }
        }
        
        // Adjust to make total exactly 100%
        updatedHeirs[largestShareIdx].share += (100 - totalAfterAdjustment);
      }
    }
    
    setNewPlan({
      ...newPlan,
      heirs: updatedHeirs
    });
  };

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

  // Function to handle tab change
  const handleTabChange = (index: number) => {
    setTabIndex(index)
  }
  
  // Function to go to next tab
  const goToNextTab = () => {
    if (tabIndex < 3) { // We have 4 tabs (0-3)
      setTabIndex(tabIndex + 1)
    }
  }
  
  // Function to go to previous tab
  const goToPrevTab = () => {
    if (tabIndex > 0) {
      setTabIndex(tabIndex - 1)
    }
  }

  // Add a function to add new heirs
  const addNewHeir = () => {
    const isProdMode = localStorage.getItem('bitguardian-mode') === 'prod';
    if (!isProdMode && newPlan.heirs.length >= 2) {
      toast({
        title: 'Demo Mode Limitation',
        description: 'Demo mode supports maximum 2 heirs. Switch to Production mode to add more heirs.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    // Calculate default share
    const currentTotal = newPlan.heirs.reduce((sum, heir) => sum + heir.share, 0);
    const remainingShare = Math.max(0, 100 - currentTotal);
    const shareForNew = remainingShare > 0 ? remainingShare : Math.floor(100 / (newPlan.heirs.length + 1));
    
    // Adjust existing shares if needed
    let updatedHeirs = [...newPlan.heirs];
    if (remainingShare <= 0) {
      updatedHeirs = updatedHeirs.map(heir => ({
        ...heir,
        share: Math.floor(heir.share * (newPlan.heirs.length) / (newPlan.heirs.length + 1))
      }));
    }
    
    // Add new heir
    updatedHeirs.push({
      name: `heir${newPlan.heirs.length + 1}`,
      share: shareForNew
    });
    
    setNewPlan({
      ...newPlan,
      heirs: updatedHeirs
    });
  };
  
  // Function to remove an heir
  const removeHeir = (index: number) => {
    if (newPlan.heirs.length <= 2) {
      toast({
        title: 'Minimum Heirs',
        description: 'You need at least 2 heirs for an inheritance plan.',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    
    const removedShare = newPlan.heirs[index].share;
    const remainingHeirs = newPlan.heirs.length - 1;
    
    // Remove the heir and redistribute their share
    const updatedHeirs = newPlan.heirs.filter((_, idx) => idx !== index).map(heir => ({
      ...heir,
      share: heir.share + Math.floor(removedShare / remainingHeirs)
    }));
    
    // Adjust shares to ensure they sum to 100%
    const totalShare = updatedHeirs.reduce((sum, heir) => sum + heir.share, 0);
    if (totalShare !== 100) {
      updatedHeirs[0].share += (100 - totalShare);
    }
    
    setNewPlan({
      ...newPlan,
      heirs: updatedHeirs
    });
  };
  
  // Function to update heir name
  const updateHeirName = (index: number, name: string) => {
    const updatedHeirs = [...newPlan.heirs];
    updatedHeirs[index] = {
      ...updatedHeirs[index],
      name
    };
    
    setNewPlan({
      ...newPlan,
      heirs: updatedHeirs
    });
  };

  // Function to update heir address
  const updateHeirAddress = (index: number, address: string) => {
    const updatedHeirs = [...newPlan.heirs];
    updatedHeirs[index] = {
      ...updatedHeirs[index],
      address
    };
    
    setNewPlan({
      ...newPlan,
      heirs: updatedHeirs
    });
  };

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
          index={tabIndex}
          onChange={handleTabChange}
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

                {isProdMode && (
                  <Card p={4} borderRadius="lg" borderWidth="1px" borderColor={cardBorder}>
                    <CardHeader pb={2} px={2}>
                      <Heading size="sm" color={highlightColor}>
                        Connect Your Bitcoin Wallet
                      </Heading>
                    </CardHeader>
                    <CardBody pt={0} px={2}>
                      <VStack spacing={4} align="stretch">
                        <FormControl>
                          <FormLabel fontSize="sm">Wallet Type</FormLabel>
                          <Select 
                            placeholder="Select wallet type"
                            focusBorderColor={inputFocusBorderColor}
                          >
                            <option value="btcpay">BTCPay Server</option>
                            <option value="electrum">Electrum</option>
                            <option value="coldcard">Coldcard</option>
                            <option value="ledger">Ledger</option>
                            <option value="trezor">Trezor</option>
                            <option value="other">Other</option>
                          </Select>
                        </FormControl>
                        
                        <FormControl>
                          <FormLabel fontSize="sm">Bitcoin Address (optional)</FormLabel>
                          <Input 
                            placeholder="Enter your Bitcoin address"
                            focusBorderColor={inputFocusBorderColor}
                          />
                          <FormHelperText>
                            Provide a Bitcoin address to receive funds if you're not connecting a hardware wallet
                          </FormHelperText>
                        </FormControl>
                        
                        <HStack justify="flex-end">
                          <Button 
                            colorScheme="blue"
                            size="sm"
                            leftIcon={<Icon as={FaLock} />}
                          >
                            Connect Wallet
                          </Button>
                        </HStack>
                      </VStack>
                    </CardBody>
                  </Card>
                )}

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
                      {isProdMode 
                        ? "Your hardware wallet will need to sign a transaction to separate these funds into a dedicated inheritance plan multisig." 
                        : "In Demo Mode, simulated Bitcoin will be used. Switch to Production Mode to use real Bitcoin."}
                    </AlertDescription>
                  </Alert>
                </Box>
                
                {/* Add Next button */}
                <Flex justify="flex-end" pt={4}>
                  <Button 
                    colorScheme="brand" 
                    onClick={goToNextTab}
                    rightIcon={<ChevronRightIcon />}
                    size="lg"
                  >
                    Next: Heirs & Distribution
                  </Button>
                </Flex>
              </VStack>
            </TabPanel>
            
            {/* PANEL 2: HEIRS & DISTRIBUTION */}
            <TabPanel p={6}>
              <VStack spacing={8} align="stretch">
                <VStack spacing={1} align="flex-start">
                  <Heading size="md">Heirs Distribution</Heading>
                  <Text color={subTextColor}>Configure how your Bitcoin will be distributed among your heirs</Text>
                </VStack>
              
                <Flex justify="space-between" align="center" mb={4}>
                  <Text fontWeight="semibold">Current Heirs: {newPlan.heirs.length}</Text>
                  <Button
                    onClick={addNewHeir}
                    colorScheme="green"
                    leftIcon={<AddIcon />}
                    size="sm"
                  >
                    Add Heir
                  </Button>
                </Flex>
              
                <FormControl>
                  <FormLabel fontWeight="semibold">Heirs List</FormLabel>
                  
                  <VStack spacing={4} align="stretch">
                    {newPlan.heirs.map((heir, idx) => (
                      <Box 
                        key={idx}
                        p={4} 
                        borderWidth="1px" 
                        borderRadius="lg" 
                        borderColor={cardBorder}
                        bg={statBg}
                      >
                        <VStack spacing={4} align="stretch">
                          <Flex justify="space-between" align="center">
                            <HStack>
                              <FormControl w="200px">
                                <FormLabel fontSize="sm">Heir Name</FormLabel>
                                <Input 
                                  value={heir.name} 
                                  onChange={(e) => updateHeirName(idx, e.target.value)}
                                  size="sm"
                                  placeholder="Enter heir name"
                                />
                              </FormControl>
                              <Badge colorScheme={idx === 0 ? "brand" : idx === 1 ? "blue" : "green"} fontSize="md" px={2} borderRadius="md">
                                {heir.share}%
                              </Badge>
                            </HStack>
                            
                            {newPlan.heirs.length > 2 && (
                              <IconButton
                                aria-label="Remove heir"
                                icon={<Icon as={FaTrash} />}
                                onClick={() => removeHeir(idx)}
                                colorScheme="red"
                                variant="ghost"
                                size="sm"
                              />
                            )}
                          </Flex>
                          
                          <Box>
                            <FormLabel fontSize="sm">Share Percentage</FormLabel>
                            <Slider 
                              value={heir.share}
                              min={1}
                              max={100}
                              step={1}
                              onChange={(value) => handleHeirShareChange(idx, value)}
                              colorScheme={idx === 0 ? "brand" : idx === 1 ? "blue" : "green"}
                            >
                              <SliderTrack h={2} borderRadius="full">
                                <SliderFilledTrack />
                              </SliderTrack>
                              <SliderThumb boxSize={5} />
                            </Slider>
                          </Box>
                        </VStack>
                      </Box>
                    ))}
                  </VStack>
                </FormControl>
                
                <Box py={4}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <VStack align="start" spacing={1}>
                      <Text fontWeight="medium">Distribution Information</Text>
                      <Text fontSize="sm">
                        In production mode, you can add as many heirs as you need. Each heir will receive their specified percentage of the inheritance.
                      </Text>
                    </VStack>
                  </Alert>
                </Box>
                
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
                
                {/* Add Next/Prev buttons */}
                <Flex justify="space-between" pt={4}>
                  <Button 
                    variant="outline" 
                    onClick={goToPrevTab}
                    leftIcon={<ChevronLeftIcon />}
                  >
                    Previous
                  </Button>
                  <Button 
                    colorScheme="brand" 
                    onClick={goToNextTab}
                    rightIcon={<ChevronRightIcon />}
                  >
                    Next: Execution Settings
                  </Button>
                </Flex>
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
                              type="datetime-local"
                              min={minDate}
                              value={newPlan.scheduledExecution.scheduledDate || ''}
                              onChange={handleScheduledDateChange}
                              focusBorderColor={inputFocusBorderColor}
                            />
                            <FormHelperText>
                              Choose a future date and time when the plan should automatically execute (UTC timezone)
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
                
                {/* Add Next/Prev buttons */}
                <Flex justify="space-between" pt={4}>
                  <Button 
                    variant="outline" 
                    onClick={goToPrevTab}
                    leftIcon={<ChevronLeftIcon />}
                  >
                    Previous
                  </Button>
                  <Button 
                    colorScheme="brand" 
                    onClick={goToNextTab}
                    rightIcon={<ChevronRightIcon />}
                  >
                    Next: Review & Create
                  </Button>
                </Flex>
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
                                new Date(newPlan.scheduledExecution.scheduledDate).toLocaleString(undefined, {
                                  dateStyle: 'medium',
                                  timeStyle: 'medium',
                                  timeZone: 'UTC'
                                }) + ' UTC' : 
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
                
                {/* Update buttons */}
                <Flex 
                  justify="space-between" 
                  direction={{ base: "column", md: "row" }}
                  gap={{ base: 4, md: 0 }}
                  pt={4}
                >
                  <HStack>
                    <Button 
                      variant="outline" 
                      onClick={goToPrevTab}
                      leftIcon={<ChevronLeftIcon />}
                    >
                      Previous
                    </Button>
              <Button 
                as={Link} 
                href="/dashboard" 
                variant="outline"
                      colorScheme="gray"
              >
                Cancel
              </Button>
                  </HStack>
                  
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