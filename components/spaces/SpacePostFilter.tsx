import { postInterface } from "@/interfaces/postInterface";
import { CalendarIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Divider,
  HStack,
  Icon,
  Input,
  InputGroup,
  InputLeftElement,
  Menu,
  MenuButton,
  MenuDivider,
  MenuItem,
  MenuItemOption,
  MenuList,
  MenuOptionGroup,
  Text,
} from "@chakra-ui/react";
import assert from "assert";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { BiSearch } from "react-icons/bi";
import Fuse from "fuse.js";
import { FaFire } from "react-icons/fa";
import { HiArrowNarrowUp } from "react-icons/hi";
import { BsSortAlphaDown, BsCalendarDate } from "react-icons/bs";
export default function SpacePostFilter({ posts, setPost, setLoading }) {
  const sortDict = {
    time: "发帖时间",
    pop: "热度",
    up: "点赞数",
  };
  const spanDict = {
    all: "全部",
    year: "最近一年",
    month: "最近一月",
    week: "最近一周",
  };

  function filterCond(sortBy: string) {
    setLoading(true);
    //deep copy
    let tmp_posts = JSON.parse(JSON.stringify(currentPosts));
    if (sortBy == "time") {
      tmp_posts.sort(
        (a: postInterface, b: postInterface) =>
          dayjs(b.time).valueOf() - dayjs(a.time).valueOf()
      );
    } else if (sortBy == "pop") {
      console.log("pop");
      tmp_posts.sort(
        (a: postInterface, b: postInterface) => b.viewcount - a.viewcount
      );
    } else if (sortBy == "up") {
      tmp_posts.sort(
        (a: postInterface, b: postInterface) =>
          b.upvote - b.downvote - a.upvote + a.downvote
      );
    }
    assert(currentPosts !== tmp_posts);
    setPost(tmp_posts);
    setLoading(false);
  }

  function filterTime(span: string) {
    setLoading(true);
    const now = dayjs();
    let tmp_posts = posts;
    if (span == "all") {
      tmp_posts = posts;
    } else if (span == "year") {
      tmp_posts = posts.filter(
        (post: postInterface) => now.diff(dayjs(post.time), "year") <= 1
      );
    } else if (span == "month") {
      tmp_posts = posts.filter(
        (post: postInterface) => now.diff(dayjs(post.time), "month") <= 1
      );
    } else if (span == "week") {
      tmp_posts = posts.filter(
        (post: postInterface) => now.diff(dayjs(post.time), "week") <= 1
      );
    }
    setPost(tmp_posts);
    setCurrentPosts(tmp_posts);
    // filterCond(sortBy);
    setLoading(false);
  }

  function handleSearch() {
    if (searchText == "") {
      setPost(posts);
      return;
    }
    const options = {
      keys: ["title", "content"],
    };
    const fuse = new Fuse(posts, options);
    const res = fuse.search(searchText);
    setPost(res.map((r) => r.item));
    // return fuse.search(searchText);
  }

  const [currentPosts, setCurrentPosts] = useState<postInterface[]>(posts);
  const [sortBy, setSortBy] = useState("time");
  const [span, setSpan] = useState("all");

  const [searchText, setSearchText] = useState("");

  return (
    <Box mx="10%" mt="-10px" mb="20px" zIndex={100}>
      <HStack justify="space-between">
        <HStack>
          <Menu closeOnSelect={false}>
            <MenuButton
              leftIcon={<HamburgerIcon />}
              _hover={{ bgColor: "var(--minimal-3)" }}
              bgColor='var(--minimal-2)'
              color='white'
              as={Button}

            >
              筛选
            </MenuButton>
            <MenuList>
              <MenuOptionGroup
                defaultValue="time"
                title="排序"
                type="radio"
                onChange={(value) => {
                  setSortBy(value);
                  filterCond(value);
                }}
              >
                <MenuItemOption icon={<CalendarIcon />} value="time">
                  发帖时间
                </MenuItemOption>
                <MenuItemOption icon={<FaFire />} value="pop">
                  热度
                </MenuItemOption>
                <MenuItemOption icon={<HiArrowNarrowUp />} value="up">
                  点赞数
                </MenuItemOption>
              </MenuOptionGroup>
              <MenuDivider />
              <MenuOptionGroup
                defaultValue="all"
                title="时间跨度"
                type="radio"
                onChange={(value) => {
                  setSpan(value);
                  filterTime(value);
                  //   filterCond(sortBy);
                }}
              >
                <MenuItemOption value="all">全部</MenuItemOption>
                <MenuItemOption value="year">最近一年</MenuItemOption>
                <MenuItemOption value="month">最近一月</MenuItemOption>
                <MenuItemOption value="week">最近一周</MenuItemOption>
              </MenuOptionGroup>
            </MenuList>
          </Menu>
          <Divider ml={100} height={"2em"} orientation="vertical" />
          <InputGroup  width="25%">
            <InputLeftElement pointerEvents="none">
              <BsSortAlphaDown />
            </InputLeftElement>
            <Input
              placeholder={sortDict[sortBy]}
              isReadOnly
              textAlign="center"
              cursor="default"
              _focusVisible={{borderColor: 'var(--minimal-2)'}}

            ></Input>
          </InputGroup>
          <InputGroup width="25%">
            <InputLeftElement>
              <BsCalendarDate />
            </InputLeftElement>
            <Input
              placeholder={spanDict[span]}
              isReadOnly
              textAlign="center"
              cursor="default"
              _focusVisible={{borderColor: 'var(--minimal-2)'}}

            ></Input>
          </InputGroup>
        </HStack>
        <HStack width="50%" >
          <InputGroup mb={1}>
            {/* search when enter */}
            <Input
              placeholder="搜索"
              outline="0"
              borderRadius='0'
              border='none'
              borderBottom='1px solid gray'

              transitionProperty="common"
              transitionDuration="normal"
              _focusVisible={{
                bg: "white",
                borderBottom: "1px solid var(--minimal-2)",
                borderBottomRadius: 0,
                transition: "ease-in-out",
              }}
              value={searchText}
              onChange={(event) => {
                setSearchText(event.target.value);
              }}
              onKeyDown={(event) => {
                if (event.key == "Enter") {
                  handleSearch();
                }
              }}
              // variant="filled"
            />
            <InputLeftElement>
              <BiSearch color="gray.300" />
            </InputLeftElement>
          </InputGroup>
        </HStack>
      </HStack>
    </Box>
  );
}
