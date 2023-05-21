import {
  Text,
  Avatar,
  Box,
  Card,
  CardHeader,
  Flex,
  Heading,
  HStack,
  CardBody,
  CardFooter,
  Button,
  ButtonGroup,
  IconButton,
  Divider,
} from "@chakra-ui/react";
import React from "react";

interface UserHeaderProps {
  avatar: string;
  username: string;
  introduction: string;
}

const UserHeader: React.FC<UserHeaderProps> = ({
  avatar,
  username,
  introduction,
}) => {
  return (
    <Card mb={0} ml={2} variant="eleated" width="100%">
      <CardHeader m={0} py={0}>
        <HStack spacing={2}>
          <Avatar
            size="sm"
            src={avatar}
            _hover={{ cursor: "pointer" }}
          ></Avatar>
          <Text role="username">{username}</Text>
        </HStack>
      </CardHeader>
      <CardBody mx={5}>
        <Text>{introduction}</Text>
      </CardBody>
      <Divider />
    </Card>
  );
};

export default UserHeader;
