import {create} from "zustand";
import {persist} from "zustand/middleware";
import {axiosStaffList} from "@/shared/services/staff.service";

interface StaffState {
    staffs: any[]

    staffList: () => Promise<void>
}

export const useStaffStore = create<StaffState>()(
    persist((set, get) => ({
            staffs: [],

            staffList: async () => {
                try {
                    const data = await axiosStaffList()
                    set({ staffs: data })
                } catch (err) {
                    console.error(err)
                    throw err
                }
            }

        }),
        {name: 'staff-state'}
    )
)