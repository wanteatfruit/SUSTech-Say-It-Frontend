import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import SubNavUser from "@/components/SubNavUser";
import PostHeader from "@/components/PostHeader";
import UserCard from "@/components/user-center/UserCard";
import UserHeader from "@/components/user-center/UserHeader";
import StatusIndicator from "@/components/StatusIndicator";

export default function UserFollowers() {
  const router = useRouter();
  const { userid } = router.query;
  const [userFollowers, setUserFollowers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserFollowers() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://120.25.216.186:8888/users/getUserFollowers?id=${userid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user followers");
        }
        const data = await response.json();
        console.log("data from getUserFollowers: ", data);
        setUserFollowers(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    if (userid) {
      fetchUserFollowers();
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
                  {userFollowers.length > 0 ? (
                    userFollowers.map((user) => (
                      <UserHeader key={user.id} {...user} />
                    ))
                  ) : (
                    <div>你还没有任何关注者</div>
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
