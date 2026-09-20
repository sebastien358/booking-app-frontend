'use client'

import styles from './StripePaymentForm.module.scss'
import type { Stripe, StripeElements, StripeCardElement } from '@stripe/stripe-js';
import { loadStripe } from '@stripe/stripe-js'
import {useBookingStore} from "@/store/booking.store";
import React, {useEffect, useRef, useState} from "react";
import axios, {isAxiosError} from "axios";

const KEY_STRIPE = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string

export default function StripePaymentForm() {

    {/* BOOKING */}

    const { bookingDraft, createBooking, errorBooking } = useBookingStore()

    const date = new Date(bookingDraft.bookingDatetime as string)

    const confirmBooking = async (paymentIntentId: string) => {
        try {
            const dataBooking = {
                datetime: date.toISOString(),
                category_id: bookingDraft.bookingCategoryId,
                service_id: bookingDraft.bookingServiceId,
                staff_id: bookingDraft.bookingStaffId
            }
            await createBooking(dataBooking, paymentIntentId)
        } catch (err: unknown) {
            console.error(err)
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
            base: {
                styles: {
                    'fontSize': '14px'
                }
            }
        })

        stripeCardElementRef.current.mount(cardElementRef.current!)
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

            const { data } = await axios.post<PaymentStatus>(`http://127.0.0.1:8000/api/user/payment`, payload)
            await handleStatusPayment(data)
        } catch (err: unknown) {
            if (isAxiosError(err)) {
                const apiError = err?.response?.data
                await handleStatusPayment(apiError)
            }
        }
    }

    const buildPayload = (token: string) => {
        return {token, service_id: bookingDraft.bookingServiceId}
    }

    type PaymentStatus =
        | { type: 'SUCCESS_PAYMENT'; message: string; payment_intent_id: string }
        | { type: 'ALREADY_PROCESSED'; message: string }
        | { type: 'ERROR_PAYMENT'; message: string }
        | { type: 'REQUIRES_ACTION'; clientSecret: string; message?: string }
        | { type: 'PRICE_MISMATCH'; message: string };

    const handleStatusPayment = async (apiError: PaymentStatus) => {
        switch (apiError.type) {
            case 'SUCCESS_PAYMENT':
                displaySuccess(apiError.message)

                setTimeout(async () => {
                    await confirmBooking(apiError.payment_intent_id)
                }, 1000)
                break

            case 'PRICE_MISMATCH':
            case 'ALREADY_PROCESSED':
            case 'ERROR_PAYMENT':

                displayError(apiError.message)
                break

            case 'REQUIRES_ACTION': {
                if (!stripeRef.current) {
                    displayError('Stripe pas chargé')
                    break
                }
                const { error, paymentIntent } = await stripeRef.current.confirmCardPayment(apiError.clientSecret)

                if (error) {
                    displayError(error.message ?? '3DS échouée')
                } else if (paymentIntent?.status === 'succeeded') {
                    displaySuccess('Paiement validé')

                    setTimeout(async () => {
                        await confirmBooking(paymentIntent.id)
                    }, 1000)
                } else {
                    displayError('Paiement en attente')
                }

                break
            }

            default:
                displayError('Réponse serveur inconnue')
                break
        }
    }

    const [DELAY_TIMEOUT] = useState<number>(2000)

    const displaySuccess = (msg: string) => {
        setErrorMessage(null)
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
        }, DELAY_TIMEOUT)
    }

    const displayError = (msg: string) => {
        setErrorMessage(msg)
        setTimeout(() => {
            setErrorMessage(null)
        }, DELAY_TIMEOUT)
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

                {/* Erreur Stripe / carte */}
                {errorMessage && (
                    <p className={styles['error-message']}>{errorMessage}</p>
                )}

                {/* Erreur Réservation / créneau */}
                {errorBooking && (
                    <p className={styles['error-message']}>{errorBooking}</p>
                )}

                {/* Success Message */}
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