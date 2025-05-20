'use client'

import {
  Box,
  Container,
  Heading,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'

export default function FAQPage() {
  // Theme-aware colors
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const headingColor = useColorModeValue('brand.600', 'brand.400');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  const faqs = [
    {
      question: "What is BitGuardian?",
      answer: "BitGuardian is a secure Bitcoin inheritance platform that helps you ensure your Bitcoin assets are passed to your designated heirs when needed. It provides a way to create inheritance plans without giving up custody of your Bitcoin."
    },
    {
      question: "How secure is BitGuardian?",
      answer: "BitGuardian uses secure Bitcoin transactions and never takes custody of your funds. All inheritance plans are secured using cryptographic techniques, and your private keys remain under your control at all times."
    },
    {
      question: "What happens if I lose access to my BitGuardian account?",
      answer: "BitGuardian is designed to be non-custodial. Your inheritance plans are stored on the Bitcoin blockchain, ensuring they remain accessible even if you lose access to your BitGuardian account."
    },
    {
      question: "Can I update my inheritance plan after creating it?",
      answer: "Yes, you can modify your inheritance plans at any time as long as you have access to your account and your Bitcoin wallet."
    },
    {
      question: "How does BitGuardian know when to execute my inheritance plan?",
      answer: "BitGuardian uses a combination of activity monitoring, time-based triggers, and optional verification methods you can configure. You can set up inactivity periods or specific dates as triggers for your inheritance execution."
    },
    {
      question: "What's the difference between Demo and Production modes?",
      answer: "Demo mode uses a simulated Bitcoin environment (testnet) so you can try out the features without using real Bitcoin. Production mode connects to your actual Bitcoin wallet and uses the main Bitcoin network."
    },
    {
      question: "How many heirs can I add to my inheritance plan?",
      answer: "In production mode, you can add as many heirs as you wish. Each heir can receive a specified percentage of your Bitcoin inheritance."
    },
    {
      question: "What fees does BitGuardian charge?",
      answer: "BitGuardian charges a small fee for creating and managing inheritance plans. The exact fee structure can be found on our pricing page. Additionally, standard Bitcoin network fees apply when executing transactions."
    },
    {
      question: "Is my personal information stored by BitGuardian?",
      answer: "BitGuardian collects minimal personal information, and you can use pseudonyms for your heirs. We prioritize privacy and only store essential information to make the service function properly."
    }
  ];

  return (
    <Box bg={bgColor} py={12}>
      <Container maxW="container.md">
        <VStack spacing={8} align="stretch" mb={12}>
          <Box textAlign="center">
            <Heading as="h1" size="xl" mb={4}>Frequently Asked Questions</Heading>
            <Text fontSize="lg" color={useColorModeValue('gray.600', 'gray.400')}>
              Find answers to common questions about BitGuardian's Bitcoin inheritance platform
            </Text>
          </Box>
          
          <Accordion allowToggle borderColor={borderColor}>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} borderColor={borderColor}>
                <h2>
                  <AccordionButton py={4}>
                    <Box flex="1" textAlign="left" fontWeight="semibold">
                      {faq.question}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4}>
                  <Text>{faq.answer}</Text>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </VStack>
      </Container>
    </Box>
  )
} 