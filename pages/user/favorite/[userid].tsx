import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import SubNavUser from "@/components/SubNavUser";
import UserCard from "@/components/user-center/UserCard";
import { postInterface } from "@/interfaces/postInterface";
import StatusIndicator from "@/components/StatusIndicator";
import PostHeaderInUserCenter from "@/components/user-center/PostHeaderInUserCenter";

export default function UserPosts() {
  const router = useRouter();
  const { userid } = router.query;

  const [userPosts, setUserPosts] = useState<postInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserPosts() {
      setLoading(true);
      setError("");
      console.log("fetch posts from userid: ", userid);
      try {
        const response = await fetch(
          `http://120.25.216.186:8888/users/getUserFavoritePosts?id=${userid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user favorite posts");
        }
        const data = await response.json();
        console.log(data);
        setUserPosts(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    if (userid) {
      fetchUserPosts();
    }
  }, [userid]);

  if (loading) {
    return (
      <div>
        <StatusIndicator />
      </div>
    );
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Box mb={10} mt="150px">
      <Navbar />
      <SubNavUser />
      <div style={{ height: "20px" }}></div>
      <Flex direction="column">
        <Flex as="main" direction="column">
          <Box px="10vw">
            <HStack alignItems="flex-start" spacing={4}>
              <Flex role="left" flex={7}>
                <VStack width="100%">
                  <UserCard />
                  {userPosts.map((post) => (
                    <PostHeaderInUserCenter key={post.id} {...post} />
                  ))}
                </VStack>
              </Flex>
            </HStack>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
