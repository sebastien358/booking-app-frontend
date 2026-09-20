import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string

export const axiosBookingSlots = async (bookingCategoryId: number, bookingServiceId: number, bookingStaffId: number, bookingDate: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/api/appointment/slots`, {
            params: {
                categoryId: bookingCategoryId,
                serviceId: bookingServiceId,
                staffId: bookingStaffId,
                date: bookingDate
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

export const axiosCreateBooking = async (dataBooking: any) => {
    try {
        const response = await axios.post(`${BASE_URL}/api/appointment/create`, dataBooking)
        if (response.status >= 200 && response.status < 300) {
            return response.data
        }
        throw new Error(`Erreur de la création d'un rendez-vous : ${response.status}`)
    } catch (err) {
        console.error(err)
        throw err
    }
}
