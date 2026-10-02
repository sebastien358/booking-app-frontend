import axios from "axios";
import {ContactData} from "@/store/contact.store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosContactNew(data: ContactData) {
    try {
        const response = await axios.post(`${BASE_URL}/api/contact/new`, data)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de l'ajout d'un contact : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}