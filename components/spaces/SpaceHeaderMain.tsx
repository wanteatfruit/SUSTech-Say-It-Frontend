import {
  Box,
  Card,
  CardHeader,
  CircularProgress,
  CircularProgressLabel,
  HStack,
  Heading,
  Icon,
  LinkBox,
  LinkOverlay,
  Stat,
  StatArrow,
  StatLabel,
  StatNumber,
  Text,
  VStack,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { spaceInfo } from "../../interfaces/spaceInterface";
import SpaceAvatar from "./SpaceAvatar";
import { BiArrowBack } from "react-icons/bi";
import { FaArrowUp } from "react-icons/fa";
import { useEffect, useState } from "react";
import { getHotBySpace } from "@/pages/api/SpaceAPI";
import { AiFillFire, AiOutlineFire } from "react-icons/ai";

export default function SpaceHeaderMain({
  spaceName,
  spaceIntroduction,
  spaceLink,
  spaceID,
}: spaceInfo) {
  const [hotness, setHotness] = useState(0);
  useEffect(() => {
    async function getHot(spaceID: string) {
      const data = await getHotBySpace(spaceID);
      setHotness((data * 100).toFixed(0));
    }
    getHot(spaceID.toString());
  });

  return (
    <Box>
      <LinkBox
        rounded="md"
        maxW="sm"
        p="5"
        pt="1"
        shadow="md"
        _hover={{
          border: "none",
          backgroundColor: "var(--minimal-2)",
          color: "white",
          textColor: "white",
          transition: "all 0.1s ease-in-out",
          fill: "white",
        }}
        _focus={{ backgroundColor: "var(--minimal-3)" }}
      >
        <HStack pt={2} justify="space-between" alignItems="top" width="100%">
          <div>
            <HStack>
              <Text fontSize="xl" fontWeight="600" my="2">
                <LinkOverlay href={spaceLink}>{spaceName}</LinkOverlay>
              </Text>
            </HStack>
            <Text> {spaceIntroduction}</Text>
          </div>
          <div>
            <CircularProgress
              size="2.3em"
              color="var(--minimal-2)"
              thickness="8px"
              value={hotness}
            >
              <CircularProgressLabel fontSize="md">
                <VStack>
                  <Icon _hover={{ fill: "white" }} as={AiOutlineFire}></Icon>
                </VStack>
                <Text fontWeight='600'>{hotness}%</Text>
              </CircularProgressLabel>
            </CircularProgress>
          </div>
        </HStack>
      </LinkBox>
    </Box>
  );
}
