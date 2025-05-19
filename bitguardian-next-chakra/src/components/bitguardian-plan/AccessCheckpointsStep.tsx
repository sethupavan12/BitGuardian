'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Alert,
  AlertIcon,
  HStack,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { FormDataState } from '../../app/create-bitguardian-plan/page'; // Import shared types

interface AccessCheckpointsStepProps {
  data: Pick<FormDataState, 'survivorAccessTime' | 'guardianAccessTime'>;
  setData: (field: keyof Pick<FormDataState, 'survivorAccessTime' | 'guardianAccessTime'>, value: string) => void;
}

export const AccessCheckpointsStep: React.FC<AccessCheckpointsStepProps> = ({ data, setData }) => {
  const handleBeneficiaryTimeChange = (valueAsString: string, valueAsNumber: number) => {
    setData('survivorAccessTime', valueAsString);
  };

  const handleGuardianTimeChange = (valueAsString: string, valueAsNumber: number) => {
    setData('guardianAccessTime', valueAsString);
  };

  const beneficiaryTimeNum = parseInt(data.survivorAccessTime, 10);
  const guardianTimeNum = parseInt(data.guardianAccessTime, 10);

  return (
    <VStack spacing={8} align="stretch" p={8} borderWidth="1px" borderRadius="lg" shadow="lg" bg="white">
      <Heading as="h2" size="lg" textAlign="center" color="purple.700" fontWeight="semibold">
        Step 4: Set Access Checkpoints
      </Heading>
      <Text textAlign="center" color="gray.600" fontSize="md">
        Define when backup access paths for your Plan become available using block confirmations.
        For this demo, these are relative to the current block height when the Plan is funded.
      </Text>

      <FormControl id="beneficiaryAccessTime">
        <HStack justifyContent="space-between">
          <FormLabel fontWeight="semibold" color="gray.700">Initial Beneficiary Access Time (Blocks from Funding)</FormLabel>
          <Tooltip 
            label="After this many blocks are mined (post-funding), one of the Initial Beneficiaries can access the Plan funds alone."
            placement="top"
            hasArrow
            bg="gray.700"
            color="white"
          >
            <InfoOutlineIcon color="gray.500" cursor="help" mb={1} />
          </Tooltip>
        </HStack>
        <NumberInput 
          min={1} 
          value={data.survivorAccessTime} 
          onChange={handleBeneficiaryTimeChange}
          focusBorderColor="purple.500"
          borderColor="gray.300"
        >
          <NumberInputField placeholder="e.g., 100 blocks" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        <FormHelperText color="gray.500">e.g., 144 blocks is roughly 1 day.</FormHelperText>
      </FormControl>

      <FormControl id="guardianAccessTime" isInvalid={!isNaN(beneficiaryTimeNum) && !isNaN(guardianTimeNum) && guardianTimeNum <= beneficiaryTimeNum}>
        <HStack justifyContent="space-between">
            <FormLabel fontWeight="semibold" color="gray.700">Guardian Access Time (Blocks from Funding)</FormLabel>
            <Tooltip 
                label="After this many blocks (must be after Beneficiary Access Time), the Final Guardian can access the Plan funds."
                placement="top"
                hasArrow
                bg="gray.700"
                color="white"
            >
                <InfoOutlineIcon color="gray.500" cursor="help" mb={1} />
            </Tooltip>
        </HStack>
        <NumberInput 
          min={1} 
          value={data.guardianAccessTime} 
          onChange={handleGuardianTimeChange}
          focusBorderColor="purple.500"
          borderColor="gray.300"
        >
          <NumberInputField placeholder="e.g., 200 blocks" />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
        {(!isNaN(beneficiaryTimeNum) && !isNaN(guardianTimeNum) && guardianTimeNum <= beneficiaryTimeNum) && (
          <Text color="red.500" fontSize="sm" mt={1}>Guardian Access Time must be greater than Beneficiary Access Time.</Text>
        )}
        <FormHelperText color="gray.500">Must be significantly after Initial Beneficiary Access Time.</FormHelperText>
      </FormControl>
      
      {/* Timeline Graphic Placeholder - Could be a simple Box with text or a more complex SVG component */}
      <Box mt={6} p={4} bg="purple.50" borderRadius="md" borderWidth="1px" borderColor="purple.200">
        <Heading as="h4" size="sm" color="purple.700" mb={2}>Access Timeline (Conceptual):</Heading>
        <Text fontSize="sm" color="purple.600">
          1. **Funding:** BitGuardian Plan is funded on the blockchain.
        </Text>
        <Text fontSize="sm" color="purple.600" mt={1}>
          2. **Beneficiary Access (Solo):** After {data.survivorAccessTime || '[X]'} blocks (approx. {data.survivorAccessTime ? (parseInt(data.survivorAccessTime, 10)/144).toFixed(1) : 'Y'} days).
        </Text>
        <Text fontSize="sm" color="purple.600" mt={1}>
          3. **Guardian Access:** After {data.guardianAccessTime || '[Z]'} blocks (approx. {data.guardianAccessTime ? (parseInt(data.guardianAccessTime, 10)/144).toFixed(1) : 'W'} days).
        </Text>
      </Box>

    </VStack>
  );
}; 