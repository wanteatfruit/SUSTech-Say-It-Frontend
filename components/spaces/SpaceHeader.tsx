import {
  Avatar,
  Card,
  CardBody,
  CardHeader,
  Box,
  Flex,
  HStack,
  Text,
  Heading,
  Button,
  FormControl,
  FormLabel,
  Switch,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
  MenuDivider,
} from "@chakra-ui/react";
import { BiPaperPlane } from "react-icons/bi";
import SpaceAvatar from "./SpaceAvatar";
import { spaceInfo } from "@/interfaces/spaceInterface";
import { useState } from "react";
type spaceHeader={
  spaceName:string,
  spaceAvatar:string
}
export default function SpaceHeader({ spaceName, spaceAvatar }: spaceHeader) {


  return (
    <Box width="100%">
      <Card boxShadow="base" bgColor="var(--minimal-1)" height="11vh"></Card>
      <HStack pos="relative" top="-10" px="10vw">
        <SpaceAvatar
          src={spaceAvatar}
          spaceName={spaceName}
        />
        <Heading fontFamily='var(--font-post-title)' pt={10}>{spaceName.substring(0,2)}<span style={{color:'var(--minimal-2)'}}>{spaceName.substring(2,4)}</span></Heading>
      </HStack>
    </Box>
  );
}
