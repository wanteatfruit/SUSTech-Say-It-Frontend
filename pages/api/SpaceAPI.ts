import axios from "axios";

const space_axios = axios.create({
    baseURL:"http://120.25.216.186:8888"
})

export async function getHotBySpace(space_id:string){
    const res = await space_axios.get(`/space/getActivityPercent?space_id=${space_id}`);
    const data = await res.data;
    return data;
}

export async function getActivePostNumber(space_id:string){
    const res = await space_axios.get(`/space/getRecentPost?space_id=${space_id}`);
    const data = await res.data;
    return data;
}