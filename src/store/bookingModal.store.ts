import {create} from "zustand";
import {persist} from "zustand/middleware";

interface BookingModalState {
    bookingBoolean: boolean

    openModalBooking: () => void
    closeModalBooking: () => void
}

export const useBookingModalStore = create<BookingModalState>()(
    persist((set, get) => ({
            bookingBoolean: true,

        openModalBooking: () => {
            set({ bookingBoolean: true })
        },

        closeModalBooking: () => {
            set({ bookingBoolean: false })
        }

    }),
        {name: 'booking-modal-state'}
    )
)