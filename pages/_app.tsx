import "@/styles/globals.css";
import {
  ChakraProvider,
  defineStyleConfig,
  extendTheme,
} from "@chakra-ui/react";
import type { AppProps } from "next/app";
import localFont from "next/font/local";
import { MilvusClient } from "@zilliz/milvus2-sdk-node/dist/milvus";
import { mconfig } from "@/milvus_config";

console.log = function(){}; //clean up console

export function getCookie() {
  if (typeof window !== "undefined") {
    const id = localStorage.getItem("userToken");
    console.log(id);
    return id;
  }
  return "";
}



const myFont = localFont({
  src: [
    {
      path: "../fonts/AlibabaPuHuiTi-2-55-Regular.otf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../fonts/AlibabaPuHuiTi-2-45-Light.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../fonts/AlibabaPuHuiTi-2-65-Medium.otf",
      weight: "600",
      style: "bold",
    },
  ],
});

// const chakraHeading = {
//   textStyles:{
//     h1:{
//       fontFamily:'var(font-post-title)'
//     }
//   }
// }

const Button = defineStyleConfig({
  variants: {
    outline: {
      borderColor: "var(--beach-1)",
    },
  },
});

const theme = extendTheme({
  colors: {
    minimalColor3: "#DDD6CE",
  },
  components: {
    Button,
  },
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <main className={myFont.className}>
        <Component {...pageProps} />
      </main>
    </ChakraProvider>
  );
}
