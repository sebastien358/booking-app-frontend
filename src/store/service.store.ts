import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosServicesList} from "@/shared/services/services.service";

interface ServiceState {
    services: any[]
    isLoadingService: boolean

    servicesList: () => Promise<void>
}

export const useServiceStore = create<ServiceState>()(
    persist((set, get) => ({
            services: [],
            isLoadingService: false,

            servicesList: async () => {
                try {
                    set({ isLoadingService: true })
                    const data = await axiosServicesList()
                    set({ services: data, isLoadingService: false })
                } catch (err) {
                    set({ isLoadingService: false })
                    throw err
                }
            }

        }),
        {name: 'service-state'}
    )
)