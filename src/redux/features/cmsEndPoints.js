import { catalogueSlice } from "../services/catalogueSlice";

export const cmsEndPoints = catalogueSlice.injectEndpoints({
  endpoints: (builder) => ({
    // ----------------homePage---------------
    addUpdateHomePage: builder.mutation({
      query: ({ formType }) => ({
        url: `/add-home-page`,
        method: "POST",
        body: formType,
      }),
    }),
    getHomePage: builder.query({
      query: () => `get-home-page`,
    }),
    // ---------------sales banner-------------
    getSalesBanner: builder.query({
      query: () => `/get-sales-banner`,
    }),
    getSalesBannerID: builder.query({
      query: (bannerID) => `/get-sales-banner/${bannerID}`,
    }),
    getTrashSalesBanner: builder.query({
      query: () => `/get-sales-banner-trash`,
    }),
    updateSalesBanner: builder.mutation({
      query: ({ formType, bannerID }) => ({
        url: `/update-sales-banner/${bannerID}`,
        method: "PUT",
        body: formType,
      }),
    }),
    addSalesBanner: builder.mutation({
      query: (formType) => ({
        url: `/add-sales-banner`,
        method: "POST",
        body: formType,
      }),
    }),
    softDeleteSalesBanner: builder.mutation({
      query: ({ formType, bannerID }) => ({
        url: `/trash-sales-banner/${bannerID}`,
        method: "PUT",
        body: formType,
      }),
    }),
    restoreSalesBanner: builder.mutation({
      query: ({ formType, bannerID }) => ({
        url: `/restore-sales-banner/${bannerID}`,
        method: "PUT",
        body: formType,
      }),
    }),
    deleteSalesBanner: builder.mutation({
      query: ({ formType, bannerID }) => ({
        url: `/delete-sales-banner/${bannerID}`,
        method: "DELETE",
        body: formType,
      }),
    }),

    // ------------testimonials----------------
    getTestimonials: builder.query({
      query: () => `/get-testimonial`,
    }),
    getTestimonialsID: builder.query({
      query: (testimonialID) => `/get-testimonial/${testimonialID}`,
    }),
    getTrashTestimonials: builder.query({
      query: () => `/get-trash-testimonial`,
    }),
    updateTestimonials: builder.mutation({
      query: ({ formType, testimonialID }) => ({
        url: `/update-testimonial/${testimonialID}`,
        method: "PUT",
        body: formType,
      }),
    }),
    addTestimonials: builder.mutation({
      query: (formType) => ({
        url: `/add-testimonial`,
        method: "POST",
        body: formType,
      }),
    }),
    softDeleteTestimonials: builder.mutation({
      query: ({ formType, testimonialID }) => ({
        url: `/soft-delete-testimonial/${testimonialID}`,
        method: "PUT",
        body: formType,
      }),
    }),
    restoreTestimonials: builder.mutation({
      query: ({ formType, testimonialID }) => ({
        url: `/restore-testimonial/${testimonialID}`,
        method: "PUT",
        body: formType,
      }),
    }),
    deleteTestimonials: builder.mutation({
      query: ({ formType, testimonialID }) => ({
        url: `/delete-testimonial/${testimonialID}`,
        method: "DELETE",
        body: formType,
      }),
    }),
    // --------------------customer Support policy--------------------------
    addCustomerSupportPolicy: builder.mutation({
      query: (formData) => ({
        url: `/add-customer-support-policy`,
        method: "POST",
        body: formData,
      }),
    }),
    getCustomerSupportrPolicy: builder.query({
      query: () => `/get-customer-support-policy`,
    }),
    // ------------------------refund-return-policy-----------------------------
    addRefundReturnPolicy: builder.mutation({
      query: (formData) => ({
        url: `/add-refund-return-policy`,
        method: "POST",
        body: formData,
      }),
    }),
    getRefundReturnPolicy: builder.query({
      query: () => `/get-refund-return-policy`,
    }),
    // ------------------------refund-return-policy-----------------------------
    addShippingPolicy: builder.mutation({
      query: (formData) => ({
        url: `/add-shipping-policy`,
        method: "POST",
        body: formData,
      }),
    }),
    getShippingPolicy: builder.query({
      query: () => `/get-shipping-policy`,
    }),
    // ------------------------terms and condition-----------------------------
    addTermsCondition: builder.mutation({
      query: (formData) => ({
        url: `/add-term-condition-policy`,
        method: "POST",
        body: formData,
      }),
    }),
    getTermsCondition: builder.query({
      query: () => `/get-term-condition-policy`,
    }),
    // --------------privacy policy---------------
    addPrivacyPolicy: builder.mutation({
      query: (formData) => ({
        url: `/add-privacy-policy`,
        method: "POST",
        body: formData,
      }),
    }),
    getPrivacyPolicy: builder.query({
      query: () => `/get-privacy-policy`,
    }),

    // --------------contact us---------------
    addContactUs: builder.mutation({
      query: (formData) => ({
        url: `/add-update-contact-us`,
        method: "POST",
        body: formData,
      }),
    }),
    getContactUs: builder.query({
      query: () => `/get-contact-us`,
    }),

    // ----------------career-------------------
    addCareerPage: builder.mutation({
      query: (formData) => ({
        url: `/add-update-career`,
        method: "POST",
        body: formData,
      }),
    }),
    getCareerPage: builder.query({
      query: () => `/get-career`,
    }),

    //---------------about us---------------------
    addAboutUs: builder.mutation({
      query: (formData) => ({
        url: `/add-update-about-us`,
        method: "POST",
        body: formData,
      }),
    }),
    getAboutUs: builder.query({
      query: () => `/get-about-us`,
    }),

    //job position
    addJobPosition: builder.mutation({
      query: (formData) => ({
        url: `/add-position`,
        method: "POST",
        body: formData,
      }),
    }),
    getJobPosition: builder.query({
      query: () => `/all-position`,
    }),
    updateJobPosition: builder.mutation({
      query: ({ positionId, positionData }) => ({
        url: `/update-position/${positionId}`,
        method: "PUT",
        body: positionData,
      }),
    }),
    getJobPositionId: builder.query({
      query: (positionId) => `/position-by-id/${positionId}`,
    }),
    deletejobPosition: builder.mutation({
      query: (positionId) => ({
        url: `/delete-position/${positionId}`,
        method: "DELETE",
      }),
    }),

    //job applocation
    getAllJobApplication: builder.query({
      query: () => `all-application`,
    }),
    deleteJobApplication: builder.mutation({
      query: (applicationId) => ({
        url: `/delete-application/${applicationId}`,
        method: `DELETE`,
      }),
    }),
    addUpdateCouponPageContent: builder.mutation({
      query: (formData) => ({
        url: `/add-coupon-page-content`,
        method: "POST",
        body: formData,
      })
    }),
    getCouponPageContent: builder.query({
      query: () => `/get-coupon-page-content`,
    })
  }),
});

export const {
  // home page
  useAddUpdateHomePageMutation,
  useGetHomePageQuery,

  // sales banner
  useGetSalesBannerQuery,
  useUpdateSalesBannerMutation,
  useAddSalesBannerMutation,
  useGetSalesBannerIDQuery,
  useSoftDeleteSalesBannerMutation,
  useRestoreSalesBannerMutation,
  useGetTrashSalesBannerQuery,
  useDeleteSalesBannerMutation,

  // testimonials
  useGetTestimonialsQuery,
  useGetTestimonialsIDQuery,
  useGetTrashTestimonialsQuery,
  useUpdateTestimonialsMutation,
  useAddTestimonialsMutation,
  useSoftDeleteTestimonialsMutation,
  useRestoreTestimonialsMutation,
  useDeleteTestimonialsMutation,

  // customer support policy
  useAddCustomerSupportPolicyMutation,
  useGetCustomerSupportrPolicyQuery,

  //refund return policy
  useAddRefundReturnPolicyMutation,
  useGetRefundReturnPolicyQuery,

  //shipping policy
  useAddShippingPolicyMutation,
  useGetShippingPolicyQuery,

  //terms condition
  useAddTermsConditionMutation,
  useGetTermsConditionQuery,

  //Provacy Policy
  useAddPrivacyPolicyMutation,
  useGetPrivacyPolicyQuery,

  //contact us
  useAddContactUsMutation,
  useGetContactUsQuery,

  // career page
  useAddCareerPageMutation,
  useGetCareerPageQuery,

  //------------about us---------------
  useAddAboutUsMutation,
  useGetAboutUsQuery,

  //job position
  useAddJobPositionMutation,
  useGetJobPositionQuery,
  useUpdateJobPositionMutation,
  useGetJobPositionIdQuery,
  useDeletejobPositionMutation,

  //job application
  useGetAllJobApplicationQuery,
  useDeleteJobApplicationMutation,

  //coupon page content
  useAddUpdateCouponPageContentMutation,
  useGetCouponPageContentQuery
} = cmsEndPoints;
