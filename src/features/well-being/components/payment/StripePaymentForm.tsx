'use client'

import styles from './StripePaymentForm.module.scss'

import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import {useBookingStore} from "@/store/booking.store";
import React, {useEffect, useRef, useState} from "react";
import axios, {isAxiosError} from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string
const KEY_STRIPE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string

export default function StripePaymentForm() {

    {/* BOOKING */}

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
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const apiError = err.response?.data
                displayError('La prise de rendez-vous a échoué')
            }
            throw err
        }
    }

    {/* PAYMENT STRIPE */}

    const stripeRef = useRef<Stripe | null>(null)
    const stripeElementsRef = useRef<StripeElements | null>(null)
    const stripeCardElementRef = useRef<StripeCardElement | null>(null)
    const cardElementRef = useRef<HTMLDivElement | null>(null)

    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const stripePayment = async () => {
        if (!KEY_STRIPE && !cardElementRef.current) return

        stripeRef.current = await loadStripe(`${KEY_STRIPE}`)

        stripeElementsRef.current = stripeRef.current!.elements()
        stripeCardElementRef.current = stripeElementsRef.current.create('card', {
            base: { styles: {'fontSize': '14px'}
            }
        })

        stripeCardElementRef.current.mount(cardElementRef.current!)
    }

    const buildPayload = (token: string) => {
        return {token, service_id: bookingDraft.bookingServiceId}
    }

    const confirmPayment = async () => {
        try {
            if (!stripeRef || !stripeCardElementRef) {
                displayError('Stripe n\'est pas configuré correctement')
                return
            }

            const {token, error} = await stripeRef.current!.createToken(stripeCardElementRef.current!)
            if (error || !token) {
                displayError('Stripe n\'est pas configuré correctement')
                return
            }

            const payload = buildPayload(token.id)

            await confirmBooking()
            console.log(payload)

            displaySuccess('Le paiment a réussi ✨')
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const apiError = err.response?.data
            }
            throw err
        }
    }

    const displaySuccess = (msg: string) => {
        setErrorMessage(null)
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
        }, 2000)
    }

    const displayError = (msg: string) => {
        setErrorMessage(msg)
        setTimeout(() => {
            setErrorMessage(null)
        }, 2000)
    }

    useEffect(() => {
        stripePayment()
    }, []);

    return (
        <section className={styles['booking-form']}>
            <div className={styles['booking-form__description']}>
                <p>Numéro de carte bancaire</p>
                <p>Carte Visa, Mastercard acceptées</p>
            </div>

            <form>
                <div className={styles['form-group']}>
                    <div className={styles['card-element-stripe']} ref={cardElementRef}></div>
                </div>
                {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
                <button
                    type={"button"}
                    onClick={() => confirmPayment()}
                    className={styles['btn-payment']}
                >
                    Payer
                </button>
            </form>
        </section>
    )
}