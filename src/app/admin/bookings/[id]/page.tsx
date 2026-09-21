'use client'

import BookingDetails from "@/features/admin/views/booking/BookingDetails";
import {useParams} from "next/navigation";
import {useEffect} from "react";
import {useBookingAdminStore} from "@/store/admin/bookingAdmin.store";

export default function Page() {
    const {id} = useParams<{id: string}>()

    const { bookingDetails, currentBooking, isLoading } = useBookingAdminStore()

    useEffect(() => {
        if (id) {
            bookingDetails(id)
        }
    }, [id]);

    return (
        <BookingDetails id={id} currentBooking={currentBooking} isLoading={isLoading} />
    )
}