import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosCategoryAdminList} from "@/shared/services/admin/categoryAdmin.service";

export interface CategoryData {
    id: string
    name: string
    slug: string
}

export interface CategoryState {
    categories: CategoryData[]
    isLoading: boolean

    categoryAdminList: () => void
}

export const useCategoryAdminStore = create<CategoryState>()(
    persist((set, get) => ({
            categories: [],
            isLoading: false,

            categoryAdminList: async () => {
                try {
                    set({ categories: [], isLoading: true })
                    const data = await axiosCategoryAdminList()
                    set({ categories: data, isLoading: false })
                } catch (err) {
                    set({ isLoading: false })
                    throw err
                }
            },
        }),
        {
            name: 'category-admin-state',
            partialize: (state) => ({ categories: state.categories })
        }
    )
)