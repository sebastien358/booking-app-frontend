'use client'

import styles from './RequestPassword.module.scss'
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import { z } from 'zod'
import {useState} from "react";
import {useAuthStore} from "@/store/auth.store";
const DELAY_TIMEOUT = 2000

const schema = z.object({
    email: z
        .string()
        .trim()
        .min(1, { message: "Veuillez renseigner une adresse email" })
        .email({ message: "Format d'email invalide" })
        .toLowerCase(),
})


export default function RequestPassword() {

    const { requestPassword, clearError, errorMessage } = useAuthStore()

    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(schema)
    })

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const onSubmit = async (data: string) => {
        try {
            await requestPassword(data)
            handleSuccess('Un email de réinitialisation vous a été envoyé')
        } catch (err) {
            handleError()
            throw err
        }
    }

    const handleSuccess = (msg: string) => {
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
            reset()
        }, DELAY_TIMEOUT)
    }

    const handleError = () => {
        setTimeout(() => {
            clearError()
        }, DELAY_TIMEOUT)
    }

    return (
        <main className={`${styles['request-password-grid']} ${styles['container']}`}>
            <div className={styles['request-password-form']}>
                <h1 className={styles['request-password-title']}>Réinitialiser votre mot de passe</h1>
                <p className={styles['request-password-subtitle']}>Renseignez votre email pour recevoir le lien de réinitialisation.</p>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles['form-group']}>
                        <input {...register('email')} type="email" placeholder="Email"/>
                        {errors.email && <span className={styles['error-field']}>{errors.email.message}</span>}
                    </div>
                    {successMessage && <p className={styles['success-message']}>{successMessage}</p>}
                    {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}
                    <div className={styles['btn-wrapper']}>
                        <button className={styles['btn-submit']}>
                            <span>{isSubmitting ? 'Chargement...' : 'Envoyer'}</span>
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}