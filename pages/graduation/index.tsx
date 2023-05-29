import Navbar from "@/components/Navbar";
import styles from "../../styles/pagination.module.css";
import {
  Box,
  Card,
  CardHeader,
  Flex,
  HStack,
  VStack,
  Text,
  CardFooter,
  Link,
  Button,
  CardBody,
  useDisclosure,
  Skeleton,
} from "@chakra-ui/react";
import dayjs from "dayjs";
import SpaceHeader from "@/components/spaces/SpaceHeader";
import SpaceCard from "@/components/spaces/SpaceCard";
import PostHeader from "@/components/PostHeader";
import Footer from "@/components/Footer";
import MapPlugin from "@/components/side-plugins/UniversityMap";
import { graduationInfo } from "../../lib/graduationInfo";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { postInterface } from "@/interfaces/postInterface";
import { getPostsBySpace } from "../api/PostAPI";
import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import Head from "next/dist/shared/lib/head";
import BackToTopButton from "@/components/BackToTop";
import UniversityRankings from "@/components/side-plugins/UniversityRanking";
import SpacePostFilter from "@/components/spaces/SpacePostFilter";
import StackOverflow from "@/components/side-plugins/StackOverflow";
import { AnimatePresence, motion } from "framer-motion";

export const getStaticProps: GetStaticProps<{
  posts: postInterface[];
}> = async (context) => {
  const posts = await getPostsBySpace(graduationInfo.ID);
  posts.sort(
    (a: postInterface, b: postInterface) =>
      dayjs(b.time).valueOf() - dayjs(a.time).valueOf()
  );
  return {
    props: {
      posts,
    },
    revalidate: 1,
  };
};

type props = {
  currentItems: postInterface[];
};

export default function Space({
  posts,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [allPosts, setAllPosts] = useState<postInterface[]>(posts);
  const {
    isOpen: isRankOpen,
    onOpen: onRankOpen,
    onClose: onRankClose,
  } = useDisclosure();
  const [currentItems, setCurrentItems] = useState<postInterface[]>(posts);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const [loading, setLoading] = useState(false);

  const itemsPerPage = 10;
  useEffect(() => {
    // Fetch items from another resources.
    const endOffset = itemOffset + itemsPerPage;
    console.log(`Loading items from ${itemOffset} to ${endOffset}`);
    setCurrentItems(allPosts.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(allPosts.length / itemsPerPage));
  }, [itemOffset, itemsPerPage, allPosts]);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % posts.length;
    console.log(
      `User requested page number ${event.selected}, which is offset ${newOffset}`
    );
    setItemOffset(newOffset);
    // console.log(currentItems);
    window.scrollTo(0, 0);
  };

  return (
    <>
    <Head>
        <title>{graduationInfo.name}</title>
    </Head>
      <MapPlugin isOpen={isOpen} onClose={onClose} />
      <UniversityRankings isOpen={isRankOpen} onClose={onRankClose} />
      <BackToTopButton />
      <Flex mt={12} mb={10} direction="column">
        <Navbar />
        <SpaceHeader
          spaceID={graduationInfo.ID}
          spaceName={graduationInfo.name}
        />
        <SpacePostFilter
          posts={posts}
          setPost={setAllPosts} 
          setLoading={setLoading}
        />
        <Flex as="main" direction="column">
          <Box px="10vw">
            <HStack alignItems="flex-start" spacing={4}>
              <Flex role="left" flex={7}>
                <Skeleton width="100%" isLoaded={!loading}>
                  <VStack width="100%" mb={2} spacing={4}>
                    <AnimatePresence>
                      {currentItems &&
                        currentItems.map((post) => (
                          <motion.div
                            style={{ width: "100%" }}
                            key={post.id}
                            initial={{ opacity: 0, x: -100 }}
                            animate={{ opacity: 1, x:0, transition: { duration: 0.75, type:'spring' } }}
                            exit={{ opacity: 0, y: -50 }}
                          >
                            <PostHeader {...post} />
                          </motion.div>
                        ))}
                    </AnimatePresence>
                    <div></div>
                    <ReactPaginate
                      nextLabel="下一页"
                      previousLabel="返回"
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={pageCount}
                      className={styles.reactpaginate}
                      containerClassName={styles.reactpaginate}
                      activeClassName={styles.selected}
                      previousClassName={styles.previous}
                      nextClassName={styles.next}
                      breakClassName={styles.break}
                      disabledClassName={styles.disabled}
                      renderOnZeroPageCount={null}
                    />
                  </VStack>
                </Skeleton>
              </Flex>
              <Flex role="right" flex="2" direction="column">
                <VStack spacing="4" mb={2}>
                  <SpaceCard
                    spaceID={graduationInfo.ID}
                    RouteName={graduationInfo.RouteName}
                    spaceName={graduationInfo.name}
                    spaceIntroduction={graduationInfo.longIntro}
                    postNum={posts.length}
                  />
                  <Card width="100%" variant="outline" aria-label="links">
                    <CardHeader pb={0}>
                      <Text fontWeight="600" fontSize="xl">
                        外部链接
                      </Text>
                    </CardHeader>
                    <CardFooter>
                      <HStack width="100%">
                        <Link
                          _hover={{ textDecoration: "none" }}
                          isExternal
                          width="100%"
                          href="https://sustech-application.com/#/?id=%e5%8d%97%e6%96%b9%e7%a7%91%e6%8a%80%e5%a4%a7%e5%ad%a6%e9%a3%9e%e8%b7%83%e6%89%8b%e5%86%8c"
                        >
                          <Button
                            width="100%"
                            colorScheme='teal'
                            variant="solid"
                            textColor="white"
                          >
                            南方科技大学飞跃手册
                          </Button>
                        </Link>
                      </HStack>
                    </CardFooter>
                  </Card>
                  <Card variant="outline" width="100%" aria-label="plugin">
                    <CardHeader pb={0}>
                      <Text fontWeight="600" fontSize="xl">
                        实用插件
                      </Text>
                    </CardHeader>
                    <CardBody>
                      <HStack>
                        <Button
                          width="100%"
                          // colorScheme='facebook'
                          bgColor="var(--minimal-2)"
                          _hover={{ bgColor: "var(--minimal-3)" }}
                          _focus={{ bgColor: "var(--minimal-4)" }}

                          textColor="white"
                          onClick={onOpen}
                        >
                          互动地图
                        </Button>
                        <Button
                          width="100%"
                          // colorScheme='orange'
                          
                          // textColor="white"
                          onClick={onRankOpen}
                        >
                          学校排名
                        </Button>
                      </HStack>
                    </CardBody>
                  </Card>
                </VStack>
                {/* <MapPage /> */}
              </Flex>
            </HStack>
          </Box>
        </Flex>
      </Flex>
      {/* <Footer /> */}
    </>
  );
}
