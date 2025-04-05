import { getAppearancePage, getBlogsPage, getCancellationPage, getCarrierPage, getCartPage, getCategoryPage, getCustomFieldPage, getCustomerPage, getDynamicContentPage, getEmailTemplatePage, getFaqPage, getInventoryPage, getOrderPage, getProductPage, getReturnCancellationPOlicyPage, getReturnsPage, getReviewsPage, getSalesBannerPage, getSaveForLaterPage, getShippingZonePage, getSpecificationsPage, getTestimonialsPage, getSystemSettingsPage, getGlobalSettings, getDesputeText, getSettingClients, getDisputeSupportDesk, getNotification, getMessageInbox, getMedicinePage, getProductReview, getCMSForm, getCMSPages, getCMSPrivacyPolicy, getCMSTermsCondition, getCMSShippingPolicy, getCMSReturnRefundPolicy, getCMSCustomerSupportPolicy, getSubscriber, getPushNotification, getCurrencySettings, getSEOPage, getAddBlogsPage, getContactEnquiry, getTags, getPrescriptionRequest, ProductsEnquiries, getBlogCategoriesPage, getAddNewBlogCategoriesPage, getManufacturerDeletedItem, getSurgicalEquipmentPage, getBrandDeletedItem, getCategoryDeletedItemsPage, getCustomFieldTrashPage, getCustomFieldValueTrashPage, getDeletedCouponPage, getProductTrashPage, getMedicineDeletedPage, getBlogCategoriesTrashPage, getBlogTagPage, getBlogTagViewPage, getBlogsTrashPage, getNotificationTrash, getInventoryWithoutVariantTrashPage, getInventoryWithVariantTrashPage, getCarrierTrashPage, getTrashPushNotification, getContactUsPage, getCareersPage, getAboutUsPage, getJobApplication, getJobApplicationReceived, getMediaList, getUsesList, getFormList, getDisputeList, getStaffPermissions, getNotFoundPages, getAllPopups, getLoginData, getReviewMedicineList, getCouponPageContent, getCouponPage, getBlogComments, getCouponUsagePage } from "../utils/routes";

export const MENUITEMS = [
  {
    menutitle: "MAIN",
    Items: [
      {
        path: `${import.meta.env.BASE_URL}dashboard`,
        icon: "home",
        type: "link",
        active: false,
        title: "Dashboard",
      },
    ],
  },
  {
    Items: [
      {
        title: "Order Management",
        icon: "check-circle",
        type: "sub",
        active: false,
        children: [
          {
            path: `/all-orders`,
            type: "link",
            title: "All Orders",
            active: false,
            permission: "view",
            related_fields: [
              "/all-orders/order-details/:id"
            ],
            model: 'Order',
            show: (role, permissions) =>
              role === "Admin" || (role === "Staff" && permissions.Order.includes("view")),
          },
          {
            path: `${getDisputeList()}`,
            icon: "rotate-cw",
            type: "link",
            title: "Service Request Against Order",
            related_fields: [
              "/dispute/view-disputes/:id"
            ],
            active: false,
            permission: "view",
            model: 'NeedHelp',
            show: (role, permissions) =>
              role === "Admin" || (role === "Staff" && permissions.NeedHelp.includes("view")),
          }
        ],
      },
    ],
  },
  {
    Items: [
      {
        path: `${getCartPage()}`,
        icon: "shopping-cart",
        type: "link",
        title: "Abandoned Cart",
        active: false,
        permission: "view",
        model: 'Cart',
        show: (role, permissions) =>
          role === "Admin" || (role === "Staff" && permissions.Cart.includes("view")),
      },
    ],
  },
  {
    Items: [
      {
        title: "Catalogue",
        icon: "book-open",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getProductPage()}`,
            title: "General Product",
            related_fields: [
              "/catalogue/add-new-product",
              "/catalogue/product/:id",
              "/catalogue/edit-product/:id",
              "/catalogue/product-deleted-items"
            ],
            type: "link",
            active: false,
            permission: "view",
            model: 'Product',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Product.includes("view"))
          },
          {
            path: `${getMedicinePage()}`,
            title: "Medicine",
            type: "link",
            related_fields: [
              "/catalogue/add-medicines",
              "/catalogue/view-medicines/:id",
              "/catalogue/edit-medicines/:id",
              "/catalogue/medicines-deleted-items"
            ],
            active: false,
            permission: "view",
            model: 'Medicine',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Medicine.includes("view"))
          },

          {
            path: `${getReviewMedicineList()}`,
            // icon: "check-circle",
            viewPath: ``,
            type: "link",
            related_fields: [
              "/view-review-medicine/:id",
            ],
            active: false,
            title: "Review Medicine",
            permission: "reviewer",
            model: 'Medicine',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions?.Medicine?.includes("reviewer"))
          },

          {
            path: `${getSurgicalEquipmentPage()}`,
            title: "Surgical Equipments",
            type: "link",
            related_fields: [
              "/catalogue/surgical-equipment/add-surgical-equipment",
              "/catalogue/surgical-equipment/edit-surgical-equipment/:id",
              "/catalogue/surgical-equipment/view-surgical-equipment/:id",
              "/catalogue/surgical-equipment/trash-surgical-equipment"
            ],
            active: false,
            permission: "view",
            model: 'Sergical_Equipment',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Sergical_Equipment.includes("view"))
          },
          {
            path: `${getCategoryPage()}`,
            title: "Category",
            active: false,
            related_fields: [
              "/catalogue/add-new-category",
              "/catalogue/edit-category/:id",
              "/catalogue/category/:id",
              "/catalogue/category-deleted-items"
            ],
            type: "link",
            permission: "view",
            model: 'Category',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Category.includes("view"))
          },
          {
            path: `${getCustomFieldPage()}`,
            title: "Custom Fields",
            active: false,
            related_fields: [
              "/catalogue/custom-field-deleted-items",
              "catalogue/custom-field-value/:id",
              "/catalogue/custom-field-value-deleted-items/:id"
            ],
            type: "link",
            permission: "view",
            model: 'CustomFiled',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.CustomFiled.includes("view"))
          },
          {
            path: `${getTags()}`,
            title: "Tags",
            type: "link",
            active: false,
            permission: "view",
            model: 'Tags',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Tags.includes("view"))
          },
          {
            path: `${import.meta.env.BASE_URL}marketer-manufacturer`,
            icon: "home",
            type: "link",
            active: false,
            related_fields: [
              "/marketer-manufacturer-deleted-item"
            ],
            title: "Marketer/Manufacturer",
            permission: "view",
            model: 'Marketer',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Marketer.includes("view"))
          },
          {
            path: `${import.meta.env.BASE_URL}brand`,
            viewPath: `/view-brand/`,
            editPath: `/edit-brand/`,
            addNewPath: `/add-brand`,
            deletedPath: `${getBrandDeletedItem()}`,
            type: "link",
            related_fields: [
              '/view-brand/:id',
              '/edit-brand/:id',
              '/add-brand',
              '/brand-deleted-items'
            ],
            active: false,
            title: "Brand",
            permission: "view",
            model: 'Brand',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Brand.includes("view"))
          },
          {
            path: `${getReviewsPage()}`,
            type: "link",
            active: false,
            title: "Reviews",
            related_fields: [
              "/product-review",
              "/product-reviews/:type/:id",
              "/view-review/Medicine/:id/:One",
              "/edit-review/Medicine/:id/:One"
            ],
            permission: "view",
            model: 'Review',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Review.includes("view"))
          },
          {
            path: `${getCouponPage()}`,
            title: "Coupons",
            type: "link",
            related_fields: [
              "/add-new-coupon",
              "/coupon/deleted-coupons",
              "/edit-coupon/:id",
              "/view-coupon/:id"
            ],
            active: false,
            deletedPath: `${getDeletedCouponPage()}`,
            permission: "view",
            model: 'Coupons',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Coupons.includes("view"))
          },
          {
            path: `${getCouponUsagePage()}`,
            title: "Coupon History",
            type: "link",
            // viewPath: `/view-coupon/`,
            // editPath: `/edit-coupon/`,
            // addNewPath: `/add-new-coupon`,
            active: false,
            deletedPath: `${getDeletedCouponPage()}`,
            permission: "view",
            model: 'Coupons',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Coupons.includes("view"))
          },
          {
            path: `${getUsesList()}`,
            title: "Uses",
            type: "link",
            active: false,
            related_fields: [
              "/catalogue/trash-uses"
            ],
            permission: "view",
            model: 'Uses',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Uses.includes("view"))
          },
          {
            path: `${getFormList()}`,
            title: "Form",
            type: "link",
            related_fields: [
              "/catalogue/trash-form"
            ],
            active: false,
            permission: "view",
            model: 'Form',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Form.includes("view"))
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Inventory",
        icon: "trending-up",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}stocks/inventory`,
            related_fields: [
              "/stocks/inventory-without-variant-delete-items",
              "/stocks/edit-inventory-without-variant/:id",
              "/stocks/view-inventory-without-variant/:id",
              "/stocks/add-inventory-without-variant/:id",
              "/stocks/inventory-with-variant-delete-items",
              "/inventor/edit-invertory-with-varient/:type/:id",
              "/stocks/view-inventory-without-variant/:id"
            ],
            active: false,
            title: "Medicine Inventory",
            permission: "view",
            model: 'InvertoryWithoutVarient',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view"))
          },
          {
            path: `${import.meta.env.BASE_URL}stocks/general-product-inventory`,
            active: false,
            title: "General Product Inventory",
            permission: "view",
            model: 'InvertoryWithoutVarient',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view"))
          },
          {
            path: `${import.meta.env.BASE_URL}stocks/surgical-equipment-inventory`,
            active: false,
            title: "Surgical Equipment Inventory",
            permission: "view",
            model: 'InvertoryWithoutVarient',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view"))
          },
        ],
      },
    ],
  },

  {
    Items: [
      {
        title: "Inventory Reporting",
        icon: "trending-up",
        type: "sub",
        active: false,
        children: [
          {
            path: `${import.meta.env.BASE_URL}inventory-report/medicine`,
            // viewPath: `/stocks/view-inventory-without-variant/`,
            // deletedPath: `${getInventoryWithoutVariantTrashPage()}`,
            // deletedWithVariantPath: `${getInventoryWithVariantTrashPage()}`,
            // viewWithVariantPath: `/inventor/view-invertory-with-varient/`,
            // editPath: `/stocks/edit-inventory-without-variant/`,
            // editWithVariantPath: `/inventor/list-variant-edit/`,
            // addNewPath: `/stocks/add-inventory-without-variant/`,
            // addwithvariantPath: `/inventor/add-invertory-with-varient`,
            active: false,
            title: "Medicine Inventory Reporting",
            permission: "view",
            model: 'InvertoryWithoutVarient',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view"))
          },
          {
            path: `${import.meta.env.BASE_URL}inventory-report/product`,
            // viewPath: `/stocks/view-inventory-without-variant/`,
            // deletedPath: `${getInventoryWithoutVariantTrashPage()}`,
            // deletedWithVariantPath: `${getInventoryWithVariantTrashPage()}`,
            // viewWithVariantPath: `/inventor/view-invertory-with-varient/`,
            // editPath: `/stocks/edit-inventory-without-variant/`,
            // editWithVariantPath: `/inventor/list-variant-edit/`,
            // addNewPath: `/stocks/add-inventory-without-variant/`,
            // addwithvariantPath: `/inventor/add-invertory-with-varient`,
            active: false,
            title: "Product Inventory Reporting",
            permission: "view",
            model: 'InvertoryWithoutVarient',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view"))
          },
          {
            path: `${import.meta.env.BASE_URL}inventory-report/equipment`,
            // viewPath: `/stocks/view-inventory-without-variant/`,
            // deletedPath: `${getInventoryWithoutVariantTrashPage()}`,
            // deletedWithVariantPath: `${getInventoryWithVariantTrashPage()}`,
            // viewWithVariantPath: `/inventor/view-invertory-with-varient/`,
            // editPath: `/stocks/edit-inventory-without-variant/`,
            // editWithVariantPath: `/inventor/list-variant-edit/`,
            // addNewPath: `/stocks/add-inventory-without-variant/`,
            // addwithvariantPath: `/inventor/add-invertory-with-varient`,
            active: false,
            title: "Equipment Inventory Reporting",
            permission: "view",
            model: 'InvertoryWithoutVarient',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.InvertoryWithoutVarient.includes("view"))
          },

        ],
      },
    ],
  },

  {
    Items: [
      {
        title: "Shipping",
        icon: "truck",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getCarrierPage()}`,
            related_fields: [
              "/shipping/carrier-deleted-items",
              "/shipping/carrier/edit-carrier/:id",
              "/shipping/carrier/view-carrier/:id",
              "/shipping/carrier/add-new-carrier"
            ],
            title: "Carrier",
            type: "link",
            active: false,
            permission: "view",
            model: 'Carrier',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Carrier.includes("view"))
          },
          {
            path: `${getShippingZonePage()}`,
            title: "Shipping Zone",
            type: "link",
            active: false,
            permission: "view",
            model: 'ShippingZone',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.ShippingZone.includes("view"))
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Customer Data",
        icon: "user",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getCustomerPage()}`,
            related_fields: [
              "/add-new-customer",
              "/edit-customer/:id",
              "/view-customer/:id"
            ],
            type: "link",
            active: false,
            title: "Customer",
            permission: "view",
            model: 'User',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.User.includes("view"))
          },
          {
            path: `${getSubscriber()}`,
            type: "link",
            active: false,
            title: "Subscribers",
            permission: "view",
            model: 'Subscriber',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Subscriber.includes("view"))
          },
          {
            path: `${getContactEnquiry()}`,
            type: "link",
            active: false,
            title: "Contact Enquiries",
            permission: "view",
            model: 'Contact',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Contact.includes("view"))
          },
          {
            path: `${ProductsEnquiries()}`,
            type: "link",
            active: false,
            title: "Product Enquiries",
            permission: "view",
            model: 'ProductEnquiry',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.ProductEnquiry.includes("view"))
          },
          {
            path: `${getPrescriptionRequest()}`,
            type: "link",
            active: false,
            title: "Prescription Request",
            permission: "view",
            model: 'PrescriptionRequest',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.PrescriptionRequest.includes("view"))
          },
        ]
      }
    ],
  },
  {
    Items: [
      {
        title: "Blogs",
        icon: "edit",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getBlogsPage()}`,
            title: "All Posts",
            type: "link",
            related_fields: [
              "/blogs-deleted-items",
              "/edit-blogs/:id",
              "/view-blogs/:id"
            ],
            permission: "view",
            model: 'Blog',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Blog.includes("view"))
          },
          {
            path: `${getAddBlogsPage()}`,
            title: "Add New Post",
            type: "link",
            permission: "add",
            model: 'Blog',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Blog.includes("add"))
          },
          {
            path: `${getBlogCategoriesPage()}`,
            title: "Categories",
            related_fields: [
              "/blogs/categories-deleted-items",
              "/blogs/view-categories/:id",
              "/blogs/edit-categories/:id",
              "/blogs/add-categories"
            ],
            type: "link",
            permission: "view",
            model: 'BlogCategory',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.BlogCategory.includes("view"))
          },
          {
            path: `${getBlogTagPage()}`,
            title: "Tags",
            viewPath: `/blogs/view-tags/`,
            editPath: `/blogs/edit-categories/`,
            addNewPath: `${getAddNewBlogCategoriesPage()}`,
            deletedPath: `${getBlogsTrashPage()}`,
            type: "link",
            permission: "view",
            model: 'BlogTags',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.BlogTags.includes("view"))
          },
          {
            path: `${getBlogComments()}`,
            title: "Comments",
            // viewPath: `/blogs/view-tags/`,
            // editPath: `/blogs/edit-categories/`,
            // addNewPath: `${getAddNewBlogCategoriesPage()}`,
            // deletedPath: `${getBlogsTrashPage()}`,
            type: "link",
            permission: "view",
            model: 'Blog',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.BlogTags.includes("view"))
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Settings",
        icon: "settings",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getGlobalSettings()}`,
            title: "Global Settings",
            type: "link",
            permission: "view",
            model: 'Global',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Global.includes("view"))
          },
          {
            path: `${getCurrencySettings()}`,
            type: "link",
            icon: "dollar-sign",
            active: false,
            title: "Currency Settings",
            permission: "view",
            model: 'Global',
            show: (role, permissions) => role === "Admin" || (role === "ExchangeRates" && permissions.Global.includes("view"))
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "Support Desk",
        icon: "aperture",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getNotification()}`,
            title: "Email Notification",
            related_fields: [
              "/support-desk/notification-deleted-items",
              "/notification/edit-notification/:id",
              "/notification/add-notification"
            ],
            type: "link",
            permission: "view",
            model: 'Notification',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Notification.includes("view"))
          },
          {
            path: `${getPushNotification()}`,
            related_fields: [
              "/push-notification-deleted-items",
              "/push-notification/add-push-notification",
              "/push-notification/edit-push-notification/:id"
            ],
            title: "Push Notification",
            deletedPath: `${getTrashPushNotification()}`,
            type: "link",
            permission: "view",
            model: 'PushNotification',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.PushNotification.includes("view"))
          },
        ],
      },
    ],
  },
  {
    Items: [
      {
        title: "CMS",
        icon: "settings",
        type: "sub",
        active: false,
        children: [
          {
            path: `${getCMSForm()}`,
            title: "Home Page",
            type: "link",
            permission: "view",
            model: 'Home_Page',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Home_Page.includes("view"))
          },
          {
            path: `${getSalesBannerPage()}`,
            title: "Sales Banner",
            related_fields: [
              "/appearance/trash-sales-banner",
              ""
            ],
            type: "link",
            permission: "view",
            model: 'SalesBanner',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.SalesBanner.includes("view"))
          },
          {
            path: `${getAboutUsPage()}`,
            title: "About Us",
            type: "link",
            permission: "view",
            model: 'AboutUs',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.AboutUs.includes("view"))
          },
          {
            path: `${getContactUsPage()}`,
            title: "Contact us",
            type: "link",
            permission: "view",
            model: 'ContactUs',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.ContactUs.includes("view"))
          },
          {
            path: `${getTestimonialsPage()}`,
            title: "Testimonials",
            related_fields: [
              "/cms/add-testimonials",
              "/cms/trash-testimonials",
              "/cms/edit-testimonials/:id"
            ],
            type: "link",
            permission: "view",
            model: 'Testimonial',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Testimonial.includes("view"))
          },
          {
            path: `${getCareersPage()}`,
            title: "Career",
            type: "link",
            permission: "view",
            model: 'Career',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Career.includes("view"))
          },
          {
            path: `${getJobApplication()}`,
            title: "Job Position",
            related_fields: [
              "/cms/job-position/add",
              "/cms/job-position/view/:id",
              "/cms/job-position/edit/:id"
            ],
            type: "link",
            permission: "view",
            model: 'Position',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Position.includes("view"))
          },
          {
            path: `${getCMSPrivacyPolicy()}`,
            title: "Privacy-Policy",
            type: "link",
            permission: "view",
            model: 'Privacy_policy',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Privacy_policy.includes("view"))
          },
          {
            path: `${getCMSTermsCondition()}`,
            title: "Terms & Conditions",
            type: "link",
            permission: "view",
            model: 'Term_condition',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Term_condition.includes("view"))
          },
          {
            path: `${getCMSShippingPolicy()}`,
            title: "Grievance Redressal Policy",
            type: "link",
            permission: "view",
            model: 'Shipping_policy',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Shipping_policy.includes("view"))
          },
          {
            path: `${getCMSReturnRefundPolicy()}`,
            title: "Refund & Return Policy",
            type: "link",
            permission: "view",
            model: 'Refund_return',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Refund_return.includes("view"))
          },
          {
            path: `${getCMSCustomerSupportPolicy()}`,
            title: "Cancellation Policy",
            type: "link",
            permission: "view",
            model: 'Customer_support',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Customer_support.includes("view"))
          },
          {
            path: `${getJobApplicationReceived()}`,
            title: "Job Application Received",
            type: "link",
            permission: "view",
            model: 'Application',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Application.includes("view"))
          },
          {
            path: `${getCouponPageContent()}`,
            title: "Coupon Page",
            type: "link",
            permission: "view",
            model: 'CouponPageContent',
            show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.CouponPageContent.includes("view"))
          },
        ],
      },

    ],
  },
  {
    Items: [
      {
        path: `${getMediaList()}`,
        icon: "image",
        type: "link",
        active: false,
        title: "Media Uploaded",
        permission: "view",
        model: 'Media',
        show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Media.includes("view"))
      },
    ],
  },
  {
    Items: [
      {
        path: `${getStaffPermissions()}`,
        icon: "lock",
        viewPath: ``,
        type: "link",
        related_fields: [
          "/add-staff-permissions",
          "/view-staff-permissions/:id",
          "/edit-staff-permissions/:id"
        ],
        active: false,
        title: "Staff Permissions",
        permission: "view",
        model: 'StaffLogin',
        show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.StaffLogin.includes("view"))
      },
    ],
  },
  {
    Items: [
      {
        path: `${getNotFoundPages()}`,
        icon: "x-circle",
        viewPath: ``,
        type: "link",
        active: false,
        title: "Not Found Searches",
        permission: "view",
        model: 'NeedHelp',
        show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.NeedHelp.includes("view"))
      },
    ],
  },
  {
    Items: [
      {
        path: `${getAllPopups()}`,
        icon: "bell",
        viewPath: ``,
        type: "link",
        active: false,
        related_fields: [
          "/add-pop-up",
          "/edit-pop-up/:id",
          "/view-pop-up/:id"
        ],
        title: "Pop Ups",
        permission: "view",
        model: 'Popups',
        show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.Popups.includes("view"))
      },
    ],
  },
  {
    Items: [
      {
        path: `${getLoginData()}`,
        icon: "database",
        viewPath: ``,
        type: "link",
        active: false,
        title: "Login Data",
        permission: "view",
        model: 'StaffLogin',
        show: (role, permissions) => role === "Admin" || (role === "Staff" && permissions.StaffLogin.includes("view"))
      },
    ],
  },
];