/* eslint-disable no-unused-vars */
import React from "react";
import {
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Link,
  MenuButton,
  Menu, Portal, MenuList, MenuItem, useToast
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useNavigate } from "react-router";
const UserHeader = ({user}) => {
    const toast = useToast()
    const shareURL = ()=>{
        const currentURL = window.location.href;
        navigator.clipboard.writeText(currentURL).then(()=>{
            toast({
                title: 'Pasted to clipboard',
                description: "Profile URL copied to clipboard",
                status: 'success',
                duration: 3000,
                isClosable: true,
            })
        })
    }
    const navigate = useNavigate();
    const editProfile = () =>{
        navigate(`/update`)
    }
    return (
        <Box
      w="full"
      p={5}
      boxShadow="md"
      borderRadius="md"
      bgGradient="linear(to-r, teal.500, green.500)"
      color="white"
    >
      <Flex justifyContent="space-between" alignItems="center" w="full">
        <Box>
          <Text fontSize="2xl" fontWeight="bold">{user.username}</Text>
          <Flex gap={3} alignItems="center">
            <Text fontSize="small">{user.name}</Text>
          </Flex>
          {/* <a href="tel:+919014698906">Hello world</a> */}
        </Box>
        <Box>
          <Avatar
            name={user.name}
            src={user.profilePic}
            size={{
              base: "md",
              md: "xl",
            }}
            border="2px"
            borderColor="white"
          />
        </Box>
      </Flex>
      <Text mt={3} fontStyle="italic">{user.bio}</Text>
      <Flex w="full" justifyContent="space-between" mt={5}>
        <Flex gap={2} alignItems="center">
          <Text color="gray.100" fontSize="xs">
            {user.followers.length} followers
          </Text>
          <Box
            width={1}
            height={1}
            borderRadius="full"
            backgroundColor="gray.100"
          ></Box>
          <Text color="gray.100" fontSize="xs">
            {user.following.length} following
          </Text>
        </Flex>
        {/* <Link color="gray.100" href="#" textDecoration="underline">
            LinkedIn
          </Link> */}
        <Flex>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor="pointer" />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={shareURL}>Share Profile</MenuItem>
                  <MenuItem onClick={editProfile}>Edit Profile</MenuItem>
                </MenuList>
              </Portal>
            </Menu>
          </Box>
        </Flex>
      </Flex>
    </Box>
    );
};

export default UserHeader;
