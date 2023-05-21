import { postInterface } from "@/interfaces/postInterface";
import { spaceInfo } from "@/interfaces/spaceInterface";
import { getActivePostNumber } from "@/pages/api/SpaceAPI";
import { getMostActiveUser, getUserByID } from "@/pages/api/UserAPI";
import {
  Button,
  Text,
  ButtonGroup,
  Card,
  CardFooter,
  CardHeader,
  Heading,
  VStack,
  CardBody,
  Link,
  LinkBox,
  LinkOverlay,
  HStack,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Icon,
} from "@chakra-ui/react";
import { useEffect,useState } from "react";
import { BiCrown } from "react-icons/bi";

//add postNum to props

interface spaceStats{
  postNum: number,
}
interface spaceCard extends spaceInfo, spaceStats{

}

export default function SpaceCard({
  spaceID,
  RouteName,
  spaceName,
  spaceIntroduction,
  postNum,
}:  spaceCard ) {

  const [mostActiveUsername, setMostActiveUsername] = useState('' as string)
  const [mostActiveUserid, setMostActiveUserid] = useState('' as string)
  const [activePostNum, setActivePostNum] = useState(0 as number)

  const [mostActiveUserPercent, setMostActiveUserPercent] = useState(0 as number)

  useEffect(()=>{
    async function getData(spaceID:string){
      const activeUserData = await getMostActiveUser(spaceID);
      const recentPosts = await getActivePostNumber(spaceID);
      const user = await getUserByID(activeUserData.userid);
      const activeUserPercent = activeUserData.proportion;
      setMostActiveUsername(user.username);
      setMostActiveUserid(user.id);
      setMostActiveUserPercent((activeUserPercent*100).toFixed(0));
      setActivePostNum(recentPosts);
    } 
    getData(spaceID.toString());
  },[]);

  return (
    <Card variant="outline" width="100%" maxWidth="20vw" minWidth="20vw">
      <CardHeader >
        <Text fontWeight="600" fontSize="2xl"  >
          {spaceName}
        </Text>
      </CardHeader>
      <CardBody pt={0} pb={0}>
        <HStack justify='center' alignItems='center'>
        <Stat>
          <StatLabel>最近一周贴子</StatLabel>
          <StatNumber>{activePostNum}</StatNumber>
        </Stat>
        <Stat>
          <StatLabel>总贴子</StatLabel>
          <StatNumber>{postNum}</StatNumber>
        </Stat>

        </HStack>
        <Stat mt={4}>
          <StatLabel>最活跃用户👑</StatLabel>
          <Link href={`/user/send/${mostActiveUserid}`}>
          <StatNumber  alignItems='center'>{mostActiveUsername}</StatNumber>
          </Link>
          <StatHelpText>超越了<span style={{color:'var(--minimal-2)', fontWeight:'600'}}>{mostActiveUserPercent}%</span>的用户</StatHelpText>
        </Stat>
      </CardBody>
      <CardFooter flexDir="column">
        <VStack>
          <LinkBox width="100%">
            <LinkOverlay href={`/publish/${RouteName}`}>
              <Button
                width="100%"
                bgColor="var(--minimal-2)"
                _hover={{ bgColor: "var(--minimal-3)" }}
                textColor="white"
              >
                发帖
              </Button>
            </LinkOverlay>
          </LinkBox>
        </VStack>
      </CardFooter>
    </Card>
  );
}
