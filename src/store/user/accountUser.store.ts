import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosAccountUser} from "@/shared/services/user/accountUser.service";

export interface AccountFormData {
    email: string
    password: string
    passwordConfirm: string
}

export interface UserData {
    email: string
}

export interface AccountUserState {
    user: UserData | null
    isLoading: boolean

    accountUser: () => void
}

export const useAccountUser = create<AccountUserState>()(
    persist((set, get) => ({
        user: null,
        isLoading: false,

        accountUser: async () => {
            try {
                set({ isLoading: true })
                const data = await axiosAccountUser()
                set({ user: data, isLoading: false })
            } catch (err: any) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        }

    }), {
        name: 'account-user-state'
    })
)