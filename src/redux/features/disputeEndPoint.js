import { catalogueSlice } from "../services/catalogueSlice";

export const disputeEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllDisputes: builder.query({
            query: () => `/get-all-disputes`
        }),
        getAllMessages: builder.query({
            query: (disputeId) => `/get-dispute-messages/${disputeId}`
        }),
        updateStatus: builder.mutation({
            query: ({ disputeId, disputeBody }) => ({
                url: `/update-status/${disputeId}`,
                method: 'PUT',
                body: disputeBody
            })
        }),
        sendDisputeMessages: builder.mutation({
            query: (messageBody) => ({
                url: '/send-dispute-message',
                body: messageBody,
                method: "POST"
            })
        }),

    })
})


export const { useGetAllDisputesQuery, useGetAllMessagesQuery, useUpdateStatusMutation, useSendDisputeMessagesMutation } = disputeEndPoint