import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosInfoMe,
    axiosLogin,
    axiosRegister,
    axiosRequestPassword,
    axiosResetPassword
} from "@/shared/services/auth.service";

export interface AuthState { // renommé ProductInterface -> AuthState
    token: string | null
    user: null
    errorMessage: string | null
    showLoginModal: boolean
    hasHydrated: boolean

    registerUser: (data: any) => Promise<void>
    login: (data: { email: string, password: string }) => Promise<void>
    infoMe: () => void
    requestPassword: (data: string) => Promise<void>
    resetPassword: (data: any, token: string) => Promise<void>
    logout: () => void
    isAdmin: () => boolean
    isUser: () => boolean
    clearError: () => void

    setShowLoginModal: (showLoginModal: boolean) => void,
    setHasHydrated: (hasHydrated: boolean) => void
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            errorMessage: null,
            showLoginModal: false,
            hasHydrated: false,

            registerUser: async (data) => {
                try {
                    await axiosRegister(data)
                } catch(err) {
                    const apiError = err?.response?.data
                    if (apiError?.type === 'EMAIL_ALREADY_EXISTS') {
                        set({ errorMessage: apiError?.message })
                    } else {
                        set({ errorMessage: 'L\'inscription a échouée' })
                    }
                    throw err
                }
            },

            login: async (data) => {
                try {
                    const { token } = await axiosLogin(data)
                    set({ token: token })
                    get().infoMe()
                } catch(err: any) {
                    if (err?.response?.status === 401) {
                        set({ errorMessage: 'Identifiant ou mot de passe invalide' })
                    } else {
                        set({ errorMessage: 'La connexion a échouée.' })
                    }
                    throw err
                }
            },

            infoMe: async () => {
                try {
                    const data = await axiosInfoMe()
                    set({ user: data })
                } catch(err) {
                    console.error(err)
                    throw err
                }
            },

            requestPassword: async (data: string) => {
                try {
                    await axiosRequestPassword(data)
                } catch (err: any) {
                    const apiError = err?.response?.data
                    if (apiError?.type === 'ERROR_REQUEST_PASSWORD') {
                        set({ errorMessage: apiError?.message })
                    } else {
                        set({ errorMessage: 'Une erreur est survenue' })
                    }
                    throw err
                }
            },

            resetPassword: async (data: any, token: string) => {
                try {
                    await axiosResetPassword(data, token)
                } catch (err: any) {
                    const apiError = err?.response?.data
                    if (apiError?.type === 'ERROR_RESET_PASSWORD_EXPIRED') {
                        set({ errorMessage: 'Le mot de passe a bien été réiniatilisé' })
                    } else {
                        set({ errorMessage: 'Une erreur est survenue' })
                    }
                    throw err
                }
            },

            isAdmin: () => {
                const { user } = get()
                return user?.roles.includes('ROLE_ADMIN') ?? false
            },

            isUser: () => {
                const { user } = get()
                return user?.roles.includes('ROLE_USER') ?? false
            },

            logout: () => {
                set({ token: null, user: null })
            },

            clearError: () => set({ errorMessage: null }),

            setShowLoginModal: (showLoginModal: boolean) => set({ showLoginModal }),

            setHasHydrated: (state) => set({ hasHydrated: state })
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true)
            }

        }
    )
)