import { catalogueSlice } from "../services/catalogueSlice";

export const StaffEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllModules: builder.query({
            query: () => `/get-all-models`
        }),
        addStaff: builder.mutation({
            query: (staffData) => ({
                url: `/register`,
                body: staffData,
                method: "POST"
            })
        }),
        getAllStaff: builder.query({
            query: () => `/all-staff`
        }),
        getSingleStaff: builder.query({
            query: (id) => `/get-staff/${id}`
        }),
        updateSingleStaffPermission: builder.mutation({
            query: ({staffData, staffId}) => ({
                url: `/edit-staff/${staffId}`,
                method: "PUT",
                body: staffData
            })
        })
    })
})

export const { useGetAllModulesQuery, useAddStaffMutation, useGetAllStaffQuery, useGetSingleStaffQuery, useUpdateSingleStaffPermissionMutation } = StaffEndPoint