import {
  Box,
  Accordion,
  AccordionButton,
  AccordionItem,
  Avatar,
  Drawer,
  Text,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  List,
  ListIcon,
  ListItem,
  Stack,
  AccordionPanel,
  AccordionIcon,
  UnorderedList,
  Button,
  ButtonGroup,
  VStack,
  IconButton,
  Link,
} from "@chakra-ui/react";
import { BiPaperPlane, BiStar } from "react-icons/bi";
interface props {
  onClose: () => void;
  isOpen: boolean;
}

export default function SideNavDrawer({ onClose, isOpen }: props) {
  return (
    <Drawer  placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay />
      <DrawerContent fontFamily="var(--font-post-title)">
        <DrawerHeader>快速导航</DrawerHeader>
        <DrawerBody>
          <Accordion allowToggle defaultIndex={[0]} allowMultiple>
            {/* <AccordionItem px={0}>
              <>
                <AccordionButton>
                  <Box textAlign="left" as="span" flex="1">
                    我的板块
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={0}>
                  <VStack>
                    <ButtonGroup width='100%'  variant='ghost' isAttached>
                    <Button textAlign='left' width='100%'>留学交流</Button>
                    </ButtonGroup>
                   
                  </VStack>
                </AccordionPanel>
              </>
            </AccordionItem> */}
            <AccordionItem>
              <h2>
                <AccordionButton>
                  <Box textAlign="left" as="span" flex="1">
                    所有板块
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel px={0}>
                  <VStack>
                    <ButtonGroup
                    
                      width="100%"
                      variant="ghost"
                      isAttached
                      flexDirection="column"
                    >
                      <Link href="/graduation" _hover={{ textDecoration: "none" }}>
                        <Button textAlign="left" width="100%">
                          升学交流
                        </Button>
                      </Link>
                      <Link href="/chat" _hover={{ textDecoration: "none" }}>
                      <Button textAlign="left" width="100%">
                        闲聊吹水
                      </Button>
                      </Link>
                      <Link href="/course" _hover={{ textDecoration: "none" }}>
                      <Button textAlign="left" width="100%">
                        课程交流
                      </Button>
                      </Link>
                    </ButtonGroup>
                  </VStack>
                </AccordionPanel>
              </h2>
            </AccordionItem>
          </Accordion>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
