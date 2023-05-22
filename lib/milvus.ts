import { MilvusClient } from "@zilliz/milvus2-sdk-node/dist/milvus";
import { mconfig } from "@/milvus_config";
//init


declare global{
   var milvus:MilvusClient
}

let milvus:MilvusClient
console.info("Connecting to milvus");

const { uri, user, password, secure } = mconfig;
if(process.env.NODE_ENV=='production'){
    milvus = new MilvusClient("118.195.181.111:19530");
    // milvus = null;
}else{
    if(!global.milvus){
        console.log("No milvus available, creating new milvus.");
        // global.milvus = new MilvusClient(uri, true, user, password);
        global.milvus = new MilvusClient("localhost:19530")
    }
    milvus = global.milvus;
}
console.info("Success");
export default milvus;
