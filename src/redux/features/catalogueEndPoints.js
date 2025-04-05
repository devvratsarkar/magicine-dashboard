import { catalogueSlice } from "../services/catalogueSlice";

export const catalogueEndPoints = catalogueSlice.injectEndpoints({
  endpoints: (builder) => ({
    getTags: builder.query({
      query: () => `/get-tags`,
    }),
    editTag: builder.mutation({
      query: ({ tagId, tagData }) => ({
        url: `/update-tags/${tagId}`,
        method: "PUT",
        body: tagData,
      }),
    }),
    addNewTag: builder.mutation({
      query: ({ newTag }) => ({
        url: `/add-tags`,
        method: "POST",
        body: newTag,
      }),
    }),
    deleteTag: builder.mutation({
      query: ({ tagId }) => ({
        url: `/delete-tags/${tagId}`,
        method: "DELETE",
        // body: newTag,
      }),
    }),
    getCategory: builder.query({
      query: ({ status, type }) => `/get-category?status=${status}&type=${type}`,
    }),
    getCategoryDeletedItems: builder.query({
      query: () => `/get-soft-deleted-category`,
    }),
    getCategoryById: builder.query({
      query: (id) => `/get-category/${id}`,
    }),
    editCategory: builder.mutation({
      query: ({ categoryId, categoryData }) => ({
        url: `/update-category/${categoryId}`,
        method: "PUT",
        body: categoryData,
      }),
    }),
    deleteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/soft-delete-category/${categoryId}`,
        method: "PUT",
        body: {},
      }),
    }),
    restoreCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/restore-category/${categoryId}`,
        method: "PUT",
        body: {},
      }),
    }),
    permanentDeleteCategory: builder.mutation({
      query: ({ categoryId }) => ({
        url: `/delete-category/${categoryId}`,
        method: "DELETE",
        body: {},
      }),
    }),
    getCategoryByParentChild: builder.query({
      query: () => `/parent-child-category`,
    }),
    addNewCategory: builder.mutation({
      query: (newCategory) => ({
        url: `/add-category`,
        method: "POST",
        body: newCategory,
      }),
    }),
    getManufactutrer: builder.query({
      query: () => `/get-marketer`,
    }),
    getManufacturerById: builder.query({
      query: (manufacturerId) => `/get-marketer/${manufacturerId}`,
    }),
    getManufactutrerDeletedData: builder.query({
      query: () => `/get-soft-delete-marketer`,
    }),
    addManufactutrer: builder.mutation({
      query: ({ Manufactutrer }) => ({
        url: `/add-marketer`,
        method: "POST",
        body: Manufactutrer,
      }),
    }),
    deleteManufactutrer: builder.mutation({
      query: ({ manufactutrerId }) => ({
        url: `/soft-delete-marketer/${manufactutrerId}`,
        method: "PUT",
        // body: {},
      }),
    }),
    permanentDeleteManufactutrer: builder.mutation({
      query: ({ manufactutrerId }) => ({
        url: `/delete-marketer/${manufactutrerId}`,
        method: "DELETE",
        // body: ,
      }),
    }),
    restoreManufactutrer: builder.mutation({
      query: ({ manufactutrerId }) => ({
        url: `/restore-soft-delete-marketer/${manufactutrerId}`,
        method: "PUT",
        body: {},
      }),
    }),
    editManufactutrer: builder.mutation({
      query: ({ manufactutrerId, manufactutrerData }) => ({
        url: `/update-marketer/${manufactutrerId}`,
        method: "PUT",
        body: manufactutrerData,
      }),
    }),
    getBrand: builder.query({
      query: ({ type, status }) => `/get-brand?type=${type}&status=${status}`,
    }),
    getBrandById: builder.query({
      query: (id) => `/get-brand/${id}`,
    }),
    addNewBrand: builder.mutation({
      query: (newBrand) => ({
        url: `/add-brand`,
        method: "POST",
        body: newBrand,
        // headers: {
        //     'Content-Type': 'multipart/form-data',
        // },
      }),
    }),
    editBrand: builder.mutation({
      query: ({ updatedData, brandId }) => ({
        url: `/update-brand/${brandId}`,
        method: "PUT",
        body: updatedData,
      }),
    }),
    brandRestore: builder.mutation({
      query: ({ brandId }) => ({
        url: `/restore-soft-delete-brand/${brandId}`,
        method: "PUT",
        body: {},
      }),
    }),
    deleteBrand: builder.mutation({
      query: ({ brandId }) => ({
        url: `/soft-delete-brand/${brandId}`,
        method: "PUT",
        // body: {},
      }),
    }),
    permanentDeleteBrand: builder.mutation({
      query: ({ brandId }) => ({
        url: `/delete-brand/${brandId}`,
        method: "DELETE",
        // body: {},
      }),
    }),
    getBrandsDeletedData: builder.query({
      query: () => `/get-soft-delete-brand`,
    }),
    getReviewsData: builder.query({
      query: () => `/get-review-product`,
    }),
    getCouponData: builder.query({
      query: () => `/get-coupon`,
    }),
    addNewCoupon: builder.mutation({
      query: (newCoupon) => ({
        url: `/add-coupon`,
        method: "POST",
        body: newCoupon,
      }),
    }),
    editCoupon: builder.mutation({
      query: ({ couponId, couponData }) => ({
        url: `/update-coupon/${couponId}`,
        method: "PUT",
        body: couponData,
      }),
    }),
    getSingleCoupon: builder.query({
      query: (couponId) => `/get-coupon/${couponId}`,
    }),
    getDeletedCouponData: builder.query({
      query: () => `/get-soft-delete-coupon`,
    }),
    deleteCoupon: builder.mutation({
      query: ({ couponId }) => ({
        url: `/soft-delete-coupon/${couponId}`,
        method: "PUT",
        body: {},
      }),
    }),
    permanentDeleteCoupon: builder.mutation({
      query: ({ couponId }) => ({
        url: `/delete-coupon/${couponId}`,
        method: "DELETE",
        body: {},
      }),
    }),
    restoreCoupon: builder.mutation({
      query: (couponId) => ({
        url: `/restore-soft-delete-coupon/${couponId}`,
        method: "PUT",
        body: {},
      }),
    }),
    getCustomFields: builder.query({
      query: () => `/get-all-fields`,
    }),
    getSingleCustomFields: builder.query({
      query: (id) => `/get-field-id/${id}`,
    }),
    addNewCustomField: builder.mutation({
      query: (newCustomField) => ({
        url: `/add-custom-field`,
        method: "POST",
        body: newCustomField,
      }),
    }),
    editCustomField: builder.mutation({
      query: ({ customField, fieldId }) => ({
        url: `/update-custom-field/${fieldId}`,
        method: "PUT",
        body: customField,
      }),
    }),
    deleteCustomField: builder.mutation({
      query: (fieldId) => ({
        url: `/soft-delete-field/${fieldId}`,
        method: "GET",
      }),
    }),
    permanentDeleteCustomField: builder.mutation({
      query: (fieldId) => ({
        url: `/delete-field/${fieldId}`,
        method: "GET",
      }),
    }),
    getCustomFieldsDeletedItems: builder.query({
      query: () => `/get-soft-delete-field`,
    }),
    getCustomFieldsValueDeletedItems: builder.query({
      query: (fieldId) => `/get-soft-delete-value/${fieldId}`,
    }),
    customFieldsRestore: builder.mutation({
      query: (fieldId) => ({
        url: `/restore-field/${fieldId}`,
        method: "GET",
      }),
    }),
    getCustomFieldValue: builder.query({
      query: (fieldId) => `/get-all-values/${fieldId}`,
    }),
    addCustomFieldValues: builder.mutation({
      query: (fieldValue) => ({
        url: `/add-custom-value`,
        method: "POST",
        body: fieldValue,
      }),
    }),
    editCustomFieldValues: builder.mutation({
      query: ({ fieldValue, fieldId }) => ({
        url: `/update-value/${fieldId}`,
        method: "PUT",
        body: fieldValue,
      }),
    }),
    deleteCustomFieldValues: builder.mutation({
      query: (fieldId) => ({
        url: `/soft-delete-value/${fieldId}`,
        method: "GET",
      }),
    }),
    permanentDeleteCustomFieldValues: builder.mutation({
      query: (fieldId) => ({
        url: `/delete-field-value/${fieldId}`,
        method: "GET",
      }),
    }),
    restoreCustomFieldValues: builder.mutation({
      query: (fieldId) => ({
        url: `/restore-value/${fieldId}`,
        method: "GET",
      }),
    }),
    // ----------surgical equipment-----------
    getSurgicalEquipment: builder.query({
      query: ({ marketer, status, fromDate, toDate }) => `/get-sergical-equipment?manufacture=${marketer}&status=${status}&fromDate=${fromDate}&toDate=${toDate}`,
    }),
    getSurgicalEquipmentID: builder.query({
      query: (equipmentId) => `/get-sergical-equipment/${equipmentId}`,
    }),
    addSurgicalEquipment: builder.mutation({
      query: (newData) => ({
        url: `/add-sergical-equipment`,
        method: "POST",
        body: newData,
      }),
    }),
    updateSurgicalEquipmentID: builder.mutation({
      query: ({ updateEquipment, equipmentID }) => ({
        url: `/update-sergical-equipment/${equipmentID}`,
        method: "PUT",
        body: updateEquipment,
      }),
    }),
    softDeleteSurgicalEquipment: builder.mutation({
      query: ({ equipmentId }) => ({
        url: `/soft-delete-sergical-equipment/${equipmentId}`,
        method: "PUT",
        body: {},
      }),
    }),
    deleteSurgicalEquipment: builder.mutation({
      query: ({ equipmentId }) => ({
        url: `/delete-sergical-equipment/${equipmentId}`,
        method: "DELETE",
        body: {},
      }),
    }),
    restoreSurgicalEquipment: builder.mutation({
      query: ({ equipmentId }) => ({
        url: `/restore-sergical-equipment/${equipmentId}`,
        method: "PUT",
        body: {},
      }),
    }),
    getTrashSurgicalEquipment: builder.query({
      query: () => `/get-trash-sergical-equipment`,
    }),
    getSelectedReviews: builder.query({
      query: ({ modelType, productId }) =>
        `/get-review/${modelType}/${productId}`,
    }),
    addProductReview: builder.mutation({
      query: (formData) => ({
        url: `/add-review`,
        method: "POST",
        body: formData,
      }),
    }),
    getProductMedicineEquipment: builder.query({
      query: () => `/get-product-medicine-equipment`,
    }),
    getSingleReview: builder.query({
      query: (reviewId) => `/get-review/${reviewId}`,
    }),
    updateReview: builder.mutation({
      query: ({ reviewData, ID }) => ({
        url: `/update-review/${ID}`,
        method: "PUT",
        body: reviewData,
      }),
    }),
    reviewStatusTrue: builder.mutation({
      query: (reviewId) => ({
        url: `/review-status-true/${reviewId}`,
        method: "PUT",
      }),
    }),
    reviewStatusFalse: builder.mutation({
      query: (reviewId) => ({
        url: `/review-status-false/${reviewId}`,
        method: "PUT",
      }),
    }),
    // -----------uses------------
    getAllUses: builder.query({
      query: () => `/get-all-uses`
    }),
    getAllTrashUses: builder.query({
      query: () => `/get-all-uses-trash`
    }),
    getSingleUses: builder.query({
      query: (usesID) => `/get-uses/${usesID}`
    }),
    addUses: builder.mutation({
      query: (formData) => ({
        url: `/add-uses`,
        method: "POST",
        body: formData
      })
    }),
    editUses: builder.mutation({
      query: ({ usesId, formData }) => ({
        url: `/update-uses/${usesId}`,
        method: "PUT",
        body: formData
      })
    }),
    addTrashUses: builder.mutation({
      query: (usesId) => ({
        url: `/add-trash-uses/${usesId}`,
        method: "PUT",
      })
    }),
    restoreTrashUses: builder.mutation({
      query: (usesId) => ({
        url: `/restore-uses/${usesId}`,
        method: "PUT",
      })
    }),
    deleteTrashUses: builder.mutation({
      query: (usesId) => ({
        url: `/delete-use/${usesId}`,
        method: "DELETE",
      })
    }),
    // -------------form---------------
    getAllForm: builder.query({
      query: () => `/get-all-form`
    }),
    getAllTrashForm: builder.query({
      query: () => `/get-all-form-trash`
    }),
    getSingleForm: builder.query({
      query: (usesID) => `/get-form/${usesID}`
    }),
    addForm: builder.mutation({
      query: (formData) => ({
        url: `/add-form`,
        method: "POST",
        body: formData
      })
    }),
    editForm: builder.mutation({
      query: ({ usesId, formData }) => ({
        url: `/update-form/${usesId}`,
        method: "PUT",
        body: formData
      })
    }),
    addTrashForm: builder.mutation({
      query: (usesId) => ({
        url: `/add-trash-form/${usesId}`,
        method: "PUT",
      })
    }),
    restoreTrashForm: builder.mutation({
      query: (usesId) => ({
        url: `/restore-form/${usesId}`,
        method: "PUT",
      })
    }),
    deleteTrashForm: builder.mutation({
      query: (usesId) => ({
        url: `/delete-form/${usesId}`,
        method: "DELETE",
      })
    }),
    copyCategory: builder.mutation({
      query: (formData) => ({
        url: `/copy-category`,
        method: "POST",
        body: formData,
      })
    }),
    deleteReview: builder.mutation({
      query: (id) => ({
        url: `/delete-review/${id}`,
        method: "PUT",
      })
    }),
    getCouponUsageData: builder.query({
      query: () => `/get-coupon-usage`
    })
  }),
});

export const {
  useGetTagsQuery,
  useEditTagMutation,
  useAddNewTagMutation,
  useDeleteTagMutation,
  useGetCategoryQuery,
  useGetCategoryDeletedItemsQuery,
  useGetCategoryByIdQuery,
  useEditCategoryMutation,
  useDeleteCategoryMutation,
  useRestoreCategoryMutation,
  usePermanentDeleteCategoryMutation,
  useGetCategoryByParentChildQuery,
  useAddNewCategoryMutation,
  useGetManufactutrerQuery,
  useGetManufacturerByIdQuery,
  useAddManufactutrerMutation,
  useDeleteManufactutrerMutation,
  usePermanentDeleteManufactutrerMutation,
  useRestoreManufactutrerMutation,
  useEditManufactutrerMutation,
  useGetManufactutrerDeletedDataQuery,
  useGetBrandQuery,
  useAddNewBrandMutation,
  useGetBrandByIdQuery,
  useEditBrandMutation,
  useBrandRestoreMutation,
  useDeleteBrandMutation,
  usePermanentDeleteBrandMutation,
  useGetBrandsDeletedDataQuery,
  useGetReviewsDataQuery,
  useGetCouponDataQuery,
  useGetSingleCouponQuery,
  useGetDeletedCouponDataQuery,
  useEditCouponMutation,
  useAddNewCouponMutation,
  useDeleteCouponMutation,
  usePermanentDeleteCouponMutation,
  useRestoreCouponMutation,
  useGetCustomFieldsQuery,
  useGetSingleCustomFieldsQuery,
  useAddNewCustomFieldMutation,
  useEditCustomFieldMutation,
  useDeleteCustomFieldMutation,
  useGetCustomFieldsDeletedItemsQuery,
  useGetCustomFieldsValueDeletedItemsQuery,
  usePermanentDeleteCustomFieldMutation,
  useCustomFieldsRestoreMutation,
  useGetCustomFieldValueQuery,
  useAddCustomFieldValuesMutation,
  useEditCustomFieldValuesMutation,
  useDeleteCustomFieldValuesMutation,
  usePermanentDeleteCustomFieldValuesMutation,
  useRestoreCustomFieldValuesMutation,
  useGetSurgicalEquipmentQuery,
  useGetSurgicalEquipmentIDQuery,
  useAddSurgicalEquipmentMutation,
  useUpdateSurgicalEquipmentIDMutation,
  useSoftDeleteSurgicalEquipmentMutation,
  useDeleteSurgicalEquipmentMutation,
  useGetTrashSurgicalEquipmentQuery,
  useRestoreSurgicalEquipmentMutation,
  useGetSelectedReviewsQuery,
  useAddProductReviewMutation,
  useGetProductMedicineEquipmentQuery,
  useGetSingleReviewQuery,
  useUpdateReviewMutation,
  useReviewStatusTrueMutation,
  useReviewStatusFalseMutation,
  useGetAllUsesQuery,
  useAddUsesMutation,
  useGetSingleUsesQuery,
  useEditUsesMutation,
  useAddTrashUsesMutation,
  useRestoreTrashUsesMutation,
  useGetAllTrashUsesQuery,
  useDeleteTrashUsesMutation,
  useCopyCategoryMutation,
  useDeleteReviewMutation,
  useGetCouponUsageDataQuery,
  // ---form---
  useGetAllFormQuery,
  useGetAllTrashFormQuery,
  useGetSingleFormQuery,
  useAddFormMutation,
  useEditFormMutation,
  useAddTrashFormMutation,
  useRestoreTrashFormMutation,
  useDeleteTrashFormMutation

} = catalogueEndPoints;
