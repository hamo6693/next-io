//استخدام الخطافات لاحضار البيانات من الخادم
//خطاف المسؤول عن المشاركة او الاسئلة

import useSWR, { mutate } from "swr"
import axios from "axios"

//دالة المسئولة عن ارسال الطلب
const fetcher = url => axios.get(url).then(({data}) => data?.data)

//دالة للتعامل مع البيانات القادمة
export function usePosts({page = 1,sort = -1,tag = ""}){
    const url = `/api/post/?page=${page}&sort=${sort}&tag=${tag}`
    const {data,error} = useSWR(url,fetcher)
    
    return{
        data:data,
        error,
        loading:!data && !error
    };
}
//طلب بيانات السؤال
export default function usePost(id) {
    const url = `/api/post/${id}`;
    const {data,error,mutate} = useSWR(url,fetcher);

    const answer = async(params) => {
        await axios.post(`/api/post/answer`,{...params,question:id})
        await mutate({...data})
    }

    const vote = async(id,type) => {
        await axios.post(`/api/post/vote`,{post:id,type})
        await mutate({...data})
    }

    return{
        data,
        error,
        loading: !data && !error,
        answer,
        vote
    };
}
export const ask = async (params) => {
    const { data } = await axios.post(`/api/post/question`, params)
    return data?.data?.id
}