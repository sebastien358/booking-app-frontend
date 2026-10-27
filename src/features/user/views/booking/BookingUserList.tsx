'use client'

import styles from './BookingUserList.module.scss'

import {BookingsDataState, useAppointmentUserStore} from "@/store/user/appointmentUser.store";
import {useEffect} from "react";
import Link from "next/link";
import InputSearch from "@/components/input-search/InputSearch";

export default function BookingUserList() {

    const { bookingUserList, bookingUserLazyLoad, bookings, isLoading, hasMore } = useAppointmentUserStore()

    useEffect(() => {
        bookingUserList()
    }, [bookingUserList]);


    const displayDate = (date: Date) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    const bookingStartAt = (startAt: Date) => {
        if (!startAt) return ""
        const d = new Date(startAt)
        return Intl.DateTimeFormat('fr-FR', {
            hour: "numeric",
            minute: "numeric",
        }).format(d)
    }

    const bookingEndAt = (endAt: Date) => {
        if (!endAt) return ""
        const d = new Date(endAt)
        return Intl.DateTimeFormat('fr-FR', {
            hour: "numeric",
            minute: "numeric",
        }).format(d)
    }

    return (
        <>
            {isLoading ? (
                <div className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </div>
            ) : bookings.length === 0 ? (
                <div className={styles['empty-state']}>
                    <p>Aucun rendez-vous pour le moment.</p>
                </div>
            ) : (
                <div className={styles['page']}>
                    <div className={styles['booking-admin']}>
                        <div className={styles['container']}>
                            <div className={styles['grid-container']}>
                                {bookings?.map((booking: BookingsDataState) => (
                                    <Link
                                        key={booking.id}
                                        href={`/admin/bookings/${booking.id}`}
                                        className={styles['grid-item']}
                                    >
                                        <h3>{booking.lastname} {booking.firstname}</h3>
                                        <p>Email : {booking.email}</p>
                                        <p>Téléphone : {booking.phone}</p>
                                        <p>Date : {displayDate(booking.created_at)}</p>
                                        <p>Début : {bookingStartAt(booking.startAt)}</p>
                                        <p>Fin : {bookingEndAt(booking.endAt)}</p>
                                        <small className={styles['is-read']}>
                                            {booking.is_read ? '✅ vu' : '❌ non-vu'}
                                        </small>
                                    </Link>
                                ))}
                            </div>

                            {/* Lazy Load */}

                            {hasMore && (
                                <div className={styles['load-contact']}>
                                    <button
                                        onClick={() => bookingUserLazyLoad()}
                                        className={styles['btn-load']}
                                    >
                                        Charger plus
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}