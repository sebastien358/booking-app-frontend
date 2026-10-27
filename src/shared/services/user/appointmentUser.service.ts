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

export async function axiosBookingUserSearch(search: string | null) {
    try {
        const response = await axios.get(`${BASE_URL}/api/user/bookings/search`, {
            params: {
                search
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des rendez-vous (search) : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}