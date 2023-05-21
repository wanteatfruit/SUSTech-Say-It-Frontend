import { relatedPost } from "@/lib/relatedPost";
import {
  Card,
  CardBody,
  CardHeader,
  Link,
  List,
  ListItem,
  Skeleton,
  Text,
  UnorderedList,
} from "@chakra-ui/react";
import axios from "axios";
import { useState, useEffect } from "react";

//相关推荐

export default function RelatedPosts(posts:relatedPost[]) {
  const [loading, isLoading] = useState(false);
  console.log(Array.isArray(posts))
  
  return (
    <>
    <Skeleton isLoaded={!loading}>
      <Card>
        <CardHeader pb={0}>
        </CardHeader>
        <CardBody>
          <UnorderedList>
            {posts!==undefined && posts!==null && posts.map((item)=>(
              <ListItem key={item.id} >
                <Link>{item.title}</Link>
              </ListItem>
            ))}
            {/* <ListItem>
              <Link>如何评价计算机科学？</Link>
            </ListItem> */}
          </UnorderedList>
        </CardBody>
      </Card>
      </Skeleton>
    </>
  );
}
