import { useEffect, useState } from "react";
import {
  Box,
  VStack,
  Avatar,
  Text,
  Button,
  Spinner,
} from "@chakra-ui/react";
import { useRecoilValue } from "recoil";
import { useParams } from "react-router-dom";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import { motion } from "framer-motion";

const UserFollowing = () => {
  const { username } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [following, setFollowing] = useState([]);
  const [updating, setUpdating] = useState(false);

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
            bg="white"
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Avatar name={user.username} src={user.profilePic} />
            <Box flex="1" ml={4}>
              <Text fontSize="lg">{user.username}</Text>
              <Text fontSize="sm" color="gray.500">
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
