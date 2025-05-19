'use client'

import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  Icon,
  Link as ChakraLink,
  Popover,
  PopoverTrigger,
  PopoverContent,
  useColorModeValue,
  useBreakpointValue,
  useDisclosure,
  Container,
  HStack,
} from '@chakra-ui/react'
import {
  HamburgerIcon,
  CloseIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  InfoIcon,
} from '@chakra-ui/icons'
import { InfoModal } from './InfoModal'
import Link from 'next/link'
import { ThemeSwitcher } from './ThemeSwitcher'
import { FaShieldAlt } from 'react-icons/fa'

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure()
  const { isOpen: isModalOpen, onOpen: onModalOpen, onClose: onModalClose } = useDisclosure()
  
  // Define theme-aware colors
  const navBg = useColorModeValue('white', 'gray.900');
  const navBorder = useColorModeValue('gray.100', 'gray.800');
  const navText = useColorModeValue('gray.800', 'white');
  const logoColor = useColorModeValue('brand.500', 'brand.400');

  return (
    <Box 
      borderBottom="1px" 
      borderStyle={'solid'} 
      borderColor={navBorder} 
      bg={navBg}
      position="sticky"
      top={0}
      zIndex={1000}
      py={2}
      boxShadow="sm"
    >
      <Container maxW="container.xl">
        <Flex
          color={navText}
          minH={'60px'}
          align={'center'}
          justify="space-between"
        >
          <HStack spacing={2}>
            <Icon as={FaShieldAlt} w={8} h={8} color={logoColor} />
          <Text
            as={Link}
            href="/"
              fontSize="xl"
            fontWeight="bold"
              letterSpacing="tight"
              display="flex"
              alignItems="center"
          >
            BitGuardian
          </Text>
          </HStack>

          <Flex display={{ base: 'none', md: 'flex' }}>
            <DesktopNav />
        </Flex>

          <Flex>
            <HStack spacing={4}>
          <Button
            as={Link}
            display={{ base: 'none', md: 'inline-flex' }}
            fontSize={'sm'}
            fontWeight={600}
            href={'/create'}
                colorScheme="brand"
                size="sm"
          >
            Create Plan
          </Button>
              
          <IconButton
            aria-label="About BitGuardian"
            icon={<InfoIcon />}
            onClick={onModalOpen}
            variant="ghost"
                colorScheme="gray"
                size="sm"
          />
              
          <ThemeSwitcher />
              
              <IconButton
                display={{ base: 'flex', md: 'none' }}
                onClick={onToggle}
                icon={
                  isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
                }
                variant={'ghost'}
                aria-label={'Toggle Navigation'}
                size="sm"
              />
            </HStack>
          </Flex>
      </Flex>

      <Collapse in={isOpen} animateOpacity>
        <MobileNav />
      </Collapse>
      </Container>
      
      <InfoModal isOpen={isModalOpen} onClose={onModalClose} />
    </Box>
  )
}

const DesktopNav = () => {
  const linkColor = useColorModeValue('gray.600', 'gray.200')
  const linkHoverColor = useColorModeValue('brand.600', 'brand.300')
  const popoverContentBgColor = useColorModeValue('white', 'gray.800')
  const popoverBorderColor = useColorModeValue('gray.200', 'gray.700')

  return (
    <HStack spacing={8}>
      {NAV_ITEMS.map((navItem) => (
        <Box key={navItem.label}>
          <Popover trigger={'hover'} placement={'bottom-start'} gutter={12}>
            <PopoverTrigger>
              <ChakraLink
                as={Link}
                p={2}
                href={navItem.href ?? '#'}
                fontSize={'sm'}
                fontWeight={500}
                color={linkColor}
                _hover={{
                  textDecoration: 'none',
                  color: linkHoverColor,
                }}
              >
                {navItem.label}
              </ChakraLink>
            </PopoverTrigger>

            {navItem.children && (
              <PopoverContent
                border={1}
                borderStyle="solid"
                borderColor={popoverBorderColor}
                bg={popoverContentBgColor}
                p={4}
                rounded={'md'}
                minW={'sm'}
                boxShadow="xl"
              >
                <Stack>
                  {navItem.children.map((child) => (
                    <DesktopSubNav key={child.label} {...child} />
                  ))}
                </Stack>
              </PopoverContent>
            )}
          </Popover>
        </Box>
      ))}
    </HStack>
  )
}

const DesktopSubNav = ({ label, href, subLabel }: NavItem) => {
  return (
    <ChakraLink
      as={Link}
      href={href ?? '#'}
      role={'group'}
      display={'block'}
      p={2}
      rounded={'md'}
      _hover={{ bg: useColorModeValue('brand.50', 'gray.700') }}
    >
      <Stack direction={'row'} align={'center'}>
        <Box>
          <Text
            transition={'all .3s ease'}
            _groupHover={{ color: useColorModeValue('brand.500', 'brand.300') }}
            fontWeight={500}
          >
            {label}
          </Text>
          <Text fontSize={'sm'} color={useColorModeValue('gray.500', 'gray.400')}>
            {subLabel}
          </Text>
        </Box>
        <Flex
          transition={'all .3s ease'}
          transform={'translateX(-10px)'}
          opacity={0}
          _groupHover={{ opacity: '100%', transform: 'translateX(0)' }}
          justify={'flex-end'}
          align={'center'}
          flex={1}
        >
          <Icon color={'brand.500'} w={5} h={5} as={ChevronRightIcon} />
        </Flex>
      </Stack>
    </ChakraLink>
  )
}

const MobileNav = () => {
  return (
    <Stack
      bg={useColorModeValue('white', 'gray.800')}
      p={4}
      display={{ md: 'none' }}
      borderRadius="md"
      my={2}
      boxShadow="md"
    >
      {NAV_ITEMS.map((navItem) => (
        <MobileNavItem key={navItem.label} {...navItem} />
      ))}
      <Button
        as={Link}
        href="/create"
        w="full"
        colorScheme="brand"
        size="sm"
        mt={2}
      >
        Create Plan
      </Button>
    </Stack>
  )
}

const MobileNavItem = ({ label, children, href }: NavItem) => {
  const { isOpen, onToggle } = useDisclosure()
  const textColor = useColorModeValue('gray.600', 'gray.200')
  const hoverBg = useColorModeValue('gray.50', 'gray.700')

  return (
    <Stack spacing={4} onClick={children && onToggle}>
      <Flex
        py={2}
        as={Link}
        href={href ?? '#'}
        justify={'space-between'}
        align={'center'}
        _hover={{
          textDecoration: 'none',
          bg: hoverBg,
          borderRadius: 'md',
        }}
      >
        <Text
          fontWeight={500}
          color={textColor}
        >
          {label}
        </Text>
        {children && (
          <Icon
            as={ChevronDownIcon}
            transition={'all .25s ease-in-out'}
            transform={isOpen ? 'rotate(180deg)' : ''}
            w={6}
            h={6}
          />
        )}
      </Flex>

      <Collapse in={isOpen} animateOpacity style={{ marginTop: '0!important' }}>
        <Stack
          mt={2}
          pl={4}
          borderLeft={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.700')}
          align={'start'}
        >
          {children &&
            children.map((child) => (
              <ChakraLink
                key={child.label}
                as={Link}
                py={2}
                href={child.href ?? '#'}
                color={textColor}
                _hover={{
                  color: useColorModeValue('brand.500', 'brand.300'),
                }}
              >
                {child.label}
              </ChakraLink>
            ))}
        </Stack>
      </Collapse>
    </Stack>
  )
}

interface NavItem {
  label: string
  subLabel?: string
  children?: Array<NavItem>
  href?: string
}

const NAV_ITEMS: Array<NavItem> = [
  {
    label: 'Dashboard',
    href: '/dashboard',
  },
  {
    label: 'Plans',
    children: [
      {
        label: 'View My Plans',
        subLabel: 'See all your inheritance plans',
        href: '/dashboard',
      },
      {
        label: 'Create New Plan',
        subLabel: 'Set up a new inheritance plan',
    href: '/create',
      },
    ],
  },
  {
    label: 'Learn',
    children: [
      {
        label: 'Documentation',
        subLabel: 'How BitGuardian works',
        href: '#',
      },
      {
        label: 'FAQ',
        subLabel: 'Frequently asked questions',
        href: '#',
      },
    ],
  },
] 