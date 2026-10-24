import axios from "axios";
import {UserEditState} from "@/store/admin/accountAdmin.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminInfoMe() {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/account`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des données utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminUserEdit(data: UserEditState) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/account/edit`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'édition des données de l'utilisateur : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}