import { Avatar, Box } from "@chakra-ui/react";
import { ReactNode } from "react";
import { BiMath } from "react-icons/bi";
import { BsChatLeftText, BsCodeSlash } from "react-icons/bs";
import { TbSchool } from "react-icons/tb";

interface Savatar {
  src?: string;
  spaceName: string;
}

export default function SpaceAvatar(props: Savatar) {
  return (
    <Box border="4px" borderRadius="full" borderColor="white">
      {props.spaceName == "升学交流" && (
        <Avatar
          bgColor="var(--minimal-1)"
          size="xl"
          icon={
            <TbSchool
              color="var(--minimal-4)"
              fontSize="4rem"
              strokeWidth="1px"
            />
          }
        ></Avatar>
      )}
      {props.spaceName == "闲聊吹水" && (
        <Avatar
          bgColor="var(--minimal-1)"
          size="xl"
          icon={
            <BsChatLeftText
              color="var(--minimal-4)"
              fontSize="2.8rem"
            />
          }
        ></Avatar>
      )}
      {props.spaceName == "课程交流" && (
        <Avatar
          bgColor="var(--minimal-1)"
          size="xl"
          icon={
            <BsCodeSlash
              color="var(--minimal-4)"
              fontSize="3rem"
            />
          }
        ></Avatar>
      )}
    </Box>
  );
}
