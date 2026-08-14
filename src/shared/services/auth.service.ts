import axios from "axios";
import {useAuthStore} from "@/store/auth.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

axios.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => Promise.reject(error))

export async function axiosRegister(data: {email: string, password: string}) {
    try {
        const response = await axios.post(`${BASE_URL}/api/user/register`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'inscription' : ${response.status}`)
    } catch(err: any) {
        console.error(err)
        throw err
    }
}

export async function axiosLogin(data: {email: string, password: string}) {
    try {
        const response = await axios.post(`${BASE_URL}/api/login`, {
            username: data.email,
            password: data.password
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la connexion : ${response.status}`)
    } catch(err: any) {
        console.error(err)
        throw err
    }
}

export async function axiosInfoMe() {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/me`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des infoq de l'utilisateur connecté : ${response.status}`)
    } catch(err: any) {
        console.error(err)
        throw err
    }
}