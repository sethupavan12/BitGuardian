'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  Divider,
  SimpleGrid,
  Tag,
  List,
  ListItem,
  ListIcon,
  Icon,
  Flex,
  useColorModeValue,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { CheckCircleIcon, LockIcon, TimeIcon, ViewIcon, WarningTwoIcon } from '@chakra-ui/icons';
import { FormDataState } from '../../app/create-bitguardian-plan/page'; // Import shared types

interface ReviewStepProps {
  data: FormDataState;
}

const DetailItem: React.FC<{ label: string; value?: string | number | null; children?: React.ReactNode; icon?: React.ElementType }> = ({ label, value, children, icon }) => {
  const labelColor = useColorModeValue('gray.600', 'gray.400');
  const valueColor = useColorModeValue('gray.800', 'gray.100');
  return (
    <Box>
      <Flex align="center">
        {icon && <Icon as={icon} mr={2} color="purple.500" />}
        <Text fontSize="sm" fontWeight="medium" color={labelColor}>{label}:</Text>
      </Flex>
      {value && <Text fontSize="md" fontWeight="semibold" color={valueColor} mt={1} ml={icon ? 6 : 0}>{value}</Text>}
      {children && <Box mt={1} ml={icon ? 6 : 0}>{children}</Box>}
    </Box>
  );
};

export const ReviewStep: React.FC<ReviewStepProps> = ({ data }) => {
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const approxSurvivorDays = data.survivorAccessTime ? (parseInt(data.survivorAccessTime, 10) / 144).toFixed(1) : 'N/A';
  const approxGuardianDays = data.guardianAccessTime ? (parseInt(data.guardianAccessTime, 10) / 144).toFixed(1) : 'N/A';

  return (
    <VStack spacing={6} align="stretch" p={8} borderWidth="1px" borderRadius="lg" shadow="lg" bg={cardBg}>
      <Heading as="h2" size="lg" textAlign="center" color="purple.700" fontWeight="semibold">
        Step 5: Review Your Plan
      </Heading>
      <Text textAlign="center" color="gray.500" fontSize="md" mb={4}>
        Please carefully review all details before creating your BitGuardian Plan.
      </Text>

      <VStack spacing={5} divider={<Divider borderColor={borderColor} />} align="stretch">
        <DetailItem label="Plan Name" value={data.lockboxName || 'Not specified'} icon={ViewIcon} />

        <DetailItem label="Initial Beneficiaries" icon={CheckCircleIcon}>
          {data.initialReceivers.length > 0 ? (
            <List spacing={2} mt={2}>
              {data.initialReceivers.map(receiver => (
                <ListItem key={receiver.id} display="flex" alignItems="center">
                  <ListIcon as={CheckCircleIcon} color="green.500" />
                  <Text fontSize="sm" fontWeight="medium">{receiver.name}</Text>
                  <Tag size="sm" colorScheme="gray" ml={2} title={receiver.pubkey}>Pubkey: {receiver.pubkey.substring(0,10)}...</Tag>
                </ListItem>
              ))}
            </List>
          ) : (
            <Text color="red.500" fontSize="sm">No initial beneficiaries selected!</Text>
          )}
        </DetailItem>

        <DetailItem label="Final Guardian" icon={LockIcon}>
          {data.finalGuardian ? (
            <VStack align="start" spacing={1} mt={1}>
                <Flex align="center">
                    <Text fontSize="sm" fontWeight="medium">{data.finalGuardian.name}</Text>
                    <Tag size="sm" colorScheme="gray" ml={2} title={data.finalGuardian.pubkey}>Pubkey: {data.finalGuardian.pubkey.substring(0,10)}...</Tag>
                </Flex>
            </VStack>
          ) : (
            <Text color="red.500" fontSize="sm">No final guardian selected!</Text>
          )}
        </DetailItem>
        
        <DetailItem label="Access Checkpoints" icon={TimeIcon}>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={3} mt={2}>
                <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                    <Text fontSize="xs" color="gray.500">Beneficiary Access Time</Text>
                    <Text fontWeight="bold">{data.survivorAccessTime} blocks</Text>
                    <Text fontSize="xs" color="gray.500">(approx. {approxSurvivorDays} days)</Text>
                </Box>
                <Box p={3} borderWidth="1px" borderRadius="md" borderColor={borderColor}>
                    <Text fontSize="xs" color="gray.500">Guardian Access Time</Text>
                    <Text fontWeight="bold">{data.guardianAccessTime} blocks</Text>
                    <Text fontSize="xs" color="gray.500">(approx. {approxGuardianDays} days)</Text>
                </Box>
            </SimpleGrid>
        </DetailItem>
      </VStack>

      <Alert status="warning" borderRadius="md" mt={8}>
        <AlertIcon as={WarningTwoIcon} />
        <Box flex="1">
            <Text fontWeight="bold">Important:</Text>
            <Text fontSize="sm">Once created, the BitGuardian Plan parameters (public keys, time locks) are cryptographically sealed and cannot be changed. Ensure all details are correct.</Text>
        </Box>
      </Alert>
    </VStack>
  );
}; 