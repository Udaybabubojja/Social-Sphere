import { Flex, Text, Spinner } from "@chakra-ui/react";
import UserPost from "../components/UserPost";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";

const FeedPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const showToast = useShowToast();

  useEffect(() => {
    const getPosts = async () => {
      setLoading(true);
      try {
        let res;
        if (activeTab === "home") {
          res = await fetch("/api/posts/feed");
        } else if (activeTab === "explore") {
          res = await fetch("/api/posts/explore", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
          });
        }
        const data = await res.json();
        if (data.message) {
          showToast("Error", data.message, "error");
          return;
        }
        setPosts(data.feedPosts);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, [activeTab, showToast]);

  return (
    <>
      <Flex w={"full"} borderBottom="1px solid gray">
        <Flex
          flex={1}
          borderBottom={activeTab === "home" ? "2px solid white" : "1px solid gray"}
          justifyContent={"center"}
          pb={3}
          cursor={"pointer"}
          onClick={() => setActiveTab("home")}
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
          onClick={() => setActiveTab("explore")}
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
      ) : (
        <Flex direction="column" p={4}>
          {posts.length > 0 ? (
            posts.map((post) => (
              <UserPost
                key={post._id}
                post={post}
              />
            ))
          ) : (
            <Text>No posts Yet!!!</Text>
          )}
        </Flex>
      )}
    </>
  );
};

export default FeedPage;
