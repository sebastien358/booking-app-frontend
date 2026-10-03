import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminContactDelete,
    axiosAdminContactDetails,
    axiosAdminContactList,
    axiosAdminContactSearch
} from "@/shared/services/admin/contactAdmin.service";

export interface ContactData {
    id?: string
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
    resetContact: () => void
}

export const useContactAdminStore = create<ContactState>()(
    persist((set, get) => ({
        contacts: [],
        currentContact: null,
        isLoading: false,
        term: null,
        offset: 0,
        limit: 2,
        hasMore: false,
        countContacts: null,

        contactList: async () => {
            try {
                set({ contacts: [], isLoading: true, offset: 0, hasMore: true })

                const data = await axiosAdminContactList(get().offset, get().limit)

                set({
                    contacts: data.contacts,
                    isLoading: false,
                    countContacts: data.count,
                    hasMore: data.contacts.length >= get().limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        contactLazyLoad: async () => {
            try {
                const { contacts, offset, limit, hasMore, isLoading } = get()
                if (!hasMore || isLoading) return

                set({ offset: offset + limit, isLoading: true })

                const data = await axiosAdminContactList(get().offset, get().limit)
                const newContacts = data.contacts.length ?? []

                if (newContacts.length === 0) {
                    set({ hasMore: false, isLoading: false })
                }

                set({
                    contacts: [ ...contacts, ...data.contacts ],
                    isLoading: false,
                    hasMore: data.contacts.length >= limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
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
                set({ isLoading: false })
                throw err
            }
        },

        contactSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim() || null

            if (!trimmed) {
                set({ term: null, offset: 0, hasMore: true })
                await get().contactList()
                return
            }
            try {
                set({ term: trimmed, isLoading: true, offset: 0 })

                const data = await axiosAdminContactSearch(trimmed)
                const results = (data as any).contacts ?? data ?? []

                set({
                    contacts: results,
                    isLoading: false,
                    hasMore: false,
                    countContacts: results.length
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        contactDelete: async (id: string) => {
            try {
                await axiosAdminContactDelete(id)
                set({ contacts: get().contacts.filter((c: any) => c._id !== id) })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        resetContact: () => {
            set({ term: null, offset: 0, hasMore: true })
            get().contactList()
        },

    }), {
        name: 'contact-admin-state',
        partialize: (state) => ({
            contacts: state.contacts,
            term: state.term,
            offset: state.offset,
            countContacts: state.countContacts
        }),
    })
)