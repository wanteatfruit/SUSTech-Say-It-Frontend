import {
  Button,
  Card,
  CardBody,
  CardHeader,
  IconButton,
  Input,
  InputGroup,
  Link,
  InputRightElement,
  SkeletonCircle,
  SkeletonText,
  Text,
  UnorderedList,
  ListItem,
} from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { BiSearch } from "react-icons/bi";
export default function StackOverflow() {
  const [searchText, setSearchText] = useState("");
  const [loading, setLoading] = useState(false);
  const [topFiveTitles, setTopFiveTitles] = useState([]);
  const [topFiveLinks, setTopFiveLinks] = useState([]);

  function handleSearch() {
    async function stackAPI() {
      if(searchText == "") return;
      setLoading(true);
      const res = await axios.get(
        `https://api.stackexchange.com/2.3/search?order=desc&sort=activity&intitle=${searchText}&site=stackoverflow`
      );
      const topFive = res.data.items.slice(0, 5);
      const topFiveTitles = topFive.map((item: any) => item.title);
      const topFiveLinks = topFive.map((item: any) => item.link);
      setTopFiveTitles(topFiveTitles);
      setTopFiveLinks(topFiveLinks);
      setLoading(false);
    }
    stackAPI();
  }

  return (
    <>
      <Card variant='outline' width="100%">
        <CardHeader fontWeight="600" fontSize="xl">
        搜索Stack Overflow
        </CardHeader>
        <CardBody pt={0} pb={1}>
          <InputGroup>
            <Input
              value={searchText}
              placeholder="搜索..."
              _focusVisible={{ borderColor: "var(--minimal-2)" }}
              onChange={(event) => setSearchText(event.target.value)}
            ></Input>
            <InputRightElement>
              <IconButton
                aria-label="search"
                borderStartRadius="0"
                p={2}
                // bgColor="tomato"
                bgColor="var(--minimal-2)"
                _hover={{ bgColor: "var(--minimal-3)" }}
                onClick={handleSearch}
                icon={<BiSearch color="white" />}
              ></IconButton>
            </InputRightElement>
          </InputGroup>
          <SkeletonText isLoaded={!loading}>
            <UnorderedList mt={4}>
              {topFiveTitles.map((title: string, index: number) => (
                <ListItem my={2} key={index} >
                  <Link isExternal href={topFiveLinks[index]}>
                    <Text>{title.toString()}</Text>
                  </Link>
                </ListItem>
              ))}
            </UnorderedList>
          </SkeletonText>
        </CardBody>
      </Card>
    </>
  );
}
