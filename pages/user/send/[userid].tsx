import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import SubNavUser from "@/components/SubNavUser";
import UserCard from "@/components/user-center/UserCard";
import PostHeader from "@/components/PostHeader";
import { postInterface } from "@/interfaces/postInterface";
import StatusIndicator from "@/components/StatusIndicator";

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
      try {
        const response = await fetch(
          `http://120.25.216.186:8888/users/getUserPosts?id=${userid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user posts");
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
    <Box mb={10}>
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
                    <PostHeader key={post.id} {...post} />
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
