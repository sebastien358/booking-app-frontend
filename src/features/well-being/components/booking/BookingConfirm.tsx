'use client'

import styles from './BookingConfirm.module.scss'
import {useBookingModalStore} from "@/store/bookingModal.store";
import {useEffect} from "react";

interface BookingConfirmState {
    selectedDay: string
    slotLabel: string
}

export default function BookingConfirm({ selectedDay, slotLabel }: BookingConfirmState) {

    const { closeModalBooking } = useBookingModalStore()

    useEffect(() => {
        setTimeout(() => {
            closeModalBooking()
        }, 3000)
    }, [closeModalBooking])

    return (
        <main className={styles['container-confirmation']}>
            <div className={styles['booking']}>
                <div className={styles['booking__date']}>
                    <p className={styles['date']}>📅 {selectedDay} - {slotLabel}</p>
                </div>

                <div className={styles['booking__text']}>
                    <p className={styles['booking__text--main']}>
                        Votre rendez-vous est bien enregistré.
                    </p>
                    <p className={styles['booking__text--secondary']}>
                        Vous recevrez prochainement une confirmation par email.
                    </p>
                    <p className={styles['booking__text--hint']}>
                        Le cabinet vous contactera si des informations complémentaires sont nécessaires.
                    </p>
                </div>
            </div>
        </main>
    )
}