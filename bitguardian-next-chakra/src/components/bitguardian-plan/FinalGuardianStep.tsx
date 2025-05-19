'use client';

import {
  Box,
  Heading,
  Text,
  VStack,
  FormControl,
  FormLabel,
  FormHelperText,
  RadioGroup,
  Radio,
  Stack,
  Tooltip,
  HStack,
} from '@chakra-ui/react';
import { FormDataState, DemoPubkeys, FinalGuardian } from '../../app/create-bitguardian-plan/page';

interface FinalGuardianStepProps {
  data: FormDataState;
  // Narrow down setData to only update the finalGuardian field
  setData: (field: 'finalGuardian', value: FinalGuardian | null) => void;
  demoPubkeys: DemoPubkeys;
}

export const FinalGuardianStep: React.FC<FinalGuardianStepProps> = ({ data, setData, demoPubkeys }) => {
  const handleDemoGuardianChange = (selectedValue: string) => {
    if (selectedValue === 'polarCarol') { // Example, expand if more demo guardians
      setData('finalGuardian', {
        id: 'polarCarol',
        name: 'Carol (Polar)',
        pubkey: demoPubkeys.carol,
      });
    } else {
      setData('finalGuardian', null); // Or handle other demo guardians
    }
  };

  return (
    <VStack spacing={6} align="stretch" p={8} borderWidth="1px" borderRadius="lg" shadow="lg" bg="white">
      <Heading as="h2" size="lg" textAlign="center" color="purple.700" fontWeight="semibold">
        Step 3: Designate Final Guardian
      </Heading>
      <Text textAlign="center" color="gray.600" fontSize="md">
        If Initial Beneficiaries cannot access the Plan funds after a long period, 
        the Final Guardian can. This provides an ultimate safety net for the Plan.
      </Text>

      <FormControl>
        <FormLabel fontWeight="semibold" color="gray.700">Select Demo Final Guardian</FormLabel>
        <RadioGroup 
          colorScheme="purple" 
          value={data.finalGuardian?.id || ''} 
          onChange={handleDemoGuardianChange}
        >
          <Stack spacing={3} direction={['column', 'row']}>
            <Radio value="polarCarol">Carol (Polar Node)</Radio>
            {/* Add more radio buttons if more demo guardians are configured */}
            {/* e.g., <Radio value="polarDave">Dave (Polar Node)</Radio> */}
          </Stack>
        </RadioGroup>
        <FormHelperText color="gray.500">
          In a real scenario, you would input their actual Bitcoin public key.
        </FormHelperText>
      </FormControl>

      {data.finalGuardian && (
        <Box mt={4}>
          <Text fontWeight="medium" color="gray.700">Selected Final Guardian:</Text>
          <HStack key={data.finalGuardian.id} p={2} borderWidth="1px" borderColor="gray.200" borderRadius="md" justifyContent="space-between">
            <Text fontSize="sm">{data.finalGuardian.name}</Text>
            <Tooltip label={data.finalGuardian.pubkey} placement="top" hasArrow>
              <Text fontSize="xs" color="gray.500" cursor="help">
                {data.finalGuardian.pubkey.substring(0, 10)}...
              </Text>
            </Tooltip>
          </HStack>
        </Box>
      )}
    </VStack>
  );
}; 