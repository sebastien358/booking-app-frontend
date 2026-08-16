import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export const axiosBookingSlots = async (categoryId: number, serviceId: number, staffId: number, date: string) => {
    const response = await axios.get(`${BASE_URL}/api/appointment/slots`, {
        params: {
            categoryId,
            serviceId,
            staffId,
            date,
        }
    })

    return response.data
}