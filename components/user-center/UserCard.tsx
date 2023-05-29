import {
  Box,
  Flex,
  Avatar,
  Text,
  Button,
  Link,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import {
  addToFollow,
  removeFromFollow,
  getUserFollowStatus,
} from "@/pages/api/UserAPI"; // import the user_axios module

interface UserCardProps {}

const UserCard: React.FC<UserCardProps> = () => {
  const router = useRouter();
  const [numFollowers, setNumFollowers] = useState<number>(0);
  const [numFollowing, setNumFollowing] = useState<number>(0);
  const [name, setName] = useState<string>("");
  const [introduction, setIntroduction] = useState<string>("");
  const [avatarUrl, setAvatarUrl] = useState<string>("");

  const [userId, setUserId] = useState<string>("");
  const [shouldRenderEditProfileButton, setShouldRenderEditProfileButton] =
    useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false); // new state variable

  const toast = useToast();

  const { userid } = router.query; // move declaration outside of useEffect

  useEffect(() => {
    const userIdFromLocalStorage = localStorage.getItem("userId");
    setUserId(userIdFromLocalStorage);

    const fetchUserData = async () => {
      const response = await fetch(
        `http://120.25.216.186:8888/users/getUserById?id=${userid}`
      );
      const data = await response.json();
      setName(data.username);
      setIntroduction(data.introduction);
      setAvatarUrl(data.avatar);
    };
    fetchUserData();

    const fetchFollowers = async () => {
      console.log("fetching followers begin for userid: " + userid);
      const response = await fetch(
        `http://120.25.216.186:8888/users/getUserFollowers?id=${userid}`
      );
      const data = await response.json();
      console.log(data);
      console.log("fetching followers end for userid: " + userid);
      setNumFollowers(data.length);
    };
    fetchFollowers();

    const fetchFollowing = async () => {
      console.log("fetching following begin for userid: " + userid);
      const response = await fetch(
        `http://120.25.216.186:8888/users/getUserFollowing?id=${userid}`
      );
      const data = await response.json();
      console.log(data);
      console.log("fetching following end for userid: " + userid);
      setNumFollowing(data.length);
    };
    fetchFollowing();

    setShouldRenderEditProfileButton(userid === userIdFromLocalStorage);

    getUserFollowStatus(userid).then((res) => {
      console.log("getUserFollowStatus userid: " + userid);
      console.log("getUserFollowStatus: " + res);
      setIsFollowing(res);
    });
  }, [userid]); // use userid as a dependency

  const handleFollowersClick = () => {
    console.log("Userfollower for: " + userid);
    router.push(`/user/userfollowers/${userid}`);
  };

  const handleFollowingClick = () => {
    router.push(`/user/userfollowing/${userid}`);
  };

  const handleEditProfileClick = () => {
    const userIdFromLocalStorage = localStorage.getItem("userId");
    if (userid === userIdFromLocalStorage) {
      router.push(`/user/edit/${userid}`);
    }
  };

  const handleFollowClick = async () => {
    if (localStorage.getItem("userId") !== null) {
      try {
        if (isFollowing) {
          // unfollow user
          console.log("unfollow user");
          removeFromFollow(userid)
            .then((res) => {
              if (res) {
                setIsFollowing(false);
                toast({
                  title: "取关成功",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              } else {
                console.log("unfollow user failed");
              }
              console.log("res: " + res);
            })
            .catch((err) => {
              console.log(err);
            });
        } else {
          // follow user
          console.log("follow user");
          addToFollow(userid)
            .then((res) => {
              if (res) {
                setIsFollowing(true);
                toast({
                  title: "关注成功",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
              } else {
                console.log("follow user failed");
              }
              console.log("res: " + res);
            })
            .catch((err) => {
              console.log(err);
            });
        }
        router.reload();
      } catch (e) {
        console.log(e);
      }
    } else {
      toast({
        title: "请先登录",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box
      maxW="lg"
      border="1px solid var(--minimal-2)"
      // border='1px solid #e2e8f0'
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
    >
      <Flex p="6">
        <Avatar size="lg" name={name} src={avatarUrl} />
        <Box ml="4">
          <Text fontSize="lg" fontWeight="bold" pl="4">
            {name}
          </Text>
          <Text fontSize="md" color="gray.500" pl="4">
            {introduction}
          </Text>
          <Flex mt="2">
            <Button
              variant="outline"
              size="md"
              mr="2"
              onClick={handleFollowersClick}
              border="none"
            >
              关注者：{numFollowers}
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={handleFollowingClick}
              border="none"
            >
              关注了：{numFollowing}
            </Button>
            {shouldRenderEditProfileButton && (
              <Button
                variant="outline"
                size="md"
                onClick={handleEditProfileClick}
                border="none"
                ml="auto"
              >
                编辑个人资料
              </Button>
            )}
            {!shouldRenderEditProfileButton && (
              <Button
                variant="outline"
                size="md"
                onClick={handleFollowClick}
                border="none"
                ml="auto"
                colorScheme="pink"
              >
                {isFollowing ? "取关" : "关注"}
              </Button>
            )}
          </Flex>
        </Box>
      </Flex>
    </Box>
  );
};

export default UserCard;
