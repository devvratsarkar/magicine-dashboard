// import { catalogueSlice } from "../services/commonApi";
import {catalogueSlice} from "../services/catalogueSlice.js"

export const commonApiCall = catalogueSlice.injectEndpoints({
    endpoints: builder => ({
        getUserProfile: builder.query({
            query: () => `/get-user`
        }),
        updateProfile: builder.mutation({
            query: (formData) => ({
                url: `/update-profile`,
                method: "POST",
                body: formData
            })
        }),
        changePassword: builder.mutation({
            query: (formData) => ({
                url: '/change-password',
                method: "POST",
                body: formData
            })
        }),
    })
})


export const { useGetUserProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } = commonApiCall;