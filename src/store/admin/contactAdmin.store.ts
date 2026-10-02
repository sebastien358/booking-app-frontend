import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosAdminContactList} from "@/shared/services/admin/contactAdmin.service";

export interface ContactState {
    contacts: any[]
    isLoading: boolean
    offset: number
    limit: number
    hasMore: boolean

    contactList: () => Promise<void>
}

export const useContactAdminStore = create<ContactState>()(
    persist((set, get) => ({
        contacts: [],
        isLoading: false,
        offset: 0,
        limit: 2,
        hasMore: true,

        contactList: async () => {
            try {
                set({ contacts: [], isLoading: true, hasMore: true })
                const data = await axiosAdminContactList()
                set({ contacts: data, isLoading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        }

    }), {
        name: 'contact-admin-state'
    })
)