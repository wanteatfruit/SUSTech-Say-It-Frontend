import axios from "axios";
import { getCookie } from "../_app";
let option = null;
const token = getCookie();
if(token!==undefined){
    option =  {
        headers:{
            'token':`${token}`
        }
    }
}

const user_axios = axios.create({
    headers:{
        'token':`${token}`
    },
    //set host
    baseURL:"http://120.25.216.186:8888"
})


export async function getMostActiveUser(space_id:string) {
    const res = await user_axios.get(`/users/getMostActiveUser?space_id=${space_id}`);
    const data = await res.data;
    return data;
}

export async function getUserByID(id:number) {
    const res = await user_axios.get(`/users/getUserById?id=${id}`);
    const data = await res.data;
    return data;
}

export async function getFavPost(id:number) {
    const res = await user_axios.get(`/users/getUserFavoritePosts?id=${id}`);
    const data = await res.data;
    return data;
}

export async function getDislikePost(id:number) {
    const res = await user_axios.get(`/users/getUserDownvotePosts?id=${id}`)
    const data = await res.data;
    return data;
}

export async function getLikePost(id:number) {
    const res = await user_axios.get(`/users/getUserUpvotePosts?id=${id}`)
    const data = await res.data;
    return data;
}

export async function addToFav(id:string){
    const res = await user_axios.post(`/users/addfavpost?post_id=${id}`)
    const data = await res.data;
    return data;
}

export async function removeFromFav(id:string){
    const res = await user_axios.post(`/users/deletefavpost?post_id=${id}`)
    const data = await res.data;
    return data;
}