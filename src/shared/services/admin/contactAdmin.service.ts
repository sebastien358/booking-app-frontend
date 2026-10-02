import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosAdminContactList() {
    try {
        const response = await axios.get(`${BASE_URL}/api/admin/contact/list`)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération de la liste des contacts : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}