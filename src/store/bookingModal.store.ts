import {create} from "zustand";
import {persist} from "zustand/middleware";
import {useBookingStore} from "@/store/booking.store";

interface BookingModalState {
    bookingBoolean: boolean

    openModalBooking: () => void
    closeModalBooking: () => void
}

export const useBookingModalStore = create<BookingModalState>()((set) => ({
    bookingBoolean: false,

    openModalBooking: () => set({ bookingBoolean: true }),

    closeModalBooking: () => {
        useBookingStore.getState().resetBookingDraft()
        set({ bookingBoolean: false })
    }
}))