import  { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
// import UserPost from '../components/UserPost';
import { useParams } from 'react-router';
import useShowToast from '../hooks/useShowToast';

const UserPage = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(false);
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

    getUser();
  }, [username, showToast]);

  if (error) return <div>User not found</div>; // Display an error message or a placeholder when there is an error
  if (!user) return null; // Return null to render nothing while loading

  return (
    <div>
      <UserHeader user={user} />
      
      {/* <UserPost likes={1200} replies={481} postImg="/vite.svg" postTitle="Let's Talk!" />
      <UserPost likes={17890} replies={78} postImg="/vite.svg" postTitle="I don't know what to talk!" />
      <UserPost likes={1990} replies={48} postImg="/vite.svg" postTitle="Anything is there to say??" />
      <UserPost likes={15434} replies={701} postTitle="Let's Talk!" /> */}
    </div>
  );
};

export default UserPage;
