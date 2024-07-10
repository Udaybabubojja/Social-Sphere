import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { Flex, Avatar, Box, Text, Image, Link, Menu, MenuButton, Portal, MenuList, MenuItem, Spinner, IconButton, Button } from '@chakra-ui/react';
import { FaTrash } from 'react-icons/fa';
import Actions from '../components/Actions';
import { formatDistanceToNow } from 'date-fns';
import userAtom from '../atoms/userAtom';
import { useRecoilValue } from 'recoil';
import { BsThreeDotsVertical } from 'react-icons/bs';
import useShowToast from '../hooks/useShowToast';
import InputEmoji from 'react-input-emoji';

const PostPage = () => {
  const { postId, username } = useParams();
  const [post, setPost] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [reply, setReply] = useState('');
  const [isReplying, setIsReplying] = useState(false);
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

          // Fetch details of users who replied
          const repliesData = await Promise.all(
            postData.post.replies.map(async (reply) => {
              const replyUserRes = await fetch(`/api/users/${reply.userId}`, {
                method: 'GET',
                headers: {
                  'Content-Type': 'application/json',
                },
              });
              return await replyUserRes.json();
            })
          );

          // Map replies to include user data
          const enrichedReplies = postData.post.replies.map((reply, index) => ({
            ...reply,
            userProfilePic: repliesData[index].profilePic,
            username: repliesData[index].username,
          }));

          setPost((prevPost) => ({ ...prevPost, replies: enrichedReplies }));
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

  const handleReplyDelete = async (replyId) => {
    if (!window.confirm('Do you want to delete this reply permanently?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/posts/${post._id}/replies/${replyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (res.ok) {
        showToast('Success', 'Reply deleted', 'success');
        setPost((prevPost) => ({
          ...prevPost,
          replies: prevPost.replies.filter(reply => reply._id !== replyId),
        }));
      } else {
        showToast('Error', 'Some error occurred', 'error');
      }
    } catch (error) {
      console.error('Error deleting reply:', error);
      showToast('Error', 'Failed to delete reply', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!currentUser)
      return showToast("Error", "You must be logged in to add a comment", "error");
    if (reply.trim() === '')
      return showToast("Error", "Empty string cannot be added", "error");
    setIsReplying(true);
    try {
      const res = await fetch("/api/posts/reply/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: reply })
      });
      const data = await res.json();
      setPost({ ...post, replies: [...post.replies, data.reply] });
      showToast("Success", "Comment added!", "success");
      setReply("");
    } catch (error) {
      console.log(error);
      showToast("Error", "Failed to add comment", "error");
    } finally {
      setIsReplying(false);
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
        <Flex mt={4} alignItems="center">
          <InputEmoji
            value={reply}
            onChange={setReply}
            cleanOnEnter
            onEnter={handleReply}
            placeholder="Type a comment..."
            borderRadius={2}
          />
          <Button
            ml={2}
            onClick={handleReply}
            isLoading={isReplying}
            colorScheme="blue"
            borderRadius={4}
          >
            Post
          </Button>
        </Flex>
        {post.replies && post.replies.map(reply => (
          <Flex key={reply._id} alignItems="center" mb={2}>
            <Avatar size={{ base: 'xs', md: 'sm' }} name={reply.username} src={reply.userProfilePic} />
            <Box ml={{ base: 2, md: 3 }} flex="1">
              <Link as={RouterLink} to={`/${reply.username}`} cursor="pointer">
                <Text fontSize={{ base: 'sm', md: 'md' }} fontWeight="bold" _hover={{ textDecoration: 'underline' }}>
                  {reply.username}
                </Text>
              </Link>
              <Text fontSize={{ base: 'sm', md: 'md' }}>{reply.text}</Text>
            </Box>
            {(currentUser.user._id === reply.userId || currentUser.user._id === post.postedBy) && (
              <IconButton
                icon={<FaTrash />}
                size="sm"
                colorScheme="red"
                onClick={() => handleReplyDelete(reply._id)}
                isLoading={loading}
              />
            )}
          </Flex>
        ))}
      </Box>
    </Flex>
  );
};

export default PostPage;
