import Navbar from "@/components/Navbar";
import {
  Box,
  Flex,
  HStack,
  VStack,
  useDisclosure,
} from "@chakra-ui/react";
import Head from "next/dist/shared/lib/head";
import SpaceHeader from "@/components/spaces/SpaceHeader";
import SpaceCard from "@/components/spaces/SpaceCard";
import PostHeader from "@/components/PostHeader";
import styles from "../../styles/pagination.module.css";
import MapPlugin from "@/components/side-plugins/UniversityMap";
import { chatSpaceInfo } from "../../lib/chatInfo";
import { GetStaticProps, InferGetStaticPropsType } from "next";
import { postInterface } from "@/interfaces/postInterface";
import { getPostsBySpace } from "../api/PostAPI";
import ReactPaginate from "react-paginate";
import BackToTopButton from "@/components/BackToTop";
import SpacePostFilter from "@/components/spaces/SpacePostFilter";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect } from "react";
import dayjs from "dayjs";

export const getStaticProps: GetStaticProps<{posts:postInterface[]}> = async(context) =>{
  const posts = await getPostsBySpace(chatSpaceInfo.ID);
  posts.sort(
    (a: postInterface, b: postInterface) =>
      dayjs(b.time).valueOf() - dayjs(a.time).valueOf()
  );  return{
    props:{
      posts
    },
    revalidate:1
  }
}



export default function Space({posts}:InferGetStaticPropsType<typeof getStaticProps>) {
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
      <title>{chatSpaceInfo.name}</title>
    </Head>
    <BackToTopButton />
      <MapPlugin isOpen={isOpen} onClose={onClose} />
      <Flex  mt={12} mb={20} direction="column">
        <Navbar />
        <SpaceHeader spaceName={chatSpaceInfo.name} spaceID={chatSpaceInfo.ID} RouteName={chatSpaceInfo.RouteName}/>
        <SpacePostFilter
          posts={posts}
          setPost={setAllPosts} 
          setLoading={setLoading}
        />

        <Flex as="main" direction="column">
          <Box px="10vw">
            <HStack alignItems="flex-start" spacing={4}>
              <Flex role="left" flex={7}>
                <VStack width="100%" spacing= {2}>
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
              </Flex>
              <Flex role="right" flex="2" direction="column">
                <VStack spacing="4" mb={2}> 
                  <SpaceCard
                    spaceID={chatSpaceInfo.ID}
                    RouteName={chatSpaceInfo.RouteName}
                    spaceIntroduction={chatSpaceInfo.longIntro}
                    spaceName={chatSpaceInfo.name}
                    postNum={posts.length}
                  />
                  {/* <Card width="100%" variant="outline" aria-label="links">
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
                          href="https://tis.sustech.edu.cn/"
                        >
                          <Button
                            width="100%"
                            colorScheme='red'
                            variant="solid"
                            textColor="white"
                          >
                            Reddit
                          </Button>
                        </Link>
                      </HStack>
                    </CardFooter>
                  </Card> */}

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
