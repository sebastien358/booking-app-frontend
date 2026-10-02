import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosContactNew} from "@/shared/services/contact.service";

export interface ContactData {
    firstname: string
    lastname: string
    email: string
    message: string
}

export interface ContactState {
    errorMessage: string | null

    contactNew: (data: ContactData) => Promise<void>
    resetContact: () => void
}

export const useContact = create<ContactState>()(
    persist((set, get) => ({
        errorMessage: null,

        contactNew: async (data: ContactData) => {
            try {
                await axiosContactNew(data)
            } catch (err) {
                set({ errorMessage: 'Le message n\'a pas pu être envoyé' })
                throw err
            }
        },

        resetContact: () => set({ errorMessage: null })

    }), {
        name: 'contact-state'
    })
)