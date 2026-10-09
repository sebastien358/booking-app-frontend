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
    isLoadingCategory: boolean
    errorMessage: string | null

    categoriesList: () => void
}

export const useCategoryStore = create<CategoryState>()(
    persist((set) => ({
        categories: [],
        isLoadingCategory: false,
        errorMessage: null,

        categoriesList: async () => {
            try {
                set({ categories: [], isLoadingCategory: true })
                const data = await axiosCategoriesList()
                set({ categories: data, isLoadingCategory: false })
            } catch (err) {
                console.error(err)
                set({ isLoadingCategory: false })
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