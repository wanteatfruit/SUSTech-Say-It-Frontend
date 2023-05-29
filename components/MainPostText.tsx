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
  VStack,
  Link,
  useToast,
} from "@chakra-ui/react";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import {
  TbArrowBigUpLine,
  TbArrowBigUpLineFilled,
  TbArrowBigDownLine,
  TbArrowBigDownLineFilled,
} from "react-icons/tb";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { postInterface } from "@/interfaces/postInterface";
import dayjs from "dayjs";
import axios from "axios";
import "dayjs/locale/zh-cn";
import {
  addDownVote,
  addUpVote,
  deleteDownvote,
  deleteUpvote,
  getPostStatus,
} from "@/pages/api/PostAPI";
import Favorite from "./posts/AddtoFavorite";
import { getUserByID } from "@/pages/api/UserAPI";
import rehypeHighlight from "rehype-highlight"


var rel = require("dayjs/plugin/relativeTime");
dayjs.locale("zh-cn");
dayjs.extend(rel);

//贴主的帖子显示组件
export default function MainPost({
  title,
  content,
  time,
  userid,
  spaceid,
  upvote,
  downvote,
  id,
}: postInterface) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownVoted] = useState(false);
  const [score, setScore] = useState(upvote - downvote);
  const prevScore = useRef(score); //for animation
  const [animateScoreUp, setAnimateScoreUp] = useState(false);
  const [animateScoreDown, setAnimateScoreDown] = useState(false);
  const [avatar, setAvatar] = useState("");
  const [isToxic, setIsToxic] = useState(false);
  const [sortLoading, setSortLoading] = useState(false);
  const [isFav, setIsFav] = useState(false);
  const [userName, setUserName] = useState("");
  const toast = useToast();
  useEffect(() => {
    // checkToxic();
    if(userid === undefined) return;
    getUserByID(userid).then((res) => {
      setAvatar(res.avatar);
      setUserName(res.username);
    });

    getPostStatus(id.toString()).then((res) => {
      if (res === undefined) return;
      setUpvoted(res.upvote);
      setDownVoted(res.downvote);
      setIsFav(res.fav);
      console.log(isFav);
    });
  }, [id, userid]);

  async function checkToxic() {
    await axios.get(`/api/gpt?type=toxicity&post_id=${id}`).then((res) => {
      const flag = res.data.toxicity;
      console.log(flag);
      if (flag === "Yes.") {
        console.log("isToxic");
        setIsToxic(true);
      } else {
        setIsToxic(false);
      }
      console.log(isToxic);
    });
  }

  return (
    <Card variant="ss" width="100%">
      <CardHeader mb={2} pb={0}>
        <HStack justifyContent="space-between">
          <HStack spacing={4} maxW="89%">
            <Link href={`/user/send/${userid}`}>
              <Avatar
                size="md"
                src={avatar}
                _hover={{ cursor: "pointer" }}
              ></Avatar>
            </Link>
            <VStack align="flex-start" spacing="0">
              <Link href={`/user/send/${userid}`}>
                <Text>{userName}</Text>
              </Link>
              <Text fontSize="2xl" fontFamily="var(--font-post-title)">
                {title}
              </Text>
            </VStack>
          </HStack>
          <VStack align="flex-end" spacing="0">
            {/* <Text>{userName}</Text> */}
            <Text textStyle="h1">{dayjs(time).fromNow()}</Text>
          </VStack>
        </HStack>
      </CardHeader>
      <CardBody mx={2} fontSize="lg" >
        <VStack align="flex-start" spacing="7" maxW='50vw' ml="7%" css={{'& img':{
          'max-height':'50vh',
          'max-width':'50vw',
        }}}>
          {/* <Heading fontSize="2xl" fontFamily="var(--font-post-title)">
            {title}
          </Heading> */}
          <ReactMarkdown  rehypePlugins={[rehypeHighlight,rehypeRaw]} children={content} />
        </VStack>
      </CardBody>
      <CardFooter mx={0} py={0} mt={4} justify="space-between">
        <HStack>
          <HStack>
            {upvoted ? (
              <IconButton
                as={motion.div}
                border="0"
                whileTap={{ scale: 1.2 }}
                onClick={async () => {
                  setUpvoted(false);
                  setAnimateScoreDown(true);
                  setScore(prevScore.current);
                  await deleteUpvote(title);
                  console.log(prevScore);
                }}
                variant="link"
                colorScheme="red"
                cursor="pointer"
                aria-label="upvote_button"
                icon={<TbArrowBigUpLineFilled size="1.25em" />}
              ></IconButton>
            ) : (
              <IconButton
                as={motion.div}
                border="0"
                whileTap={{ scale: 1.2 }}
                variant="link"
                colorScheme="black"
                cursor="pointer"
                onClick={async () => {
                  if (localStorage.getItem("userId") === null) {
                    toast({
                      title: "请先登录",
                      status: "error",
                      duration: 2000,
                      isClosable: true,
                    });
                    return;
                  }
                  setUpvoted(true);
                  if (downvoted) {
                    await deleteDownvote(title);
                    setDownVoted(false);
                  }
                  addUpVote(title);
                  setAnimateScoreUp(true);
                  console.log(prevScore);
                  setScore(prevScore.current + 1);
                }}
                aria-label="upvote_button"
                icon={<TbArrowBigUpLine size="1.25em" />}
              ></IconButton>
            )}
            <motion.div
              animate={{
                y: animateScoreUp
                  ? [0, -20, 20]
                  : animateScoreDown
                  ? [0, 20, -20]
                  : 0,
                // y: animateScoreDown? []
                opacity: animateScoreUp || animateScoreDown ? [0.6, 0, 0] : 1,
              }}
              transition={{ duration: 0.2, ease: "backOut" }}
              onAnimationComplete={() => {
                setAnimateScoreUp(false);
                setAnimateScoreDown(false);
              }}
            >
              <Text fontWeight="bold">{score}</Text>
            </motion.div>
            {downvoted ? (
              <IconButton
                as={motion.div}
                border="0"
                whileTap={{ scale: 1.2 }}
                onClick={async () => {
                  setDownVoted(false);
                  setAnimateScoreUp(true);
                  await deleteDownvote(title);
                  setScore(prevScore.current);
                }}
                variant="link"
                colorScheme="purple"
                cursor="pointer"
                aria-label="upvote_button"
                icon={<TbArrowBigDownLineFilled size="1.25em" />}
              ></IconButton>
            ) : (
              <IconButton
                as={motion.div}
                border="0"
                whileTap={{ scale: 1.2 }}
                variant="link"
                colorScheme="black"
                cursor="pointer"
                onClick={async () => {
                  if (localStorage.getItem("userId") === null) {
                    toast({
                      title: "请先登录",
                      status: "error",
                      duration: 2000,
                      isClosable: true,
                    });
                    return;
                  }
                  setDownVoted(true);
                  if (upvoted) {
                    await deleteUpvote(title);
                    setUpvoted(false);
                  }
                  addDownVote(title);
                  setAnimateScoreDown(true);
                  setScore(prevScore.current - 1);
                }}
                aria-label="upvote_button"
                icon={<TbArrowBigDownLine size="1.25em" />}
              ></IconButton>
            )}
          </HStack>
        </HStack>
        <Favorite id={id === undefined ? "0" : id.toString()} fav={isFav} />
      </CardFooter>
    </Card>
  );
}
