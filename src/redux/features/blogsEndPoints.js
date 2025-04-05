import { catalogueSlice } from "../services/catalogueSlice";

export const blogsEndPoints = catalogueSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllBlogs: builder.query({
            query: () => `/get-blog`,
        }),
        getDeltedBlogs: builder.query({
            query: () => `/get-trash-blog`,
        }),
        getSingleBlogs: builder.query({
            query: (blogId) => `/get-blog/${blogId}`,
        }),
        addNewBlog: builder.mutation({
            query: (blogData) => ({
                url: `/add-blog`,
                method: "POST",
                body: blogData,
            }),
        }),
        editBlog: builder.mutation({
            query: ({ blogData, blogId }) => ({
                url: `/update-blog/${blogId}`,
                method: "PUT",
                body: blogData,
            }),
        }),
        deleteBlog: builder.mutation({
            query: (blogId) => ({
                url: `/add-trash-blog/${blogId}`,
                method: "PUT",
                body: {},
            }),
        }),
        permanentDeleteBlog: builder.mutation({
            query: (blogId) => ({
                url: `/delete-blog/${blogId}`,
                method: "DELETE",
                body: {},
            }),
        }),
        restoreDeleteBlog: builder.mutation({
            query: (blogId) => ({
                url: `/restore-trash-blog/${blogId}`,
                method: "PUT",
            }),
        }),
        getAllBlogsCategory: builder.query({
            query: () => `/get-blog-category`,
        }),
        getParentChildBlogsCategory: builder.query({
            query: () => `/parent-child-blogh-category`,
        }),
        getSingleBlogsCategory: builder.query({
            query: (categoryId) => `/get-blog-category/${categoryId}`,
        }),
        getDeletedBlogsCategory: builder.query({
            query: () => `/get-trash-blog-category`,
        }),
        addNewBlogCategory: builder.mutation({
            query: (blogCategoryData) => ({
                url: `/add-blog-category`,
                method: "POST",
                body: blogCategoryData,
            }),
        }),
        editBlogCategory: builder.mutation({
            query: ({ blogCategoryData, categoryId }) => ({
                url: `/update-blog-category/${categoryId}`,
                method: "PUT",
                body: blogCategoryData,
            }),
        }),
        deleteBlogCategory: builder.mutation({
            query: ({ categoryId }) => ({
                url: `/add-trash-blog-category/${categoryId}`,
                method: "PUT",
                body: {},
            }),
        }),
        permanentdeleteBlogCategory: builder.mutation({
            query: ({ categoryId }) => ({
                url: `/delete-blog-category/${categoryId}`,
                method: "DELETE",
                body: {},
            }),
        }),
        restoreBlogCategory: builder.mutation({
            query: ({ categoryId }) => ({
                url: `/restore-trash-blog-category/${categoryId}`,
                method: "PUT",
                body: {},
            }),
        }),
        getAllBlogsTags: builder.query({
            query: () => `/get-blog-tag`,
        }),
        getSingleBlogsTags: builder.query({
            query: (blogTagId) => `/get-blog-tag/${blogTagId}`,
        }),
        addNewBlogsTags: builder.mutation({
            query: (blogTagData) => ({
                url: `/add-blog-tag`,
                method: "POST",
                body: blogTagData,
            }),
        }),
        editBlogsTags: builder.mutation({
            query: ({ blogTagData, blogTagId }) => ({
                url: `/update-blog-tag/${blogTagId}`,
                method: "PUT",
                body: blogTagData,
            }),
        }),
        deleteBlogsTags: builder.mutation({
            query: ({ blogTagId }) => ({
                url: `/delete-blog-tag/${blogTagId}`,
                method: "DELETE",
                body: {},
            }),
        }),
        getNotFoundSearches: builder.query({
            query: () => `/all-not-found`
        }),
        getPreviewLink: builder.mutation({
            query: (formData) => ({
                url: `/preview-blog`,
                method: "POST",
                body: formData,
            })
        }),
        getAllBlogComments: builder.query({
            query: () => `/all-blog-comments`
        }),
        blogBlukDelete: builder.mutation({
            query: (bloghIds) => ({
                url: `/bulk-delete`,
                method: 'DELETE',
                body: bloghIds
            })
        })

    }),
});

export const { useGetAllBlogsQuery, useGetDeltedBlogsQuery, useGetSingleBlogsQuery, useAddNewBlogMutation, useEditBlogMutation, useDeleteBlogMutation, usePermanentDeleteBlogMutation, useRestoreDeleteBlogMutation, useGetAllBlogsCategoryQuery, useGetParentChildBlogsCategoryQuery, useGetSingleBlogsCategoryQuery, useGetDeletedBlogsCategoryQuery, useAddNewBlogCategoryMutation, useEditBlogCategoryMutation, useDeleteBlogCategoryMutation, usePermanentdeleteBlogCategoryMutation, useRestoreBlogCategoryMutation, useGetAllBlogsTagsQuery, useGetSingleBlogsTagsQuery, useAddNewBlogsTagsMutation, useEditBlogsTagsMutation, useDeleteBlogsTagsMutation, useGetNotFoundSearchesQuery, useGetPreviewLinkMutation, useGetAllBlogCommentsQuery, useBlogBlukDeleteMutation } = blogsEndPoints;
