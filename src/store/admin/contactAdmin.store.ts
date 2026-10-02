import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminContactDelete,
    axiosAdminContactDetails,
    axiosAdminContactList,
    axiosAdminContactSearch
} from "@/shared/services/admin/contactAdmin.service";

export interface ContactData {
    firstname: string
    lastname: string
    email: string
    message: string
    is_read: boolean
}

export interface ContactState {
    contacts: ContactData[]
    currentContact: ContactData | null
    isLoading: boolean
    term: string | null
    offset: number
    limit: number
    hasMore: boolean
    countContacts: number | null

    contactList: () => Promise<void>
    contactLazyLoad: () => Promise<void>
    contactDetails: (id: string) => Promise<void>
    contactSearch: (term: string | null) => Promise<void>
    contactDelete: (id: string) => Promise<void>
}

export const useContactAdminStore = create<ContactState>()(
    persist((set, get) => ({
        contacts: [],
        currentContact: null,
        isLoading: false,
        term: null,
        offset: 0,
        limit: 2,
        hasMore: true,
        count: null,

        contactList: async () => {
            try {
                set({ contacts: [], isLoading: true, hasMore: true })
                const data = await axiosAdminContactList(get().offset, get().limit)
                set({ contacts: data.contacts, isLoading: false, countContacts: data.count })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        contactLazyLoad: async () => {
            try {
                const { contacs, offset, limit } = get()
                set({ offset: offset + limit, isLoading: true })
                const data = await axiosAdminContactList(get().offset, get().limit)
                set({ contacts: [ ...contacts, ...data ], isLoading: false })

                if (data.length < limit) {
                    set({ hasMore: false })
                }
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        contactDetails: async (id: string) => {
            try {
                set({ currentContact: null, isLoading: true })
                const data = await axiosAdminContactDetails(id)
                set({ currentContact: data, isLoading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        contactSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({ term: null, offset: 0, hasMore: true })
                    await get().contactList()
                }

                set({ term: trimmed, isLoading: true })
                const data = await axiosAdminContactSearch(get().term)
                set({ contacts: data, isLoading: false, hasMore: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        contactDelete: async (id: string) => {
            try {
                await axiosAdminContactDelete(id)
            } catch (err) {
                console.error(err)
                throw err
            }
        },



    }), {
        name: 'contact-admin-state'
    })
)