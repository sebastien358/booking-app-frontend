import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosTestimonialCreate, axiosTestimonialList} from "@/shared/services/testimonial.service";

export interface TestimonialData {
    id: number
    author: string
    job: string
    rating: string
    message: string
    image: File | null
    created_at: Date
}

export interface TestimonialState {
    testimonials: TestimonialData[]
    isLoading: boolean
    errorMessage: string | null
    offset: number
    limit: number
    hasMore: boolean

    testimonialList: () => Promise<void>
    testimonialLazyLoad: () => Promise<void>
    testimonialCreate: (data: TestimonialData) => Promise<void>
    resetErrorMessage: () => void
}

export const useTestimonialStore = create<TestimonialState>()(
    persist((set, get) => ({
        testimonials: [],
        isLoading: false,
        errorMessage: null,
        offset: 0,
        limit: 6,
        hasMore: true,

        testimonialList: async () => {
            try {
                set({ testimonials: [], isLoading: true, hasMore: true })
                const data = await axiosTestimonialList(get().offset, get().limit)
                set({
                    testimonials: data,
                    isLoading: false,
                    hasMore: data.length >= get().limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        testimonialLazyLoad: async () => {
            try {
                const { testimonials, isLoading, offset, limit, hasMore } = get()
                if (!hasMore || isLoading) return

                set({ offset: offset + limit, isLoading: true })
                const data = await axiosTestimonialList(get().offset, get().limit)

                const newData = (data as any) ?? data ?? []
                if (newData.length === 0) {
                    set({ hasMore: false, isLoading: false })
                }

                set({
                    testimonials: [ ...testimonials, ...newData ],
                    isLoading: false,
                    hasMore: newData.length >= limit
                })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        testimonialCreate: async (data: TestimonialData) => {
            try {
                const formData = new FormData()

                formData.append('author', data.author)
                formData.append('job', data.job)
                formData.append('message', data.message)
                formData.append('rating', data.rating)

                // Si il y a une image dans le fichier

                if (data.image) {
                    formData.append('image', data.image)
                }

                await axiosTestimonialCreate(formData)
            } catch (err) {
                set({ errorMessage: 'Impossible d\'ajouter votre témoignage' })
                throw err
            }
        },

        resetErrorMessage: () => set({ errorMessage: null }),

    }),
        {
            name: 'testimonial-state',
            partialize: (state) => ({
                testimonials: state.testimonials,
                offset: state.offset
            })
        }
    )
)