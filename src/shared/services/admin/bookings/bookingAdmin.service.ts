import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosBookingAdminList() {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/appointment/list`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des témoignages : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosAdminBookingDetails(id: number) {
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