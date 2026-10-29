import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosBookingUserDelete,
    axiosBookingUserDetails,
    axiosBookingUserList,
} from "@/shared/services/user/appointmentUser.service";

export interface BookingStaffData {
    firstname: string
    lastname: string
}

export interface BookingServiceData {
    name: string
    duration: number
    price: number
}

export interface BookingsDataState {
    id: number
    firstname: string
    lastname: string
    email: string
    phone: string
    is_read: boolean
    startAt: string
    endAt: string
    created_at: string
    service: BookingServiceData
    staff: BookingStaffData
}

export interface AppointmentUserState {
    bookings: BookingsDataState[]
    currentBooking: BookingsDataState | null
    isLoading: boolean
    offset: number
    limit: number
    countAppointments: number,
    hasMore: boolean

    bookingUserList: () => Promise<void>
    bookingUserDetails: (id: string) => Promise<void>
    bookingUserLazyLoad: () => Promise<void>
    bookingUserDelete: (id: string) => Promise<void>
    resetBookingUser: () => void
}

export const useAppointmentUserStore = create<AppointmentUserState>()(
    persist((set, get) => ({
        bookings: [],
        currentBooking: null,
        isLoading: false,
        offset: 0,
        limit: 2,
        countAppointments: 0,
        hasMore: true,

        bookingUserList: async () => {
            try {
                set({ bookings: [], isLoading: true, offset: 0, hasMore: true })
                const data = await axiosBookingUserList(get().offset, get().limit)
                set({
                    bookings: data.appointments,
                    isLoading: false,
                    countAppointments: data.count,
                    hasMore: data.appointments.length >= get().limit
                })
            } catch (err){
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        bookingUserDetails: async (id: string) => {
            try {
                set({ currentBooking: null, isLoading: true })
                const data = await axiosBookingUserDetails(id)
                set({ currentBooking: data, isLoading: false })
            } catch (err){
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        bookingUserLazyLoad: async () => {
            try {
               const { bookings, isLoading, offset, limit, hasMore } = get()
                if (!hasMore || isLoading) return

                set({ offset: offset + limit, isLoading: true })
                const data = await axiosBookingUserList(get().offset, get().limit)

                const newBookings = data.appointments ?? []
                if (newBookings.length === 0) {
                    set({ hasMore: false, isLoading: false })
                }

                set({
                    bookings: [...bookings, ...newBookings],
                    isLoading: false,
                    hasMore: data.appointments.length >= limit
                })
            } catch (err){
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        bookingUserDelete: async (id: string) => {
            try {
                await axiosBookingUserDelete(id)
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        resetBookingUser() {
            set({ offset: 0, hasMore: true })
        }

    }), {
        name: 'appointment-user-state',
        partialize: (state) => ({
            bookings: state.bookings,
            offset: state.offset,
            count: state.countAppointments,
        })
    })
)