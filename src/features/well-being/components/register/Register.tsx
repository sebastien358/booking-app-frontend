'use client'

import { useForm } from "react-hook-form";
import styles from './Register.module.scss';
import {zodResolver} from "@hookform/resolvers/zod";
import { z } from 'zod'
import {useAuthStore} from "@/store/auth.store";
import {useState} from "react";
import BookingView from "@/features/well-being/components/booking/BookingView";
import {useRouter} from "next/navigation";

const schema = z.object({
    firstname: z
        .string()
        .trim()
        .min(1, { message: 'Veuillez renseigner votre prénom.' })
        .min(3, { message: "Le prénom doit contenir au moins 3 caractères." })
        .max(180, { message: "Le prénom ne peut pas dépasser 180 caractères." }),
    lastname: z
        .string()
        .trim()
        .min(1, { message: 'Veuillez renseigner votre nom.' })
        .min(3, { message: "Le nom doit contenir au moins 3 caractères." })
        .max(180, { message: "Le nom ne peut pas dépasser 180 caractères." }),
    phoneNumber: z
        .string()
        .trim()
        .regex(/^(\+33|0)[1-9]\d{8}$/, {message: "Merci de saisir un numéro de téléphone valide."}),
    email: z
        .string()
        .trim()
        .email({ message: "Veuillez renseigner une adresse email valide." })
        .max(180, { message: "Email trop long." }),
    password: z
        .string()
        .trim()
        .min(1, {message:  "Veuillez renseigner votre mot de passe." })
        .min(6, { message: "Le mot de passe doit contenir au moins 6 caractères." })
        .max(50, { message: "Le mot de passe ne peut pas dépasser 50 caractères." }),
    confirmPassword: z
        .string()
        .trim()
        .min(1, {message:  "Veuillez confimer votre mot de passe." })
}).refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
})

export default function Register() {

    const { registerUser, errorMessage, clearError } = useAuthStore()

    const router = useRouter()

    const {register, handleSubmit, reset, formState: {errors, isSubmitting} } = useForm({
        resolver: zodResolver(schema)
    })

    const onSubmit = async (data: any) => {
        try {
            await registerUser(data)
            displayMessage()
        } catch (err: any) {
            displayError()
        }
    }

    const [successMessage, setSuccessMessage] = useState<string | null>(null)

    const displayMessage = () => {
        setSuccessMessage('Compte créé avec succès. ✨')
        setTimeout(() => {
            setSuccessMessage(null)
            router.push('/login')
            reset()
        }, 2000)
    }


    const displayError = () => {
        setSuccessMessage(null)
        setTimeout(() => {
            clearError()
        }, 2000)
    }

    return (
        <section className={`${styles['register']} ${styles['container']}`}>
            <div className={styles['register__form']}>
                <h2 className={styles['register-title']}>S'inscrire</h2>
                <p className={styles['register-subtitle']}>Créez votre accès à l’espace administrateur</p>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className={styles['form-group']}>
                        <input {...register('firstname')} type="text" placeholder="Prénom" />
                        {errors.firstname && <span className={styles['error-field']}>{errors.firstname.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('lastname')} type="text" placeholder="Nom" />
                        {errors.lastname && <span className={styles['error-field']}>{errors.lastname.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('phoneNumber')} type="tel" placeholder="Téléphone" />
                        {errors.phoneNumber && <span className={styles['error-field']}>{errors.phoneNumber.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('email')} type="email" placeholder="Email" />
                        {errors.email && <span className={styles['error-field']}>{errors.email.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('password')} type="password" placeholder="Mot de passe" />
                        {errors.password && <span className={styles['error-field']}>{errors.password.message}</span>}
                    </div>

                    <div className={styles['form-group']}>
                        <input {...register('confirmPassword')} type="password" placeholder="Confirmation de Mot de passe" />
                        {errors.confirmPassword && <span className={styles['error-field']}>{errors.confirmPassword.message}</span>}
                    </div>

                    {successMessage && <p className={styles['success-message']}>{successMessage}</p>}

                    {errorMessage && <p className={styles['error-message']}>{errorMessage}</p>}

                    <div className={styles['form__actions']}>
                        <button type={"submit"} className={styles['btn-submit']} disabled={isSubmitting}>
                            {isSubmitting ? 'Chargement...' : 'Envoyer'}
                        </button>
                    </div>
                </form>
            </div>
            {/* Modal de réservation */}
            <BookingView />
        </section>
    )
}