"use client"

import styles from './AccountUser.module.scss'

import {AccountFormData, useAccountUser} from "@/store/user/accountUser.store";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useEffect, useState} from "react";
import {z} from 'zod'
import {useAuthStore} from "@/store/auth.store";
import {useRouter} from "next/navigation";
import ModalConfirm from "@/components/modal-confirmation/ModalConfirm";

const DELAY_TIMEOUT = 2000
const DELAY_TIMEOUT_REDIRECT_LOGIN = 1000

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

export default function AccountUser() {

    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: ""
        }
    })

    {/* Store Auth */}

    const { logout } = useAuthStore()

    {/* Store Account User */}

    const { accountUser, resetAccountUser, accountUserEdit, accountUserDelete, user, isLoading, errorMessage } = useAccountUser()

    useEffect(() => {
        accountUser()
    }, [accountUser]);

    useEffect(() => {
        reset({
            email: user?.email,
            password: "",
            passwordConfirm: ""
        })
    }, [reset, user]);

    const [ successMessage, setSuccessMessage ] = useState<string | null>(null)

    {/* Èdition du compte */}

    const onSubmit = async (data: AccountFormData) => {
        try {
            await accountUserEdit(data)
            handleSuccessMessage('Le mot de passe a bien été modifié')
        } catch (err: any) {
            resetErrorMessage()
        }
    }

    {/* Delete Account */}

    const onClickDelete = async () => {
        try {
            await accountUserDelete()
            setActiveModal(false)
            router.push('/')
        } catch (err: any) {
            resetErrorMessage()
        }
    }

    {/* Gestion message de confirmation */}

    const router = useRouter()

    const handleSuccessMessage = (msg: string | null) => {
        setSuccessMessage(msg)
        setTimeout(() => {
            setSuccessMessage(null)
            disconnectAndRedirectToLogin()
        }, DELAY_TIMEOUT)
    }

    const disconnectAndRedirectToLogin = () => {
        setTimeout(() => {
            router.push('/login')
            logout()
        }, DELAY_TIMEOUT_REDIRECT_LOGIN)
    }

    const resetErrorMessage = () => {
        setTimeout(() => {
           resetAccountUser()
        }, DELAY_TIMEOUT)
    }

    {/* Gestion Modal de confirmation de suppression */}

    const [activeModal, setActiveModal] = useState<boolean | null>(null)

    const closeModal = () => {
        setActiveModal(false)
    }

    if (isLoading) {
        return (
            <section className={styles['spinner']}>
                <div className={styles['spinner__loader']}></div>
            </section>
        )
    }

    if (!isLoading && user !== null) {
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

                            {errorMessage && <p className={styles['error-message']}>
                                {errorMessage}
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

                {/* Suppression du compte utilisateur  */}

                <section className={styles['account-delete']}>
                    <p className={styles['account-delete__title']}>Zone de danger</p>
                    <p className={styles['account-delete__text']}>La suppression de votre compte est irréversible.</p>
                    <button
                        type="button"
                        className={styles['btn-remove-account']}
                        onClick={() => setActiveModal(true)}
                    >
                        Supprimer mon compte
                    </button>
                </section>

                <ModalConfirm
                    activeModal={activeModal}
                    closeModal={closeModal}
                    onClickDelete={onClickDelete}
                    errorMessage={errorMessage}
                    dropdownAccount
                />
            </div>
        )
    }
}