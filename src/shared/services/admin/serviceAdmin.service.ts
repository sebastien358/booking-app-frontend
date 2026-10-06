import axios from "axios";
import {ServiceFormData} from "@/store/admin/serviceAdmin.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminServiceList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/service/list`, {
            params: {
                offset, limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des services : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminServiceDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/service/show/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un service : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminServiceSearch(term: string | null) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/service/search`, {
            params: {
                search: term
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche d'un service : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminServiceCreate(data: ServiceFormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/service/create`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'ajout d'un service : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminServiceDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/service/delete/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un service : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}