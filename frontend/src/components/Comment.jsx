/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { Flex, Avatar, Text, Divider } from '@chakra-ui/react'
import React, {useState} from 'react'
import { BsThreeDots } from 'react-icons/bs'
import Actions from './Actions'
const Comment = ({likes, comment, createdAt, username, userAvatar}) => {
    const [liked, setLiked] = useState(false)
    return (
        <>
            <Flex justifyContent="space-between" alignItems="center" mb={4}>
                <Flex alignItems="center" gap={3}>
                    <Avatar src={userAvatar} size="xs" />
                    <Text fontWeight="bold">{username}</Text>
                </Flex>
                <Flex alignItems="center" gap={4}>
                    <Text fontSize="sm" color="gray.500">
                    {createdAt}
                    </Text>
                    <BsThreeDots />
                </Flex>
            </Flex>
            <Flex flexDirection={"column"} ml={8} gap={2}>
                <Text>{comment}</Text>
                <Flex gap={3} alignItems={"center"}>
                <Actions liked={liked} setLiked={setLiked}/>
                </Flex>
                <Text color={"gray.light"} fontSize='sm' mt={"-10px"}>
                        {likes +(liked ?1:0)}likes
                </Text>
            </Flex>
            <Divider my={4}/>
        </>
    );
}

export default Comment
