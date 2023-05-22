import Navbar from "@/components/Navbar";
import PostHeader from "@/components/PostHeader";
import SpaceHeaderMain from "@/components/spaces/SpaceHeaderMain";
import {
  Flex,
  Text,
  Grid,
  SimpleGrid,
  Box,
  Card,
  useDisclosure,
  VStack,
  ButtonGroup,
  Button,
  RadioGroup,
  Stack,
  HStack,
  Radio,
  Skeleton,
  SkeletonText,
} from "@chakra-ui/react";
import { graduationInfo } from "../lib/graduationInfo";
import { chatSpaceInfo } from "../lib/chatInfo";
import { courseSpaceInfo } from "../lib/courseInfo";
import { useState, useEffect } from "react";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { postInterface } from "@/interfaces/postInterface";
import axios from "axios";
import {
  addUpVote,
  sortByDate,
  sortByViewCount,
  sortByVoteScore,
} from "./api/PostAPI";
import BackToTopButton from "@/components/BackToTop";
import PaginatedItems from "@/components/Pagniation";
import Footer from "@/components/Footer";
interface Props {
  byViewCount: postInterface[];
  byVote: postInterface[];
  byDate: postInterface[];
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const count = await sortByViewCount();
  const votePost = await sortByVoteScore();
  const datePost = await sortByDate();
  return {
    props: {
      byViewCount: count.slice(0, 10),
      byDate: datePost.slice(0, 10),
      byVote: votePost.slice(0, 10),
    },
    revalidate: 1,
  };
};

export default function Main({
  byDate,
  byViewCount,
  byVote,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // const {isOpen, onOpen, onClose} = useDisclosure();

  const [filter, setFilter] = useState("hot"); //radio group
  const [isLoaded, setIsLoading] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [hotPosts, setHotPosts] = useState<postInterface[]>(byViewCount);
  const [newPosts, setNewPosts] = useState<postInterface[]>(byDate);
  const [bestPosts, setBestPosts] = useState<postInterface[]>(byVote);
  const [recommendPost, setRecommendPost] =
    useState<postInterface[]>(byVote);

  useEffect(()=>{
    async function getRecommend(){
      if (typeof window !== 'undefined') {
        const user_id =  localStorage.getItem("userId");
        if(user_id===undefined){
          return;
        }
        const recommendPost = await axios.get(`/api/milvus?type=recommendation&user_id=${user_id}}`);
        let recommendData = recommendPost.data;
        if (recommendPost.data.length > 0) {
          setRecommendPost(recommendData);
        }
      }
    }

    // getRecommend();

  },[] )

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(true);
    }, 400);
  }, [filter]);
  useEffect(() => {
    // alert("sdsd")

    async function refresh() {
      if (filter == "hot") {
        const v = await sortByViewCount();
        setHotPosts(v);
      } else if (filter == "new") {
        const v = await sortByDate();
        setNewPosts(v);
      } else {
        const v = await sortByVoteScore();
        setBestPosts(v);
      }
    }
    refresh();
  }, [filter]);

  const handleFilterChange = (value: string) => {
    setIsLoading(false);
    setFilter(value);
  };

  return (
    <>
      <BackToTopButton />
      <Flex mt={12} mb={10} direction="column" opacity={2}>
        <Navbar />
        <Flex
          as="main"
          direction="column"
          justifyContent="center"
          mx="15%"
          px={5}
          pt={10}
          zIndex="20"
          bgColor="white"
        >
          <Text fontSize="xx-large">板块</Text>
          <SimpleGrid
            aria-label="spaces"
            columns={{ sm: 1, md: 3 }}
            display={{ sm: "none", md: "grid" }}
            spacing="20px"
            mt={4}
          >
            <SpaceHeaderMain
              RouteName={graduationInfo.RouteName}
              spaceID={graduationInfo.ID}
              spaceName={graduationInfo.name}
              spaceLink={graduationInfo.link}
              spaceIntroduction={graduationInfo.shortIntro}
            />
            <SpaceHeaderMain
              spaceID={chatSpaceInfo.ID}
              spaceName={chatSpaceInfo.name}
              spaceLink={chatSpaceInfo.link}
              spaceIntroduction={chatSpaceInfo.shortIntro}
            />
            <SpaceHeaderMain
              spaceID={courseSpaceInfo.ID}
              spaceName={courseSpaceInfo.name}
              spaceIntroduction={courseSpaceInfo.shortIntro}
              spaceLink={courseSpaceInfo.link}
            />
          </SimpleGrid>
          <Text mt={4} fontSize="xx-large">贴子</Text>
          <Box
            my={5}
            mb={7}
            py={5}
            px={5}
            borderWidth="1px"
            rounded="md"
            flexDirection="row"
            display="flex"
            minW="100%"
            // border=''
          >
            <RadioGroup
              colorScheme='blackAlpha'
              onChange={handleFilterChange}
              value={filter}
            >
              <HStack>
                <Radio value="hot">热门</Radio>
                <Radio value="new">最新</Radio>
                <Radio value="best">最受好评</Radio>
              </HStack>
            </RadioGroup>
          </Box>
          <VStack width="100%" spacing={3}>
            {filter == "recommend" &&
              recommendPost.slice(0, 5).map((post) => (
                <Skeleton
                  width="100%"
                  fadeDuration={0.5}
                  key={post.id}
                  isLoaded={isLoaded}
                >
                  <PostHeader key={post.id} {...post} />
                </Skeleton>
              ))}
            {filter == "hot" &&
              hotPosts.slice(0, 5).map((post) => (
                <Skeleton
                  width="100%"
                  fadeDuration={0.5}
                  key={post.id}
                  isLoaded={isLoaded}
                >
                  <PostHeader key={post.id} {...post} />
                </Skeleton>
              ))}

            {filter == "best" &&
              bestPosts.slice(0, 5).map((post) => (
                <Skeleton
                  width="100%"
                  fadeDuration={0.5}
                  key={post.id}
                  isLoaded={isLoaded}
                >
                  <PostHeader key={post.id} {...post} />
                </Skeleton>
              ))}
            {filter == "new" &&
              newPosts.slice(0, 5).map((post) => (
                <Skeleton
                  width="100%"
                  fadeDuration={0.5}
                  key={post.id}
                  isLoaded={isLoaded}
                >
                  <PostHeader key={post.id} {...post} />
                </Skeleton>
              ))}
          </VStack>
        </Flex>
        <Footer />
      </Flex>
    </>
  );
}
