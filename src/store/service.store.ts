import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosServicesList} from "@/shared/services/services.service";

interface ServiceState {
    services: any[]

    servicesList: () => Promise<void>
}

export const useServiceStore = create<ServiceState>()(
    persist((set, get) => ({
            services: [],

            servicesList: async () => {
                try {
                    const data = await axiosServicesList()
                    set({ services: data })
                } catch (err) {
                    console.error(err)
                    throw err
                }
            }

        }),
        {name: 'service-state'}
    )
)