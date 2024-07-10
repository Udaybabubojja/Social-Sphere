/* eslint-disable no-unused-vars */
import React from 'react';
import { Flex, IconButton, Text, Box, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerCloseButton, DrawerHeader, DrawerBody, Button } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { FaUser, FaCompass, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { useRecoilValue } from 'recoil';
import { keyframes } from '@emotion/react';
import userAtom from '../atoms/userAtom';
import DarkModeToggle from './DarkModeToggle';
import LogoutButton from './LogoutButton';

const Header = () => {
  const user = useRecoilValue(userAtom);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Animation keyframes
  const hoverAnimation = keyframes`
    from {
      transform: scale(1);
    }
    to {
      transform: scale(1.1);
    }
  `;

  return (
    <Flex justifyContent="space-between" alignItems="center" padding={4}>
      <Flex display={{ base: 'none', md: 'flex' }}>
        {!isOpen && <DarkModeToggle />}
      </Flex>
      <Link to="/" style={{ flex: '1', textAlign: 'center' }}>
        <Text 
          fontSize={{ base: 'md', md: '2xl' }} 
          fontFamily="'Roboto', sans-serif" 
          fontWeight="bold"
          textAlign="center"
        >
          Social-Sphere
        </Text>
      </Link>
      <Flex display={{ base: 'none', md: 'flex' }}>
        <Link to="/feed">
          <IconButton
            aria-label="Feed"
            icon={<FaCompass />}
            variant="outline"
            mr={2}
            _hover={{
              animation: `${hoverAnimation} 0.2s ease-in-out forwards`,
            }}
          />
        </Link>
        <Link to={`/${user.user.username}`}>
          <IconButton
            aria-label="Profile"
            icon={<FaUser />}
            variant="outline"
            mr={2}
            _hover={{
              animation: `${hoverAnimation} 0.2s ease-in-out forwards`,
            }}
          />
        </Link>
        {user && (
          <LogoutButton
            _hover={{
              animation: `${hoverAnimation} 0.2s ease-in-out forwards`,
            }}
          />
        )}
      </Flex>
      <IconButton
        aria-label="Menu"
        icon={<FaBars />}
        variant="outline"
        display={{ base: 'flex', md: 'none' }}
        onClick={onOpen}
      />
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Box mb={4}>
              <DarkModeToggle />
            </Box>
            <Link to="/feed" onClick={onClose}>
              <Button
                leftIcon={<FaCompass />}
                variant="outline"
                mb={4}
                w="full"
                justifyContent="flex-start"
              >
                Feed
              </Button>
            </Link>
            <Link to={`/${user.user.username}`} onClick={onClose}>
              <Button
                leftIcon={<FaUser />}
                variant="outline"
                mb={4}
                w="full"
                justifyContent="flex-start"
              >
                Profile
              </Button>
            </Link>
            {user && (
              <LogoutButton
                w="full"
                justifyContent="flex-start"
                onClick={() => {
                  onClose();
                }}
                _hover={{
                  animation: `${hoverAnimation} 0.2s ease-in-out forwards`,
                }}
              >
                Logout
              </LogoutButton>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default Header;
