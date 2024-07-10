import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Avatar,
  Text,
  Button,
  Spinner,
  Link as ChakraLink,
  useColorModeValue,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useParams, Link } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { motion } from "framer-motion";

const UserFollowing = () => {
  const { username } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [following, setFollowing] = useState([]);
  const [updating, setUpdating] = useState(false);

  const textColor = useColorModeValue("gray.800", "gray.200");
  const nameColor = useColorModeValue("gray.500", "gray.400");
  const bgColor = useColorModeValue("white", "gray.700");

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        const res = await fetch(`/api/users/${username}/following`);
        const data = await res.json();
        setFollowing(
          data.following.map((followingUser) => ({
            ...followingUser,
            isFollowing: true,
          }))
        );
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    fetchFollowing();
  }, [username, currentUser, showToast]);

  const handleUnfollow = async (userId) => {
    if (!currentUser) {
      showToast("Error", "Please Login to Unfollow", "error");
      return;
    }
    setUpdating(true);
    try {
      const res = await fetch(`/api/users/follow/${userId}`, {
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
      setFollowing((prevFollowing) =>
        prevFollowing.filter((user) => user._id !== userId)
      );
      showToast("Success", data.message, "success");
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <VStack spacing={4} alignItems="stretch">
      {following.map((user) => (
        <motion.div
          key={user._id}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Box
            w="full"
            p={4}
            boxShadow="md"
            borderRadius="md"
            bg={bgColor}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar name={user.username} src={user.profilePic} />
            <Box flex="1" ml={4}>
              <ChakraLink as={Link} to={`/${user.username}`} textDecoration="none">
                <Text fontSize="lg" color={textColor} _hover={{ textDecoration: "underline" }}>
                  {user.username}
                </Text>
              </ChakraLink>
              <Text fontSize="sm" color={nameColor}>
                {user.name}
              </Text>
            </Box>
            <Button
              onClick={() => handleUnfollow(user._id)}
              isLoading={updating}
              colorScheme="gray"
              variant="outline"
            >
              Unfollow
            </Button>
          </Box>
        </motion.div>
      ))}
      {updating && (
        <Box w="full" display="flex" justifyContent="center" mt={4}>
          <Spinner size="lg" />
        </Box>
      )}
    </VStack>
  );
};

export default UserFollowing;
