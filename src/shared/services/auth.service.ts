import axios from "axios";
import {useAuthStore} from "@/store/auth.store";

const api = axios.create({
    baseURL: 'http://127.0.0.1:8000',
})

// INTERCEPTOR OK AVEC getState()
api.interceptors.request.use((config) => {
    const token = useAuthStore.getState().token
    if (token) {
        config.headers.Authorization = `Bearer ${token}`
    }
    return config
}, (error) => Promise.reject(error))

export async function axiosLogin(data: {email: string, password: string}) {
    try {
        const response = await api.post('/api/login', {
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
        const response = await api.get('/api/user/me')
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des infoq de l'utilisateur connecté : ${response.status}`)
    } catch(err: any) {
        console.error(err)
        throw err
    }
}