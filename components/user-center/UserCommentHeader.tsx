/* eslint-disable react/no-children-prop */
import {
  Text,
  Avatar,
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  HStack,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  IconButton,
  Divider,
  Link,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import {
  TbArrowBigUpLine,
  TbArrowBigUpLineFilled,
  TbArrowBigDownLine,
  TbArrowBigDownLineFilled,
} from "react-icons/tb";
import { addUpVote, addDownVote } from "@/pages/api/PostAPI";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { commentInterface } from "@/interfaces/commentInterface";
import { getUserByID } from "@/pages/api/UserAPI";
import axios from "axios";
var rel = require("dayjs/plugin/relativeTime");
dayjs.locale("zh-cn");
dayjs.extend(rel);

//贴子回复显示组件
export default function ReplyPostCard({
  userid,
  postid,
  content,
  time,
  fatherid,
  upvote,
  downvote,
  username,
}: commentInterface) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownVoted] = useState(false);
  const [score, setScore] = useState(upvote - downvote);
  const prevScore = useRef(score); //for animation
  const [animateScoreUp, setAnimateScoreUp] = useState(false);
  const [animateScoreDown, setAnimateScoreDown] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [postTitle, setPostTitle] = useState("");

  useEffect(() => {
    getUserByID(userid).then((res) => {
      setAvatar(res.avatar);
    });

    // Make HTTP request to fetch post title
    axios
      .get(`http://120.25.216.186:8888/post/getpostbyid?postid=${postid}`)
      .then((response) => {
        setPostTitle(response.data.title);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  return (
    <>
      <Link
        width="100%"
        _hover={{ textDecoration: "none" }}
        href={`/posts/${postid}`}
      >
        <Card
          dropShadow="md"
          boxShadow="md "
          as={motion.div}
          whileInView={{ filter: "brightness(100%)" }}
          whileHover={{ y: -3.01, filter: "brightness(95%)" }}
          // whileHover={{ y: -3.01, border: "1px solid var(--minimal-2)", color:'white', backgroundColor:'var(--minimal-2)', transition:'all 0.01s ease-in-out' }}
          whileTap={{ scale: 0.99 }}
          width="100%"
          // variant="elevated"
          maxHeight={300}
          minHeight={100}
          zIndex="1"
          pr={10}
        >
          <CardBody
            css={{
              "& img": {
                maxHeight: "10vh",
              },
            }}
            overflow="hidden"
            maxHeight="30vh"
            textColor="transparent"
            background="linear-gradient(to bottom, rgba(0, 0, 0, 1) 50%, rgba(255, 255, 255, 0))"
            bgClip="text"
          >
            <Heading as="h2" size="md" mb={2}>
              {postTitle}
            </Heading>
            <ReactMarkdown rehypePlugins={[rehypeRaw]} children={content} />
          </CardBody>
          <CardFooter
            mt={0}
            pt={0}
            textColor={"gray.300"}
            fontSize={"xs"}
            justify={"end"}
          >
            <Text textAlign={"right"} textStyle="h1">
              {dayjs(time).fromNow()}
            </Text>
          </CardFooter>
        </Card>
      </Link>
      <Divider />
    </>
  );
}
