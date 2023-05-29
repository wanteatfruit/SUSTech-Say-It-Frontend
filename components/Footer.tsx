import {
  Box,
  ButtonGroup,
  Container,
  HStack,
  IconButton,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <Box w="100%" mt={16} pb={10} bgColor="var(--minimal-1)">
      <Container pt={10} as="footer" role="contentinfo">
        <HStack justify="space-between">
          <Stack spacing={{ base: "3", md: "3" }}>
            <Text fontSize="md" fontFamily="Poppins" color="subtle">
              &copy; {new Date().getFullYear()} Just-Say-It. All rights
              reserved.
            </Text>
          </Stack>
          <Link
            href="https://github.com/wanteatfruit/SUSTech-Say-It-Frontend"
            isExternal
          >
            <IconButton
              _hover={{ bgColor: "none", color: "gray" }}
              aria-label="github"
              variant="ghost"
            >
              <FaGithub size="md" />
            </IconButton>
          </Link>
        </HStack>
      </Container>
    </Box>
  );
}
