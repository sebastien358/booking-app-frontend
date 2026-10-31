import {create} from "zustand";
import {persist} from "zustand/middleware";
import {
    axiosTestimonialCreate,
    axiosTestimonialHomePage,
    axiosTestimonialList
} from "@/shared/services/testimonial.service";

export interface PictureData {
    id: number
    filename: string
}

export interface TestimonialData {
    id: number
    author: string
    job: string
    rating: string
    message: string
    picture: PictureData | null
    created_at: Date
}

export interface TestimonialState {
    testimonials: TestimonialData[]
    testimonialsHome: TestimonialData[]
    isLoading: boolean
    errorMessage: string | null
    currentPage: number
    pages: number | null
    limit: number

    testimonialHomePage: () => Promise<void>
    testimonialList: () => Promise<void>
    testimonialCreate: (data: TestimonialData) => Promise<void>
    previousPage: () => void
    nextPage: () => void
    resetErrorMessage: () => void
}

export const useTestimonialStore = create<TestimonialState>()(
    persist((set, get) => ({
        testimonials: [],
        testimonialsHome: [],
        isLoading: false,
        errorMessage: null,
        currentPage: 1,
        limit: 6,
        pages: null,

        testimonialHomePage: async () => {
            try {
                set({ testimonialsHome: [], isLoading: true })
                const data = await axiosTestimonialHomePage()
                set({ testimonialsHome: data, isLoading: false })

                console.log(get().testimonialsHome)
            } catch(err: any) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },

        testimonialList: async () => {
            try {
                set({ testimonials: [], isLoading: true })
                const data = await axiosTestimonialList(get().currentPage, get().limit)
                set({
                    testimonials: data.testimonials,
                    pages: data.pages,
                    isLoading: false,
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

                if (data.image) {
                    formData.append('image', data.image)
                }

                await axiosTestimonialCreate(formData)
            } catch (err) {
                set({ errorMessage: 'Impossible d\'ajouter votre témoignage' })
                throw err
            }
        },

        previousPage: async () => {
            try {
                const { currentPage } = get()
                if (currentPage > 0) {
                    set({ currentPage: currentPage - 1 })
                    await get().testimonialList()
                }
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        nextPage: async () => {
            try {
                const { currentPage, pages } = get()
                if (pages !== null && currentPage < pages) {
                    set({ currentPage: currentPage + 1 })
                    await get().testimonialList()
                }
            } catch (err: any) {
                console.error(err)
                throw err
            }
        },

        resetErrorMessage: () => set({ errorMessage: null }),
    }),
        {
            name: 'testimonial-state',
            partialize: (state) => ({
                testimonials: state.testimonials,
                testimonialsHome: state.testimonialsHome,
                pages: state.pages
            })
        }
    )
)