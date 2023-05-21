import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import axios from "axios";
import { Logo } from "./Logo";
import { OAuthButtonGroup } from "./OAuthButtonGroup";
import { PasswordField } from "./PasswordField";
import { useState, useEffect } from "react";
import { useToast } from "@chakra-ui/react";

type LoginResponse = {
  userToken: string;
};

export const Login = () => {
  const [usernameOremail, setusernameOremail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");

  const toast = useToast();

  // useEffect(() => {
  //   const userToken = localStorage.getItem("userToken");
  //   if (userToken) {
  //     fetch(`http://120.25.216.186:8888/users/getUserByName?name=${userToken}`)
  //       .then((response) => response.json())
  //       .then((data) => setUserId(data.id))
  //       .catch((error) => console.error(error));
  //   } else {
  //     console.log("userToken not found");
  //   }
  // }, []);

  const validateFields = () => {
    if (!usernameOremail || !password) {
      setError("请填写邮箱和密码");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission behavior
    setIsLoading(true);
    setError("");
    console.log(usernameOremail);
    console.log(password);
    if (!validateFields()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<LoginResponse>(
        "http://120.25.216.186:8888/users/login",
        {
          usernameOremail,
          password,
        }
      );

      localStorage.setItem("userToken", response.data);
      console.log(response.data);
      console.log("userToken: " + localStorage.getItem("userToken"));
      const userToken = localStorage.getItem("userToken");
      if (userToken === "user not exist") {
        console.log("用户不存在！");
        toast({
          title: "用户不存在！",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        localStorage.removeItem("userToken");
        localStorage.removeItem("userId");
        window.location.href = "/login";
        return;
      }
      if (userToken === "password wrong") {
        console.log("密码错误！");
        toast({
          title: "密码错误！",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        localStorage.removeItem("userToken");
        localStorage.removeItem("userId");
        window.location.href = "/login";
        return;
      }
      if (userToken) {
        console.log("try to get userId by name");
        fetch(
          `http://120.25.216.186:8888/users/getUserByName?name=${userToken}`
        )
          .then((response) => response.json())
          .then((data) => {
            setUserId(data.id);
            localStorage.setItem("userId", data.id);
            console.log("userId: " + localStorage.getItem("userId"));
            toast({
              title: `${userToken} 登陆成功！`,
              status: "success",
              duration: 2000,
              isClosable: true,
            });
          })
          .catch((error) => console.error(error));
        console.log(response.data);
        console.log("userId: " + localStorage.getItem("userId"));
      } else {
        console.log("userToken not found");
      }
      console.log("登录成功!");
      window.location.href = "/";
      setTimeout(() => {
        localStorage.removeItem("userToken");
        localStorage.removeItem("userId");
        toast({
          title: "登录超时，请重新登录",
          status: "warning",
          duration: 2000,
          isClosable: true,
        });
        window.location.href = "/login";
      }, 30 * 60 * 1000);
    } catch (e) {
      setError(e.message);
      console.log("登录失败处理");
      toast({
        title: "登录失败",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      localStorage.removeItem("userToken");
      localStorage.removeItem("userId");
      window.location.href = "/login";
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container
      maxW="lg"
      py={{ base: "12", md: "24" }}
      px={{ base: "0", sm: "8" }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          <Logo />
          <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
            <Heading size={{ base: "xs", md: "sm" }}>登陆后更精彩</Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">还没有账号？</Text>
              <Button
                variant="ghost"
                colorScheme="blue"
                size="sm"
                onClick={() => (window.location.href = "/signup")}
              >
                立即注册
              </Button>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{ base: "0", sm: "8" }}
          px={{ base: "4", sm: "10" }}
          bg={{ base: "transparent", sm: "bg-surface" }}
          boxShadow={{ base: "none", sm: "md" }}
          borderRadius={{ base: "none", sm: "xl" }}
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="usernameOremail">邮箱</FormLabel>
                <Input
                  value={usernameOremail}
                  onChange={(event) => {
                    setusernameOremail(event.target.value);
                    console.log(usernameOremail);
                  }}
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  console.log(password);
                }}
              />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>记住我</Checkbox>
              <Button variant="link" colorScheme="blue" size="sm">
                忘记密码？
              </Button>
            </HStack>
            <Stack spacing="6">
              <Button
                variant="solid"
                colorScheme="pink"
                size="lg"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="登录中..."
                _hover={{ bg: "purple.600" }}
              >
                登录
              </Button>
              {error && (
                <Text fontSize="sm" color="red.500">
                  {error}
                </Text>
              )}
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  可使用以下方式登录
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};
