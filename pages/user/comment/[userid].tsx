import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import SubNavUser from "@/components/SubNavUser";
import UserCard from "@/components/user-center/UserCard";
import UserCommentHeader from "@/components/user-center/UserCommentHeader";
import { commentInterface } from "@/interfaces/commentInterface";
import StatusIndicator from "@/components/StatusIndicator";

export default function UserComments() {
  const router = useRouter();
  const { userid } = router.query;

  const [comments, setComments] = useState<commentInterface[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchUserComments() {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(
          `http://120.25.216.186:8888/users/getUserComments?id=${userid}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch user comments");
        }
        const data = await response.json();
        console.log("start log data");
        console.log(data);
        setComments(data);
      } catch (error) {
        setError(error.message);
      }
      setLoading(false);
    }

    if (userid) {
      fetchUserComments();
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
    <Box>
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
                  {comments.map((comment) => (
                    <UserCommentHeader key={comment.id} {...comment} />
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
