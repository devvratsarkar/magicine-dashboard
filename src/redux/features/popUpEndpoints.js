import { catalogueSlice } from "../services/catalogueSlice";

export const popUpEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllPopUps: builder.query({
            query: () => `/get-pop-ups`,
        }),
        addPopUp: builder.mutation({
            query: (popUpBody) => ({
                url: `add-pop-up`,
                method: "POST",
                body: popUpBody
            })
        }),
        getSinglePOPUP: builder.query({
            query: (popupID) => `/get-pop-up/${popupID}`
        }),
        updatePopup: builder.mutation({
            query: ({ popupData, popupId }) => ({
                url: `update-pop-up/${popupId}`,
                method: "PUT",
                body: popupData
            })
        }),
        getLoginData: builder.query({
            query: () => `get-login-data`,
        }),
        deletePopUp: builder.mutation({
            query: (popUpId) => ({
                url: `delete-pop-up/${popUpId}`,
                method: "DELETE"
            })
        })

    }),
});

export const { useGetAllPopUpsQuery, useAddPopUpMutation, useGetSinglePOPUPQuery, useUpdatePopupMutation, useGetLoginDataQuery, useDeletePopUpMutation } = popUpEndPoints;
