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

  useEffect(()=>{
    getUserByID(userid).then((res) => {
      setAvatar(res.avatar);
    });
  })

  return (
    <>
      <Card my={3}  ml={2} variant="elvated" width="100%">
        <CardHeader m={0} py={0}>
          <HStack justifyContent="space-between">
            <HStack spacing={2}>
              <Avatar size="sm" src={avatar} _hover={{ cursor: "pointer" }}></Avatar>
              <Text role="username">{username}</Text>
            </HStack>
            <Text textStyle="h1">{dayjs(time).fromNow()}</Text>
          </HStack>
        </CardHeader>
        <CardBody mx='4%'>
          <ReactMarkdown rehypePlugins={[rehypeRaw]} children={content} />
        </CardBody>
        {/* <CardFooter mx={0} mt={1} pt={0} justify="space-between">
          <HStack>
            <HStack spacing={4}>
              {upvoted ? (
                <IconButton
                  as={motion.div}
                  border="0"
                  whileTap={{ scale: 1.2 }}
                  onClick={() => {
                    setUpvoted(!upvoted);
                    setAnimateScoreDown(true);
                    // addDownVote(title);
                    setDownVoted(false);
                    setScore(prevScore.current);
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
                    setUpvoted(!upvoted);
                    // addUpVote(title);
                    setAnimateScoreUp(true);
                    console.log(prevScore);
                    setDownVoted(false);
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
                <Text>{score}</Text>
              </motion.div>
              {downvoted ? (
                <IconButton
                  as={motion.div}
                  border="0"
                  whileTap={{ scale: 1.2 }}
                  onClick={() => {
                    setDownVoted(!downvoted);
                    setUpvoted(false);
                    setAnimateScoreUp(true);
                    // addUpVote(title);
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
                  onClick={() => {
                    setDownVoted(true);
                    setUpvoted(false);
                    // addDownVote(title);
                    setAnimateScoreDown(true);
                    setScore(prevScore.current - 1);
                  }}
                  aria-label="upvote_button"
                  icon={<TbArrowBigDownLine size="1.25em" />}
                ></IconButton>
              )}
            </HStack>
          </HStack>
        </CardFooter> */}
        {/* <Divider /> */}
      </Card>
      <Divider/>
    </>
  );
}
