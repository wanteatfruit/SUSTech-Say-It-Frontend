import { useRouter } from "next/router";
import { Box, Flex, HStack, VStack } from "@chakra-ui/react";
import Navbar from "@/components/Navbar";
import SubNavUser from "@/components/SubNavUser";
import PostHeader from "@/components/PostHeader";
import UserCard from "@/components/user-center/UserCard";
import UserHeader from "@/components/user-center/UserHeader";

export default function UserFollowers() {
  const router = useRouter();
  const { username } = router.query;

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
                <VStack width="100%">{/* <UserHeader /> */}</VStack>
              </Flex>
            </HStack>
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
}
