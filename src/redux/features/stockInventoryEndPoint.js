import { catalogueSlice } from "../services/catalogueSlice";

export const stockInventoryEndPoint = catalogueSlice.injectEndpoints({
  endpoints: (builder) => ({
    getAllInventoryWithoutVariant: builder.query({
      query: ({ medicinepage, medicinelimit, medicinesearch, productlimit, productpage, productsearch, equipmentpage, equipmentlimit, equipmentsearch }) => `/get-inventory-without-varient?medicinepage=${medicinepage}&medicinelimit=${medicinelimit}&medicinesearch=${medicinesearch}&productlimit=${productlimit}&productpage=${productpage}&productsearch=${productsearch}&equipmentpage=${equipmentpage}&equipmentlimit=${equipmentlimit}&equipmentsearch=${equipmentsearch}`,
    }),
    getSingleInventoryWithoutVariant: builder.query({
      query: (inventoryWithoutVarientId) =>
        `/get-inventory-without-varient/${inventoryWithoutVarientId}`,
    }),
    getDeletedInventoryWithoutVariant: builder.query({
      query: () => `/get-trash-inventory-without-varient`,
    }),
    addInventoryWithoutVariant: builder.mutation({
      query: (inventoryWithoutVarientData) => ({
        url: `/add-inventory-without-varient`,
        method: "POST",
        body: inventoryWithoutVarientData,
      }),
    }),
    editInventoryWithoutVariant: builder.mutation({
      query: ({ inventoryWithoutVarientData, inventoryWithoutVarientId }) => ({
        url: `/update-inventory-without-varient/${inventoryWithoutVarientId}`,
        method: "PUT",
        body: inventoryWithoutVarientData,
      }),
    }),
    deleteInventoryWithoutVariant: builder.mutation({
      query: ({ inventoryWithoutVarientId }) => ({
        url: `/add-trash-inventory-without-varient/${inventoryWithoutVarientId}`,
        method: "PUT",
      }),
    }),
    permanentDeleteInventoryWithoutVariant: builder.mutation({
      query: ({ inventoryWithoutVarientId }) => ({
        url: `/delete-inventory-without-varient/${inventoryWithoutVarientId}`,
        method: "DELETE",
      }),
    }),
    restoreInventoryWithoutVariant: builder.mutation({
      query: ({ inventoryWithoutVarientId }) => ({
        url: `/restore-inventory-without-varient/${inventoryWithoutVarientId}`,
        method: "PUT",
      }),
    }),
    getSearchProductMedicine: builder.query({
      query: (productName) =>
        `/get-product-medicine?product_name=${productName}`,
    }),
    getAllInventoryWithVariant: builder.query({
      query: () => `/get-inventory-varients`,
    }),
    getInventoryAttributes: builder.query({
      query: ({ modelType, modelId }) =>
        `get-inventory-attributes/${modelType}/${modelId}`,
    }),
    addInventoryWithVariant: builder.mutation({
      query: (inventoryWithVarient) => ({
        url: `/add-inventory-varients`,
        method: "POST",
        body: inventoryWithVarient,
      }),
    }),
    getInventoryVariants: builder.query({
      query: ({ modelType, modelId }) =>
        `/get-varients/${modelType}/${modelId}`,
    }),
    getTrashVariant: builder.query({
      query: () => `/get-trash-variant`,
    }),
    addTrashVariant: builder.mutation({
      query: ({ modelType, modelId }) => ({
        url: `/add-trash-variant/${modelType}/${modelId}`,
        method: "PUT",
      }),
    }),
    deleteTrashVariant: builder.mutation({
      query: ({ modelType, modelId }) => ({
        url: `/delete-trash-variant/${modelType}/${modelId}`,
        method: "DELETE",
      }),
    }),
    restoreTrashVariant: builder.mutation({
      query: ({ modelType, modelId }) => ({
        url: `/restore-trash-variant/${modelType}/${modelId}`,
        method: "PUT",
      }),
    }),
    updateInventoryWithVariant: builder.mutation({
      query: ({ modelType, modelId, formData }) => ({
        url: `/update-varients/${modelType}/${modelId}`,
        method: "PUT",
        body: formData,
      })
    }),
    getInventoryReport: builder.query({
      query: ({ medicinepage, medicinelimit, medicinesearch, productlimit, productpage, productsearch, equipmentpage, equipmentlimit, equipmentsearch, fromDate, toDate }) => `/get-inventory-report?medicinepage=${medicinepage}&medicinelimit=${medicinelimit}&medicinesearch=${medicinesearch}&productlimit=${productlimit}&productpage=${productpage}&productsearch=${productsearch}&equipmentpage=${equipmentpage}&equipmentlimit=${equipmentlimit}&equipmentsearch=${equipmentsearch}&fromDate=${fromDate}&toDate=${toDate}`
    }),
    updateInventoryBulkUpload: builder.mutation({
      query: (formData) => ({
        url: `/update-inventory-without-variant`,
        method: "POST",
        body: formData,
      })
    }),
    updateInventoryWithVariantBulkUpload: builder.mutation({
      query: (formData) => ({
        url: `/update-inventory-with-variant`,
        method: "POST",
        body: formData,
      })
    })
  }),
});

export const {
  useGetAllInventoryWithoutVariantQuery,
  useGetDeletedInventoryWithoutVariantQuery,
  useGetSingleInventoryWithoutVariantQuery,
  useAddInventoryWithoutVariantMutation,
  useEditInventoryWithoutVariantMutation,
  useDeleteInventoryWithoutVariantMutation,
  usePermanentDeleteInventoryWithoutVariantMutation,
  useRestoreInventoryWithoutVariantMutation,
  useLazyGetSearchProductMedicineQuery,
  useGetAllInventoryWithVariantQuery,
  useGetInventoryAttributesQuery,
  useAddInventoryWithVariantMutation,
  useGetInventoryWithVariantMutation,
  useGetInventoryVariantsQuery,
  useGetTrashVariantQuery,
  useAddTrashVariantMutation,
  useDeleteTrashVariantMutation,
  useRestoreTrashVariantMutation,
  useUpdateInventoryWithVariantMutation,
  useGetInventoryReportQuery,
  useUpdateInventoryBulkUploadMutation,
  useUpdateInventoryWithVariantBulkUploadMutation
} = stockInventoryEndPoint;
