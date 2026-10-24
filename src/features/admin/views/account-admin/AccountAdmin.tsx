'use client'

import styles from './AccountAdmin.module.scss'
import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import { z } from 'zod'
import {zodResolver} from "@hookform/resolvers/zod";
import {useAccountAdminStore} from "@/store/admin/accountAdmin.store";
import {useAuthStore} from "@/store/auth.store";
import {useRouter} from "next/navigation";

const schema = z.object({
    email: z.string().email({ message: 'Email invalide' }),
    password: z.string()
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .max(50, { message: '50 caractères maximum' }),
    passwordConfirm: z.string()
        .min(8, { message: 'Le mot de passe doit contenir au moins 8 caractères' })
        .max(50, { message: '50 caractères maximum' })

}).refine((value) => value.password === value.passwordConfirm, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['passwordConfirm']
})

export default function AccountAdmin() {

    const { logout } = useAuthStore()

    {/* Store Admin User */}

    const { infoMe, user, isLoading, editAccount } = useAccountAdminStore()

    const {register, handleSubmit, reset, formState: {isSubmitting, errors}} = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: ""
        }
    })

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    type DatAUser = {
        email: string
        password: string
        passwordConfirm: string
    }

    const onSubmit = async (dataUser: DatAUser) => {
        try {
            const data = {
                email: dataUser.email,
                password: dataUser.password
            }
            await editAccount(data)
            displaySuccessMessage('La modification des données a réussie')
        } catch(err) {
            throw err
        }
    }

    const router = useRouter()

    const displaySuccessMessage = (msg: string) => {
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
            router.push('/login')
            logout()
        }, 2000)
    }

    useEffect(() => {
        infoMe()
    }, [infoMe]);

    useEffect(() => {
        if (user?.email) {
            reset({
                email: user.email,
                password: ""
            })
        }
    }, [user, reset]);

    return (
        <div className={styles['page']}>
            <section className={styles['account-user']}>
                <div className={styles['account-user__form']}>
                    <h3>Modifier mes données</h3>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className={styles['form-group']}>
                            <input {...register('email')} type={"email"} disabled={true} />
                            {errors && <p className={styles['error-field']}>
                                {errors.email?.message}
                            </p>}
                        </div>

                        <div className={styles['form-group']}>
                            <input {...register('password')} type={"password"} placeholder="••••••••" />
                            {errors && <p className={styles['error-field']}>
                                {errors.password?.message}
                            </p>}
                        </div>

                        <div className={styles['form-group']}>
                            <input {...register('passwordConfirm')} type={"password"} placeholder="••••••••" />
                            {errors && <p className={styles['error-field']}>
                                {errors.passwordConfirm?.message}
                            </p>}
                        </div>
                        {/* Gestion messages de validation */}

                        {successMessage && <p className={styles['success-message']}>
                            {successMessage}
                        </p>}

                        {/* Bouton de soumission */}
                        <button
                            type={'submit'}
                            className={`${styles['btn']} ${styles['btn-primary']}`}
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Chargement...' : 'Soumettre'}
                        </button>
                    </form>
                </div>
            </section>
        </div>
    )
}