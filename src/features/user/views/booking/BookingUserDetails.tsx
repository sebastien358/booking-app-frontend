"use client"

import styles from './BookingUserDetails.module.scss'
import {BookingsDataState} from "@/store/user/appointmentUser.store";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {useState} from "react";
import {useRouter} from "next/navigation";

type BookingUserDetailsProps = {
    id: string
    currentBooking: BookingsDataState | null
    isLoading: boolean
    bookingUserDelete: (id: string) => Promise<void>
}

export default function BookingUserDetails({ id, currentBooking, isLoading, bookingUserDelete }: BookingUserDetailsProps) {

    {/* Date du rendez vous */}

    const formattedDate = (date: Date) => {
        if (!date) return ""
        const d = new Date(date)
        return Intl.DateTimeFormat('fr-FR', {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
        }).format(d)
    }

    {/* Modal de confirmation de suppression */}

    const [activeModal, setActiveModal] = useState<boolean | null>(null)

    const closeModal = () => {
        setActiveModal(false)
    }

    {/* Delete Account */}

    const router = useRouter()

    const onClickDelete = async() => {
        try {
            await bookingUserDelete(id)
            router.push('/user/bookings')
        } catch (err: any) {
            console.error(err)
            throw err
        }
    }

    return (
        <main>
            {isLoading ? (
                <section className={styles['loading-indicator']}>
                    <p>Chargement...</p>
                </section>
            ) : !isLoading && currentBooking && (
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
                            <h3 className={styles['date-title']}>📅 : {formattedDate(currentBooking.startAt)}</h3>
                            <p>👤 : {currentBooking.firstname} {currentBooking.lastname}</p>
                            <p>📞 : {currentBooking.phone}</p>
                            <p>🫂 : {currentBooking.service.name} - {currentBooking.service.duration}min</p>
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
                                onClick={() => setActiveModal(true)}
                                type="button"
                                className={styles['btn-delete']}
                            >
                                Annuler le rdv
                            </button>
                        </div>
                    </div>

                <ModalConfirm
                    activeModal={activeModal}
                    closeModal={closeModal}
                    onClickDelete={onClickDelete}
                    dropdownBookingUser
                />
            </section>
            )}
        </main>
    )
}