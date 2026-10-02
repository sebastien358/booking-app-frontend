import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminContactList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/list`, {
            params: {
                offset,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération de la liste des contacts : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminContactDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/show/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un contact : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminContactSearch(term: string | null) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/search`, {
            params: {
                search: term
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recehrche d'un contact : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminContactDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/contact/delete/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un contact : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}