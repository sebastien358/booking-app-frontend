import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import {axiosBookingSlots} from "@/shared/services/booking.service";
//import { axiosBookingSlots, axiosCreateBooking } from '../shared/services/booking.service.ts'

export interface BookingDraft {
    bookingCategoryId: number | null
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
    categoryName: string | null
    serviceName: string | null
    staffName: string | null
    serviceDuration: number | null,
    selectedDay: string | null,
    slotLabel: string | null,
    progressStep: number

    setBookingDraft: (payload: Partial<BookingDraft>) => void
    resetBookingDraft: () => void

    setCategoryName: (categoryName: string) => string
    setServiceName: (serviceName: string) => string
    setStaffName: (staffName: string) => string
    setServiceDuration: (serviceDuration: number) => number
    setSelectedDay: (selectedDay: string) => string
    setSlotLabel: (slotLabel: string) => string

    axiosSlots: () => Promise<void>
    createBooking: (dataBooking: any) => Promise<any>
    setProgressStep: (progressStep: number) => number
    informationCompletedOne: () => boolean
    informationCompletedTwo: () => boolean
    isStep2Complete: () => boolean
}

export const useBookingStore = create<BookingState>()(
    persist(
        (set, get) => ({
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
            categoryName: null,
            serviceName: null,
            staffName: null,
            serviceDuration: null,
            selectedDay: null,
            slotLabel: null,
            progressStep: 1,

            // actions
            setBookingDraft: (payload) => {
                set((state) => ({ bookingDraft: { ...state.bookingDraft, ...payload } }))
                console.log(get().bookingDraft)
            },
            resetBookingDraft: () => {
                set({
                    bookingDraft: {
                        bookingCategoryId: null,
                        bookingServiceId: null,
                        bookingStaffId: null,
                        bookingDate: null,
                        bookingDatetime: null,
                    },
                    slots: [],
                    success: false,
                    categoryName: null,
                    serviceName: null,
                    staffName: null,
                    serviceDuration: null,
                    selectedDay: null,
                    slotLabel: null,
                    progressStep: 1,
                })


                console.log(get().bookingDraft)
            },

            setCategoryName: (categoryName: string) => set({ categoryName }),

            setServiceName: (serviceName: string) => set({ serviceName }),

            setStaffName: (staffName: string) => set({ staffName }),

            setServiceDuration: (serviceDuration: number) => set({ serviceDuration }),

            setSelectedDay: (selectedDay: string) => set({ selectedDay }),

            setSlotLabel: (slotLabel: string) => set({ slotLabel }),

            axiosSlots: async () => {
                const { bookingCategoryId, bookingServiceId, bookingStaffId, bookingDate } = get().bookingDraft
                if (!bookingCategoryId || !bookingServiceId || !bookingStaffId || !bookingDate) {
                    set({ slots: [] })
                    return
                }

                set({ loadingSlots: true })
                try {
                    const slots = await axiosBookingSlots(bookingCategoryId, bookingServiceId, bookingStaffId, bookingDate)
                    setTimeout(() => {
                        set({ slots, loadingSlots: false })
                    }, 300)
                } catch(e) {
                    console.error(e)
                    set({ loadingSlots: false })
                }
            },

            createBooking: async (dataBooking) => {
                try {
                    console.log(dataBooking)

                    //const res = await axiosCreateBooking(dataBooking)
                    //set({ success: true, error: null })
                    //return res
                } catch (e: any) {
                    set({ error: e?.message || 'Erreur réservation', success: false })
                    throw e
                }
            },

            setProgressStep: (progressStep: number) => set({ progressStep }),

            // getters
            informationCompletedOne: () => {
                const { bookingCategoryId, bookingServiceId, bookingStaffId } = get().bookingDraft
                return !!(bookingCategoryId && bookingServiceId && bookingStaffId)
            },
            informationCompletedTwo: () => {
                const { bookingCategoryId, bookingServiceId, bookingStaffId, bookingDatetime } = get().bookingDraft
                const { slotLabel } = get()
                return !!(bookingCategoryId && bookingServiceId && bookingStaffId && bookingDatetime && slotLabel)
            },
        }),
        {
            name: 'booking-storage'
        }
    )
)