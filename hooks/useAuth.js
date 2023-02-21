//لاستخدام الحزمة للتخاطب الخادم مع المتصفح
import axios from 'axios'
import { useEffect } from 'react'
import useSWR from 'swr'
import Router from 'next/router'

//دالة لارسال البيانات الى الخادم
export const login = params => axios.post(`/api/auth/login`, params)

export const register = params => axios.post(`/api/auth/register`, params)

export const logout = async (mutate) => {
    await axios.post(`/api/auth/logout`);
    mutate()
}

const fetcher = url => axios.get(url).then(({data}) => data?.data)

export default function useAuth({redirectTo = false, redirectIfFound = false} = {}) {
    // Getting data from the server.
    const {data: user, error, mutate} = useSWR(`/api/auth/me`, fetcher);

    useEffect(() => {
        if (error && redirectTo && !redirectIfFound) Router.push(redirectTo);
        if (user && redirectIfFound) Router.push(redirectTo);
    }, [user, error, redirectTo]);

    return {
        user,
        loading: !user && !error,
        logout: () => logout(mutate)
    }

}