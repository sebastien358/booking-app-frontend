import axios from "axios";
import {AccountFormData} from "@/store/user/accountUser.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAccountUser() {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/account`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération du compte utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAccountUserEdit(data: AccountFormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/user/account/edit`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la modification du compte utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAccountUserDelete() {
    try {
        const response = await axios.delete(`${BASE_URL}/api/user/account/delete`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression du compte utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}