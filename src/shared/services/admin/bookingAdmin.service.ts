import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosBookingAdminList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/appointment/list`, {
            params: {
                offset,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des témoignages : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosBookingAdminSearch(term: string | null) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/appointment/search`, {
            params: {
                search: term
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la recherche des témoignages : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminBookingDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/appointment/show/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un témoignage : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminBookingDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/appointment/delete/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un témoignage : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}