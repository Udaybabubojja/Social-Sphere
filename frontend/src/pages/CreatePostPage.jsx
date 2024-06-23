import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Textarea,
  useColorModeValue,
  Stack,
  Image,
  Center,
  CloseButton,
} from "@chakra-ui/react";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import useShowToast from '../hooks/useShowToast';
import usePreviewImg from '../hooks/usePreviewImg';
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";

const CreatePostPage = () => {
  const showToast = useShowToast();
  const navigate = useNavigate();
  const user = useRecoilValue(userAtom);
  const [postContent, setPostContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = useRef(null);
  const [remainingChar, setRemainingChar] = useState(500);

  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  const handleContentChange = (e) => {
    const input = e.target.value;
    if (input.length > 500) {
      const truncatedTxt = input.slice(0, 500);
      setPostContent(truncatedTxt);
      setRemainingChar(0);
    } else {
      setPostContent(input);
      setRemainingChar(500 - input.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user.user._id,
          text: postContent,
          img: imgUrl,
        }),
      });
      const data = await res.json();
      if (data.message) {
        showToast("Error", data.message, "error");
        return;
      }
      showToast("Success", data.message, "success");
      navigate(`/${user.user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Flex
      minH="100vh"
      align="center"
      justify="center"
      bg={useColorModeValue("gray.50", "gray.800")}
      p={4}
    >
      <Box
        w="full"
        maxW="md"
        bg={useColorModeValue("white", "gray.700")}
        rounded="xl"
        boxShadow="lg"
        p={9}
      >
        <Heading as="h1" mb={6} fontSize="2xl">
          Create New Post
        </Heading>
        <form onSubmit={handleSubmit}>
          <Box mb={4} />
          <FormControl id="postImage" mb={4}>
            <FormLabel>Upload Image</FormLabel>
            <Stack direction={['column', 'row']} spacing={6}>
              <Center w="full">
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Upload Image <BsFillImageFill style={{ margin: 10 }} />
                </Button>
                <Input type="file" hidden ref={fileRef} onChange={handleImageChange} />
              </Center>
            </Stack>
          </FormControl>
          {imgUrl && (
            <Flex py={5} mt={5} w="full" position="relative">
              <Image src={imgUrl} alt="Selected Image" />
              <CloseButton
                onClick={() => {
                  setImgUrl("");
                }}
                bg="gray.500"
                m={-4}
              />
            </Flex>
          )}
          <FormControl id="postContent" isRequired mb={4}>
            <FormLabel>Post Content</FormLabel>
            <Textarea
              placeholder="Write something..."
              value={postContent}
              onChange={handleContentChange}
              size="sm"
            />
            {500 - remainingChar}/500
          </FormControl>
          <Button
            type="submit"
            colorScheme="blue"
            isLoading={isSubmitting}
            width="full"
          >
            Create Post
          </Button>
        </form>
      </Box>
    </Flex>
  );
};

export default CreatePostPage;
