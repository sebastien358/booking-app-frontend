import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosAdminTestimonialDelete,
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
    countTestimonials: number | null

    testimonialAdminList: () => Promise<void>
    testimonialAdminLazyLoad: () => Promise<void>
    testimonialAdminSearch: (term: string | null) => Promise<void>
    testimonialAdminDetails: (id: string) => Promise<void>
    testimonialAdminToggle: (id: string) => Promise<void>
    testimonialDelete: (id: string) => Promise<void>
    resetTestimonial: () => void
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
        countTestimonials: null,

        testimonialAdminList: async () => {
            try {
                set({ testimonials: [], isLoading: true, hasMore: true })
                const data = await axiosAdminTestimonialList(get().offset, get().limit)

                set({
                    testimonials: data.testimonials,
                    isLoading: false,
                    countTestimonials: data.count,
                    hasMore: data.testimonials.length >= get().limit
                })
            } catch (err) {
                set({ isLoading: false })
                console.error(err)
                throw err
            }
        },

        testimonialAdminLazyLoad: async () => {
            try {
                const { testimonials, offset, limit, isLoading, hasMore} = get()

                if (!hasMore || isLoading) return

                set({ offset: offset + limit , isLoading: true })
                const data = await axiosAdminTestimonialList(get().offset, get().limit)

                const newContacts = data.testimonials ?? []

                if (newContacts.length === 0) {
                    set({ hasMore: false, isLoading: false })
                }

                set({
                    testimonials: [ ...testimonials, ...data.testimonials ],
                    isLoading: false,
                    hasMore: data.testimonials.length >= get().limit
                })
            }  catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        testimonialAdminSearch: async (term: string | null) => {
            const trimmed = term?.toLowerCase().trim()
            try {
                if (!trimmed) {
                    set({term: null, hasMore: true})
                    await get().testimonialAdminList()
                    return
                }

                set({ isLoading: true, hasMore: true })
                const data = await axiosAdminTestimonialSearch(get().term)

                set({
                    testimonials: data,
                    term: trimmed,
                    isLoading: false,
                    hasMore: false
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
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
                set({ isLoading: false })
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
        },

        testimonialDelete: async (id: string) => {
            const { testimonials } = get()
            set({ testimonials: testimonials.filter((t) => t.id !== id) })
            try {
                await axiosAdminTestimonialDelete(id)
                set({ currentTestimonial: null })
            } catch (err) {
                console.error(err)
                throw err
            }
        },

        resetTestimonial: async () => {
            set({ term: null, offset: 0, hasMore: true })
            await get().testimonialAdminList()
        }

    }), {
        name: 'testimonial-admin-state',
        partialize: (state) => ({
            testimonials: state.testimonials,
            offset: state.offset,
            countTestimonials: state.countTestimonials,
            term: state.term
        })
    })
)