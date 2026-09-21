import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosAdminBookingDetails, axiosBookingAdminList} from "@/shared/services/admin/bookings/bookingAdmin.service";

export interface BookingService {
    id: number
    name: string
    price: number
    duration: number
}

export interface BookingStaff {
    id: number
    firstname: string
    lastname: string
}

export interface BookingDataState {
    id: number
    firstname: string
    lastname: string
    email: string
    phone: string
    is_read: boolean
    created_at: string
    service: BookingService
    staff: BookingStaff
}

export interface BookingState {
    bookings: BookingDataState[]
    currentBooking: BookingDataState | null
    isLoading: boolean

    bookingList: () => void
    bookingDetails: (id: string) => void
}

export const useBookingAdminStore = create<BookingState>()(
    persist((set, get) => ({
        bookings: [],
        currentBooking: null,
        isLoading: false,

        bookingList: async () => {
            try {
                set({ bookings: [], isLoading: true })
                const data = await axiosBookingAdminList()
                set({ bookings: data, isLoading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        bookingDetails: async (id: string) => {
            try {
                set({ currentBooking: null, isLoading: true })
                const data = await axiosAdminBookingDetails(id)
                set({ currentBooking: data, isLoading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        }
    }), {
        name: 'booking-admin-storage'
    })
)