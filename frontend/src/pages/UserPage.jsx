import { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserPost from '../components/UserPost';
import { useParams } from 'react-router';
import useShowToast from '../hooks/useShowToast';
import { Text, Spinner, Box} from '@chakra-ui/react';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  const { username } = useParams();
  const showToast = useShowToast();

  useEffect(() => {
    const getUser = async () => {
      try {
        const res = await fetch(`/api/users/profile/${username}`);
        const data = await res.json();
        if (data.message) {
          setError(true);
          showToast('Error', data.message, 'error');
        } else {
          setUser(data);
        }
      } catch (error) {
        setError(true);
        showToast('Error', error.message, 'error');
        console.log(error);
      }
    };

    const getPosts = async () => {
      try {
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();
        setPosts(data);
      } catch (error) {
        setError(true);
        showToast('Error', error.message, 'error');
        console.log(error);
      }
    };

    const fetchData = async () => {
      setLoading(true);
      await getUser();
      await getPosts();
      setLoading(false);
    };

    fetchData();
  }, [username, showToast]);

  // const handlePostDelete = async (postId) => {
  //   // Delete logic here
  //   alert("Do you want to delete this post permanently?");
  //   try {
  //     const res = await fetch(`/api/posts/${postId}`, {
  //       method: "DELETE",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     if (res.ok) {
  //       alert("Post deleted");
  //       window.location.reload(); // Reload the page after deletion
  //     } else {
  //       const data = await res.json();
  //       showToast("Error", data.message, "error");
  //     }
  //   } catch (error) {
  //     console.error("Error deleting post:", error);
  //     showToast("Error", "Failed to delete post", "error");
  //   }
  // };

  if (loading) return <Box textAlign="center" marginTop="50px"><Spinner size="xl" /></Box>; // Display a loading spinner while fetching data
  if (error) return <div>User not found</div>; // Display an error message when there is an error
  if (!user) return null; // Return null to render nothing while loading

  return (
    <div>
      <UserHeader user={user} />
      {posts.length > 0 ? (
        posts.map((post) => (
        <UserPost post={post} key={post._id} />
        ))
      ) : (
        <Text>No posts yet!</Text>
      )}
    </div>
  );
};

export default UserPage;
