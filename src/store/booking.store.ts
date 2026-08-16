import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {axiosBookingSlots} from "@/shared/services/booking.service";
//import { axiosBookingSlots, axiosCreateBooking } from '../shared/services/booking.service.ts'

export interface BookingDraft {
    bookingCategoryId: number | null // <- renommé
    bookingServiceId: number | null
    bookingStaffId: number | null
    bookingDate: string | null
    bookingDatetime: string | null
}

export interface Slot {
    start: string
    end: string
    label: string
}

interface BookingState {
    bookingDraft: BookingDraft
    slots: Slot[]
    success: boolean
    error: string | null
    loadingSlots: boolean

    setBookingDraft: (payload: Partial<BookingDraft>) => void
    resetBookingDraft: () => void
    axiosSlots: () => Promise<void>
    createBooking: (dataBooking: any) => Promise<any>
    isStep1Complete: () => boolean
    isStep2Complete: () => boolean
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
            // state
            bookingDraft: {
                bookingCategoryId: null,
                bookingServiceId: null,
                bookingStaffId: null,
                bookingDate: null,
                bookingDatetime: null,
            },
            slots: [],
            success: false,
            error: null,
            loadingSlots: false,

            // actions
            setBookingDraft: (payload) =>
                set((state) => ({ bookingDraft: { ...state.bookingDraft, ...payload } })),

            resetBookingDraft: () =>
                set({
                    bookingDraft: {
                        bookingCategoryId: null,
                        bookingServiceId: null,
                        bookingStaffId: null,
                        bookingDate: null,
                        bookingDatetime: null,
                    },
                    slots: [],
                    success: false
                }),

            axiosSlots: async () => {
                const { bookingCategoryId, bookingServiceId, bookingStaffId, bookingDate } = get().bookingDraft
                if (!bookingCategoryId || !bookingServiceId || !bookingStaffId || !bookingDate) {
                    set({ slots: [] })
                    return
                }

                set({ loadingSlots: true })
                try {
                    const slots = await axiosBookingSlots(bookingCategoryId, bookingServiceId, bookingStaffId, bookingDate)
                    set({ slots, loadingSlots: false })
                } catch(e) {
                    console.error(e)
                    set({ loadingSlots: false })
                }
            },

            createBooking: async (dataBooking) => {
                try {
                    const res = await axiosCreateBooking(dataBooking)
                    set({ success: true, error: null })
                    return res
                } catch (e: any) {
                    set({ error: e?.message || 'Erreur réservation', success: false })
                    throw e
                }
            },

            // getters
            isStep1Complete: () => {
                const { bookingCategoryId, bookingServiceId, bookingStaffId } = get().bookingDraft
                return !!(bookingCategoryId && bookingServiceId && bookingStaffId)
            },
            isStep2Complete: () => {
                const { bookingDate } = get().bookingDraft
                return !!bookingDate
            },
        }),
        {
            name: 'booking-storage',
            partialize: (state) => ({ bookingDraft: state.bookingDraft, slots: state.slots }),
        }
    )
)