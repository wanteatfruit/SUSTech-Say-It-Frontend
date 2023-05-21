import { postInterface } from "@/interfaces/postInterface";
import {
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  Text,
  IconButton,
  VStack,
  LinkBox,
  Link,
  LinkOverlay,
  CardFooter,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import {
  TbArrowBigUpLine,
  TbArrowBigUpLineFilled,
  TbArrowBigDownLine,
  TbArrowBigDownLineFilled,
} from "react-icons/tb";
import rehypeRaw from "rehype-raw";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import { addDownVote, addUpVote, deleteDownvote, deleteUpvote, getPostStatus, getVote } from "@/pages/api/PostAPI";
import { ReactMarkdown } from "react-markdown/lib/react-markdown";
// import relative 'dayjs/plugin/relativeTime'
var rel = require("dayjs/plugin/relativeTime");
dayjs.locale("zh-cn");
dayjs.extend(rel);

export default function PostHeader({
  title,
  content,
  time,
  userid,
  upvote,
  downvote,
  userName,
  id,
}: postInterface) {
  const [upvoted, setUpvoted] = useState(false);
  const [downvoted, setDownVoted] = useState(false);
  const [score, setScore] = useState(upvote - downvote);
  const prevScore = useRef(score); //for animation
  const [animateScoreUp, setAnimateScoreUp] = useState(false);
  const toast = useToast();
  const [animateScoreDown, setAnimateScoreDown] = useState(false);
  async function refreshVote(title: string) {
    if (title != null) {
      const vote = await getVote(title);
      setScore(vote);
    }
  }

  useEffect(()=>{
    //check post status
    getPostStatus(id.toString()).then((res)=>{
      if(res.upvote){
        setUpvoted(true);
      }
      if(res.downvote){
        setDownVoted(true);
      }
    })
  },[])

  // refreshVote(title);

  return (
    <>
      <HStack width="100%">
        <VStack flexDirection="column" spacing="4">
          {upvoted ? (
            <IconButton
              as={motion.div}
              border="0"
              whileTap={{ scale: 1.2 }}
              onClick={async() => {
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
                if(localStorage.getItem('userId')===null){
                  toast({
                    title: "请先登录",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                  })
                  return
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
            <Text>{score}</Text>
          </motion.div>
          {downvoted ? (
            <IconButton
              as={motion.div}
              border="0"
              whileTap={{ scale: 1.2 }}
              onClick={async() => {
                setDownVoted(!downvoted);
                setUpvoted(false);
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
                if(localStorage.getItem('userId')===null){
                  toast({
                    title: "请先登录",
                    status: "error",
                    duration: 2000,
                    isClosable: true,
                  })
                  return
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
        </VStack>
        {/* <Divider orientation="vertical" /> */}
        <Link
          width="100%"
          _hover={{ textDecoration: "none" }}
          href={`/posts/${id}`}
        >
          <Card
            dropShadow="md"
            boxShadow="md "
            as={motion.div}
            whileInView={{ filter: "brightness(100%)" }}
            whileHover={{ y: -3.01, filter:'brightness(95%)' }}
            // whileHover={{ y: -3.01, border: "1px solid var(--minimal-2)", color:'white', backgroundColor:'var(--minimal-2)', transition:'all 0.01s ease-in-out' }}
            whileTap={{ scale: 0.99 }}
            width="100%"
            // variant="elevated"
            zIndex="1"
            pr={10}
          >
            <CardHeader pb={0}>
              <HStack>
                <Text>{userName} - </Text>
                <Text suppressHydrationWarning={true}>
                  {dayjs(time).fromNow()}
                </Text>
              </HStack>
              <Text fontWeight="600" fontSize="2xl">
                {title}
              </Text>
            </CardHeader>
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
              <ReactMarkdown
                rehypePlugins={[rehypeRaw]}
                children={content}
              ></ReactMarkdown>
            </CardBody>
            <CardFooter pt={0} pb={0} />
          </Card>
        </Link>
      </HStack>
      {/* </Card> */}
      {/* <Divider w="90%" mt={3} /> */}
    </>
  );
}
