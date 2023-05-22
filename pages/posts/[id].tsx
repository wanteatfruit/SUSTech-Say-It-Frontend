import { useRouter } from "next/router";
import TextInput from "../../components/TextInput";
import SpaceCard from "../../components/spaces/SpaceCard";
import ReplyPostCard from "../../components/ReplyPostText";
import React, { useEffect, useState } from "react";
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
  Stack,
  Button,
  Skeleton,
  SkeletonText,
  Card,
  CardHeader,
  CardBody,
  UnorderedList,
  ListItem,
  Link,
} from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import MainPost from "@/components/MainPostText";
import RelatedPosts from "@/components/posts/RelatedPosts";
import { getPostByID, getCommentsBypostID, addViewCount } from "../api/PostAPI";
import { postInterface } from "@/interfaces/postInterface";
import { commentInterface } from "@/interfaces/commentInterface";
import { relatedPost } from "../../lib/relatedPost";
import BackToTopButton from "@/components/BackToTop";
import Summarize from "@/components/side-plugins/Summarize";
import { AiOutlineSend } from "react-icons/ai";
import {RiSendPlaneLine, RiSpyLine} from 'react-icons/ri'

export default function Post() {
  const router = useRouter();
  const id = router.query.id===null?"":router.query.id;
  const [isLoadingPost, setIsLoadingPost] = useState(true);
  const [isLoadingComment, setIsLoadingComment] = useState(true);
  const [content_value, setContent] = useState("");
  const [mainPost, setMainPost] = useState<NonNullable<postInterface>>(null);
  const [Comments, setComments] = useState<commentInterface[]>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading_anonymous, setIsLoading_anonymous] = useState(false);
  const [isLoadingRelated, setIsLoadingRelated] = useState(true);
  const [error, setError] = useState("");
  const [relatedPosts, setRelatedPosts] = useState<NonNullable<relatedPost[]>>([
    { id: "", post_id: 0, score: 0, title: "" },
  ]);

  let userid = 0;
  useEffect(() => {
    //get the post content
    async function fetchUserPosts(id: string) {
      setIsLoadingPost(true);
      setIsLoadingComment(true);
      try {
        const data: postInterface = await getPostByID(id);
        const Commentsdata: commentInterface[] = await getCommentsBypostID(id);
        setMainPost(data);
        setComments(Commentsdata);
        console.log(data);
        console.log(Commentsdata);
      } catch (error) {
        return;
      }
      setIsLoadingPost(false);
      setIsLoadingComment(false);
      addViewCount(mainPost?.title);
    }

    async function fetchRelated(id: string) {
      setIsLoadingRelated(true);
      try {
        await axios.get(`../api/milvus?post_id=${id}`).then((resp) => {
          const data = resp.data;
          setRelatedPosts(data.slice(0,5));
          setIsLoadingRelated(false);
        });
      } catch (error) {
        return;
      }
    
    }



    if (router.isReady) {
      setIsLoadingPost(true);
      setIsLoadingComment(true);
      fetchUserPosts(id);
      fetchRelated(id);

      // const data = getPostByID(id);
    }
  }, [router.isReady]);


  const handleSubmit_anonymous = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // const userID=localStorage.getItem("accessToken");
    setIsLoading_anonymous(true);
    setError("");

    let content_value_check = content_value.replaceAll("<p><br></p>", "");
    if (content_value_check === "") {
      alert("请输入内容");
      setIsLoading_anonymous(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://120.25.216.186:8888/comment/addcomment",
        {
          content: content_value,
          postid: id,
          userid: 99999,
        }
      );

      window.location.href = `/posts/${id}`;
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading_anonymous(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    // const userID=localStorage.getItem("accessToken");
    setIsLoading(true);
    setError("");

    if (localStorage.getItem("userId") === null) {
      alert("请先登录");
      setIsLoading(false);
      return;
    }

    let content_value_check = content_value.replaceAll("<p><br></p>", "");
    console.log(content_value_check);
    if (content_value_check === "") {
      alert("请输入内容");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://120.25.216.186:8888/comment/addcomment",
        {
          content: content_value,
          postid: id,
          userid: localStorage.getItem("userId"),
        }
      );

      window.location.href = `/posts/${id}`;
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <BackToTopButton />
      <Flex mt={16} pb={16} direction="column">
        <Flex as="main" role="main" direction="column" pt={6}>
          <Box px="10vw">
            <SkeletonText isLoaded={!isLoadingPost}>
              <HStack spacing={4} alignItems="flex-start">
                <Flex flex={7} role="left">
                  <VStack width="100%" spacing={4}>
                    <Box
                      role="poster_section"
                      width="100%"
                      padding={0}
                      margin={0}
                    >
                      {!isLoadingPost && (
                        <MainPost
                          title={mainPost.title}
                          time={mainPost.time}
                          upvote={mainPost.upvote}
                          downvote={mainPost.downvote}
                          content={mainPost.content}
                          userid={mainPost.userid}
                          spaceid={mainPost.spaceid}
                          id={mainPost?.id}
                        />
                      )}
                    </Box>
                    <Divider size='xl' pb={0} />
                    <HStack mt={0}>
                      <TextInput  value={content_value} setValue={setContent} />
                      
                    </HStack>
                    {/* <Text>{content_value}</Text>
                    <Text>aaa</Text>
                    <Text>{content_value.replaceAll("<p><br></p>", "")}</Text> */}
                    <Stack direction='row' spacing={4} align='center'>
                      <Button
                        variant="solid"
                        rightIcon={<RiSendPlaneLine />}
                        isLoading={isLoading}
                        loadingText="发送中..."
                        onClick={handleSubmit}
                      >
                        发送
                      </Button>
                      <Button
                        variant="solid"
                        colorScheme='blackAlpha'
                        rightIcon = {<RiSpyLine />}
                        isLoading={isLoading_anonymous}
                        loadingText="发送中..."
                        onClick={handleSubmit_anonymous}

                      >
                        匿名发送
                      </Button>
                    </Stack>
                    <VStack mt={0} role="reply_section" width="100%">
                      {!isLoadingComment &&
                        Comments.map((comment) => (
                          <SkeletonText
                            width="100%"
                            key={comment.id}
                            isLoaded={!isLoadingComment}
                            fadeDuration={0.5}
                          >
                            <ReplyPostCard key={comment.id} {...comment} />
                          </SkeletonText>
                        ))}
                    </VStack>
                  </VStack>
                </Flex>
                <Flex flex={2.1} flexDirection="column">
                  {/* <Box minH={20} width="100%" padding={0} margin={0}>
                      {!isLoadingPost && (
                        <SpaceCard spaceName={mainPost} spaceID={mainPost.spaceid}/>
                      )}
                    </Box> */}
                  <Box width="100%" pt={"10%"}>
                    {/* 相关推荐 */}
                    <VStack width="100%" spacing={4}>
                      {/* {!isLoadingPost && (
                        <SpaceCard RouteName={mainPost.rou} spaceID={mainPost.spaceid}/>
                      )} */}
                      <SkeletonText width="100%" isLoaded={!isLoadingRelated}>
                        <Card>
                          <CardHeader>
                            <Text fontSize="2xl" fontWeight="600">
                              相关贴子
                            </Text>
                          </CardHeader>
                          <CardBody pt={2}>
                            <UnorderedList spacing={3}>
                              {relatedPosts.map((post) => (
                                <ListItem key={post.post_id}>
                                  <Link fontSize="lg" href={`${post.post_id}`}>
                                    {post.title}
                                  </Link>
                                </ListItem>
                              ))}
                            </UnorderedList>
                          </CardBody>
                        </Card>
                      </SkeletonText>
                      <SkeletonText width='100%' isLoaded={!isLoadingPost}>
                        <Summarize title={mainPost?.title} post_id={mainPost?.id} />
                      </SkeletonText>
                    </VStack>
                  </Box>
                </Flex>
              </HStack>
            </SkeletonText>
          </Box>
        </Flex>
      </Flex>
    </>
  );
}
