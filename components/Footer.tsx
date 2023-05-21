import {
  Box,
  ButtonGroup,
  Container,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <Box w='100%' mt={10}  bgColor='var(--minimal-2)'>
    <Container pt={10} as="footer" role="contentinfo">
      <Stack  spacing={{ base: "4", md: "5" }}>

        <Text fontSize="sm" color="subtle">
          &copy; {new Date().getFullYear()} Just-Say-It. All rights
          reserved.
        </Text>
      </Stack>
    </Container>
    </Box>
  );
}
