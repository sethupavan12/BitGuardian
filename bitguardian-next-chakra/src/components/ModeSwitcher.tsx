import { useState, useEffect } from 'react';
import { 
  Box, 
  Switch, 
  Text, 
  HStack, 
  useColorModeValue, 
  Tooltip
} from '@chakra-ui/react';

// Demo/Prod mode switcher
export const ModeSwitcher = () => {
  // Use localStorage to persist the mode between refreshes
  const [isProdMode, setIsProdMode] = useState<boolean>(false);
  
  // Load mode from localStorage on component mount
  useEffect(() => {
    const savedMode = localStorage.getItem('bitguardian-mode');
    if (savedMode) {
      setIsProdMode(savedMode === 'prod');
    }
  }, []);
  
  // Update localStorage when mode changes
  const toggleMode = () => {
    const newMode = !isProdMode;
    setIsProdMode(newMode);
    localStorage.setItem('bitguardian-mode', newMode ? 'prod' : 'demo');
    
    // You could trigger an event or context update here
    // to inform other components about the mode change
    const event = new CustomEvent('modeChanged', { detail: { isProdMode: newMode } });
    window.dispatchEvent(event);
  };
  
  const labelColor = useColorModeValue('gray.600', 'gray.300');
  const activeColor = useColorModeValue('green.500', 'green.300');
  
  return (
    <Tooltip 
      label={isProdMode ? 'Production Mode: Use your own Bitcoin wallet' : 'Demo Mode: Use simulated Bitcoin'} 
      placement="bottom"
    >
      <HStack spacing={2}>
        <Text fontSize="sm" color={labelColor} fontWeight="medium">
          {isProdMode ? 'Prod' : 'Demo'}
        </Text>
        <Switch 
          colorScheme="green"
          isChecked={isProdMode}
          onChange={toggleMode}
          size="sm"
        />
      </HStack>
    </Tooltip>
  );
}; 