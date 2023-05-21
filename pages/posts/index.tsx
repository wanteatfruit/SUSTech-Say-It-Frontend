import Navbar from "../../components/Navbar";
import MainPost from "../../components/MainPostText";
import TextInput from "../../components/TextInput";
import SpaceCard from "../../components/spaces/SpaceCard";
import ReplyPostCard from "../../components/ReplyPostText";
import React, { useState } from 'react';
import axios from "axios";
import {
  Flex,
  Container,
  Box,
  Text,
  HStack,
  Textarea,
  VStack,
  Divider,
  Button
} from "@chakra-ui/react";
import RelatedPosts from "@/components/posts/RelatedPosts";


type addComentResponse = {
  commentID: string;
  // 还不确定，返回新发布的整个post
};

export default function Home() {
  const [content_value, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    const userID=localStorage.getItem("userID");
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post("/comment/addcomment", {
        userID,
        content_value,
        // 需要添加postid
      });

      const data: addComentResponse = response.data;

      // need change 重新刷新当前post界面
      window.location.href = "/"; // Redirect to homepage

    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex  mt={12} direction="column">
      <Navbar />
      <Flex as="main" role="main" direction="column" pt={10}>
        <Box px="10vw">
          <HStack spacing={4} alignItems="flex-start">
            <Flex flex={7} role="left">
              <VStack width="100%" spacing={4}>
                <Box role="poster_section" width="100%" padding={0} margin={0}>
                  <MainPost />
                </Box>
                <Divider py={5}/>
                <Container>
                  <TextInput value={content_value} setValue={setContent}/>
                </Container>
                {/* <Text>{content_value}</Text> */}
                <Button 
                  variant="solid" 
                  onClick={() => (window.location.href = "/")}
                >
                发送
                </Button>
                <VStack mt={0}  role="reply_section" width="100%">
                  <ReplyPostCard />
                  <ReplyPostCard />
                </VStack>
              </VStack>
            </Flex>
            <Flex flex={2} flexDirection='column'>
              <VStack>
              <Box minH={20} width="100%" padding={0} margin={0}>
                <SpaceCard />
              </Box>
              <Box width='100%'>
              <RelatedPosts />
              </Box>
              </VStack>
            </Flex>
          </HStack>
        </Box>
      </Flex>
    </Flex>
  );
}
