export function getOrderPage() {
  return `/orders`;
}
export function generateSingleOrderDetailsPage(orderID) {
  return `/all-orders/order-details/${orderID}`;
}
export function getCartPage() {
  return `/cart`;
}
export function getSaveForLaterPage() {
  return `/save-for-later`;
}
export function getCancellationPage() {
  return `/cancellation`;
}
export function generateViewCancellationPage() {
  return `/view-cancellation`;
}
export function getCustomerPage() {
  return `/customer`;
}
export function generateViewCustomerPage() {
  return `/view-customer`;
}
export function getCategoryPage() {
  return `/catalogue/category`;
}
export function getCategoryDeletedItemsPage() {
  return `/catalogue/category-deleted-items`;
}
export function getAddNewCategoryPage() {
  return `/catalogue/add-new-category`;
}
export function generateViewCategoryPage(categoryID) {
  return `/catalogue/category/:${categoryID}`;
}
export function generateEditCategoryPage(categoryID) {
  return `/catalogue/edit-category/:${categoryID}`;
}
export function getCustomFieldPage() {
  return `/catalogue/custom-field`;
}
export function getCustomFieldTrashPage() {
  return `/catalogue/custom-field-deleted-items`;
}
export function getCustomFieldValueTrashPage() {
  return `/catalogue/custom-field-value-deleted-items`;
}
export function getProductPage() {
  return `/catalogue/products`;
}
export function getProductTrashPage() {
  return `/catalogue/product-deleted-items`;
}
export function getAddNewProductPage() {
  return `/catalogue/add-new-product`;
}
export function generateViewProductPage() {
  return `/catalogue/product`;
}
export function generateEditProductPage(productID) {
  return `/catalogue/edit-product/:${productID}`;
}
export function getSurgicalEquipmentPage() {
  return `/catalogue/surgical-equipment`;
}
export function getInventoryPage() {
  return `/stocks/inventory`;
}
export function getInventoryWithoutVariantTrashPage() {
  return `/stocks/inventory-without-variant-delete-items`;
}
export function getInventoryWithVariantTrashPage() {
  return `/stocks/inventory-with-variant-delete-items`;
}
export function generateViewInventoryWithoutVariantPage() {
  return `/stocks/view-inventory-without-variant`;
}
export function generateEditInventoryWithVariantPage() {
  return `/stocks/edit-inventory-without-variant`;
}
export function getCarrierPage() {
  return `/shipping/carrier`;
}
export function getCarrierTrashPage() {
  return `/shipping/carrier-deleted-items`;
}
export function getAddNewCarrierPage() {
  return `/shipping/carrier/add-new-carrier`;
}
export function generateViewCarrierPage(carrierID) {
  return `/shipping/carrier/view-carrier/:${carrierID}`;
}
export function generateEditCarrierCarrierPage(carrierID) {
  return `/shipping/carrier/edit-carrier/:${carrierID}`;
}
export function getShippingZonePage() {
  return `/shipping/shipping-zone`;
}
export function getReturnsPage() {
  return `/returns`;
}
export function getCouponPage() {
  return `/coupon`;
}
export function getDeletedCouponPage() {
  return `/coupon/deleted-coupons`;
}
export function getPromocodePage() {
  return `/offer/promocode`;
}
export function getViewReviewPage() {
  return `/offer/promocode`;
}
export function generateViewReviewPage(reviewID) {
  return `/view-review/:${reviewID}`;
}
export function getAppearancePage() {
  return `/appearance/page`;
}
export function getAddNewAppearancePage() {
  return `/appearance/add-new-page`;
}
export function generateViewAppearancePage(pageID) {
  return `/appearance/view-page/:${pageID}`;
}
export function generateEditAppearancePage(pageID) {
  return `/appearance/edit-page/:${pageID}`;
}
export function getEmailTemplatePage() {
  return `/appearance/email-template`;
}
export function getAddNewEmailTemplatePage() {
  return `/appearance/add-new-email-template`;
}
export function generateEditEmailTemplatePage(templateID) {
  return `/appearance/edit-email-template/:${templateID}`;
}
export function generateViewEmailTemplatePage(templateID) {
  return `/appearance/view-email-template/:${templateID}`;
}
export function getDynamicContentPage() {
  return `/appearance/dynamic-content`;
}
export function getAddNewDynamicContentPage() {
  return `/appearance/add-new-dynamic-content`;
}
export function generateEditDynamicContentPage(contentID) {
  return `/appearance/edit-dynamic-content/:${contentID}`;
}
export function getFaqPage() {
  return `/appearance/faq`;
}
export function getBlogsPage() {
  return `/blogs`;
}
export function getBlogsTrashPage() {
  return `/blogs-deleted-items`;
}
export function getBlogCategoriesPage() {
  return `/blogs/categories`;
}
export function getBlogCategoriesTrashPage() {
  return `/blogs/categories-deleted-items`;
}
export function getAddNewBlogCategoriesPage() {
  return `/blogs/add-categories`;
}
export function generateEditBlogCategoriesPage() {
  return `/blogs/edit-categories`;
}
export function generateViewBlogCategoriesPage() {
  return `/blogs/view-categories`;
}
export function getAddBlogsPage() {
  return `/add-blogs`;
}
export function getBlogTagPage() {
  return `/blogs/tags`;
}
export function getBlogTagViewPage() {
  return `/blogs/view-tags`;
}
export function getSalesBannerPage() {
  return `/appearance/sales-banner`;
}
export function generateEditBlogsPage(blogsID) {
  return `/appearance/edit-blogs/:${blogsID}`;
}
export function generateViewBlogsPage() {
  return `/view-blogs`;
}
export function getTestimonialsPage() {
  return `/cms/testimonials`;
}
export function getAddNewTestimonialsPage() {
  return `/cms/add-testimonials`;
}
export function generateEditTestimonialsPage(testimonialsID) {
  return `/cms/edit-testimonials/:${testimonialsID}`;
}
export function getSpecificationsPage() {
  return `/settings/specifications`;
}
export function getReturnCancellationPOlicyPage() {
  return `/settings/return-cancellation-policies`;
}
export function getSystemSettingsPage() {
  return `/settings/system-setting`;
}

export function getGlobalSettings() {
  return `/settings/global-settings`;
}

export function getDesputeText() {
  return `/settings/desput-text`;
}
export function getSettingClients() {
  return `/settings/clients`;
}

export function getDisputeSupportDesk() {
  return `/support-desk/disputes`;
}

export function getNotification() {
  return "/support-desk/notification";
}
export function getNotificationTrash() {
  return "/support-desk/notification-deleted-items";
}

export function getMessageInbox() {
  return "/message/messages-inbox";
}

export function getMedicinePage() {
  return "/catalogue/medicines";
}
export function getMedicineDeletedPage() {
  return "/catalogue/medicines-deleted-items";
}
export function generateViewMedicinePage() {
  return "/catalogue/view-medicines";
}

export function getProductReview() {
  return `/product-review`;
}
export function getCMSForm() {
  return `/cms/homepage`;
}

export function getCMSPages() {
  return `/cms/pages`;
}

export function getCMSPrivacyPolicy() {
  return `/cms/privacy-policy`;
}

export function getCMSTermsCondition() {
  return `/cms/terms-condition`;
}

export function getCMSShippingPolicy() {
  return `/cms/grievance-redressal-policy`;
}

export function getCMSReturnRefundPolicy() {
  return `/cms/refund-return-policy`;
}

export function getCMSCustomerSupportPolicy() {
  return `/cms/cancellation-policy`;
}

export function getSubscriber() {
  return `/subscribers`;
}

export function getPushNotification() {
  return `/push-notification`;
}
export function getTrashPushNotification() {
  return `/push-notification-deleted-items`;
}
export function getReviewsPage() {
  return `/reviews`;
}
export function getCurrencySettings() {
  return `/currency-settings`;
}

export function getSEOPage() {
  return `/seo`;
}

export function getContactEnquiry() {
  return `/contact-enquiries`;
}
export function getPrescriptionRequest() {
  return `/prescription-request`;
}
export function ProductsEnquiries() {
  return `/products-enquiries`;
}

export function getTags() {
  return `/tags`;
}
export function getManufacturerDeletedItem() {
  return `/marketer-manufacturer-deleted-item`;
}
export function getBrandDeletedItem() {
  return `/brand-deleted-items`;
}
export function getSurgicalEquipmentTrashPage() {
  return `/catalogue/surgical-equipment/trash-surgical-equipment`;
}
export function getContactUsPage() {
  return `/cms/contact-us`;
}
export function getCareersPage() {
  return `/cms/career`;
}

export function getAboutUsPage() {
  return `/cms/about-us`;
}

export function getJobApplication() {
  return `/cms/job-position`;
}

export function getJobApplicationReceived() {
  return `/cms/job-application-received`;
}

export function getMediaList() {
  return `/media-list`;
}

export function getUsesList() {
  return `/catalogue/uses`;
}
export function getFormList() {
  return `/catalogue/form`;
}

export function getDisputeList() {
  return "/dispute"
}

export function getStaffPermissions() {
  return `/staff-permissions`
}
export function getNotFoundPages() {
  return `/not-found-searches`
}
export function getAllPopups() {
  return `/pop-ups`
}

export function getLoginData() {
  return `/staff-login`
}

export function getAddPopUp() {
  return `/add-pop-up`
}

export function getReviewMedicineList() {
  return `/review-medicine-list`
}

export function getCouponPageContent() {
  return `/coupon-page`
}

export function getBlogComments() {
  return `/blog-comments`
}
export function getCouponUsagePage() {
  return `/coupon-usage`
}

