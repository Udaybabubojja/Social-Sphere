import { useEffect, useState } from 'react';
import { Flex, Text, Box, Avatar, Image, Spinner, Link as ChakraLink } from '@chakra-ui/react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import useShowToast from '../hooks/useShowToast';
import Actions from './Actions';

const UserPost = ({ post }) => {
  const [user, setUser] = useState(null);
  const [replies, setReplies] = useState([]);
  const showToast = useShowToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const res = await fetch(`/api/users/${post.postedBy}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const data = await res.json();
        setUser(data);
      } catch (error) {
        console.error('Error fetching user details:', error);
        showToast('Error', 'Failed to fetch user details', 'error');
      }
    };

    const fetchRepliesDetails = async () => {
      try {
        const repliesData = await Promise.all(
          post.replies.map(async (reply) => {
            const res = await fetch(`/api/users/${reply.userId}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            return await res.json();
          })
        );
        setReplies(repliesData);
      } catch (error) {
        console.error('Error fetching replies details:', error);
        showToast('Error', 'Failed to fetch replies details', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchUserDetails();
    fetchRepliesDetails();
  }, [post, showToast]);

  const daysSincePosted = formatDistanceToNow(new Date(post.createdAt), { addSuffix: true });

  if (loading) return <LoadingSpinner />;

  return (
    <Flex gap={3} mb={4} py={5} p={4} mt={2}>
      <Flex flexDirection="column" alignItems="center">
        {user && (<ChakraLink as={Link} to={`/${user.username}`} textDecoration="none">
          <Avatar size={{ base: 'sm', md: 'md' }} name={user ? user.username : 'Loading...'} src={user ? user.profilePic : ''} />
        </ChakraLink>)}
        <Box w="1px" h="full" bg="gray.light" my={2}></Box>
        <Box position="relative" w="full" display="flex" justifyContent="center" mt={2}>
          {post.replies.length === 0 && <Text>😶‍🌫️</Text>}
          {replies.slice(0, 3).map((reply, index) => (
              <Avatar
                key={index}
                name={`User${index}`}
                size="xs"
                src={reply.profilePic}
                position="relative"
                ml={index > 0 ? -2 : 0}
                zIndex={3 - index}
                border="2px solid white"
              />
          ))}
        </Box>
      </Flex>
      <Flex flex={1} flexDirection="column" gap={2}>
        <Flex justifyContent="space-between" w="full">
          {user && (
            <ChakraLink as={Link} to={`/${user.username}`} textDecoration="none">
              <Flex w="full" alignItems="center">
                <Text fontSize={{ base: 'sm', md: 'l' }} fontWeight="bold">
                  {user.username}
                </Text>
              </Flex>
            </ChakraLink>
          )}
          <Flex gap={4} alignItems="center">
            <Text fontSize="xs" width={36} textAlign="right" color="gray.light">
              {daysSincePosted}
            </Text>
          </Flex>
        </Flex>
        {user && post.img && (
          <Box position="relative" borderRadius={6} overflow="hidden" border="1px solid gray">
            <ChakraLink as={Link} to={`/${user.username}/${post._id}`} textDecoration="none">
              <Image src={post.img} w="full" />
            </ChakraLink>
          </Box>
        )}
        {user && (
          <ChakraLink as={Link} to={`/${user.username}/${post._id}`} textDecoration="none" >
            <Text fontSize={{ base: 'sm', md: 'md' }}>{post.text}</Text>
          </ChakraLink>
        )}
        <Flex gap={3} my={1}>
          <Actions post={post} />
        </Flex>
      </Flex>
    </Flex>
  );
};

const LoadingSpinner = () => (
  <Box textAlign="center" marginTop="50px">
    <Spinner size="xl" />
  </Box>
);

export default UserPost;
