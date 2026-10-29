import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosBookingUserList(offset: number, limit: number) {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/bookings/list`, {
            params: {
                offset,
                limit
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des rendez-vous : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosBookingUserDetails(id: string) {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/bookings/details/${id}`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération d'un' rendez-vous : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}

export async function axiosBookingUserDelete(id: string) {
    try {
        const response = await axios.delete(`${BASE_URL}/api/user/bookings/delete/${id}`)
        if (response.status === 200 || response.status === 204) {
            return response.data
        }
        throw new Error(`Erreur de la suprpression d'un rendez-vous : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}