'use client'

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  List,
  ListItem,
  ListIcon,
  Box,
  Divider
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function InfoModal({ isOpen, onClose }: InfoModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>About BitGuardian (Demo)</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text mb={4}>
            <strong>BitGuardian</strong> is a Bitcoin inheritance platform running in a local Polar Bitcoin testnet environment.
          </Text>
          
          <Text mb={3}>
            This demo shows how Bitcoin can be used for inheritance planning with:
          </Text>
          
          <List spacing={3} mb={4}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Customizable distribution</strong> - Split your Bitcoin between heirs according to your wishes
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Inactivity detection</strong> - Inheritance is triggered after a specified period of inactivity
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              <strong>Multiple verification methods</strong> - Various ways to verify inactivity before releasing funds
            </ListItem>
          </List>
          
          <Divider my={4} />
          
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" mb={2}>
              Demo Environment:
            </Text>
            <Text mb={3}>
              This application is connected to a local Bitcoin testnet (regtest) with fixed nodes:
            </Text>
            <List spacing={2}>
              <ListItem>
                <strong>Alice</strong> - The owner of the funds
              </ListItem>
              <ListItem>
                <strong>Bob</strong> - Heir #1
              </ListItem>
              <ListItem>
                <strong>Carol</strong> - Heir #2
              </ListItem>
            </List>
          </Box>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 