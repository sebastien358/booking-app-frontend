import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosServicesList() {
    try {
        const response = await axios.get(`${BASE_URL}/api/service/list`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des services : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}