import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosServiceList} from "@/shared/services/admin/serviceAdmin.service";

type CategoryData = {
    id: number
    name: string
}

type ServiceData = {
    id: number
    duration: number
    name: string
    price: string
    category: CategoryData
}

export interface ServiceState {
    services: ServiceData[]
    isLoading: boolean

    serviceList: () => Promise<void>
}

export const useServiceAdminStore = create<ServiceState>()(
    persist((set, get) => ({
        services: [],
        isLoading: false,

        serviceList: async () => {
            try {
                set({ services: [], isLoading: true })
                const data = await axiosServiceList()
                set({ services: data, isLoading: false })
            } catch (err) {
                console.error(err)
                set({ isLoading: false })
                throw err
            }
        }

    }), {
        name: 'service-admin-state'
    })
)