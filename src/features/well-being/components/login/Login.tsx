'use client'

import { z } from "zod";
import {useState} from "react";
import styles from './Login.module.scss'
import Link from "next/link";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod"
import {useAuthStore} from "@/store/auth.store";
import {useRouter} from "next/navigation";
import {useBookingModalStore} from "@/store/bookingModal.store";
import BookingView from "@/features/well-being/components/booking/BookingView";

const schema = z.object({
    email: z
        .string().trim()
        .email({ message: 'Email invalide' }),
    password: z
        .string().trim()
        .min(1, { message: 'Mot de passe requis' })
        .min(6, { message: '6 caractères minimum' })
        .max(50, { message: '50 caractères maximum' })
})

export default function Login() {

    const { login, errorMessage, clearError, setShowLoginModal, showLoginModal } = useAuthStore()

    const { openModalBooking } = useBookingModalStore()

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    const {register, handleSubmit, reset, formState: { errors }} = useForm({
        resolver: zodResolver(schema)
    })

    const router = useRouter()

    type DataUser = {
        email: string,
        password: string
    }

    const onSubmit = async (data: DataUser) => {
        try {
            await login(data)
            displayLogin()
        } catch (err) {
            displayError()
        }
    }

    const displayLogin = () => {
        clearError()
        setSuccessMessage('Vous êtes connecté')
        setTimeout(() => {
            setSuccessMessage(null)
            reset()

            if (showLoginModal) {
                openModalBooking()
                setShowLoginModal(false)
            }

            router.push('/admin/bookings')
        }, 2000)
    }


    const displayError = () => {
        setSuccessMessage(null)
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    return (
        <section className={styles['login']}>
            <div className={styles['container']}>

                <div className={styles['login__form']}>
                    <h2 className={styles['login-title']}>Se connecter</h2>
                    <p className={styles['login-subtitle']}>Accéder à votre espace administrateur.</p>

                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles['form-group']}>
                            <input {...register('email')} type="email" placeholder="Email" />
                            {errors.email  && (<span className={styles['error-field']}>{errors.email?.message}</span>)}
                        </div>

                        <div className={styles['form-group']}>
                            <input {...register('password')} type="password" placeholder="Mot de passe" />
                            {errors.password  && (<span className={styles['error-field']}>{errors.password?.message}</span>)}
                        </div>

                        <div className={styles['reset-password']}>
                            <Link href="/forgot-password" className={styles['link-reset-password']}>
                                Mot de passe oublié?
                            </Link>
                        </div>

                        {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
                        {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

                        <div className={styles['login__actions']}>
                            <button type={"submit"} className={styles['btn-submit']}>
                                Envoyer
                            </button>
                        </div>

                        <div className={styles['register-link']}>
                            <span>Pas encore de compte ?</span>
                            <Link href="/register">S'inscrire</Link>
                        </div>
                    </form>
                </div>
            </div>
            {/* Modal de réservation */}
            <BookingView />
        </section>
    )
}