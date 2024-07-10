import { Flex, Text, Box, Modal, ModalOverlay, ModalContent, ModalCloseButton, ModalBody, FormControl, Input, ModalFooter, Button, useDisclosure, ModalHeader } from "@chakra-ui/react";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import useAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
// import { useNavigate } from "react-router";

const Actions = ({ post: post_ }) => {
  const user = useRecoilValue(useAtom);
  const [post, setPost] = useState(post_);
  const [liked, setLiked] = useState(post_.likes.includes(user?.user._id));
  const [isLiking, setIsLiking] = useState(false);
  const [reply, setReply] = useState("");
  const [isReplying, setIsReplying] = useState(false);
  const showToast = useShowToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleLikeAndUnlike = async () => {
    if (!user)
      return showToast("Error", "You must be logged in to like the post", "error");
    if (isLiking) return;
    setIsLiking(true);
    try {
      const res = await fetch("/api/posts/like/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      console.log(data);
      if (data.message) return showToast("error", data.message, "error");
      if (!liked) {
        setPost({ ...post, likes: [...post.likes, user.user._id] });
      } else {
        setPost({
          ...post,
          likes: post.likes.filter((id) => id !== user.user._id),
        });
      }
      setLiked(!liked);
    } catch (error) {
      console.log(error);
    } finally {
      setIsLiking(false);
    }
  };
  const handleReply = async()=>{
    if (!user)
      return showToast("Error", "You must be logged in to like the post", "error");
    if (reply.trim()=='')
      return showToast("Error", "Empty String cannot be added", "error");
    setIsReplying(true);
    try {
      const res = await fetch("/api/posts/reply/" + post._id, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body:JSON.stringify({text: reply})
      });
      const data = await res.json();
      console.log(data);
      setPost({ ...post, replies: [...post.replies, data.reply] });
      showToast("Success", "Comment is added!", "success");
      onClose();
      setReply("");
    } catch (error) {
      console.log(error)
    }finally{
      setIsReplying(false);
    }
  }
  return (
    <Flex flexDirection="column">
      <Flex gap={3} my={2} onClick={(e) => e.preventDefault()}>
        <svg
          aria-label="Like"
          color={liked ? "rgb(237, 73, 86)" : ""}
          fill={liked ? "rgb(237, 73, 86)" : "transparent"}
          height="19"
          role="img"
          viewBox="0 0 24 22"
          width="20"
          onClick={handleLikeAndUnlike}
          cursor={"pointer"}
        >
          <path
            d="M1 7.66c0 4.575 3.899 9.086 9.987 12.934.338.203.74.406 1.013.406.283 0 .686-.203 1.013-.406C19.1 16.746 23 12.234 23 7.66 23 3.736 20.245 1 16.672 1 14.603 1 12.98 1.94 12 3.352 11.042 1.952 9.408 1 7.328 1 3.766 1 1 3.736 1 7.66Z"
            stroke="currentColor"
            strokeWidth="2"
          ></path>
        </svg>

        <svg
          aria-label="Comment"
          color=""
          fill=""
          height="20"
          role="img"
          viewBox="0 0 24 24"
          width="20"
          onClick={onOpen}
          cursor={"pointer"}
        >
          <title>Comment</title>
          <path
            d="M20.656 17.008a9.993 9.993 0 1 0-3.59 3.615L22 22Z"
            fill="none"
            stroke="currentColor"
            strokeLinejoin="round"
            strokeWidth="2"
          ></path>
        </svg>

        <ShareSVG />
      </Flex>
      <Flex gap={2} alignItems={"center"}>
        <Text color={"gray.light"} fontSize="sm">
          {post.replies.length} replies
        </Text>
        <Box w={0.5} h={0.5} borderRadius={"full"} bg={"gray.light"}></Box>
        <Text color={"gray.light"} fontSize="sm">
          {post.likes.length} likes
        </Text>
      </Flex>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader></ModalHeader>
          <ModalCloseButton ml={13}/>
          <ModalBody pb={6}>
            <FormControl>
              <Input placeholder="Add your comment"
                value={reply}
                onChange={(e)=>setReply(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3}
              isLoading={isReplying}
              onClick={handleReply}
            >
              Reply
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
};

export default Actions;

const ShareSVG = () => {
  return (
    <svg
      aria-label="Share"
      color=""
      fill="rgb(243, 245, 247)"
      height="20"
      role="img"
      viewBox="0 0 24 24"
      width="20"
    >
      <title>Share</title>
      <line
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
        x1="22"
        x2="9.218"
        y1="3"
        y2="10.083"
      ></line>
      <polygon
        fill="none"
        points="11.698 20.334 22 3.001 2 3.001 9.218 10.084 11.698 20.334"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="2"
      ></polygon>
    </svg>
  );
};
