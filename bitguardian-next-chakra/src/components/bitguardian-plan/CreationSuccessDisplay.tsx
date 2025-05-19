'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  Link,
  Icon,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Code,
  Button,
  useClipboard,
  Tooltip,
  Flex,
  useColorModeValue,
  Tag,
} from '@chakra-ui/react';
import { CheckCircleIcon, CopyIcon, ExternalLinkIcon, InfoIcon } from '@chakra-ui/icons';
import { ApiResponse } from '../../app/create-bitguardian-plan/page'; // Import shared types

interface CreationSuccessProps {
  response: ApiResponse | null;
}

export const CreationSuccessDisplay: React.FC<CreationSuccessProps> = ({ response }) => {
  const { onCopy: onCopyAddress, hasCopied: hasCopiedAddress } = useClipboard(response?.lockboxAddress || '');
  const { onCopy: onCopyScript, hasCopied: hasCopiedScript } = useClipboard(response?.accessBlueprint || '');
  
  const cardBg = useColorModeValue('white', 'gray.700');
  const codeBg = useColorModeValue('purple.50', 'purple.900');
  const codeColor = useColorModeValue('purple.700', 'purple.200');

  if (!response || !response.success) {
    return (
      <Alert status="error" borderRadius="md">
        <AlertIcon />
        <AlertTitle>Plan Creation Failed!</AlertTitle>
        <AlertDescription>{response?.error || 'An unexpected error occurred.'}</AlertDescription>
      </Alert>
    );
  }

  return (
    <VStack spacing={6} align="stretch" p={8} borderWidth="1px" borderRadius="lg" shadow="lg" bg={cardBg}>
      <Flex direction="column" align="center">
        <Icon as={CheckCircleIcon} w={16} h={16} color="green.500" mb={4} />
        <Heading as="h2" size="xl" textAlign="center" color="green.600" fontWeight="bold">
          BitGuardian Plan Configured!
        </Heading>
        <Text textAlign="center" color="gray.600" fontSize="lg" mt={2}>
          {response.message}
        </Text>
      </Flex>

      <Box>
        <Heading size="md" mb={2} color="purple.700">Plan Bitcoin Address (P2WSH):</Heading>
        <Flex align="center" borderWidth="1px" p={3} borderRadius="md" bg={codeBg}>
          <Code fontSize="sm" color={codeColor} wordBreak="break-all" flex="1">
            {response.lockboxAddress}
          </Code>
          <Tooltip label={hasCopiedAddress ? 'Copied!' : 'Copy Address'} closeOnClick={false} placement="top">
            <Button onClick={onCopyAddress} size="sm" ml={3} leftIcon={<CopyIcon />} colorScheme="purple">
              {hasCopiedAddress ? 'Copied' : 'Copy'}
            </Button>
          </Tooltip>
        </Flex>
        <Text fontSize="xs" color="gray.500" mt={1}>This is the address you will send Bitcoin to, to fund your BitGuardian Plan.</Text>
      </Box>

      <Box>
        <Heading size="md" mb={2} color="purple.700">Access Blueprint (Witness Script Hex):</Heading>
        <Flex align="center" borderWidth="1px" p={3} borderRadius="md" bg={codeBg}>
          <Code fontSize="xs" color={codeColor} wordBreak="break-all" maxH="100px" overflowY="auto" flex="1">
            {response.accessBlueprint}
          </Code>
          <Tooltip label={hasCopiedScript ? 'Copied!' : 'Copy Script'} closeOnClick={false} placement="top">
            <Button onClick={onCopyScript} size="sm" ml={3} leftIcon={<CopyIcon />} colorScheme="purple">
              {hasCopiedScript ? 'Copied' : 'Copy'}
            </Button>
          </Tooltip>
        </Flex>
        <Text fontSize="xs" color="gray.500" mt={1}>This script defines the access conditions. Keep it safe if you plan to manually redeem.</Text>
      </Box>

      {response.planDetails && (
        <Box p={4} borderWidth="1px" borderRadius="md" borderColor="gray.200">
            <Heading size="sm" mb={2} color="gray.700">Plan Overview:</Heading>
            <Text fontSize="sm">- Network: <Tag colorScheme='teal'>{response.planDetails.network}</Tag></Text>
            <Text fontSize="sm">- Initial Beneficiaries: {response.planDetails.primaryHeirPubkeys.length}</Text>
            <Text fontSize="sm">- Beneficiary Access Time: {response.planDetails.survivorAccessTime} blocks</Text>
            <Text fontSize="sm">- Guardian Access Time: {response.planDetails.guardianAccessTime} blocks</Text>
        </Box>
      )}
      
      <Alert status="info" borderRadius="md" mt={4}>
        <AlertIcon as={InfoIcon} />
        <Box flex="1">
            <AlertTitle fontWeight="semibold">Next Steps & Important Notes:</AlertTitle>
            <AlertDescription fontSize="sm">
                1. **Fund the Plan:** Send Bitcoin to the P2WSH address shown above.
                <br />
                2. **Monitor:** Keep an eye on your transaction and the block height for time-lock expirations.
                <br />
                3. **Secure Details:** Store the Plan Address and Access Blueprint securely. The blueprint is essential for recovery if our platform is unavailable.
                <br />
                4. **Demo Mode:** In this demo, you can use Polar to send funds and mine blocks to simulate time passing.
            </AlertDescription>
        </Box>
      </Alert>
    </VStack>
  );
}; 