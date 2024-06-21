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
const UserHeader = () => {
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
    const username = "uday_13"
    const navigate = useNavigate();
    const editProfile = () =>{
        navigate(`/${username}/update`)
    }
    return (
        <VStack gap={4} alignItems={"start"}>
        <Flex justifyContent={"space-between"} w={"full"}>
            <Box>
            <Text fontSize={"2xl"}>{username}</Text>
            <Flex gap={3} alignItems={"center"}>
                <Text fontSize={"small"}>Bojja Uday Babu</Text>
            </Flex>
            {/* <a href="tel:+919014698906">Hello world</a> */}
            </Box>
            <Box>
            <Avatar name="Uday Babu" src="/vite.svg" size={
                {
                    base:"md",
                    md:"xl"
                }
            } />
            </Box>
        </Flex>
        <Text>This is BIO of jflsdfjdsklfjklsdfklsdklfsdlfjsldj</Text>
        <Flex w={"full"} justifyContent={"space-between"} marginLeft={2}>
            <Flex gap={2} alignItems={"center"}>
            <Text color={"gray.light"} fontSize={"xs"}>
                1,34,567 followers
            </Text>
            <Box
                width={1}
                height={1}
                borderRadius={"full"}
                backgroundColor={"gray.light"}
            ></Box>
            <Link color={"gray.light"}>Linked IN</Link>
            </Flex>
            <Flex>
            <Box className="icon-container">
                <Menu>
                <MenuButton>
                    <CgMoreO size={24} cursor={"pointer"} />
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
        <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.6px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Home</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} pb={3}  color={"gray.light"} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Explore</Text>
            </Flex>
        </Flex>
        </VStack>
    );
};

export default UserHeader;
