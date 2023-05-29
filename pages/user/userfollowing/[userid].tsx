import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import SubNavUser from "@/components/SubNavUser";
import PostHeader from "@/components/PostHeader";
import UserCard from "@/components/user-center/UserCard";
import UserHeader from "@/components/user-center/UserHeader";
import StatusIndicator from "@/components/StatusIndicator";

export default function UserFollowing() {
  const router = useRouter();
  const { userid } = router.query;
  const [userFollowing, setUserFollowing] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserFollowing() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://120.25.216.186:8888/users/getUserFollowing?id=${userid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user Following");
        }
        const data = await response.json();
        console.log("data from getUserFollowing: ", data);
        setUserFollowing(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    if (userid) {
      fetchUserFollowing();
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
    // 可能要改
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
                  {userFollowing.length > 0 ? (
                    userFollowing.map((user) => (
                      <UserHeader key={user.id} {...user} />
                    ))
                  ) : (
                    <div>该用户没有关注任何人</div>
                  )}
                </VStack>
              </Flex>
            </HStack>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
