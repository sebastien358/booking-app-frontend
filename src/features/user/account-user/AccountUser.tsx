import styles from './AccountUser.module.scss'
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from 'zod'
import {useEffect, useState} from "react";
import {AccountFormData, useAccountUser} from "@/store/user/accountUser.store";

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

    const { register, handleSubmit, reset, formState: {isSubmitting, errors} } = useForm({
        resolver: zodResolver(schema),
        defaultValues: {
            email: "",
            password: "",
            passwordConfirm: ""
        }
    })

    const { accountUser, user, isLoading } = useAccountUser()

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

    const onSubmit = async (data: AccountFormData) => {
        try {
            console.log(data)
        } catch (err) {
            console.error(err)
            throw err
        }
    }

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