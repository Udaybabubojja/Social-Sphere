import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Flex, Avatar, Box, Text, Image, Link, Menu, MenuButton, Portal, MenuList, MenuItem, Spinner } from '@chakra-ui/react';
import Actions from '../components/Actions';
import { formatDistanceToNow } from 'date-fns';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { BsThreeDotsVertical } from 'react-icons/bs';
import useShowToast from '../hooks/useShowToast';

const PostPage = () => {
  const { postId, username } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUser = useRecoilValue(userAtom);
  const showToast = useShowToast();

  useEffect(() => {
    const fetchPostDetails = async () => {
      try {
        const postRes = await fetch(`/api/posts/${postId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        const postData = await postRes.json();
        if (postData && postData.post) {
          setPost(postData.post);
          if (postData.post.postedBy) {
            const userRes = await fetch(`/api/users/${postData.post.postedBy}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });
            const userData = await userRes.json();
            setUser(userData);
          }
        } else {
          throw new Error('Post data is invalid or empty');
        }
      } catch (error) {
        console.error('Error fetching post details:', error);
        showToast('Error', 'Failed to fetch post details', 'error');
      }
    };

    fetchPostDetails();
  }, [postId, showToast]);

  if (!post || !user) {
    return <Spinner size="xl" />;
  }

  let daysSincePosted;
  try {
    const createdAt = new Date(post.createdAt);
    if (isNaN(createdAt)) {
      throw new Error('Invalid date');
    }
    daysSincePosted = formatDistanceToNow(createdAt, { addSuffix: true });
  } catch (error) {
    console.error('Invalid date value:', post.createdAt);
    daysSincePosted = 'Invalid date';
  }

  const handlePostDelete = async () => {
    if (!window.confirm('Do you want to delete this post permanently?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        showToast('Success', 'Post deleted', 'success');
        navigate(`/${user.username}`);
      } else {
        showToast('Error', 'Some error occurred', 'error');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      showToast('Error', 'Failed to delete post', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (user.username !== username) {
    return <Text>Invalid URL</Text>;
  }

  return (
    <Flex flexDirection="column" gap={3} mb={4} py={5} px={4} mt={2} borderRadius="md">
      <Flex justifyContent="space-between" alignItems="center">
        <Flex alignItems="center">
          <Avatar size={{ base: 'md', md: 'lg' }} name={user.username} src={user.profilePic} />
          <Box ml={{ base: 2, md: 3 }}>
            <Link as={RouterLink} to={`/${user.username}`} cursor="pointer">
              <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                {user.username}
              </Text>
            </Link>
            <Text fontSize="xs" color="gray.500">{daysSincePosted}</Text>
          </Box>
        </Flex>
        {user && currentUser.user._id === user._id && (
          <Menu>
            <MenuButton as={Box} cursor="pointer" _hover={{ transform: 'scale(1.1)' }} transition="0.2s ease">
              <BsThreeDotsVertical size={20} />
            </MenuButton>
            <Portal>
              <MenuList>
                <MenuItem onClick={handlePostDelete} disabled={loading}>
                  {loading ? <Spinner size="xs" /> : 'Delete'}
                </MenuItem>
              </MenuList>
            </Portal>
          </Menu>
        )}
      </Flex>
      <Box>
        {post.img && (
          <Image src={post.img} w="full" borderRadius="md" border="1px solid #e2e8f0" mb={3} />
        )}
        <Text mt={2}>{post.text}</Text>
      </Box>
      <Actions post={post} />
      <Box mt={4}>
        <Text fontWeight="bold" mb={2}>Comments:</Text>
        {post.replies && post.replies.map(reply => (
          <Flex key={reply._id} alignItems="center" mb={2}>
            <Avatar size={{ base: 'xs', md: 'sm' }} name={reply.username} src={reply.profilePic} />
            <Box ml={{ base: 2, md: 3 }}>
              <Link as={RouterLink} to={`/${reply.username}`} cursor="pointer">
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                  {reply.username}
                </Text>
              </Link>
              <Text fontSize={{ base: 'sm', md: 'md' }}>{reply.text}</Text>
            </Box>
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default PostPage;
