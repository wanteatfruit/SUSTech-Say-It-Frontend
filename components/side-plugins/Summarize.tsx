import { postInterface } from "@/interfaces/postInterface";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  SkeletonText,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useState } from "react";

type sum = {
  post_id: string;
  title?:string
};

export default function Summarize({ post_id,title }: sum) {
  const [summary, setSummary] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [showLoading, setShowLoading] = useState<boolean>(false);
  async function handleSummarize() {
    setShowLoading(true);
    if(localStorage.getItem(`summary-${post_id}`)){
      setSummary(localStorage.getItem(`summary-${post_id}`) as string);
      setLoading(false);
      return;
    }
    await axios
      .get(`/api/gpt?type=summarize&post_id=${post_id}&title=${title}`)
      .then((res) => {
        const summ = res.data.summary;
        console.log(res.data);
        setSummary(summ);
        setLoading(false);
        localStorage.setItem(`summary-${post_id}`, summ);
      });
  }
  return (
    <>
      <Card width="100%">
        <CardHeader fontSize="2xl" fontWeight="600">
          <Text>太长不看</Text>
        </CardHeader>
        <CardBody pt={0}>
          {showLoading && (
            <SkeletonText isLoaded={!loading}>
              <Text>{summary}</Text>
            </SkeletonText>
          )}
          {!showLoading && (
            <Tooltip label='使用chatgpt生成。提示词为：“将上述文字概括为 100 个字，使其易于阅读和理解。避免使用复杂的句子结构或技术术语。”' hasArrow >
            <Button
              mt={4}
              bgColor="var(--minimal-2)"
              textColor="white"
              _hover={{ bgColor:'var(--minimal-3)' }}
              width="100%"
              onClick={handleSummarize}
            >
              生成
            </Button>
            </Tooltip>
          )}
        </CardBody>
      </Card>
    </>
  );
}
