import { Flex, Text, Spinner } from "@chakra-ui/react";
import UserPost from "../components/UserPost";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home"); // State to manage active tab
  const showToast = useShowToast();

  useEffect(() => {
    setLoading(true);
    const getFeedPosts = async () => {
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();
        if (data.message) {
          showToast("Error", data.message, "error");
          return;
        }
        console.log(data.feedPosts)
        setPosts(data.feedPosts); // Set the posts data
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast]);

  return (
    <>
      <Flex w={"full"} borderBottom="1px solid gray">
        <Flex
          flex={1}
          borderBottom={activeTab === "home" ? "2px solid white" : "1px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          onClick={() => setActiveTab("home")} // Set active tab to home
        >
          <Text fontWeight={"bold"} color={activeTab === "home" ? "white" : "gray"}>
            Home
          </Text>
        </Flex>
        <Flex
          flex={1}
          borderBottom={activeTab === "explore" ? "2px solid white" : "1px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          onClick={() => setActiveTab("explore")} // Set active tab to explore
        >
          <Text fontWeight={"bold"} color={activeTab === "explore" ? "white" : "gray"}>
            Explore
          </Text>
        </Flex>
      </Flex>

      {loading ? (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Spinner size="xl" />
        </Flex>
      ) : activeTab === "home" ? (
        <Flex direction="column" p={4}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <UserPost
                key={post._id}
                likes={post.likes}
                replies={post.replies}
                postImg={post.img}
                postTitle={post.text}
                postedBy={post.postedBy}
                createdAt={post.createdAt}
              />
            ))
          ) : (
            <Text>No posts available</Text>
          )}
        </Flex>
      ) : (
        <Flex justifyContent="center" alignItems="center" height="100vh">
          <Text fontSize="xl" color="gray.500">
            Explore feature will be available soon.
          </Text>
        </Flex>
      )}
    </>
  );
};

export default FeedPage;
