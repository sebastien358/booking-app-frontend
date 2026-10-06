import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosCategoriesList} from "@/shared/services/category.service";

export interface CategoryData {
    id: string
    name: string
    slug: string
}

 export interface CategoryState {
    categories: CategoryData[]
    isLoading: boolean
    errorMessage: string | null

    categoriesList: () => void
}

export const useCategoryStore = create<CategoryState>()(
    persist((set, get) => ({
        categories: [],
        isLoading: false,
        errorMessage: null,

        categoriesList: async () => {
            try {
                set({ categories: [], isLoading: true })
                const data = await axiosCategoriesList()
                set({ categories: data, isLoading: false })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        },
    }),
        {
            name: 'category-state',
            partialize: (state) => ({ categories: state.categories })
        }
    )
)