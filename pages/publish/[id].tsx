import Navbar from "../../components/Navbar";
import TextInput from "../../components/TextInput";
import SpaceCard from "../../components/spaces/SpaceCard";
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
// import localStorage from "localStorage";
import {
  Flex,
  Container,
  Text,
  Box,
  HStack,
  Textarea,
  VStack,
  Stack,
  SimpleGrid,
  Divider,
  Heading,
  Card,
  Input,
  Button,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from "@chakra-ui/react";
import path from "path";
import { postInterface } from "@/interfaces/postInterface";
import { milvusData } from "@/interfaces/milvusInterface";
import { useDisclosure } from "@chakra-ui/react";
import { FaUserSecret } from "react-icons/fa";
import { RiSendPlaneLine, RiSpyLine } from "react-icons/ri";
export default function Publish({ postData }) {
  const [title_value, setTitle] = useState("");
  const [content_value, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading_anonymous, setIsLoading_anonymous] = useState(false);
  const [error, setError] = useState("");
  const handleChange = (event) => setTitle(event.target.value);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef();
  const spaceID = postData.spaceID;
  let userID = 0;
  console.log(spaceID);

  //TODO:导入userid
  // useEffect(() => {
  //   // Perform localStorage action
  //   localStorage.setItem("accessToken", '1');
  //   userID=localStorage.getItem("accessToken");
  // }, [])

  async function postToDatabase(raw_text: string, userID_parameter: string) {
    try {
      const response = await axios.post<postInterface>(
        "http://120.25.216.186:8888/post/addpost",
        {
          title: title_value,
          content: content_value,
          userid: userID_parameter,
          spaceid: spaceID,
        }
      );

      console.log(response.data.id);

      const post_id = response.data.id;

      // const mr = await axios.post<milvusData>("/api/milvus", {
      //   id: response.data.id,
      //   title: title_value,
      //   text: raw_text,
      // });

      // console.log(mr.status);

      // 跳转到刚发布的帖子界面
      window.location.href = `/posts/${response.data.id}`;
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // const userID=localStorage.getItem("accessToken");
    setIsLoading(true);
    setError("");

    console.log(localStorage.getItem("userId"));

    if (localStorage.getItem("userId") === null) {
      alert("请先登录");
      setIsLoading(false);
      return;
    }
    let content_value_check = content_value.replaceAll("<p><br></p>", "");
    if (content_value_check === "" || title_value === "") {
      alert("请输入内容");
      setIsLoading(false);
      return;
    }

    try {
      let raw_text = content_value.replace(/<[^>]*>?/gm, "");
      raw_text = raw_text.replaceAll("&nbsp;", " ");
      raw_text = raw_text.replaceAll("&lt;", "<");
      raw_text = raw_text.replaceAll("&gt;", ">");
      raw_text = raw_text.replaceAll("&amp;", "&");
      raw_text = raw_text.replaceAll("&quot;", '"');
      raw_text = raw_text.replaceAll("&apos;", "'");
      //check for toxicity first
      // await axios
      //   .get(
      //     `/api/gpt?type=toxicity&text=${raw_text}&post_id=-1&title=${title_value}`
      //   )
      //   .then((res) => {
      //     const flag = res.data.toxicity;
      //     console.log(flag);
      //     if (flag === "是。" || flag === "是") {
      //       //send set toxic api to backend
      //       onOpen();
      //     } else {
      //       alert("Your post is not toxic, please continue.");
      //       postToDatabase(raw_text, localStorage.getItem("userId"));
      //     }
      //   });

      postToDatabase(raw_text, localStorage.getItem("userId"));

      console.log("完成");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit_anonymous = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault(); // Prevent default form submission behavior
    // const userID=localStorage.getItem("accessToken");
    setIsLoading_anonymous(true);
    setError("");

    let content_value_check = content_value.replaceAll("<p><br></p>", "");
    if (content_value_check === "" || title_value === "") {
      alert("请输入内容");
      setIsLoading_anonymous(false);
      return;
    }

    try {
      let raw_text = content_value.replace(/<[^>]*>?/gm, "");
      raw_text = raw_text.replaceAll("&nbsp;", " ");
      raw_text = raw_text.replaceAll("&lt;", "<");
      raw_text = raw_text.replaceAll("&gt;", ">");
      raw_text = raw_text.replaceAll("&amp;", "&");
      raw_text = raw_text.replaceAll("&quot;", '"');
      raw_text = raw_text.replaceAll("&apos;", "'");
      //check for toxicity first
      // await axios
      //   .get(
      //     `/api/gpt?type=toxicity&text=${raw_text}&post_id=-1&title=${title_value}`
      //   )
      //   .then((res) => {
      //     const flag = res.data.toxicity;
      //     console.log(flag);
      //     if (flag === "是。" || flag === "是") {
      //       //send set toxic api to backend
      //       onOpen();
      //     } else {
      //       alert("Your post is not toxic, please continue.");
      //       postToDatabase(raw_text, "99999");
      //     }
      //   });

      postToDatabase(raw_text,"99999");

      console.log("完成");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading_anonymous(false);
    }
  };

  function handleConfirm() {
    let raw_text = content_value.replace(/<[^>]*>?/gm, "");
    raw_text = raw_text.replaceAll("&nbsp;", " ");
    raw_text = raw_text.replaceAll("&lt;", "<");
    raw_text = raw_text.replaceAll("&gt;", ">");
    raw_text = raw_text.replaceAll("&amp;", "&");
    raw_text = raw_text.replaceAll("&quot;", '"');
    raw_text = raw_text.replaceAll("&apos;", "'");

    onClose();
    postToDatabase(raw_text);
  }

  return (
    <Flex direction="column">
      <AlertDialog
        isOpen={isOpen}
        onClose={onClose}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent fontSize="lg" fontWeight="600">
            <AlertDialogHeader>不良内容提示</AlertDialogHeader>
            <AlertDialogBody>
              您的贴子中包含不良内容，是否继续发布？如果坚持发布，您的贴子可能会被系统隐藏或删除。
            </AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>
                取消
              </Button>
              <Button colorScheme="red" onClick={onClose} ml={3}>
                确定
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
      <Navbar />
      <Box width="100%">
        <Card variant="filled" height="10vh"></Card>
        <HStack pos="relative" top="-10" px="10vw">
          <Heading fontFamily="var(--font-title-post)" pt={10}>
            发帖
          </Heading>
        </HStack>
      </Box>
      <Flex
        as="main"
        direction="column"
        justifyContent="center"
        mx="20%"
        pt={10}
      >
        <Text fontSize="xx-large">标题</Text>
        {/* <Text mb='8px'>Value: {title_value}</Text> */}
        <Input
          placeholder="输入你的标题 (最大30字)"
          value={title_value}
          onChange={handleChange}
        />
        <Divider py={5} />
        <Text fontSize="xx-large">内容</Text>
        {/* <Text fontSize='xx-large'>{spaceID}</Text> */}
        <TextInput value={content_value} setValue={setContent} />
        <Divider py={5} />
        <SimpleGrid
          aria-label="spaces"
          columns={2}
          display={{ sm: "none", md: "grid" }}
          spacing="70px"
          my={7}
        >
          <Button
            variant="solid"
            onClick={handleSubmit}
            isLoading={isLoading}
            loadingText="发送中..."
            rightIcon={<RiSendPlaneLine />}
          >
            发送
          </Button>
          <Button
            variant="solid"
            isLoading={isLoading_anonymous}
            loadingText="发送中..."
            onClick={handleSubmit_anonymous}
            colorScheme="blackAlpha"
            rightIcon={<RiSpyLine />}
          >
            匿名发送
          </Button>
        </SimpleGrid>
        {/* <div>title:{title_value}</div> */}
        {/* <div>content:{content_value}</div> */}
        {/* <div>user:{localStorage.getItem("userId")}</div> */}
        {/* <div>space:{spaceID}</div> */}
      </Flex>
    </Flex>
  );
}

export async function getStaticPaths() {
  const paths = getAllPostIds();
  return {
    paths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  const postData = await getPostData(params.id);
  return {
    props: {
      postData,
    },
  };
}

export function getAllPostIds() {
  let temp_return = [
    {
      params: {
        id: "graduate",
      },
    },
    {
      params: {
        id: "chat",
      },
    },
    {
      params: {
        id: "course",
      },
    },
  ];
  return temp_return;
}

export async function getPostData(id) {
  let spaceID;
  if (id == "graduate") {
    spaceID = "1";
  }
  if (id == "chat") {
    spaceID = "2";
  }
  if (id == "course") {
    spaceID = "3";
  }
  return {
    spaceID,
  };
}
