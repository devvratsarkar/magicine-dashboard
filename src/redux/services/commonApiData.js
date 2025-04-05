import { commonDataSlice } from "../slices/commonApiSlice";


export const commonApiData = commonDataSlice.injectEndpoints({
    endpoints: builder => ({
        getAllUserData: builder.query({
            query: () => `/users`
        }),

    })
})


// export const { useGetAllGlobalDataQuery, useGetCartDataQuery, useGetCountryDataQuery } = globalApiData;
export const { useGetAllUserDataQuery } = commonApiData;