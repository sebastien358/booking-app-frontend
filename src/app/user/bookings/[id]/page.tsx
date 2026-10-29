"use client"

import BookingUserDetails from "@/features/user/views/booking/BookingUserDetails";
import {useAppointmentUserStore} from "@/store/user/appointmentUser.store";
import {useParams} from "next/navigation";
import {useEffect} from "react";

export default function Page() {
    const {id} = useParams<{id: string}>()

    const { bookingUserDetails, bookingUserDelete, currentBooking, isLoading } = useAppointmentUserStore()

    useEffect(() => {
        if (id) {
            bookingUserDetails(id)
        }
    }, [id, bookingUserDetails]);

    return (
        <BookingUserDetails
            id={id}
            currentBooking={currentBooking}
            isLoading={isLoading}
            bookingUserDelete={bookingUserDelete}
        />
    )
}