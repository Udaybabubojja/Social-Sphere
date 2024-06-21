import { Flex, Text } from "@chakra-ui/react"
import UserPost from "../components/UserPost"
const FeedPage = () => {
  return (
    <>
        <Flex w={"full"}>
            <Flex flex={1} borderBottom={"1.6px solid white"} justifyContent={"center"} pb={3} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Home</Text>
            </Flex>
            <Flex flex={1} borderBottom={"1px solid gray"} justifyContent={"center"} pb={3}  color={"gray.light"} cursor={"pointer"}>
                <Text fontWeight={"bold"}>Explore</Text>
            </Flex>
        </Flex>
        <UserPost likes={1200} replies={481} postImg="/vite.svg" postTitle="Let's Talk!" />
        <UserPost likes={17890} replies={78} postImg="/vite.svg" postTitle="I don't know what to talk!" />
        <UserPost likes={1990} replies={48} postImg="/vite.svg" postTitle="Anything is there to say??" />
        <UserPost likes={15434} replies={701} postTitle="Let's Talk!" />
    </>
  )
}

export default FeedPage