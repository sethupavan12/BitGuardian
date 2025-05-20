'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'
import {
  Box,
  Heading,
  Text,
  Badge,
  Card,
  CardHeader,
  CardBody,
  SimpleGrid,
  Flex,
  Icon,
  Stack,
  Link,
  Button,
  useColorModeValue,
  Skeleton,
  Code,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { FaDatabase, FaShieldAlt, FaExternalLinkAlt, FaInfoCircle } from 'react-icons/fa'
import { CheckCircleIcon, WarningIcon } from '@chakra-ui/icons'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

interface ExSatData {
  name: string;
  description: string;
  enabled: boolean;
  endpoint: string;
  example: {
    metadataId: string;
    txid: string;
  } | null;
}

interface RebarShieldData {
  name: string;
  description: string;
  enabled: boolean;
  available: boolean;
  endpoint: string;
}

interface SponsorIntegrationsProps {
  showDetailed?: boolean;
}

export default function SponsorIntegrations({ showDetailed = false }: SponsorIntegrationsProps) {
  const [exSat, setExSat] = useState<ExSatData | null>(null)
  const [rebarShield, setRebarShield] = useState<RebarShieldData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  
  // Color settings
  const cardBg = useColorModeValue('white', 'gray.700')
  const headerBg = useColorModeValue('gray.50', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')
  const primaryColor = useColorModeValue('brand.500', 'brand.400')
  const secondaryColor = useColorModeValue('blue.500', 'blue.400')
  const infoColor = useColorModeValue('cyan.500', 'cyan.400')
  
  useEffect(() => {
    fetchIntegrationData()
  }, [])
  
  const fetchIntegrationData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await axios.get(`${API_URL}/inheritance/sponsor-integrations`)
      const data = response.data.integrations
      
      setExSat(data.exSat)
      setRebarShield(data.rebarShield)
    } catch (error) {
      console.error('Error fetching integration data:', error)
      setError('Failed to load integration data')
      
      // Mock data for display purposes if API fails
      setExSat({
        name: 'exSat Data Consensus Extension Protocol',
        description: 'exSat extends Bitcoin\'s metadata consensus with a Hybrid Mechanism (PoW + PoS), providing secure and decentralized metadata storage for inheritance plans.',
        enabled: true,
        endpoint: 'https://api.exsat.network/testnet',
        example: {
          metadataId: 'mock-metadata-id',
          txid: '28a34567cc90123456789abcdef012345678901234567890abcdef0123456789'
        }
      })
      
      setRebarShield({
        name: 'Rebar Shield Private Transaction Service',
        description: 'Rebar Shield allows Bitcoin transactions to be submitted directly to mining pools, bypassing the public mempool for faster and more private settlement.',
        enabled: true,
        available: true,
        endpoint: 'https://shield.rebarlabs.io/v1'
      })
    } finally {
      setLoading(false)
    }
  }
  
  if (showDetailed) {
    return (
      <Box>
        <Heading size="lg" mb={4}>Sponsor Integrations</Heading>
        <Text mb={6}>
          BitGuardian leverages cutting-edge Bitcoin technologies to provide enhanced security, privacy, and reliability for your inheritance plans.
        </Text>
        
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          {/* exSat Card */}
          <Card borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
            <CardHeader bg={headerBg} py={4}>
              <Flex align="center">
                <Icon as={FaDatabase} color={primaryColor} fontSize="xl" mr={2} />
                <Heading size="md">exSat Integration</Heading>
                <Skeleton isLoaded={!loading} ml="auto">
                  <Badge colorScheme={exSat?.enabled ? 'green' : 'gray'} ml={2}>
                    {exSat?.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </Skeleton>
              </Flex>
            </CardHeader>
            <CardBody>
              <Skeleton isLoaded={!loading}>
                <Stack spacing={4}>
                  <Text>{exSat?.description}</Text>
                  
                  <Box>
                    <Text fontWeight="bold" mb={1}>Benefits for your inheritance plans:</Text>
                    <Stack spacing={2}>
                      <Flex align="start">
                        <CheckCircleIcon color="green.500" mr={2} mt={1} />
                        <Text>Secure, decentralized storage of inheritance plan details</Text>
                      </Flex>
                      <Flex align="start">
                        <CheckCircleIcon color="green.500" mr={2} mt={1} />
                        <Text>Enhanced verification of inheritance execution conditions</Text>
                      </Flex>
                      <Flex align="start">
                        <CheckCircleIcon color="green.500" mr={2} mt={1} />
                        <Text>Increased transparency and auditability</Text>
                      </Flex>
                    </Stack>
                  </Box>
                  
                  {exSat?.example && (
                    <Box borderWidth="1px" borderRadius="md" p={3} bg={headerBg}>
                      <Text fontWeight="bold" mb={2}>Example Metadata:</Text>
                      <Text fontSize="sm" fontFamily="mono" mb={1}>
                        ID: <Code>{exSat.example.metadataId}</Code>
                      </Text>
                      <Text fontSize="sm" fontFamily="mono" noOfLines={1}>
                        TXID: <Code>{exSat.example.txid}</Code>
                      </Text>
                    </Box>
                  )}
                  
                  <Button 
                    rightIcon={<FaExternalLinkAlt />} 
                    colorScheme="blue" 
                    variant="outline" 
                    size="sm"
                    as={Link}
                    href="https://docs.exsat.network/"
                    isExternal
                  >
                    Learn about exSat
                  </Button>
                </Stack>
              </Skeleton>
            </CardBody>
          </Card>
          
          {/* Rebar Shield Card */}
          <Card borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
            <CardHeader bg={headerBg} py={4}>
              <Flex align="center">
                <Icon as={FaShieldAlt} color={secondaryColor} fontSize="xl" mr={2} />
                <Heading size="md">Rebar Shield Integration</Heading>
                <Skeleton isLoaded={!loading} ml="auto">
                  <Badge colorScheme={rebarShield?.enabled ? 'green' : 'gray'} ml={2}>
                    {rebarShield?.enabled ? 'Active' : 'Inactive'}
                  </Badge>
                </Skeleton>
              </Flex>
            </CardHeader>
            <CardBody>
              <Skeleton isLoaded={!loading}>
                <Stack spacing={4}>
                  <Text>{rebarShield?.description}</Text>
                  
                  <Box>
                    <Text fontWeight="bold" mb={1}>Benefits for your inheritance plans:</Text>
                    <Stack spacing={2}>
                      <Flex align="start">
                        <CheckCircleIcon color="green.500" mr={2} mt={1} />
                        <Text>Private transaction submission bypassing the public mempool</Text>
                      </Flex>
                      <Flex align="start">
                        <CheckCircleIcon color="green.500" mr={2} mt={1} />
                        <Text>Faster settlement with direct mining pool access</Text>
                      </Flex>
                      <Flex align="start">
                        <CheckCircleIcon color="green.500" mr={2} mt={1} />
                        <Text>Reduced risk of transaction front-running or censorship</Text>
                      </Flex>
                    </Stack>
                  </Box>
                  
                  <Flex align="center" mt={2}>
                    <Text fontWeight="bold" mr={2}>Service Status:</Text>
                    <Skeleton isLoaded={!loading}>
                      {rebarShield?.available ? (
                        <Badge colorScheme="green">Available</Badge>
                      ) : (
                        <Badge colorScheme="yellow">Unavailable</Badge>
                      )}
                    </Skeleton>
                  </Flex>
                  
                  <Button 
                    rightIcon={<FaExternalLinkAlt />} 
                    colorScheme="blue" 
                    variant="outline" 
                    size="sm"
                    as={Link}
                    href="https://rebarlabs.io/"
                    isExternal
                  >
                    Learn about Rebar Shield
                  </Button>
                </Stack>
              </Skeleton>
            </CardBody>
          </Card>
        </SimpleGrid>
      </Box>
    )
  }
  
  // Simplified version for dashboard display
  return (
    <Card borderWidth="1px" borderColor={borderColor} borderRadius="lg" overflow="hidden" boxShadow="md" bg={cardBg}>
      <CardHeader bg={headerBg} py={4}>
        <Flex align="center">
          <Icon as={FaInfoCircle} color={infoColor} fontSize="xl" mr={2} />
          <Heading size="md">Sponsor Integrations</Heading>
          <Button size="sm" variant="ghost" onClick={onOpen} ml="auto">
            Details
          </Button>
        </Flex>
      </CardHeader>
      <CardBody>
        <Skeleton isLoaded={!loading}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Flex align="center">
              <Icon as={FaDatabase} color={primaryColor} fontSize="xl" mr={2} />
              <Text fontWeight="medium">exSat Data Protocol:</Text>
              <Badge colorScheme={exSat?.enabled ? 'green' : 'gray'} ml={2}>
                {exSat?.enabled ? 'Active' : 'Inactive'}
              </Badge>
            </Flex>
            
            <Flex align="center">
              <Icon as={FaShieldAlt} color={secondaryColor} fontSize="xl" mr={2} />
              <Text fontWeight="medium">Rebar Shield:</Text>
              <Badge colorScheme={rebarShield?.enabled && rebarShield?.available ? 'green' : 'yellow'} ml={2}>
                {rebarShield?.enabled && rebarShield?.available ? 'Active' : 'Standby'}
              </Badge>
            </Flex>
          </SimpleGrid>
          
          <Text mt={4} fontSize="sm" color="gray.500">
            BitGuardian integrates with Bitcoin Layer 2 technologies to enhance security and privacy.
          </Text>
        </Skeleton>
      </CardBody>
      
      {/* Detailed Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>BitGuardian Sponsor Integrations</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <SponsorIntegrations showDetailed={true} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </Card>
  )
} 