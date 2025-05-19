'use client';

import { useState } from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  CheckboxGroup,
  Checkbox,
  Stack,
  FormControl,
  FormLabel,
  FormHelperText,
  Button,
  Input,
  HStack,
  IconButton,
  Tooltip,
} from '@chakra-ui/react';
import { AddIcon, DeleteIcon } from '@chakra-ui/icons';
// Import shared types from page.tsx
import { FormDataState, DemoPubkeys, InitialReceiver } from '../../app/create-bitguardian-plan/page';

// Removing local type definitions as they are now imported
/*
// Assuming shared types from page.tsx or a types file
interface DemoPubkeys {
  alice: string;
  bob: string;
  carol: string;
  [key: string]: string;
}
interface InitialReceiver {
  id: string;
  name: string;
  pubkey: string;
}
interface FormDataState {
  lockboxName: string;
  initialReceivers: InitialReceiver[];
  finalGuardian: any; // Simplified for this component's focus
  survivorAccessTime: string;
  guardianAccessTime: string;
}
*/

interface InitialBeneficiariesStepProps {
  data: FormDataState; // Now uses imported FormDataState
  setData: (field: 'initialReceivers', value: InitialReceiver[]) => void; // Now uses imported InitialReceiver
  demoPubkeys: DemoPubkeys; // Now uses imported DemoPubkeys
}

const MAX_BENEFICIARIES = 2; // Renamed from MAX_RECEIVERS

export const InitialReceiversStep: React.FC<InitialBeneficiariesStepProps> = ({ data, setData, demoPubkeys }) => {
  // For demo mode, we'll use checkboxes for predefined Polar nodes
  // The `id` will be like 'polarAlice', `name` 'Alice (Polar)', `pubkey` from demoPubkeys

  const handleDemoBeneficiaryChange = (selectedDemoIds: string[]) => {
    const newBeneficiaries = selectedDemoIds.map(id => {
      const name = id === 'polarAlice' ? 'Alice (Polar)' : 'Bob (Polar)'; // Simple mapping
      const pubkey = id === 'polarAlice' ? demoPubkeys.alice : demoPubkeys.bob;
      return { id, name, pubkey };
    }).slice(0, MAX_BENEFICIARIES); // Ensure we don't exceed max beneficiaries
    setData('initialReceivers', newBeneficiaries);
  };

  const selectedDemoValues = data.initialReceivers.filter(r => r.id.startsWith('polar')).map(r => r.id);

  return (
    <VStack spacing={6} align="stretch" p={8} borderWidth="1px" borderRadius="lg" shadow="lg" bg="white">
      <Heading as="h2" size="lg" textAlign="center" color="purple.700" fontWeight="semibold">
        Step 2: Choose Initial Beneficiaries
      </Heading>
      <Text textAlign="center" color="gray.600" fontSize="md">
        These are the primary individuals who can access the Plan funds together initially.
        For this demo, you can select up to {MAX_BENEFICIARIES} beneficiaries from your Polar nodes.
      </Text>

      <FormControl>
        <FormLabel fontWeight="semibold" color="gray.700">Select Demo Beneficiaries (up to {MAX_BENEFICIARIES})</FormLabel>
        <CheckboxGroup 
          colorScheme="purple" 
          value={selectedDemoValues} 
          onChange={handleDemoBeneficiaryChange}
        >
          <Stack spacing={3} direction={['column', 'row']}>
            <Checkbox value="polarAlice" isDisabled={selectedDemoValues.length >= MAX_BENEFICIARIES && !selectedDemoValues.includes('polarAlice')}>
              Alice (Polar Node)
            </Checkbox>
            <Checkbox value="polarBob" isDisabled={selectedDemoValues.length >= MAX_BENEFICIARIES && !selectedDemoValues.includes('polarBob')}>
              Bob (Polar Node)
            </Checkbox>
            {/* Add more checkboxes if more demo nodes are configured in DEMO_PUBKEYS */}
          </Stack>
        </CheckboxGroup>
        <FormHelperText color="gray.500">
          In a real scenario, you would input their actual Bitcoin public keys.
        </FormHelperText>
      </FormControl>

      {data.initialReceivers.length > 0 && (
        <Box mt={4}>
          <Text fontWeight="medium" color="gray.700">Selected Beneficiaries:</Text>
          <VStack align="stretch" spacing={2} mt={2}>
            {data.initialReceivers.map((beneficiary, index) => (
              <HStack key={index} p={2} borderWidth="1px" borderColor="gray.200" borderRadius="md" justifyContent="space-between">
                <Text fontSize="sm">{beneficiary.name}</Text>
                <Tooltip label={beneficiary.pubkey} placement="top" hasArrow>
                  <Text fontSize="xs" color="gray.500" cursor="help">
                    {beneficiary.pubkey.substring(0, 10)}...
                  </Text>
                </Tooltip>
              </HStack>
            ))}
          </VStack>
        </Box>
      )}
    </VStack>
  );
}; 