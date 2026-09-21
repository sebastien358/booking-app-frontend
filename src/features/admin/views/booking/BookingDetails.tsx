'use client'

import styles from './BookingDetails.module.scss'
import {BookingDataState} from "@/store/admin/bookingAdmin.store";

export default function BookingDetails({ id, isLoading, currentBooking }: {id: string, isLoading: boolean, currentBooking: BookingDataState}) {

    const formatedDate = (date: string) => {
        if (!date) return ""
        const d = new Date()
        return Intl.DateTimeFormat('fr-FR').format(d)
    }

    return (
        <>
            {isLoading ? (
                <section className={styles['booking-container']}>
                    <section className={styles['loading-indicator']}>
                        <p>Chargement...</p>
                    </section>
                </section>
            ) : currentBooking !== null ? (
                <section className={styles['booking-container']}>
                    <div className={styles['booking-details']}>
                        <h2>Rendez-vous - {currentBooking.staff.firstname} {currentBooking.staff.lastname}</h2>

                        <div className={styles['meta']}>
                            <div className={styles['booking-email']}>
                                <p>{currentBooking.email}</p>
                                <span className={`${styles['status']} ${!currentBooking.is_read ? styles['unread'] : ''}`}>
                                    {currentBooking.is_read ? "✅ vu" : "❌ non-vu"}
                                </span>
                            </div>
                        </div>

                        <div className={styles['message-body']}>
                            <h3 className={styles['date-title']}>📅 : {formatedDate(currentBooking.created_at)}</h3>
                            <p>👤 : {currentBooking.firstname} {currentBooking.lastname}</p>
                            <p>📞 : {currentBooking.phone}</p>
                            <p>✂ : {currentBooking.service.name} - {currentBooking.service.duration}min</p>
                            <p>⏱ : {currentBooking.service.duration}min</p>
                            <p>💶 : {currentBooking.service.price}€</p>
                        </div>

                        <div className={styles['actions']}>
                            <a
                                href={`https://mail.google.com/mail/?view=cm&to=${currentBooking.email}`}
                                target="_blank"
                                rel="noopener"
                                className={styles['btn-reply']}
                            >
                                Répondre
                            </a>
                            <button
                                className={styles['btn-delete']}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>


                </section>
            ) : (
                <section className={styles['booking-container']}>
                    <section className={styles['empty-state']}>
                        <p>Aucun rendez-vous pour le moment</p>
                    </section>
                </section>
            )}
        </>
    )
}