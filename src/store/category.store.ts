import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosCategoriesList} from "@/shared/services/category.service";

interface CategoryState {
    categories: any[]
    isLoadingCategory: boolean

    categoriesList: () => void
}

export const useCategoryStore = create<CategoryState>()(
    persist((set, get) => ({
        categories: [],
        isLoadingCategory: false,

        categoriesList: async () => {
            set({ isLoadingCategory: true })
            try {
                const data = await axiosCategoriesList()
                set({ categories: data, isLoadingCategory: false })
            } catch (err) {
                console.error(err)
                set({ isLoadingCategory: false })
                throw err
            }
        },
    }),
        {name: 'category-state'}
    )
)