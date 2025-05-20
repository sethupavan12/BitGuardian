'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardHeader,
  CardBody,
  Flex,
  Icon,
  Button,
  List,
  ListItem,
  ListIcon,
  SimpleGrid,
  Divider,
  useColorModeValue,
  Link as ChakraLink,
} from '@chakra-ui/react'
import { FaFileAlt, FaShieldAlt, FaBook, FaDownload, FaCheckCircle, FaLock, FaUsers, FaClock } from 'react-icons/fa'
import Link from 'next/link'

export default function LearnPage() {
  // Theme-aware colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const accentColor = useColorModeValue('green.500', 'green.300');

  return (
    <Box bg={bgColor} py={12}>
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch" mb={12}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={4}>BitGuardian Documentation</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Learn how BitGuardian works and how it can secure your Bitcoin inheritance
            </Text>
          </Box>
          
          <Tabs colorScheme="brand" variant="enclosed" isLazy>
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Whitepaper</Tab>
              <Tab>How It Works</Tab>
              <Tab>Security</Tab>
            </TabList>
            
            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <VStack spacing={8} align="stretch">
                  <Box>
                    <Heading as="h2" size="lg" mb={4} color={headingColor}>BitGuardian: Bitcoin Inheritance Platform</Heading>
                    <Text fontSize="lg">
                      BitGuardian is a secure, privacy-focused platform that ensures your Bitcoin legacy is passed on to your chosen heirs without compromising security or requiring third-party custody.
                    </Text>
                  </Box>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Flex align="center">
                          <Icon as={FaLock} color={accentColor} mr={3} />
                          <Heading size="md">Security First</Heading>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          BitGuardian leverages Bitcoin's native cryptographic security features to create inheritance plans that only execute under specific conditions that you define.
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Flex align="center">
                          <Icon as={FaUsers} color={accentColor} mr={3} />
                          <Heading size="md">Flexible Distribution</Heading>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          Distribute your Bitcoin to multiple heirs based on percentages you specify, with complete control over how your assets are allocated.
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Flex align="center">
                          <Icon as={FaClock} color={accentColor} mr={3} />
                          <Heading size="md">Customizable Triggers</Heading>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          Set up your inheritance plan to execute based on inactivity periods or specific dates, ensuring your Bitcoin reaches your heirs exactly when intended.
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Flex align="center">
                          <Icon as={FaShieldAlt} color={accentColor} mr={3} />
                          <Heading size="md">Non-Custodial</Heading>
                        </Flex>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          BitGuardian never takes custody of your Bitcoin. You maintain full control of your private keys and funds at all times.
                        </Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                  
                  <Box textAlign="center" mt={6}>
                    <Button as={Link} href="/dashboard" colorScheme="brand" size="lg" mt={4}>
                      Try BitGuardian Now
                    </Button>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Whitepaper Tab */}
              <TabPanel>
                <VStack spacing={8} align="stretch">
                  <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
                    <Box>
                      <Heading as="h2" size="lg" mb={4} color={headingColor}>BitGuardian Whitepaper</Heading>
                      <Text fontSize="lg">
                        Our technical whitepaper details the cryptographic methods, security protocols, and technical implementation of BitGuardian.
                      </Text>
                    </Box>
                    
                    <Button 
                      leftIcon={<FaDownload />} 
                      colorScheme="brand" 
                      size="md"
                      onClick={() => window.open('/whitepaper.pdf', '_blank')}
                    >
                      Download Whitepaper
                    </Button>
                  </Flex>
                  
                  <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor} p={6}>
                    <VStack spacing={6} align="stretch">
                      <Heading as="h3" size="md">Executive Summary</Heading>
                      <Text>
                        BitGuardian addresses the critical challenge of Bitcoin inheritance by implementing a secure, non-custodial solution that preserves user sovereignty while ensuring assets reach intended heirs when needed. Using time-locked transactions, cryptographic verification, and customizable triggers, BitGuardian offers a comprehensive inheritance platform without compromising Bitcoin's fundamental principles of security and self-custody.
                      </Text>
                      
                      <Divider />
                      
                      <Heading as="h3" size="md">Key Technical Components</Heading>
                      <List spacing={3}>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color={accentColor} />
                          <Text as="span" fontWeight="semibold">Time-Locked Transactions:</Text> Implementation of Bitcoin's native time-lock features (CLTV/CSV)
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color={accentColor} />
                          <Text as="span" fontWeight="semibold">Multi-Signature Security:</Text> Optional m-of-n signature schemes for added security
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color={accentColor} />
                          <Text as="span" fontWeight="semibold">Verification Oracle:</Text> Distributed proof-of-life system without centralized trust
                        </ListItem>
                        <ListItem>
                          <ListIcon as={FaCheckCircle} color={accentColor} />
                          <Text as="span" fontWeight="semibold">Smart Contract Integration:</Text> For advanced inheritance logic and conditions
                        </ListItem>
                      </List>
                      
                      <Text mt={2}>
                        For the complete technical specifications, cryptographic proofs, and implementation details, please download the full whitepaper.
                      </Text>
                    </VStack>
                  </Card>
                </VStack>
              </TabPanel>
              
              {/* How It Works Tab */}
              <TabPanel>
                <VStack spacing={8} align="stretch">
                  <Box>
                    <Heading as="h2" size="lg" mb={4} color={headingColor}>How BitGuardian Works</Heading>
                    <Text fontSize="lg">
                      BitGuardian uses a combination of Bitcoin's native features and advanced cryptography to create secure inheritance plans.
                    </Text>
                  </Box>
                  
                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={8}>
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader bg={useColorModeValue('gray.50', 'gray.700')}>
                        <Heading size="md">Step 1: Create Your Plan</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text mb={4}>
                          Define your inheritance parameters, including:
                        </Text>
                        <List spacing={2}>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Which heirs should receive your Bitcoin
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            What percentage each heir should receive
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Under what conditions the inheritance should execute
                          </ListItem>
                        </List>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader bg={useColorModeValue('gray.50', 'gray.700')}>
                        <Heading size="md">Step 2: Configure Security Settings</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text mb={4}>
                          Select verification methods to determine when your plan should execute:
                        </Text>
                        <List spacing={2}>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Inactivity period monitoring
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Regular check-in requirements
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Trusted contact verification
                          </ListItem>
                        </List>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader bg={useColorModeValue('gray.50', 'gray.700')}>
                        <Heading size="md">Step 3: Execution and Distribution</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text mb={4}>
                          When conditions are met, BitGuardian executes your plan:
                        </Text>
                        <List spacing={2}>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Verifies all conditions are satisfied
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Distributes Bitcoin according to your specifications
                          </ListItem>
                          <ListItem>
                            <ListIcon as={FaCheckCircle} color={accentColor} />
                            Maintains a transparent record of all transactions
                          </ListItem>
                        </List>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                  
                  <Box textAlign="center">
                    <ChakraLink as={Link} href="/faq" color={headingColor}>
                      Visit our FAQ for more detailed information →
                    </ChakraLink>
                  </Box>
                </VStack>
              </TabPanel>
              
              {/* Security Tab */}
              <TabPanel>
                <VStack spacing={8} align="stretch">
                  <Box>
                    <Heading as="h2" size="lg" mb={4} color={headingColor}>Security Architecture</Heading>
                    <Text fontSize="lg">
                      BitGuardian employs multiple layers of security to protect your Bitcoin and ensure your inheritance plans execute correctly.
                    </Text>
                  </Box>
                  
                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="md">Non-Custodial Design</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          BitGuardian never holds your private keys or takes custody of your Bitcoin. All transactions are created client-side and require your explicit authorization.
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="md">Cryptographic Verification</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          All inheritance conditions use cryptographic proofs to verify their status, eliminating reliance on centralized trust or single points of failure.
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="md">Transparent Operations</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          All inheritance transactions are recorded on the Bitcoin blockchain, providing complete transparency and auditability of the inheritance process.
                        </Text>
                      </CardBody>
                    </Card>
                    
                    <Card bg={cardBg} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
                      <CardHeader>
                        <Heading size="md">Open Source</Heading>
                      </CardHeader>
                      <CardBody>
                        <Text>
                          BitGuardian's core security components are open source, allowing for peer review and verification of the security implementations.
                        </Text>
                      </CardBody>
                    </Card>
                  </SimpleGrid>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </VStack>
      </Container>
    </Box>
  )
} 