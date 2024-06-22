import { AddIcon } from "@chakra-ui/icons";
import { Button, useColorMode } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const CreatePost = ({ user }) => {
  const { colorMode } = useColorMode();
  const navigate = useNavigate();

  const handlePost = () => {
    navigate(`/${user.user.username}/createpost`);
  };

  return (
    <Button
      position={"fixed"}
      bottom={10}
      right={10}
      leftIcon={<AddIcon />}
      bg={colorMode === "light" ? "gray.300" : "gray.700"}
      onClick={handlePost}
    >
      Create Post
    </Button>
  );
};

export default CreatePost;