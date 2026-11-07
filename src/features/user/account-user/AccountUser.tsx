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
    firstname: z.string().trim()
        .min(1, { message: 'Le prénom est obligatoire' })
        .max(100, { message: 'Le prénom est trop long' }),
    lastname: z.string().trim()
        .min(1, { message: 'Le nom est obligatoire' })
        .max(100, { message: 'Le nom est trop long' }),
    phoneNumber: z.string().trim()
        .min(1, { message: 'Le numéro de téléphone est obligatoire' })
        .regex(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/, {
            message: 'Numéro de téléphone invalide'
        }),
    password: z.string().trim().optional(),
    passwordConfirm: z.string().trim().optional(),
}).refine((value) => {
    if (!value.password || !value.passwordConfirm) return true
    return value.password === value.passwordConfirm;
}, {
    message: 'Les mots de passe ne correspondent pas ou moins de 8 caractères',
    path: ['passwordConfirm']
})

export default function AccountUser() {

    const { register, handleSubmit, reset, formState: { isSubmitting, errors } } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            firstname: "",
            lastname: "",
            phoneNumber: "",
            password: "",
            passwordConfirm: ""
        }
    })

    {/* Store Auth */}

    const { logout } = useAuthStore()

    {/* Store Account User */}

    const {
        accountUser,
        resetAccountUser,
        accountUserEdit,
        accountUserDelete,
        user,
        isLoading,
        errorMessage
    } = useAccountUser()

    useEffect(() => {
        accountUser()
    }, [accountUser]);

    useEffect(() => {
        reset({
            email: user?.email,
            firstname: user?.firstname,
            lastname: user?.lastname,
            phoneNumber: user?.phoneNumber,
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
                                <input {...register('firstname')} type={"text"} />
                                {errors && <p className={styles['error-field']}>
                                    {errors.firstname?.message}
                                </p>}
                            </div>
                            <div className={styles['form-group']}>
                                <input {...register('lastname')} type={"text"} />
                                {errors && <p className={styles['error-field']}>
                                    {errors.lastname?.message}
                                </p>}
                            </div>
                            <div className={styles['form-group']}>
                                <input {...register('phoneNumber')} type={"text"} />
                                {errors && <p className={styles['error-field']}>
                                    {errors.phoneNumber?.message}
                                </p>}
                            </div>
                            <div className={styles['form-group']}>
                                <input
                                    {...register('password')}
                                    type="password"
                                    autoComplete="one-time-code"
                                    readOnly
                                    placeholder="Nouveau mot de passe (laisser vide si pas de changement)"
                                />
                                {errors && <p className={styles['error-field']}>
                                    {errors.password?.message}
                                </p>}
                            </div>
                            <div className={styles['form-group']}>
                                <input
                                    {...register('passwordConfirm')}
                                    type="password"
                                    autoComplete="one-time-code"
                                    readOnly
                                    placeholder="Confirmer le nouveau mot de passe"
                                />
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