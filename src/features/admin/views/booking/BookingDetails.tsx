'use client'

import styles from './BookingDetails.module.scss'
import {BookingDataState} from "@/store/admin/bookingAdmin.store";
import {useRouter} from "next/navigation";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";
import {useState} from "react";

type BookingCurrentState = {
    id: string,
    isLoading: boolean,
    currentBooking: BookingDataState
    bookingDelete: (id: string) => Promise<void>
}

export default function BookingDetails({ id, currentBooking, bookingDelete, isLoading}: BookingCurrentState) {

    {/* Modal de suppression */}

    const [ activeModal, setActiveModal ] = useState<boolean>(false)

    const openModal = () => {
        setActiveModal(true)
    }

    const closeModal = () => {
        setActiveModal(false)
    }

    {/* Suppression d'un témoignage */}

    const router = useRouter()

    const onClickDelete = async () => {
        try {
            await bookingDelete(id)
            router.push('/admin/bookings')
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    {/* Affichage de la date */}

    const formatedDate = (date: string) => {
        if (!date) return ""
        const d = new Date(date)
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
            ) : currentBooking ? (
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
                                onClick={() => openModal()}
                                className={styles['btn-delete']}
                            >
                                Supprimer
                            </button>
                        </div>
                    </div>

                    <ModalConfirm
                        activeModal={activeModal}
                        closeModal={closeModal}
                        onClickDelete={onClickDelete}
                    />
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