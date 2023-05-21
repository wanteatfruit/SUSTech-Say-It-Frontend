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
import { useState } from "react";
import axios from "axios";
import { Logo } from "./Logo";
import { OAuthButtonGroup } from "./OAuthButtonGroup";
import { PasswordField } from "./PasswordField";
import { useToast } from "@chakra-ui/react";

type SignupResponse = {
  userID: string;
};

export const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();

  const validateFields = () => {
    if (!email || !password || !username) {
      setError("请完善注册信息");
      return false;
    }
    return true;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    if (!validateFields()) {
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post<SignupResponse>(
        "http://120.25.216.186:8888/users/signup",
        {
          username,
          email,
          password,
        }
      );
      console.log(response.data);
      if (response.data === "username exist") {
        toast({
          title: "用户名已存在",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        window.location.href = "/signup";
        return;
      }
      if (response.data === "email exist") {
        toast({
          title: "邮箱已存在",
          status: "error",
          duration: 2000,
          isClosable: true,
        });
        window.location.href = "/signup";
        return;
      }

      toast({
        title: `${username} 注册成功！`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      window.location.href = "/";
    } catch (e) {
      setError(e.message);
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
            <Heading size={{ base: "xs", md: "sm" }}>创建账号</Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">已有账号？</Text>
              <Button
                variant="ghost"
                colorScheme="blue"
                size="sm"
                onClick={() => (window.location.href = "/login")}
              >
                登录
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
                <FormLabel htmlFor="username">用户名</FormLabel>
                <Input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="email">邮箱</FormLabel>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </Stack>
            <HStack justify="space-between">
              <Checkbox defaultChecked>同意用户相关条款</Checkbox>
            </HStack>

            <Stack spacing="6">
              <Button
                variant="solid"
                colorScheme="pink"
                size="lg"
                onClick={handleSubmit}
                isLoading={isLoading}
                loadingText="注册中..."
                _hover={{ bg: "purple.600" }}
              >
                注册
              </Button>
              {error && (
                <Text fontSize="sm" color="red.500">
                  {error}
                </Text>
              )}
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  可使用以下方式注册
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
