import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export async function axiosBookingListAdmin() {
    try {
        const response = await axios.get(`${BASE_URL}/api/`)
    } catch (err) {
        console.error(err)
        throw err
    }
}