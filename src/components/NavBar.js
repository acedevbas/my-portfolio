import React from 'react';
import { Box, Flex, Link, Spacer, IconButton, useColorModeValue, Container } from '@chakra-ui/react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { SettingsIcon } from '@chakra-ui/icons';

const NavItem = ({ to, children }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const hoverBg = useColorModeValue('gray.200', 'gray.700');
  const activeBg = useColorModeValue('gray.200', 'gray.700');
  const activeColor = useColorModeValue('blue.600', 'blue.200');
  
  return (
    <Link
      as={RouterLink}
      to={to}
      fontWeight="medium"
      fontSize="md"
      px={3}
      py={2}
      rounded="md"
      _hover={{
        textDecoration: 'none',
        bg: hoverBg,
      }}
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : 'inherit'}
      transition="all 0.3s"
    >
      {children}
    </Link>
  );
};

const Navbar = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconHoverBg = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box bg={bgColor} px={4} py={2} borderBottom="1px" borderColor={borderColor} position="sticky" top="0" zIndex="sticky">
      <Container maxW="container.xl">
        <Flex align="center" height="16">
          <NavItem to="/">Портфель</NavItem>
          <NavItem to="/calendar">Календарь дивидендов</NavItem>
          <Spacer />
          <IconButton
            as={RouterLink}
            to="/settings"
            icon={<SettingsIcon />}
            variant="ghost"
            colorScheme="blue"
            aria-label="Настройки"
            size="md"
            _hover={{
              bg: iconHoverBg,
            }}
          />
        </Flex>
      </Container>
    </Box>
  );
};

export default Navbar;