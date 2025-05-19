'use client';

import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormHelperText,
  Heading,
  Text,
  VStack,
} from '@chakra-ui/react';
import { FormDataState } from '../../app/create-bitguardian-plan/page';

// Commenting out local MinimalFormData as we now use shared FormDataState
/*
interface MinimalFormData {
    lockboxName: string;
    // other fields from FormDataState in page.tsx would go here if this component used them
}
*/

interface NamePlanStepProps {
  data: Pick<FormDataState, 'lockboxName'>;
  setData: (field: 'lockboxName', value: string) => void;
}

export const NameLockboxStep: React.FC<NamePlanStepProps> = ({ data, setData }) => {
  return (
    <VStack spacing={6} align="stretch" p={8} borderWidth="1px" borderRadius="lg" shadow="lg" bg="white">
      <Heading as="h2" size="lg" textAlign="center" color="purple.700" fontWeight="semibold">
        Step 1: Name Your BitGuardian Plan
      </Heading>
      <Text textAlign="center" color="gray.600" fontSize="md">
        Give your BitGuardian Plan a memorable name for your records. This is optional.
      </Text>
      <FormControl id="planName">
        <FormLabel fontWeight="semibold" color="gray.700">Plan Name</FormLabel>
        <Input 
          type="text" 
          value={data.lockboxName}
          onChange={(e) => setData('lockboxName', e.target.value)}
          placeholder="e.g., Family Inheritance, Education Fund"
          size="lg"
          focusBorderColor="purple.500"
          borderColor="gray.300"
          _hover={{ borderColor: 'gray.400' }}
        />
        <FormHelperText color="gray.500">This name is for your reference only.</FormHelperText>
      </FormControl>
    </VStack>
  );
}; 