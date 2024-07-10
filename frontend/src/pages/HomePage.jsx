import { Button, Flex } from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useRecoilValue } from 'recoil';
import { FaUser, FaCompass } from 'react-icons/fa';
import userAtom from '../atoms/userAtom';
// import ThreeScene from '../components/ThreeScene';
import '../styles/HomePage.css'; // Import CSS file for custom styling

const HomePage = () => {
  const user = useRecoilValue(userAtom);

  return (
    <div className="homepage-container">
      <div className="content">
        <Link to={`/${user.user.username}`}>
          <Flex w={"full"} justifyContent={"center"} alignItems={"center"} mt={4}>
            <Button leftIcon={<FaUser />} mx={"auto"}>Visit Profile Page</Button>
          </Flex>
        </Link>
        <Link to={"/feed"}>
          <Flex w={"full"} padding={3} justifyContent={"center"} alignItems={"center"} mt={4}>
            <Button leftIcon={<FaCompass />} mx={"auto"}>Feed (Home) Page</Button>
          </Flex>
        </Link>
      </div>
    </div>
  );
}

export default HomePage;
