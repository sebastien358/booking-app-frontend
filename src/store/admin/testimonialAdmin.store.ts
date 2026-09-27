import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminTestimonialDetails,
    axiosAdminTestimonialList,
    axiosAdminTestimonialSearch, axiosAdminTestimonialToggle
} from "@/shared/services/admin/testimonialAdmin.service";

export interface TestimonialData {
    id: number
    author: string
    job: string
    rating: string
    message: string
    image: File | null
    created_at: Date
    is_read: boolean
    is_published: boolean
}

export interface TestimonialState {
    testimonials: TestimonialData[]
    currentTestimonial: null
    isLoading: boolean
    errorMessage: string | null
    offset: number
    limit: number
    hasMore: boolean
    term: string | null

    testimonialAdminList: () => Promise<void>
    testimonialAdminLazyLoad: () => Promise<void>
    testimonialAdminSearch: (term: string | null) => Promise<void>
    testimonialAdminDetails: (id: string) => Promise<void>
    testimonialAdminToggle: (id: string) => Promise<void>
}


export const useTestimonialAdminStore = create<TestimonialState>()(
    persist((set, get) => ({
        testimonials: [],
        currentTestimonial: null,
        isLoading: true,
        errorMessage: null,
        offset: 0,
        limit: 4,
        hasMore: true,
        term: null,

        testimonialAdminList: async () => {
            try {
                set({ testimonials: [], isLoading: true, hasMore: true })
                const data = await axiosAdminTestimonialList(get().offset, get().limit)
                set({ testimonials: data, isLoading: false })
            } catch (err) {
                set({ testimonials: [], isLoading: false })
                console.error(err)
                throw err
            }
        },

        testimonialAdminLazyLoad: async () => {
            try {
                const { testimonials, offset, limit } = get()
                set({ offset: offset + limit , isLoading: true })
                const data = await axiosAdminTestimonialList(get().offset, get().limit)
                set({ testimonials: [ ...testimonials, ...data ], isLoading: false })

                if (data.length < limit) {
                    set({ hasMore: false })
                }
            }  catch (err) {
                console.error(err)
                throw err
            }
        },

        testimonialAdminSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({ term: null, hasMore: true })
                    await get().testimonialAdminList()
                    return
                }

                set({ isLoading: true, hasMore: true })
                const data = await axiosAdminTestimonialSearch(get().term)
                set({ testimonials: data, term: trimmed, isLoading: false, hasMore: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        testimonialAdminDetails: async (id: string) => {
            try {
                set({ currentTestimonial: null, isLoading: true })
                const data = await axiosAdminTestimonialDetails(id)
                set({ currentTestimonial: data, isLoading: false })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        testimonialAdminToggle: async (id: string) => {
            try {
                await axiosAdminTestimonialToggle(id)
                await get().testimonialAdminDetails(id)
            } catch (err) {
                console.error(err)
                throw err
            }
        }

    }), {
        name: 'testimonial-admin-state',
        partialize: (state) => ({ testimonials: state.testimonials })
    })
)