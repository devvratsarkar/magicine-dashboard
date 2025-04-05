
import { catalogueSlice } from "../services/catalogueSlice";


export const productEndPoints = catalogueSlice.injectEndpoints({
    endpoints: builder => ({
        getProducts: builder.query({
            query: ({ brand, marketer, status, fromDate, toDate, search, page, limit }) => `/get-product?brand=${brand}&manufacture=${marketer}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&search=${search}&page=${page}&limit=${limit}`,
        }),
        getDeletedProducts: builder.query({
            query: () => `/get-product-trash`,
        }),
        getSingleProducts: builder.query({
            query: (id) => `/get-product/${id}`,
        }),
        addNewProduct: builder.mutation({
            query: (newproduct) => ({
                url: `/add-product`,
                method: 'POST',
                body: newproduct,
            }),
        }),
        editProduct: builder.mutation({
            query: ({ updatedproduct, productId }) => ({
                url: `/update-product/${productId}`,
                method: 'PUT',
                body: updatedproduct,
            }),
        }),
        deleteProduct: builder.mutation({
            query: ({ productId }) => ({
                url: `/add-product-trash/${productId}`,
                method: 'PUT',
            }),
        }),
        permanentlyDeleteProduct: builder.mutation({
            query: ({ productId }) => ({
                url: `/delete-product/${productId}`,
                method: 'DELETE',
            }),
        }),
        restoreProduct: builder.mutation({
            query: ({ productId }) => ({
                url: `/restore-product-trash/${productId}`,
                method: 'PUT',
            }),
        }),
        getMedicines: builder.query({
            query: ({ brand, marketer, status, fromDate, toDate, search, limit, page }) => `/get-medicine?brand=${brand}&manufacture=${marketer}&status=${status}&fromDate=${fromDate}&toDate=${toDate}&search=${search}&limit=${limit}&page=${page}`,
        }),
        getSingleMedicines: builder.query({
            query: (medicineId) => `/get-medicine/${medicineId}`,
        }),
        getDeletedMedicines: builder.query({
            query: () => `/get-soft-delete-medicine`,
        }),
        addNewMedicine: builder.mutation({
            query: (newMedicine) => ({
                url: `/add-medicine`,
                method: 'POST',
                body: newMedicine,
            }),
        }),
        editMedicine: builder.mutation({
            query: ({ medicineData, medicineId }) => ({
                url: `/update-medicine/${medicineId}`,
                method: 'PUT',
                body: medicineData,
            }),
        }),
        deleteMedicine: builder.mutation({
            query: ({ medicineId }) => ({
                url: `/soft-delete-medicine/${medicineId}`,
                method: 'PUT',
                body: {},
            }),
        }),
        permanentlyDeleteMedicine: builder.mutation({
            query: ({ medicineId }) => ({
                url: `/delete-medicine/${medicineId}`,
                method: 'DELETE',
            }),
        }),
        restoreMedicine: builder.mutation({
            query: ({ medicineId }) => ({
                url: `/restore-soft-delete-medicine/${medicineId}`,
                method: 'PUT',
            }),
        }),

        // ---------------import---------------
        importProduct: builder.mutation({
            query: (formData) => ({
                url: `/import-product`,
                method: 'POST',
                body: formData,
            }),
        }),
        importMedicine: builder.mutation({
            query: (formData) => ({
                url: `/import-medicine`,
                method: 'POST',
                body: formData,
            }),
        }),
        importSurgicalEquipment: builder.mutation({
            query: (formData) => ({
                url: `/import-sergical`,
                method: 'POST',
                body: formData,
            }),
        }),



        getProductInventory: builder.query({
            query: () => `/get-product-inventory`
        }),

        getMedicineInventory: builder.query({
            query: () => `/get-medicine-inventory`
        }),

        getSurgicalEquipmentInventory: builder.query({
            query: () => `/get-surgical-inventory`
        }),

        // ---------------------------------
        updateMedicineStatus: builder.mutation({
            query: ({ formData, medicineId }) => ({
                url: `/update-medicine-status/${medicineId}`,
                method: 'PUT',
                body: formData,
            })
        }),
        deleteComboItems: builder.mutation({
            query: (comboId) => ({
                url: `/delete-combo-items/${comboId}`,
                method: 'DELETE',
            })
        }),
        // ---------update-cart-price----------
        updateCartPrice: builder.mutation({
            query: (cartData) => ({
                url: `/update-cart-prices`,
                method: 'POST',
                body: cartData,
            })
        }),
        reviewMedicine: builder.mutation({
            query: ({ reviewMedicineId, reviewMedicineData }) => ({
                url: `/mark-as-review/${reviewMedicineId}`,
                method: 'PUT',
                body: reviewMedicineData
            })
        }),
        getMedicineOnly: builder.query({
            query: () => `/get-medicine-only`
        }),
        getGeneralProductOnly: builder.query({
            query: () => `/get-general-product-only`
        }),
    })
})

export const { useGetProductsQuery, useGetDeletedProductsQuery, useGetSingleProductsQuery, useAddNewProductMutation, useEditProductMutation, useDeleteProductMutation, usePermanentlyDeleteProductMutation, useRestoreProductMutation, useGetMedicinesQuery, useGetSingleMedicinesQuery, useGetDeletedMedicinesQuery, useAddNewMedicineMutation, useEditMedicineMutation, useDeleteMedicineMutation, usePermanentlyDeleteMedicineMutation, useRestoreMedicineMutation, useImportProductMutation, useImportMedicineMutation, useImportSurgicalEquipmentMutation, useGetProductInventoryQuery, useGetMedicineInventoryQuery, useGetSurgicalEquipmentInventoryQuery, useUpdateMedicineStatusMutation, useDeleteComboItemsMutation, useUpdateCartPriceMutation, useReviewMedicineMutation, useGetMedicineOnlyQuery, useGetGeneralProductOnlyQuery, useGetGeneralProductSaltQuery } = productEndPoints;
