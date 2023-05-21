import { IconButton, useToast } from "@chakra-ui/react";
import { motion } from "framer-motion";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { useEffect, useState } from "react";
import { addToFav, removeFromFav } from "@/pages/api/UserAPI";
export default function Favorite({ id, fav }: { id: string, fav:boolean }) {
  const toast = useToast();
  const [isFav, setIsFav] = useState(fav);

  useEffect(()=>{
    setIsFav(fav);
  },[fav])

  async function addFav() {
    if (localStorage.getItem("userToken") !== null) {
      addToFav(id).then((res) => {
        if (res) {
          setIsFav(true);
          toast({
            title: "收藏成功",
            status: "success",
            duration: 2000,
            isClosable: true,
          });
        }
      });
    } else {
      toast({
        title: "请先登录",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  async function removeFav(){
    if (localStorage.getItem("userToken") !== null) {
      removeFromFav(id).then((res) => {
        if (res) {
          setIsFav(false);
        }
      });
      toast({
        title: "取消收藏",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    } else {
      toast({
        title: "请先登录",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  return (
    <>
      {isFav ? (
        <IconButton
          as={motion.div}
          variant="link"
          cursor="pointer"
          colorScheme="red"
          border="0"
          whileTap={{ scale: 1.3 }}
          aria-label="fav"
          icon={<AiFillHeart size="1.5em" />}
          onClick={() => {

            removeFav();
          }}
        ></IconButton>
      ) : (
        <IconButton
          as={motion.div}
          variant="link"
          cursor="pointer"
          colorScheme=""
          border="0"
          whileTap={{ scale: 1.3 }}
          aria-label="fav"
          icon={<AiOutlineHeart size="1.5em" />}
          onClick={() => {
            addFav();

            // setIsFav(!isFav);
            
          }}
        ></IconButton>
      )}
    </>
  );
}
