import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosInfoMe, axiosLogin, axiosRegister} from "@/shared/services/auth.service";

export interface AuthState { // renommé ProductInterface -> AuthState
    token: string | null
    user: null
    errorMessage: string | null
    showLoginModal: boolean

    registerUser: (data: any) => Promise<void>
    login: (data: {email: string, password: string}) => Promise<void>
    infoMe: () => void
    logout: () => void
    isAdmin: () => boolean
    isUser: () => boolean
    clearError: () => void

    setShowLoginModal: (showLoginModal: boolean) => boolean,
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            errorMessage: null,
            showLoginModal: false,

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
                    const message = err.response?.data?.message || 'La connexion a échouée.'
                    set({ errorMessage: message })
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

        }),
        {name: 'auth-storage'} // renomme pour pas confondre avec product
    )
)