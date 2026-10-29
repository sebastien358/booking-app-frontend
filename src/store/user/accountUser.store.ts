import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAccountUser,
    axiosAccountUserDelete,
    axiosAccountUserEdit
} from "@/shared/services/user/accountUser.service";

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
    errorMessage: string | null

    accountUser: () => void
    accountUserEdit: (data: AccountFormData) => Promise<void>
    accountUserDelete: () => Promise<void>
    resetAccountUser: () => void
}

export const useAccountUser = create<AccountUserState>()(
    persist((set, get) => ({
        user: null,
        isLoading: false,
        errorMessage: null,

        accountUser: async () => {
            try {
                set({ isLoading: true })
                const data = await axiosAccountUser()
                set({ user: data, isLoading: false })
            } catch (err: any) {
                set({ isLoading: false })
                throw err
            }
        },

        accountUserEdit: async (data: AccountFormData) => {
            try {
                await axiosAccountUserEdit(data)
            } catch (err: any) {
                set({ errorMessage: 'Les modifications ont échouées' })
                throw err
            }
        },

        accountUserDelete: async () => {
            try {
                await axiosAccountUserDelete()
            } catch (err: any) {
                console.error(err)
                set({ errorMessage: 'Le compte n\'a pas pu être supprimé' })
                throw err
            }
        },

        resetAccountUser: async () => {
            set({ errorMessage: null })
        }

    }), {
        name: 'account-user-state'
    })
)