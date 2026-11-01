import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminClientDelete,
    axiosAdminClientIsRead,
    axiosAdminClients,
    axiosAdminInfoMe,
    axiosAdminUserEdit
} from "@/shared/services/admin/accountAdmin.service";

export interface UsersState {
    id: number
    firstname: string
    lastname: string
    phoneNumber: string
    email: string
    isRead: boolean
    isVisible: boolean
}

export interface UserState {
    email: string
}

export interface UserEditState {
    email: string
    password: string
}

export interface AccountAdminState {
    users: UsersState[],
    user: UserState | null
    clientId: number | null
    isLoading: boolean

    infoMe: () => Promise<void>
    clientsList: () => Promise<void>
    clientIsRead: (id: number) => Promise<void>
    setClientId: (clientId: number) => number
    clientDelete: () => Promise<void>
    editAccount: (data: UserEditState) => Promise<void>
}

export const useAccountAdminStore = create<AccountAdminState>()(
    persist((set, get) => ({
        users: [],
        user: null,
        clientId: null,
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

        clientsList: async () => {
            try {
                set({ users: [], isLoading: true })
                const data = await axiosAdminClients()
                set({ users: data, isLoading: false })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        clientIsRead: async (id: number) => {
            try {
                await axiosAdminClientIsRead(id)
                await get().clientsList()
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        setClientId: (id: number) => set({ clientId: id }),

        clientDelete: async () => {
            try {
                await axiosAdminClientDelete(get().clientId)
                await get().clientsList()
            } catch (err: any) {
                console.error(err)
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