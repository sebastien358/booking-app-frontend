import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosCategoriesList} from "@/shared/services/category.service";

interface CategoryState {
    categories: any[]
    categoriesList: () => void
}

export const useCategoryStore = create<CategoryState>()(
    persist((set, get) => ({
        categories: [],

        categoriesList: async () => {
            try {
                const data = await axiosCategoriesList()
                set({ categories: data })
            } catch (err) {
                console.error(err)
                throw err
            }
        },
    }),
        {name: 'category-state'}
    )
)