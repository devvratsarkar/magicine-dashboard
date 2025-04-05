import { catalogueSlice } from "../services/catalogueSlice";

export const supportDeskEndPoint = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllNotification: builder.query({
            query: () => `/all-notification`,
        }),
        getSingleNotification: builder.query({
            query: (notificationID) => `/get-notification-id/${notificationID}`,
        }),
        getDeletedNotification: builder.query({
            query: () => `/all-soft-notification`,
        }),
        addNewNotification: builder.mutation({
            query: (notificationData) => ({
                url: `/add-notification`,
                method: "POST",
                body: notificationData,
            }),
        }),
        editNotification: builder.mutation({
            query: ({ notificationData, notificationID }) => ({
                url: `/update-notification/${notificationID}`,
                method: "PUT",
                body: notificationData,
            }),
        }),
        deleteNotification: builder.mutation({
            query: ({ notificationID }) => ({
                url: `/soft-delete-notification/${notificationID}`,
                method: "GET",
            }),
        }),
        permanentDeleteNotification: builder.mutation({
            query: ({ notificationID }) => ({
                url: `/delete-notification/${notificationID}`,
                method: "GET",
            }),
        }),
        restoreNotification: builder.mutation({
            query: ({ notificationID }) => ({
                url: `/restore-notification/${notificationID}`,
                method: "GET",
            }),
        }),
        getAllPushNotification: builder.query({
            query: () => `/all-push-notification`,
        }),
        getDeletedPushNotification: builder.query({
            query: () => `/all-soft-push`,
        }),
        getSinglePushNotification: builder.query({
            query: (pushNotificationId) => `/get-push-id/${pushNotificationId}`,
        }),
        addPushNotification: builder.mutation({
            query: (pushNotificationData) => ({
                url: `/add-push`,
                method: "POST",
                body: pushNotificationData,
            }),
        }),
        editPushNotification: builder.mutation({
            query: ({ pushNotificationData, pushNotificationId }) => ({
                url: `/update-push/${pushNotificationId}`,
                method: "PUT",
                body: pushNotificationData,
            }),
        }),
        deletePushNotification: builder.mutation({
            query: (pushNotificationId) => ({
                url: `/soft-delete-push/${pushNotificationId}`,
                method: "GET",
            }),
        }),
        permanentDeletePushNotification: builder.mutation({
            query: (pushNotificationId) => ({
                url: `/delete-push/${pushNotificationId}`,
                method: "GET",
            }),
        }),
        restorePushNotification: builder.mutation({
            query: (pushNotificationId) => ({
                url: `/restore-push/${pushNotificationId}`,
                method: "GET",
            }),
        }),

    }),
});

export const { useGetAllNotificationQuery, useGetSingleNotificationQuery, useGetDeletedNotificationQuery, useAddNewNotificationMutation, useEditNotificationMutation, useDeleteNotificationMutation, usePermanentDeleteNotificationMutation, useRestoreNotificationMutation, useGetAllPushNotificationQuery, useAddPushNotificationMutation, useEditPushNotificationMutation, useGetDeletedPushNotificationQuery, useDeletePushNotificationMutation, usePermanentDeletePushNotificationMutation, useRestorePushNotificationMutation, useGetSinglePushNotificationQuery } = supportDeskEndPoint;
