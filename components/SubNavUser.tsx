import { Box, Button, Center, HStack } from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  FaRegNewspaper,
  FaArrowAltCircleDown,
  FaArrowAltCircleUp,
  FaHeart,
  FaRegComment,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";
import { IconType } from "react-icons/lib";
import React from "react";
interface SubNavButtonProps {
  icon: IconType;
  text: string;
  onClick: () => void;
  isActive: boolean;
}

function SubNavButton({ icon, text, onClick, isActive }: SubNavButtonProps) {
  return (
    <Button
      variant="ghost"
      onClick={onClick}
      color={isActive ? "var(--minimal-2)" : "gray.700"}
      _hover={{ color: "var(--minimal-2)" }}
      _focus={{ color: "var(--minimal-2)" }}
      _after={{content: '""', position: 'absolute', bottom: '-6px', left: '0', width: '100%', height: '2px', bg: 'var(--minimal-2)', opacity: isActive ? '1' : '0'  }}
      // bgColor={isActive ? "var(--minimal-2)" : "white"}
      fontWeight={isActive ? "bold" : "normal"}
      // borderBottom={isActive ? "4px solid var(--minimal-2)" : "none"}
    >
      {React.createElement(icon, {
        size: "1.2em",
        style: { marginRight: "0.5em" },
      })}
      {text}
    </Button>
  );
}
export default function SubNav() {
  const router = useRouter();
  const currentPath = router.asPath;

  const [userId, setUserId] = useState("");

  useEffect(() => {
    console.log(currentPath.split("/")[3]);
    // const userId = localStorage.getItem("userId");
    const userId = currentPath.split("/")[3];
    setUserId(userId);
  }, []);

  return (
    <Box bg="" boxShadow="md" mt="70px">
      <HStack spacing={4} py={1}  px={8} justifyContent={"center"} alignItems='end'>
        <SubNavButton
          icon={FaRegNewspaper}
          text="帖子"
          onClick={() => {
            console.log("click on 帖子 for userId: ", userId);
            router.push(`/user/send/${userId}`);
          }}
          isActive={currentPath === `/user/send/${userId}`}
        />
        <SubNavButton
          icon={FaRegComment}
          text="评论"
          onClick={() => router.push(`/user/comment/${userId}`)}
          isActive={currentPath === `/user/comment/${userId}`}
        />
        <SubNavButton
          icon={FaArrowAltCircleUp}
          text="点赞"
          onClick={() => router.push(`/user/upvote/${userId}`)}
          isActive={currentPath === `/user/upvote/${userId}`}
        />
        <SubNavButton
          icon={FaArrowAltCircleDown}
          text="点踩"
          onClick={() => router.push(`/user/downvote/${userId}`)}
          isActive={currentPath === `/user/downvote/${userId}`}
        />
        <SubNavButton
          icon={FaHeart}
          text="收藏"
          onClick={() => router.push(`/user/favorite/${userId}`)}
          isActive={currentPath === `/user/favorite/${userId}`}
        />
        <SubNavButton
          icon={FaUserFriends}
          text="关注者"
          onClick={() => router.push(`/user/userfollowers/${userId}`)}
          isActive={currentPath === `/user/userfollowers/${userId}`}
        />
        <SubNavButton
          icon={FaUserFriends}
          text="关注了"
          onClick={() => router.push(`/user/userfollowing/${userId}`)}
          isActive={currentPath === `/user/userfollowing/${userId}`}
        />
      </HStack>
    </Box>
  );
}
