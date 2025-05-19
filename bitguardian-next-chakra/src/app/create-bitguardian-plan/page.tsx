'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Container,
  Heading,
  Button,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  StepTitle,
  StepDescription,
  StepSeparator,
  VStack,
  HStack,
  useToast,
  // CircularProgress, // Not used yet, keep for isLoading if a spinner is desired beyond button
} from '@chakra-ui/react';

// Import actual step components as they are created
import { NameLockboxStep } from '../../components/bitguardian-plan/NameLockboxStep';
import { InitialReceiversStep } from '../../components/bitguardian-plan/InitialReceiversStep';
import { FinalGuardianStep } from '../../components/bitguardian-plan/FinalGuardianStep';
import { AccessCheckpointsStep } from '../../components/bitguardian-plan/AccessCheckpointsStep';
import { ReviewStep } from '../../components/bitguardian-plan/ReviewStep';
import { CreationSuccessDisplay } from '../../components/bitguardian-plan/CreationSuccessDisplay';

// --- Type Definitions ---
export interface DemoPubkeys { // EXPORTED
    alice: string;
    bob: string;
    carol: string;
    [key: string]: string;
}
export interface InitialReceiver { // EXPORTED
    id: string; 
    name: string;
    pubkey: string;
}
export interface FinalGuardian { // EXPORTED
    id: string;
    name: string;
    pubkey: string;
}
export interface FormDataState { // EXPORTED
  lockboxName: string;
  initialReceivers: InitialReceiver[];
  finalGuardian: FinalGuardian | null;
  survivorAccessTime: string;
  guardianAccessTime: string;
}
interface StepComponentProps {
  data: FormDataState;
  setData: (field: keyof FormDataState, value: any) => void; 
  demoPubkeys?: DemoPubkeys; 
}
interface ReviewStepProps {
  data: FormDataState;
}
export interface ApiResponsePlanDetails { // EXPORTED (if needed by other modules)
  primaryHeirPubkeys: string[];
  recoveryPubkey: string;
  survivorAccessTime: number;
  guardianAccessTime: number;
  network: string;
}
export interface ApiResponse { // EXPORTED (if needed by other modules)
    success: boolean;
    message: string;
    lockboxAddress?: string;
    accessBlueprint?: string;
    planDetails?: ApiResponsePlanDetails;
    error?: string;
}
interface CreationSuccessProps {
  response: ApiResponse | null; 
}

// Placeholder components for steps not yet created (with basic prop typing)
// const FinalGuardianStep: React.FC<StepComponentProps> = ({ data, setData, demoPubkeys }) => <Box p={5} shadow=\"md\" borderWidth=\"1px\">Step 3: Final Guardian (Placeholder)</Box>;
// Re-enable FinalGuardianStep import and usage once its file is stable

const steps = [
  { title: 'Name', description: 'Plan Details' },
  { title: 'Beneficiaries', description: 'Initial Access' },
  { title: 'Guardian', description: 'Final Safety Net' },
  { title: 'Checkpoints', description: 'Access Timing' },
  { title: 'Review', description: 'Confirm & Create' },
];

const DEMO_PUBKEYS: DemoPubkeys = {
  alice: '02aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  bob:   '02bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb',
  carol: '02cccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccccc',
};

export default function CreateBitGuardianPlanPage() { // Formerly CreateLegacyLockboxPage
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<FormDataState>({
    lockboxName: '',
    initialReceivers: [],
    finalGuardian: null,
    survivorAccessTime: '',
    guardianAccessTime: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const toast = useToast();

  const handleNext = () => {
    if (currentStep === 1 && formData.initialReceivers.length === 0) {
        toast({ title: 'Validation Error', description: 'Please select at least one Initial Beneficiary.', status: 'warning', duration: 3000, isClosable: true });
        return;
    }
    if (currentStep === 2 && !formData.finalGuardian) {
        toast({ title: 'Validation Error', description: 'Please select a Final Guardian.', status: 'warning', duration: 3000, isClosable: true });
        return;
    }
    if (currentStep === 3) {
        const beneficiaryTime = parseInt(formData.survivorAccessTime, 10);
        const guardianTime = parseInt(formData.guardianAccessTime, 10);
        if (isNaN(beneficiaryTime) || beneficiaryTime <= 0) {
            toast({ title: 'Validation Error', description: 'Please enter a valid Initial Beneficiary Access Time (blocks).', status: 'warning', duration: 3000, isClosable: true });
            return;
        }
        if (isNaN(guardianTime) || guardianTime <= 0) {
            toast({ title: 'Validation Error', description: 'Please enter a valid Guardian Access Time (blocks).', status: 'warning', duration: 3000, isClosable: true });
            return;
        }
        if (guardianTime <= beneficiaryTime) {
            toast({ title: 'Validation Error', description: 'Guardian Access Time must be greater than Initial Beneficiary Access Time.', status: 'warning', duration: 3000, isClosable: true });
            return;
        }
    }
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (apiResponse) {
        setApiResponse(null);
        setApiError(null);
        setFormData({ lockboxName: '', initialReceivers: [], finalGuardian: null, survivorAccessTime: '', guardianAccessTime: '' });
        setCurrentStep(0);
        return;
    }
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setApiError(null); 
    }
  };

  const updateFormData = (field: keyof FormDataState, value: FormDataState[keyof FormDataState]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitPlan = async () => {
    setIsLoading(true);
    setApiError(null);

    if (formData.initialReceivers.length === 0) {
        toast({ title: 'Validation Error', description: 'At least one Initial Beneficiary is required.', status: 'error', duration: 5000, isClosable: true });
        setIsLoading(false); return;
    }
    if (!formData.finalGuardian?.pubkey) {
        toast({ title: 'Validation Error', description: 'Final Guardian public key is missing.', status: 'error', duration: 5000, isClosable: true });
        setIsLoading(false); return;
    }
    const beneficiaryTime = parseInt(formData.survivorAccessTime, 10);
    const guardianTime = parseInt(formData.guardianAccessTime, 10);

    if (isNaN(beneficiaryTime) || beneficiaryTime <= 0 || isNaN(guardianTime) || guardianTime <= 0) {
        toast({ title: 'Validation Error', description: 'Access Checkpoint times must be valid positive numbers.', status: 'error', duration: 5000, isClosable: true });
        setIsLoading(false); return;
    }
    if (guardianTime <= beneficiaryTime) {
        toast({ title: 'Validation Error', description: 'Guardian Access Time must be after Initial Beneficiary Access Time.', status: 'error', duration: 5000, isClosable: true });
        setIsLoading(false); return;
    }

    const primaryHeirPubkeys = formData.initialReceivers.map(r => r.pubkey);
    const recoveryPubkey = formData.finalGuardian.pubkey; 

    try {
      const response = await fetch('/api/inheritance/aethelred/create-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primaryHeirPubkeys,
          recoveryPubkey,
          lockTimePath2: beneficiaryTime,
          lockTimePath3: guardianTime,
        }),
      });

      const result: ApiResponse = await response.json();
      if (!response.ok || !result.success) throw new Error(result.error || `HTTP error! status: ${response.status}`);
      setApiResponse(result);
      toast({ title: 'BitGuardian Plan Created!', description: result.message, status: 'success', duration: 9000, isClosable: true });
    } catch (error: any) { 
      console.error('Error creating BitGuardian Plan:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred.';
      setApiError(message);
      toast({ title: 'Plan Creation Failed', description: message, status: 'error', duration: 9000, isClosable: true });
    }
    setIsLoading(false);
  };

  const currentStepComponent = useMemo(() => {
    if (apiResponse && apiResponse.success) { 
        return <CreationSuccessDisplay response={apiResponse} />;
    }
    switch (currentStep) {
      case 0: return <NameLockboxStep data={formData} setData={updateFormData} />;
      case 1: return <InitialReceiversStep data={formData} setData={updateFormData as any} demoPubkeys={DEMO_PUBKEYS} />;
      case 2: return <FinalGuardianStep data={formData} setData={updateFormData as any} demoPubkeys={DEMO_PUBKEYS} />;
      case 3: return <AccessCheckpointsStep data={formData} setData={updateFormData as any} />;
      case 4: return <ReviewStep data={formData} />;
      default: return null;
    }
  }, [currentStep, formData, apiResponse]);

  return (
    <Container maxW="container.xl" py={10} bg="gray.50" minH="100vh">
      <Box bg="white" p={10} borderRadius="xl" shadow="2xl">
        <Heading as="h1" mb={8} textAlign="center" size="2xl" color="purple.600" fontWeight="bold" letterSpacing="tight">
          Create Your BitGuardian Plan
        </Heading>
        
        {!apiResponse?.success && (
          <Stepper index={currentStep} mb={10} colorScheme="purple">
            {steps.map((step, index) => (
              <Step key={index}>
                <StepIndicator borderWidth={2} borderColor="purple.500">
                  <StepStatus
                    complete={<StepIcon />}
                    incomplete={<StepNumber />}
                    active={<StepNumber />}
                  />
                </StepIndicator>
                <Box flexShrink="0" ml={2}>
                  <StepTitle>{step.title}</StepTitle> 
                  <StepDescription>{step.description}</StepDescription>
                </Box>
                <StepSeparator />
              </Step>
            ))}
          </Stepper>
        )}

        <Box minH="350px" p={5} borderWidth="1px" borderColor="gray.200" borderRadius="lg">
          {currentStepComponent}
        </Box>

        {apiError && (
          <Box color="red.500" mt={4} textAlign="center" fontWeight="medium">Error: {apiError}</Box>
        )}

        <HStack mt={10} justify="space-between">
          <Button 
            onClick={handlePrevious} 
            isDisabled={currentStep === 0 && !apiResponse?.success} 
            variant="outline"
            colorScheme="purple"
            size="lg"
            px={8}
          >
            {apiResponse?.success ? 'Create Another Plan' : 'Previous'}
          </Button>
          {!apiResponse?.success && currentStep < steps.length - 1 && (
            <Button onClick={handleNext} colorScheme="purple" size="lg" px={8}>
              Next
            </Button>
          )}
          {!apiResponse?.success && currentStep === steps.length - 1 && (
            <Button 
              onClick={handleSubmitPlan} 
              colorScheme="green" 
              isLoading={isLoading} 
              loadingText="Creating..."
              size="lg"
              px={8}
            >
              Create BitGuardian Plan
            </Button>
          )}
        </HStack>
      </Box>
    </Container>
  );
} 