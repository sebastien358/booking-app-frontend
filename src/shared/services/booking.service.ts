import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export const axiosBookingSlots = async (categoryId: number, serviceId: number, staffId: number, date: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/appointment/slots`, {
            params: {
                categoryId,
                serviceId,
                staffId,
                date,
            }
        })
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la récupération des créneaux horraires : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}
