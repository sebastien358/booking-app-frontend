import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosAdminInfoMe, axiosAdminUserEdit} from "@/shared/services/admin/accountAdmin.service";

export interface UserState {
    email: string
}

export interface UserEditState {
    email: string
    password: string
}

export interface AccountAdminState {
    user: UserState | null
    isLoading: boolean

    infoMe: () => void
    editAccount: (data: UserEditState) => Promise<void>
}

export const useAccountAdminStore = create<AccountAdminState>()(
    persist((set) => ({
        user: null,
        isLoading: false,

        infoMe: async () => {
            try {
                set({ user: null, isLoading: true })
                const data = await axiosAdminInfoMe()
                set({ user: data, isLoading: false })
            } catch (err) {
                set({ isLoading: false })
                throw err
            }
        },

        editAccount: async (data: UserEditState) => {
            try {
                await axiosAdminUserEdit(data)
            } catch (err) {
                console.error(err)
                throw err
            }
        }

    }), {
        name: 'account-admin-state'
    })
)