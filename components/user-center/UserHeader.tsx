// import {
//   Text,
//   Avatar,
//   Box,
//   Card,
//   CardHeader,
//   Flex,
//   Heading,
//   HStack,
//   CardBody,
//   CardFooter,
//   Button,
//   ButtonGroup,
//   IconButton,
//   Divider,
// } from "@chakra-ui/react";
import React from "react";
import {
  Text,
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardBody,
  CardHeader,
  Divider,
  Heading,
  HStack,
  IconButton,
  VStack,
  LinkBox,
  Link,
  LinkOverlay,
  CardFooter,
  useToast,
} from "@chakra-ui/react";
import { motion } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { BiUpvote, BiDownvote } from "react-icons/bi";
import {
  TbArrowBigUpLine,
  TbArrowBigUpLineFilled,
  TbArrowBigDownLine,
  TbArrowBigDownLineFilled,
} from "react-icons/tb";
import rehypeRaw from "rehype-raw";

interface UserHeaderProps {
  avatar: string;
  username: string;
  introduction: string;
  id: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  avatar,
  username,
  introduction,
  id,
}) => {
  return (
    <Link
      width="100%"
      _hover={{ textDecoration: "none" }}
      href={`/user/send/${id}`}
    >
      <Card
        dropShadow="md"
        boxShadow="md "
        border={"1px solid gray.300"}
        as={motion.div}
        whileInView={{ filter: "brightness(100%)" }}
        whileHover={{ y: -3.01, filter: "brightness(95%)" }}
        // whileHover={{ y: -3.01, border: "1px solid var(--minimal-2)", color:'white', backgroundColor:'var(--minimal-2)', transition:'all 0.01s ease-in-out' }}
        whileTap={{ scale: 0.99 }}
        width="100%"
        maxHeight={150}
        minHeight={100}
        // variant="elevated"
        zIndex="1"
        pr={10}
      >
        <CardHeader m={0} pb={0}>
          <HStack spacing={2}>
            <Avatar size="sm" src={avatar}></Avatar>

            <Text role="username">{username}</Text>

            {/* <Text role="id">{id}</Text> */}
          </HStack>
        </CardHeader>
        <CardBody mx={5}>
          <Text>{introduction}</Text>
        </CardBody>
      </Card>
    </Link>
  );
};

export default UserHeader;
