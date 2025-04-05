import { catalogueSlice } from "../services/catalogueSlice";

export const customerDataEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: ({ name, email, country, fromDate, toDate, purchaseStatus }) => `/get-all-users?name=${name && name}&email=${email && email}&country=${country && country}&fromDate=${fromDate && fromDate}&toDate=${toDate && toDate}&purchaseStatus=${purchaseStatus}`
        }),
        getSingleUser: builder.query({
            query: (userId) => `/user-by-id/${userId}`,
        }),
        getUser: builder.query({
            query: () => `/get-all-users`,
        }),
        addNewUsers: builder.mutation({
            query: (userData) => ({
                url: `/add-user`,
                method: "POST",
                body: userData,
            }),
        }),
        editUser: builder.mutation({
            query: ({ userData, userId }) => ({
                url: `/update-user/${userId}`,
                method: "POST",
                body: userData,
            }),
        }),
        getAllSubscribers: builder.query({
            query: ({ email, fromDate, toDate }) => `/all-subscriber?email=${email && email}&fromDate=${fromDate && fromDate}&toDate=${toDate && toDate}`
        }),
        deleteSubscribers: builder.mutation({
            query: (subscriberId) => ({
                url: `/delete-subscriber/${subscriberId}`,
                method: "DELETE",
            }),
        }),
        updateSubscribersStatus: builder.mutation({
            query: ({ subscriberStatus, subscriberId }) => ({
                url: `/update-subscriber-status/${subscriberId}`,
                method: "PUT",
                body: subscriberStatus
            }),
        }),
        // ------------------------------------------------
        getAllProductEnquiry: builder.query({
            query: ({ name, email, productName, fromDate, toDate }) => `/all-product-enquiry?name=${name}&email=${email}&productName=${productName}&fromDate=${fromDate}&toDate=${toDate}`
        }),
        // ---------------------------------
        getContactEnquiry: builder.query({
            query: ({ name, email, fromDate, toDate }) => `/all-contacts?name=${name}&email=${email}&fromDate=${fromDate}&toDate=${toDate}}`
        }),

        getAllPrescriptions: builder.query({
            query: ({ email, medicine, fromDate, toDate }) => `/all-prescription?email=${email}&medicine=${medicine}&fromDate=${fromDate}&toDate=${toDate}`
        }),
        getAllUserAccordingToCategory: builder.mutation({
            query: (body) => ({
                url: `/get-user-with-category`,
                body: body,
                method: "POST"
            })

        }),
        getCategoriesType: builder.mutation({
            query: (body) => ({
                url: "/get-category-type",
                method: "POST",
                body: body,
            })
        })
    }),
});

export const { useGetAllUsersQuery, useGetUserQuery, useGetSingleUserQuery, useAddNewUsersMutation, useEditUserMutation, useGetAllSubscribersQuery, useDeleteSubscribersMutation, useUpdateSubscribersStatusMutation, useGetAllProductEnquiryQuery, useGetContactEnquiryQuery, useGetAllPrescriptionsQuery, useGetAllUserAccordingToCategoryMutation, useGetCategoriesTypeMutation } = customerDataEndPoints;
