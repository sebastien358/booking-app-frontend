'use client'

import styles from './BookingList.module.scss'
import {BookingDataState, useBookingAdminStore} from "@/store/admin/bookingAdmin.store";
import {useEffect} from "react";
import Link from "next/link";
import InputSearch from "@/components/input-search/InputSearch";

export default function BookingList() {

    const { bookingList, bookingLazyLoad, bookingSearch, bookings, isLoading, term, hasMore } = useBookingAdminStore()

    useEffect(() => {
        bookingList()
    }, []);

    const displayDate = (date: string) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && !isLoading) {
                bookingLazyLoad()
            }
        })
        return () => observer.disconnect()
    }, [isLoading])

    return (
        <>
            {isLoading ? (
                <div className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </div>
            ) : bookings.length === 0 ? (
                <>
                    <InputSearch
                        term={term}
                        search={bookingSearch}
                        placeholder='Rechercher un rendez-vous...'
                        activeSearch='booking-admin'
                    />

                    <div className={styles['empty-state']}>
                        <p>Aucun rendez-vous pour le moment</p>
                    </div>
                </>

            ) : (
                <div className={styles['page']}>

                    {/* Input Search */}

                    <InputSearch
                        term={term}
                        search={bookingSearch}
                        placeholder='Rechercher un rendez-vous...'
                        activeSearch='booking-admin'
                    />

                    <div className={styles['booking-admin']}>
                        <div className={styles['container']}>
                            <div className={styles['grid-container']}>
                                {bookings.map((booking: BookingDataState) => (
                                    <Link
                                        key={booking.id}
                                        href={`/admin/bookings/${booking.id}`}
                                        className={styles['grid-item']}
                                    >
                                        <h3>{booking.lastname} {booking.firstname}</h3>
                                        <p>Email : {booking.email}</p>
                                        <p>Téléphone : {booking.phone}</p>
                                        <p>Date : {displayDate(booking.created_at)}</p>
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
                                        onClick={() => bookingLazyLoad()}
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