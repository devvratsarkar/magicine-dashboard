import { catalogueSlice } from "../services/catalogueSlice";

export const MediaEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllMedia: builder.query({
            query: ({ fromDate, toDate }) => `/get-all-media?fromDate=${fromDate}&toDate=${toDate}`,
        }),
        addMedia: builder.mutation({
            query: (mediaData) => ({
                url: `/add-media`,
                method: "POST",
                body: mediaData,
            })
        }),
        getSingleMedia: builder.query({
            query: (mediaId) => `/get-media/${mediaId}`,
        }),
        deleteMedia: builder.mutation({
            query: (mediaId) => ({
                url: `/delete-media/${mediaId}`,
                method: "DELETE"
            })
        })
    })
})


export const { useGetAllMediaQuery, useAddMediaMutation, useGetSingleMediaQuery, useDeleteMediaMutation } = MediaEndPoints