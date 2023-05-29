import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Text,
  Button,
  Input,
  VStack,
  HStack,
  InputGroup,
  InputRightElement,
} from "@chakra-ui/react";
import axios from "axios";
import StatusIndicator from "@/components/StatusIndicator";
import Image from "next/image";

const UserProfile = () => {
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [usernameValue, setUsernameValue] = useState("");
  const [emailValue, setEmailValue] = useState("");
  const [introductionValue, setIntroductionValue] = useState("");
  const [passwordValue, setPasswordValue] = useState("");
  const [avatarValue, setAvatarValue] = useState("");

  const router = useRouter();
  const { userid } = router.query;
  console.log("userid: " + userid);
  useEffect(() => {
    if (router.isReady) {
      axios
        .get(`http://120.25.216.186:8888/users/getUserById?id=${userid}`)
        .then((response) => {
          setUserData(response.data);
          setIsLoading(false);
          setUsernameValue(userData.username);
          setEmailValue(userData.email);
          setIntroductionValue(userData.introduction);
          setPasswordValue(userData.password);
          setAvatarValue(userData.avatar);
          console.log("response.data: " + response.data);
          console.log("userData: " + userData);
          console.log("usernameValue: " + usernameValue);
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
        });
    }
  }, [userid, router.isReady]);

  const handleClick = () => {
    setShowPassword(!showPassword);
  };

  const handleEdit = () => {
    setIsEditing(true);
    setUsernameValue(userData.username);
    setEmailValue(userData.email);
    setIntroductionValue(userData.introduction);
    setPasswordValue(userData.password);
    setAvatarValue(userData.avatar);
    setIsCancelling(false);
  };

  const handleSave = () => {
    setIsEditing(false);
    console.log("edit user begin");
    axios
      .post(`http://120.25.216.186:8888/users/updateUserById?id=${userid}`, {
        username: usernameValue,
        email: emailValue,
        introduction: introductionValue,
        password: passwordValue,
        avatar: avatarValue,
      })
      .then((response) => {
        setUserData(response.data);
        console.log("response.data: " + response.data);
        router.push(`/user/send/${localStorage.getItem("userId")}`);
      })
      .catch((error) => {
        console.log(error);
      });
    console.log("edit user end");
  };

  const handleCancel = () => {
    setIsEditing(false);
    setIsCancelling(true);
  };

  const handleUserCenter = () => {
    router.push(`/user/send/${localStorage.getItem("userId")}`);
  };

  return (
    <VStack
      overflow="hidden"
      boxShadow="md"
      justifyContent="center"
      borderRadius="lg"
      border="1px solid #e2e8f0"
      display="flex"
      flexDirection="column"
      margin="auto"
      gap={6}
      mx={"30%"}
      my={8}
      px={4}
      py={12}
    >
      <Text fontSize="2xl" textAlign="left">
        修改资料
      </Text>
      <HStack justifyContent="center" width="100%">
        <Text fontWeight="bold">昵称:</Text>
        <Input
          width="80%"
          readOnly={!isEditing}
          // value={usernameValue}
          defaultValue={userData.username}
          borderColor={isEditing ? "blue.500" : "gray.300"}
          onChange={(event) => {
            setUsernameValue(event.target.value);
          }}
        ></Input>
      </HStack>
      <HStack justifyContent="center" width="100%">
        <Text fontWeight="bold">邮箱:</Text>
        <Input
          width="80%"
          readOnly={!isEditing}
          // value={emailValue}
          defaultValue={userData.email}
          borderColor={isEditing ? "blue.500" : "gray.300"}
          onChange={(event) => {
            setEmailValue(event.target.value);
          }}
        ></Input>
      </HStack>
      <HStack px={8} width="100%">
        <Text fontWeight="bold">头像:</Text>
        <img
          src={userData.avatar}
          alt="User Avatar"
          style={{ width: "200px", height: "200px" }}
        />
      </HStack>
      {isEditing ? (
        <HStack justifyContent="center" width="100%">
          <Text fontWeight="bold">链接:</Text>

          <Input
            width="80%"
            borderColor={isEditing ? "blue.500" : "gray.300"}
            value={avatarValue}
            onChange={(event) => {
              setAvatarValue(event.target.value);
            }}
          />
        </HStack>
      ) : null}

      <HStack justifyContent="center" width="100%">
        <Text fontWeight="bold">密码:</Text>
        <InputGroup size="md" width="80%">
          <Input
            type={showPassword ? "text" : "password"}
            readOnly={!isEditing}
            borderColor={isEditing ? "blue.500" : "gray.300"}
            defaultValue={userData.password}
            // value={passwordValue}
            onChange={(event) => {
              setPasswordValue(event.target.value);
            }}
          ></Input>
          <InputRightElement pr={2}>
            <Button h="1.75rem" size="md" onClick={handleClick}>
              {showPassword ? "隐藏" : "显示"}
            </Button>
          </InputRightElement>
        </InputGroup>
      </HStack>

      <HStack justifyContent="center" width="100%">
        <Text fontWeight="bold">简介:</Text>
        <Input
          width="80%"
          readOnly={!isEditing}
          // value={introductionValue}
          defaultValue={userData.introduction}
          borderColor={isEditing ? "blue.500" : "gray.300"}
          onChange={(event) => {
            setIntroductionValue(event.target.value);
          }}
        ></Input>
      </HStack>

      {isEditing ? (
        <HStack width="100%" px={16}>
          <Button
            width="100%"
            bgColor="var(--minimal-2)"
            color="white"
            onClick={handleSave}
          >
            保存
          </Button>
          <Button width="100%" variant="ghost" onClick={handleCancel}>
            取消
          </Button>
        </HStack>
      ) : (
        <HStack width="100%" px={16}>
          <Button width="100%" variant="ghost" onClick={handleUserCenter}>
            用户中心
          </Button>
          <Button
            width="100%"
            bgColor="var(--minimal-2)"
            color="white"
            onClick={handleEdit}
          >
            开始编辑
          </Button>
        </HStack>
      )}
    </VStack>
  );
};

export default UserProfile;
