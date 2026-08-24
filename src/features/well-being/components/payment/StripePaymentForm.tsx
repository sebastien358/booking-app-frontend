'use client'

import styles from './StripePaymentForm.module.scss'
import {useBookingStore} from "@/store/booking.store";

export default function StripePaymentForm() {

    const { bookingDraft, createBooking } = useBookingStore()

    const date = new Date(bookingDraft.bookingDatetime as string)

    const confirmBooking = async () => {
        try {
            const dataBooking = {
                datetime: date.toISOString(),
                category_id: bookingDraft.bookingCategoryId,
                service_id: bookingDraft.bookingServiceId,
                staff_id: bookingDraft.bookingStaffId
            }

            await createBooking(dataBooking)
        } catch (err) {
            console.error(err)
            throw err
        }
    }

    return (
        <section className={styles['booking-form']}>
            <div className={styles['booking-form__description']}>
                <p>Numéro de carte bancaire</p>
                <p>Carte Visa, Mastercard acceptées</p>
            </div>

            <form>
                <div className={styles['form-group']}>
                    <input type={"text"} />
                </div>

                <button onClick={() => confirmBooking()} type={"button"} className={styles['btn-payment']}>Payer</button>
            </form>
        </section>
    )
}