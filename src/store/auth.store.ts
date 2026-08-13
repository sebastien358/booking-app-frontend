import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosLogin} from "@/shared/services/auth.service";

export interface AuthState { // renommé ProductInterface -> AuthState
    token: string | null;
    user: null;
    errorMessage: string | null;
    login: (data: {email: string, password: string}) => Promise<void>;
    logout: () => void;
    clearError: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            token: null,
            user: null,
            errorMessage: null,

            login: async (data) => {
                try {
                    const { token } = await axiosLogin(data)
                    set({ token: token })
                } catch(err: any) {
                    const message = err.response?.data?.message || 'La connexion a échouée.'
                    set({ errorMessage: message })
                    throw err
                }
            },

            logout: () => {
                set({ token: null, user: null })
            },

            clearError: () => set({ errorMessage: null }),
        }),
        {name: 'auth-storage'} // renomme pour pas confondre avec product
    )
)