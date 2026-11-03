import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminStaffList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/staff/list`, {
            params: {
                offset,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des salariés : ${response.status}`)
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminStaffDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/staff/show/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un salarié' : ${response.status}`)
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminStaffNew(formData: FormData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/staff/add`, formData)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'ajout d'un salarié' : ${response.status}`)
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminStaffDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/admin/staff/delete/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suppression d'un salarié' : ${response.status}`)
    } catch (err: any) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminStaffToggle(id: string) {
    try {
        const response = await axios.post(`${BASE_URL}/api/admin/staff/toggle/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'activation et de la désactivation d'un salarié ' : ${response.status}`)
    } catch (err: any) {
        console.error(err)
        throw err
    }
}