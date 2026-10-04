'use client'

import styles from './ResetPassword.module.scss'

import {useAuthStore} from "@/store/auth.store";
import {useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from 'zod'

const DELAY_TIMEOUT = 2000

const schema = z.object({
    password: z
        .string()
        .trim()
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .max(50, { message: 'Le mot de passe ne doit pas dépasser 50 caractères' }),
    confirmPassword: z
        .string()
        .trim()
        .min(1, {message: 'Veuillez confirmer le mot de passe'})
}).refine((value) => value.password === value.confirmPassword, {
    message: 'Les mots de passes ne correspondent pas',
    path: ['confirmPassword']
})

export default function ResetPassword({ token }: { token: string }) {

    const { resetPassword, errorMessage, clearError } = useAuthStore()

    const {register, handleSubmit, reset, formState: { isSubmitting, errors }} = useForm({
        resolver: zodResolver(schema)
    })

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const onSubmit = async (data: any) => {
        try {
            await resetPassword(data, token)
            handleSuccess('Le mot de passe a été modifié')
        } catch (err: any) {
            handleError()
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
        <section className={styles['reset-password'] + ' ' + styles['container']}>
            <div className={styles['reset-password__form']}>
                <h2 className={styles['reset-title']}>
                    Modification du mot de passe
                </h2>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles['form-group']}>
                        <input {...register('password')} type="password" placeholder="Mot de passe" />
                        {errors.password && <span className={styles['error-field']}>
                            {errors.password.message}
                        </span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('confirmPassword')} type="password" placeholder="Confirmation de mot de passe"/>
                        {errors.confirmPassword && <span className={styles['error-field']}>
                            {errors.confirmPassword.message}
                        </span>}
                    </div>

                    {successMessage && <p className={styles['success-message']}>
                        {successMessage}
                    </p>}

                    {errorMessage && <p className={styles['error-message']}>
                        {errorMessage}
                    </p>}

                    <div className={styles['form__actions']}>
                        <button className={styles['btn-submit']} disabled={isSubmitting}>
                            {isSubmitting ? 'Chargement...' : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    )
}