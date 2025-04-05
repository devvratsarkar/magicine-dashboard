import { catalogueSlice } from "../services/catalogueSlice";

export const cartEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllCarts: builder.query({
            query: () => `/all-cart`,
        }),
        allOrger: builder.query({
            query: ({ prescription, status, fromDate, toDate }) => `/all-order?status=${status}&prescription=${prescription}&fromDate=${fromDate}&toDate=${toDate}`
        }),
        getOrderDetail: builder.query({
            query: (order_id) => `/order-detail/${order_id}`
        }),

        getAllCancellation: builder.query({
            query: () => `/order-detail`
        }),
        updateOrderStatus: builder.mutation({
            query: ({ orderBody, orderId }) => ({
                url: `/update-order-status/${orderId}`,
                method: "PUT",
                body: orderBody
            })
        }),
        deleteOrderStatushistory: builder.mutation({
            query: (orderId) => ({
                url: `delete-order-history/${orderId}`,
                method: "DELETE"
            })
        }),
        getAllPrescriptionOPrder: builder.query({
            query: (orderId) => `/all-prescription-order/${orderId}`
        }),
        updatePrescriptionStatus: builder.mutation({
            query: ({ prescriptionStatus, prescriptionId }) => ({
                url: `/update-prescription-order/${prescriptionId}`,
                method: "PUT",
                body: prescriptionStatus
            }),
        }),
        sendInvoice: builder.mutation({
            query: (id) => ({
                url: `/send-invoice/${id}`,
                method: "POST",
            }),
        })
    }),

})

export const { useGetAllCartsQuery, useAllOrgerQuery, useGetOrderDetailQuery, useGetAllCancellationQuery, useUpdateOrderStatusMutation, useDeleteOrderStatushistoryMutation, useGetAllPrescriptionOPrderQuery, useUpdatePrescriptionStatusMutation, useSendInvoiceMutation } = cartEndPoint