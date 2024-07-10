/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import {
  VStack,
  Box,
  Flex,
  Avatar,
  Text,
  Link,
  MenuButton,
  Menu,
  Portal,
  MenuList,
  MenuItem,
  useToast,
  Button
} from "@chakra-ui/react";
import { CgMoreO } from "react-icons/cg";
import { useNavigate } from "react-router";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { Link as RouterLink } from "react-router-dom";
import useShowToast from "../hooks/useShowToast";

const UserHeader = ({ user }) => {
  const toast = useToast();

  const shareURL = () => {
    const currentURL = window.location.href;
    navigator.clipboard.writeText(currentURL).then(() => {
      toast({
        title: 'Pasted to clipboard',
        description: "Profile URL copied to clipboard",
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    });
  };

  const navigate = useNavigate();
  const editProfile = () => {
    navigate(`/update`);
  };

  const currentUser = useRecoilValue(userAtom);
  const [following, setFollowing] = useState(user.followers.includes(currentUser.user._id));
  const showToast = useShowToast();
  const [updating, setUpdating] = useState(false);

  const handleFollowandUnfollow = async () => {
    if (!currentUser) {
      showToast("Error", "Please Login to Follow", "error");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${user._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      if (data.message) {
        showToast("Error", data.message, "error");
        return;
      }
      console.log(data);
      if (following) {
        showToast("Success", `unfollowed ${user.username}`, "success");
        user.followers.pop();
      } else {
        showToast("Success", `Followed ${user.username}`, "success");
        user.followers.push(currentUser.user._id);
      }
      setFollowing(!following);
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setUpdating(false);
    }
  };

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
      {currentUser.user._id !== user._id && (
        <Button onClick={handleFollowandUnfollow} isLoading={updating}>
          {following ? "Unfollow" : "Follow"}
        </Button>
      )}
      <Flex w="full" justifyContent="space-between" mt={5}>
        <Flex gap={2} alignItems="center">
          <RouterLink to={`/${user.username}/follow`}>
            <Text color="gray.100" fontSize="xs">
              {user.followers.length} followers
            </Text>
          </RouterLink>
          <Box
            width={1}
            height={1}
            borderRadius="full"
            backgroundColor="gray.100"
          ></Box>
          <RouterLink to={`/${user.username}/following`}>
            <Text color="gray.100" fontSize="xs">
              {user.following.length} following
            </Text>
          </RouterLink>
        </Flex>
        <Flex>
          <Box className="icon-container">
            <Menu>
              <MenuButton>
                <CgMoreO size={24} cursor="pointer" />
              </MenuButton>
              <Portal>
                <MenuList>
                  <MenuItem onClick={shareURL}>Share Profile</MenuItem>
                  {currentUser.user._id === user._id && (
                    <MenuItem onClick={editProfile}>Edit Profile</MenuItem>
                  )}
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
