//استدعاء واجهة البرمجية
import useSwr from "swr"
import axios from "axios"

const fetcher = url => axios.get(url).then(({data}) => data?.data)

export function useTags(){
    const {data} = useSwr(`/api/tag`,fetcher)

    return{
        data:data || []
    }
}