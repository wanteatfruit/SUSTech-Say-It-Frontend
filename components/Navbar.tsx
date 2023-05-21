import { useState, useEffect } from "react";
import {
  Icon,
  Box,
  Button,
  ButtonGroup,
  Container,
  Flex,
  Link,
  LinkBox,
  HStack,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  useBreakpointValue,
  LinkOverlay,
  useDisclosure,
  Switch,
  FormControl,
  FormLabel,
  Menu,
  MenuButton,
  MenuList,
  MenuIcon,
  MenuItem,
} from "@chakra-ui/react";
import { useToast } from "@chakra-ui/react";
import { BiSearch, BiHome, BiMenu } from "react-icons/bi";
import SideNavDrawer from "./SideNavDrawer";
import SearchBar from "./SearchBar";
import { motion } from "framer-motion";
import { FaForumbee } from "react-icons/fa";
import { TfiThemifyFavicon } from "react-icons/tfi";
import { SiSonarsource } from "react-icons/si";
export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [userId, setUserId] = useState("");
  const toast = useToast();

  useEffect(() => {
    const userToken = localStorage.getItem("userToken");
    if (userToken) {
      fetch(`http://120.25.216.186:8888/users/getUserByName?name=${userToken}`)
        .then((response) => response.json())
        .then((data) => setUserId(data.id))
        .catch((error) => console.error(error));
    } else {
      console.log("userToken not found");
    }
  }, []);

  return (
    <Box as="section" position="fixed" top="0" width="100%" zIndex="999">
      <Link href='/'>
      <Button
        size="lg"
        variant="ghost"
        fontFamily='Poppins'
        fontWeight='400'
        _hover={{bgColor:'white'}}
        leftIcon={<SiSonarsource strokeWidth="0.5px" fontSize="1.75rem" />}
        padding={2}
        color="var(--minimal-2)"
        aria-label="logo"
        position="absolute"
        top="3"
        left="10"
      >
        JUST-SAY-IT
      </Button>
      </Link>

      <SideNavDrawer isOpen={isOpen} onClose={onClose} />
      <Box as="nav" bg="bg-surface" boxShadow="sm" bgColor="var(--beach-3)">
        <Box
          justifyContent="center"
          width="100%"
          py={{ base: "2", lg: "3" }}
          mx={0}
          px="17%"
        >
          <HStack spacing="10" justify="space-between">
            {isDesktop ? (
              <HStack spacing={10} justify="space-evenly" flex={1}>
                <ButtonGroup spacing={8}>
                  <Button
                    as={motion.div}
                    whileTap={{ scale: 0.9 }}
                    variant="ghost"
                    _hover={{
                      bgColor: "var(--minimal-2)",
                      color: "white",
                      cursor: "pointer",
                    }}
                    onClick={onOpen}
                    leftIcon={<BiMenu />}
                  >
                    导航
                  </Button>
                  <LinkBox>
                    <LinkOverlay href="/">
                      <Button
                        as={motion.div}
                        whileTap={{ scale: 0.9 }}
                        variant="ghost"
                        _hover={{
                          bgColor: "var(--minimal-2)",
                          cursor: "pointer",
                          color: "white",
                        }}
                        leftIcon={<BiHome></BiHome>}
                      >
                        主页
                      </Button>
                    </LinkOverlay>
                  </LinkBox>
                </ButtonGroup>
                <Box width="100%">
                  <SearchBar />
                </Box>
                <ButtonGroup spacing={6}>
                  {!localStorage.getItem("userToken") && (
                    <>
                      <Button
                        variant="ghost"
                        onClick={() => (window.location.href = "/login")}
                      >
                        登录
                      </Button>
                      <Button
                        variant="ghost"
                        textColor="var(--minimal-color-1)"
                        onClick={() => (window.location.href = "/signup")}
                      >
                        注册
                      </Button>
                    </>
                  )}
                  {localStorage.getItem("userToken") && (
                    <Button
                      variant="ghost"
                      onClick={() =>
                        (window.location.href = `/user/send/${userId}`)
                      }
                    >
                      {localStorage.getItem("userToken")}
                    </Button>
                  )}
                  {localStorage.getItem("userToken") && (
                    <Button
                      variant="ghost"
                      onClick={() => {
                        localStorage.removeItem("userToken");
                        localStorage.removeItem("userId");
                        window.location.href = "/";
                        toast({
                          title: "登出成功",
                          status: "success",
                          duration: 2000,
                          isClosable: true,
                        });
                      }}
                    >
                      登出
                    </Button>
                  )}
                </ButtonGroup>
              </HStack>
            ) : (
              <IconButton aria-label="not_sure_what_this_is" variant="ghost" />
            )}
          </HStack>
        </Box>
      </Box>
    </Box>
  );
}
