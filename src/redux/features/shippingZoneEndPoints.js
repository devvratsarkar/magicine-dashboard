import { catalogueSlice } from "../services/catalogueSlice";

export const shippingZoneEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllZones: builder.query({
            query: () => `/get-zones`,
        }),
        getAllCountryList: builder.query({
            query: () => `/get-country-list`,
        }),
        addNewZone: builder.mutation({
            query: (zoneData) => ({
                url: `/add-zone`,
                method: "POST",
                body: zoneData,
            }),
        }),
        editZone: builder.mutation({
            query: ({ zoneData, zoneId }) => ({
                url: `/update-zone/${zoneId}`,
                method: "PUT",
                body: zoneData,
            }),
        }),
        editCountryStates: builder.mutation({
            query: ({ countryStatesData, countryId }) => ({
                url: `/update-country/${countryId}`,
                method: "PUT",
                body: countryStatesData,
            }),
        }),
        addRate: builder.mutation({
            query: (rateData) => ({
                url: `/add-rate`,
                method: "POST",
                body: rateData,
            }),
        }),
        editRate: builder.mutation({
            query: ({ rateData, rateId }) => ({
                url: `/update-rate/${rateId}`,
                method: "PUT",
                body: rateData,
            }),
        }),
        deleteShipping: builder.mutation({
            query: ({ url, commonId }) => ({
                url: `/${url}/${commonId}`,
                method: "DELETE",
            }),
        }),
        getAllCarrier: builder.query({
            query: () => `/get-carrier`,
        }),
        getDeletedCarrier: builder.query({
            query: () => `/get-carrier-trash`,
        }),
        getSingleCarrier: builder.query({
            query: (carrierId) => `/get-carrier/${carrierId}`,
        }),
        addNewCarrier: builder.mutation({
            query: (carrierData) => ({
                url: `/add-carrier`,
                method: "POST",
                body: carrierData,
            }),
        }),
        editCarrier: builder.mutation({
            query: ({ carrierData, carrierId }) => ({
                url: `/update-carrier/${carrierId}`,
                method: "PUT",
                body: carrierData,
            }),
        }),
        deleteCarrier: builder.mutation({
            query: (carrierId) => ({
                url: `/add-trash-carrier/${carrierId}`,
                method: "PUT",
            }),
        }),
        permanentDeleteCarrier: builder.mutation({
            query: (carrierId) => ({
                url: `/delete-carrier-trash/${carrierId}`,
                method: "DELETE",
            }),
        }),
        restoreCarrier: builder.mutation({
            query: (carrierId) => ({
                url: `/restore-carrier/${carrierId}`,
                method: "PUT",
            }),
        }),
    }),
});

export const { useGetAllZonesQuery, useGetAllCountryListQuery, useAddNewZoneMutation, useEditCountryStatesMutation, useAddRateMutation, useEditRateMutation, useDeleteShippingMutation, useEditZoneMutation, useGetAllCarrierQuery, useGetDeletedCarrierQuery, useGetSingleCarrierQuery, useAddNewCarrierMutation, useEditCarrierMutation, useDeleteCarrierMutation, usePermanentDeleteCarrierMutation, useRestoreCarrierMutation } = shippingZoneEndPoints;
