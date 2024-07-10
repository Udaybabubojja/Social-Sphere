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

const UserFollowers = () => {
  const { username } = useParams();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();
  const [followers, setFollowers] = useState([]);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        const res = await fetch(`/api/users/${username}/followers`);
        const data = await res.json();
        setFollowers(
          data.followers.map((follower) => ({
            ...follower,
            isFollowing: currentUser.user.following.includes(follower._id),
          }))
        );
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };
    fetchFollowers();
  }, [username, currentUser, showToast]);

  const handleFollowandUnfollow = async (userId, isFollowing) => {
    if (!currentUser) {
      showToast("Error", "Please Login to Follow", "error");
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
      setFollowers((prevFollowers) =>
        prevFollowers.map((follower) =>
          follower._id === userId
            ? { ...follower, isFollowing: !isFollowing }
            : follower
        )
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
      {followers.map((follower) => (
        <motion.div
          key={follower._id}
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
            <Avatar name={follower.username} src={follower.profilePic} />
            <Box flex="1" ml={4}>
              <Text fontSize="lg">{follower.username}</Text>
              <Text fontSize="sm" color="gray.500">
                {follower.name}
              </Text>
            </Box>
            <Button
              onClick={() =>
                handleFollowandUnfollow(follower._id, follower.isFollowing)
              }
              isLoading={updating}
              colorScheme={follower.isFollowing ? "gray" : "blue"}
              variant="outline"
            >
              {follower.isFollowing ? "Unfollow" : "Follow"}
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

export default UserFollowers;
