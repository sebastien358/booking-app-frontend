import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminBookingDelete,
    axiosAdminBookingDetails,
    axiosBookingAdminList, axiosBookingAdminSearch
} from "@/shared/services/admin/bookingAdmin.service";

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
    term: string | null
    offset: number
    limit: number
    hasMore: boolean
    countBookings: number | null

    bookingList: () => void
    bookingLazyLoad: () => void
    bookingSearch: (term: string | null) => void
    bookingDetails: (id: string) => void
    bookingDelete: (id: string) => void
    resetBooking: () => void
}

export const useBookingAdminStore = create<BookingState>()(
    persist((set, get) => ({
        bookings: [],
        currentBooking: null,
        isLoading: false,
        term: null,
        offset: 0,
        limit: 2,
        hasMore: true,
        countBookings: null,

        bookingList: async () => {
            try {
                set({ bookings: [], isLoading: true, offset: 0, hasMore: true })
                const data = await axiosBookingAdminList(get().offset, get().limit)
                set({
                    bookings: data.appointments,
                    isLoading: false,
                    countBookings: data.count,
                    hasMore: data.appointments.length >= get().limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        bookingLazyLoad: async () => {
            try {
                const { bookings, offset, limit, hasMore, isLoading } = get()
                if (!hasMore || isLoading) return

                set({ offset: offset + limit, isLoading: true })
                const data = await axiosBookingAdminList(get().offset, get().limit)

                const newBookings = data.appointments ?? []
                if (newBookings.length === 0) {
                    set({ hasMore: false, isLoading: false })
                }

                set({
                    bookings: [ ...bookings, ...newBookings ],
                    isLoading: false,
                    hasMore: data.appointments.length >= limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        bookingSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim() || null
            if (!trimmed) {
                set({ term: null, offset: 0 })
                get().bookingList()
                return
            }
            try {
                set({ term: trimmed, isLoading: true, offset: 0 })

                const data = await axiosBookingAdminSearch(get().term)
                const results = (data as any) ?? data ?? []

                set({
                    bookings: data,
                    isLoading: false,
                    hasMore: false,
                    countBookings: results.length
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
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
        },

        bookingDelete: async (id: string) => {
            const { bookings } = get()
            set({ bookings: bookings.filter((b) => b.id !== id) })
            try {
                await axiosAdminBookingDelete(id)
                set({ currentBooking: null })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        resetBooking: () => {
            try {
                set({ term: null, offset: 0, hasMore: true })
                get().bookingList()
            } catch(err) {
                console.error(err)
                throw err
            }
        }

    }), {
        name: 'booking-admin-storage',
        partialize: (state) => ({
            bookings: state.bookings,
            offset: state.offset,
            term: state.term,
            countBookings: state.countBookings
        })
    })
)