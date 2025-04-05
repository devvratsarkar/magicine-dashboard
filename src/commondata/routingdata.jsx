import React from "react";
import Orders from "../components/orders/Orders";
import Dashboard from "../components/dashboard/dashboard";
import Cart from "../components/cart/Cart";
import SaveForLater from "../components/saveforlater/SaveForLater";
import Cancellation from "../components/cancellation/Cancellation";
import Customer from "../components/customer/Customer";
import Category from "../components/catalogue/category/Category";
import CustomField from "../components/catalogue/customfield/CustomField";
import Products from "../components/catalogue/products/Products";
import AddNewProduct from "../components/catalogue/products/AddNewProduct";
import Inventory from "../components/stocks/inventory/Inventory";
import Returns from "../components/returns/Returns";
import Reviews from "../components/reviews/Reviews";
import ViewProducts from "../components/catalogue/products/ViewProducts";
import EditProduct from "../components/catalogue/products/EditProduct";
import OrdersDetails from "../components/orders/OrderDetails";
import AddNewCategory from "../components/catalogue/category/AddNewCategory";
import ViewCategory from "../components/catalogue/category/ViewCategory";
import EditCategory from "../components/catalogue/category/EditCategory";
import Carrier from "../components/shipping/carrier/Carrier";
import AddNewCarrier from "../components/shipping/carrier/AddNewCarrier";
import ViewCarrier from "../components/shipping/carrier/ViewCarrier";
import EditCarrier from "../components/shipping/carrier/EditCarrier";
import Coupon from "../components/offer/coupon/Coupon";
import AddNewCoupon from "../components/offer/coupon/AddCoupon";
import ViewCoupon from "../components/offer/coupon/ViewCoupon";
import EditCoupon from "../components/offer/coupon/EditCoupon";
import ViewReview from "../components/reviews/ViewReview";
import Page from "../components/appearance/page/Page";
import AddNewPage from "../components/appearance/page/AddNewPage";
import ViewPage from "../components/appearance/page/ViewPage";
import EditPage from "../components/appearance/page/EditPage";
import EmailTemplate from "../components/appearance/emailTemplate/EmailTemplate";
import AddNewEmailTemplate from "../components/appearance/emailTemplate/AddNewEmailTenplate";
import EditEmailTemplate from "../components/appearance/emailTemplate/EditEmailTemplate";
import ViewEmailTemplate from "../components/appearance/emailTemplate/ViewEmailTemplate";
import DynamicContent from "../components/appearance/dynamic-content/DynamicContent";
import AddNewDynamicContent from "../components/appearance/dynamic-content/AddDynamicContent";
import EditDynamicContent from "../components/appearance/dynamic-content/EditDynamicContent";
import ShippingZone from "../components/shipping/shipping-zone/ShippingZone";
import FAQ from "../components/appearance/FAQ/FAQ";
import Blogs from "../components/appearance/blogs/Blogs";
import AddBlogs from "../components/appearance/blogs/AddBlogs";
import EditBlogs from "../components/appearance/blogs/EditBlogs";
import ViewBlogs from "../components/appearance/blogs/ViewBlogs";
import Testimonials from "../components/cms/testimonials/Testimonials";
import AddTestimonials from "../components/cms/testimonials/AddTestimonials";
import EditTestimonials from "../components/cms/testimonials/EditTestimonials";
import SalesBanner from "../components/appearance/sale-banner/SalesBanner";
import Specifications from "../components/settings/specifications/Specifications";
import ReturnCancellationPOlicy from "../components/settings/return&cancellationpolicy/ReturnCancellationPOlicy";
import ViewInventoryWithoutVariant from "../components/inventory-without-variant/ViewInventoryWithoutVariant";
import EditInventoryWithoutVariant from "../components/inventory-without-variant/EditInventoryWithoutVariant";
import AddInventoryWithoutVariant from "../components/inventory-without-variant/AddInventoryWithoutVariant";
import SystemSettings from "../components/settings/system settings/SystemSettings";
import GlobalSettings from "../components/settings/global settings/GlobalSettings";
import DisputeText from "../components/settings/dispute text/DisputeText";
import Clients from "../components/settings/clients/Clients";
import Disputes from "../components/support desk/disputes/Disputes";
import ViewDispute from "../components/support desk/disputes/ViewDispute";
import ReplyDispute from "../components/support desk/disputes/ReplyDispute";
import ViewWithVarient from "../components/inventory-with-variant/ViewWithVarient";
import AddInventoryWithVariant from "../components/inventory-with-variant/AddInventoryWithVariant";
import ListVariantEdit from "../components/inventory-with-variant/ListVariantEdit";
import Notification from "../components/support desk/notification/Notification";
import MailInbox from "../components/message/MailInbox";
import MailSent from "../components/message/MailSent";
import MailDraft from "../components/message/MailDraft";
import MailSpam from "../components/message/MailSpam";
import MailTrash from "../components/message/MailTrash";
import Medicine from "../components/catalogue/medicine/Medicine";
import AddMedicine from "../components/medicine/AddMedicine";
import ViewImage from "../components/catalogue/category/ViewImage";
import CustumFieldValue from "../components/catalogue/customfield/CustumFieldValue";
import MarketManufacturer from "../components/market-manufacturer/MarketManufacturer";
import Brand from "../components/brand/Brand";
import ViewMedicine from "../components/medicine/ViewMedicine";
import EditMedicine from "../components/medicine/EditMedicine";
import AddNewManufacturer from "../components/market-manufacturer/AddNewManufacturer";
import EditManufacturer from "../components/market-manufacturer/EditManufacturer";
import ViewNewManufacturer from "../components/market-manufacturer/ViewManufacturer";
import AddBrand from "../components/brand/AddBrand";
import EditBrand from "../components/brand/EditBrand";
import ViewBrand from "../components/brand/ViewBrand";
import ProductReview from "../components/appearance/product_review/ProductReview";
import CMSForm from "../components/cms/homepage/CMSForm";
import CMSPrivacyPolicy from "../components/cms/privacy-policy/CMSPrivacyPolicy"
import CMSPages from "../components/cms/page-list/CMSPage"
import CMSTermsCondition from "../components/cms/terms&conditions/CMSTermsCondition"
import CMSRefunReturnPolicy from "../components/cms/refund-return/CMSRefunReturnPolicy"
import CMSCustomerSupportPolicy from "../components/cms/customer-support/CMSCustomerSupportPolicy";
import AddNewNotification from "../components/support desk/notification/AddNewNotification";
import EditNotification from "../components/support desk/notification/EditNotification";
import PushNotification from "../components/support desk/push-notification/PushNotification";
import AddNewPushNotification from "../components/support desk/push-notification/AddNewPushNotification"
import EditPushNotification from "../components/support desk/push-notification/EditPushNotification";
import Subscribers from "../components/subscribers/Subscribers"
import CMSShippingPolicy from "../components/cms/shipping-policy/CMSShippingPolicy";
import CurrencySettings from "../components/currency-settings/CurrencySettings";
import SeoPage from "../components/seo-page/SeoPage";
import ViewReturns from "../components/returns/ViewReturns";
import EditReturns from "../components/returns/EditReturns";
import ContctEnquiry from "../components/contact-enquiry/ContctEnquiry";
import SingleReviews from "../components/reviews/SingleReviews";
import EditReview from "../components/reviews/EditReview";
import Tags from "../components/catalogue/tags/Tags";
import ProductsEnquiries from "../components/customer/products-enquiries/ProductsEnquiries";
import PrescriptionRequest from "../components/customer/prescription/PrescriptionRequest";
import AddCustomer from "../components/customer/AddCustomer";
import EditCustomer from "../components/customer/EditCustomer";
import ViewCustomer from "../components/customer/ViewCustomer";
import ViewCancellation from "../components/cancellation/ViewCancellation";
import Categories from "../components/appearance/blogs/categories/Categories";
import AddBlogCategories from "../components/appearance/blogs/categories/AddBlogCategories";
import EditBlogCategories from "../components/appearance/blogs/categories/EditBlogCategories";
import ViewBlogCategories from "../components/appearance/blogs/categories/ViewBlogCategories";
import UserProfile from "../components/user-profile/UserProfile";
import { SoftDelete } from "../components/soft-delete/SoftDelete";
import { ManufacturerDeletedItem } from "../components/market-manufacturer/ManufacturerDeletedItem";
import SurgicalEquipment from "../components/catalogue/surgical-equipment/SurgicalEquipment";
import { BrandDeletedItem } from "../components/brand/BrandDeletedItem";
import { CategoryDeletedItems } from "../components/catalogue/category/CategoryDeletedItems";
import { CustomFieldTrash } from "../components/catalogue/customfield/CustomFieldTrash";
import CustomFieldValueTrash from "../components/catalogue/customfield/CustomFieldValueTrash";
import { CouponDeletedItems } from "../components/offer/coupon/CouponDeletedItems";
import { ProductDeletedItems } from "../components/catalogue/products/ProductDeletedItems";
import { MedicineTrash } from "../components/medicine/MedicineTrash";
import SurgicalEquipmentMain from "../components/catalogue/surgical-equipment/SurgicalEquipmentMain";
import EditSurgicalEquipment from "../components/catalogue/surgical-equipment/EditSurgicalEquipment";
import { TrashSurgicalEquipment } from "../components/catalogue/surgical-equipment/TrashSurgicalEquipment";
import ViewSurgicalEquipment from "../components/catalogue/surgical-equipment/ViewSergicalEquipment";
import { TrashSalesBanner } from "../components/appearance/sale-banner/TrashSalesBanner";
import { CategoryDeleted } from "../components/appearance/blogs/categories/CategoryDeleted";
import BlogTags from "../components/appearance/blogs/tags/BlogTags";
import ViewBlogTag from "../components/appearance/blogs/tags/ViewBlogTag";
import { TrashTestimonial } from "../components/cms/testimonials/TrashTestimonial";
import { BlogTrash } from "../components/appearance/blogs/BlogTrash";
import { NotificationTrash } from "../components/support desk/notification/NotificationTrash";
import { InventoryWithoutVariantTrash } from "../components/inventory-without-variant/InventoryWithoutVariantTrash";
import { InventoryWithVariantTrash } from "../components/inventory-with-variant/InventoryWithVariantTrash";
import { CarrierTrash } from "../components/shipping/carrier/CarrierTrash";
import { PushNotificationTrash } from "../components/support desk/push-notification/PushNotificationTrash";
import ContactUs from "../components/cms/contact-us/ContactUs";
import Careers from "../components/cms/career/Careers";
import AboutUs from "../components/cms/about-us/CMSAboutUs";
import JobPosition from "../components/cms/job-position/JobPosition";
import AddJobPosition from "../components/cms/job-position/AddNewJobPosition";
import EditJobPosition from "../components/cms/job-position/EditJobPosition";
import ViewJobPosition from "../components/cms/job-position/ViewJobPosition";
import EditInventoryWithVariant from "../components/inventory-with-variant/EditInventoryWithVariant";
import JobApplicationReceived from "../components/cms/jobApplication-received/JobApplicationReceived";
import Media from "../components/media/Media";
import ViewMedia from "../components/media/ViewMedia";
import Uses from "../components/catalogue/uses/Uses";
import TrashUsesList from "../components/catalogue/uses/TrashUses";
import Form from "../components/catalogue/form/Form";
import TrashForm from "../components/catalogue/form/TrashForm";
import Dispute from "../components/dispute/Dispute";
import ViewDisputeDetails from "../components/dispute/viewDisputeDetails";
import ReplyDisputeMessage from "../components/dispute/editDisputeDetail";
import StaffPermission from "../components/staff-permissions/StaffPermission";
import AddStaffPermissions from "../components/staff-permissions/AddStaffPermissions";
import ViewStaffPermissions from "../components/staff-permissions/ViewStaffPermission";
import EditStaffPermissions from "../components/staff-permissions/EditStaffPermission";
import RouteGuard from "./RouteGuard";
import { NotFoundSearchTable } from "../components/not-found/NotFoundSearch";
import PopUp from "../components/pop-ups/PopUp";
import StaffLogin from "../components/staff-login/StaffLogin";
import AddPopUp from "../components/pop-ups/AddPopUp";
import EditPopUp from "../components/pop-ups/EditPopUp";
import ViewPopUp from "../components/pop-ups/ViewPopUp";
import ReviewMedicine from "../components/review-medicine/ReviewMedicine";
import ViewReVieMedicine from "../components/review-medicine/ViewReviewMedicine";
import CouponPage from "../components/cms/coupon/CouponPage";
import BlogComments from "../components/blog-comments/BlogComments";
import ProductWithoutVariant from "../components/inventory-without-variant/ProductWithoutVariant";
import EquipmentWithoutVariant from "../components/inventory-without-variant/EquipmentWithoutVariant";
import GeneralProductInventory from "../components/stocks/inventory/GeneralProduct";
import EquipmentInventory from "../components/stocks/inventory/EquipmentInventory";
import Couponusage from "../components/offer/coupon/CouponUsage";
import MedicineReport from "../components/inventory-reporting/medicine/MedicineReport";
import EquipmentReport from "../components/inventory-reporting/equipment/EquipmentReport";
import ProductReport from "../components/inventory-reporting/product/ProductReport";
import InventoryHistory from "../components/inventory-reporting/InventoryHistory";


export const RouterData = [
  { path: `${import.meta.env.BASE_URL}/dashboard`, element: <Dashboard /> },
  { path: `${import.meta.env.BASE_URL}/profile`, element: <UserProfile /> },
  { path: `${import.meta.env.BASE_URL}/all-orders`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Order', action: 'view' }]}  ><Orders /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/all-orders/order-details/:id`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Order', action: 'view' }]}  ><OrdersDetails /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cart`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Cart", action: "view" }]}><Cart /></RouteGuard>) },
  // { path: `${import.meta.env.BASE_URL}/save-for-later`, element: <SaveForLater />, },
  // { path: `${import.meta.env.BASE_URL}/cancellation`, element: <Cancellation />, },
  // { path: `${import.meta.env.BASE_URL}/view-cancellation/:id`, element: <ViewCancellation />, },
  { path: `${import.meta.env.BASE_URL}/customer`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "User", action: "view" }]}><Customer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-new-customer`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "User", action: "add" }]}><AddCustomer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-customer/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "User", action: "edit" }]}><EditCustomer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-customer/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "User", action: "view" }]}><ViewCustomer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/products-enquiries`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "ProductEnquiry", action: "view" }]}><ProductsEnquiries /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/prescription-request`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PrescriptionRequest", action: "view" }]}><PrescriptionRequest /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/category`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Category", action: "view" }]}><Category /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/add-new-category`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Category", action: "add" }]}><AddNewCategory /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/category/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Category", action: "view" }]}><ViewCategory /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/edit-category/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Category", action: "edit" }]}><EditCategory /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/category-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Category", action: "view-trash" }]}><CategoryDeletedItems /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/custom-field`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Category", action: "view" }]}><CustomField /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/custom-field-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "CustomFiled", action: "view-trash" }]}><CustomFieldTrash /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/custom-field-value-deleted-items/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "CustomFiledValue", action: "view-trash" }]}><CustomFieldValueTrash /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/products`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Product', action: 'view' }]}  ><Products /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/product-deleted-items`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Product', action: 'view-trash' }]}  ><ProductDeletedItems /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/add-new-product`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Product', action: 'add' }]}  ><AddNewProduct /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/product/:id`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Product', action: 'view' }]}  ><ViewProducts /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/edit-product/:id`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Product', action: 'edit' }]}  ><EditProduct /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/surgical-equipment`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Sergical_Equipment', action: 'view' }]}  ><SurgicalEquipmentMain /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/surgical-equipment/add-surgical-equipment`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Sergical_Equipment', action: 'add' }]}  ><SurgicalEquipment /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/surgical-equipment/edit-surgical-equipment/:id`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Sergical_Equipment', action: 'edit' }]}  ><EditSurgicalEquipment /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/surgical-equipment/view-surgical-equipment/:id`, element: (<RouteGuard requiredRoles={['Admin', 'Staff']} requiredPermissions={[{ category: 'Sergical_Equipment', action: 'view' }]}  ><ViewSurgicalEquipment /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/catalogue/surgical-equipment/trash-surgical-equipment`, element: (<RouteGuard requiredRoles={['Admin', "Staff"]} requiredPermissions={[{ category: "Sergical_Equipment", action: "view-trash" }]}><TrashSurgicalEquipment /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/stocks/inventory`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><Inventory /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/surgical-equipment-inventory`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><EquipmentInventory /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/general-product-inventory`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><GeneralProductInventory /></RouteGuard>), },

  { path: `${import.meta.env.BASE_URL}/stocks/product-inventory-without-variant`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><ProductWithoutVariant /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/equipment-inventory-without-variant`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><EquipmentWithoutVariant /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/inventory-without-variant-delete-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view-trash" }]}><InventoryWithoutVariantTrash /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/inventory-with-variant-delete-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InventoryWithVarient", action: "view-trash" }]}><InventoryWithVariantTrash /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/add-inventory-without-variant/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "add" }]}><AddInventoryWithoutVariant /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/stocks/view-inventory-without-variant/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><ViewInventoryWithoutVariant /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/stocks/edit-inventory-without-variant/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "edit" }]}><EditInventoryWithoutVariant /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/shipping/carrier`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Carrier", action: "view" }]}><Carrier /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/shipping/carrier-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Carrier", action: "view-trash" }]}><CarrierTrash /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/shipping/shipping-zone`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "ShippingZone", action: "view" }]}><ShippingZone /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/returns`, element: <Returns /> },
  { path: `${import.meta.env.BASE_URL}/returns/view-returns/:id`, element: <ViewReturns /> },
  { path: `${import.meta.env.BASE_URL}/returns/edit-returns/:id`, element: <EditReturns /> },
  { path: `${import.meta.env.BASE_URL}/reviews`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Review", action: "view" }]}><Reviews /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/shipping/carrier/add-new-carrier`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Carrier", action: "add" }]}><AddNewCarrier /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/shipping/carrier/view-carrier/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Carrier", action: "view" }]}><ViewCarrier /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/shipping/carrier/edit-carrier/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Carrier", action: "edit" }]}><EditCarrier /></RouteGuard>) },

  { path: `${import.meta.env.BASE_URL}/coupon`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Coupons", action: "view" }]}><Coupon /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/coupon-usage`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Coupons", action: "view" }]}><Couponusage /></RouteGuard>), },

  { path: `${import.meta.env.BASE_URL}/coupon/deleted-coupons`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Coupons", action: "view-trash" }]}><CouponDeletedItems /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-new-coupon`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Coupons", action: "add" }]}><AddNewCoupon /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-coupon/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Coupons", action: "view" }]}><ViewCoupon /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-coupon/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Coupons", action: "edit" }]}><EditCoupon /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-review/:TYPE/:PRODUCTID/:ID`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Review", action: "view" }]}><ViewReview /></RouteGuard>) },
  // { path: `${import.meta.env.BASE_URL}/appearance/page`, element: <Page />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/add-new-page`, element: <AddNewPage />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/view-page/:id`, element: <ViewPage />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/edit-page/:id`, element: <EditPage />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/email-template`, element: <EmailTemplate />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/add-new-email-template`, element: <AddNewEmailTemplate />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/edit-email-template/:id`, element: <EditEmailTemplate />, },
  // { path: `${import.meta.env.BASE_URL}/appearance/view-email-template/:id`, element: <ViewEmailTemplate />, },
  { path: `${import.meta.env.BASE_URL}/appearance/dynamic-content`, element: <DynamicContent />, },
  { path: `${import.meta.env.BASE_URL}/appearance/add-new-dynamic-content`, element: <AddNewDynamicContent />, },
  { path: `${import.meta.env.BASE_URL}/appearance/edit-dynamic-content/:id`, element: <EditDynamicContent />, },
  { path: `${import.meta.env.BASE_URL}/appearance/FAQ`, element: <FAQ />, },
  { path: `${import.meta.env.BASE_URL}/blogs`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Blog", action: "view" }]}><Blogs /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blog-comments`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Blog", action: "view" }]}><BlogComments /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Blog", action: "view" }]}><BlogTrash /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/categories`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogCategory", action: "view" }]}><Categories /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/categories-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogCategory", action: "view-trash" }]}><CategoryDeleted /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/add-categories`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogCategory", action: "add" }]}><AddBlogCategories /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/edit-categories/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogCategory", action: "edit" }]}><EditBlogCategories /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/view-categories/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogCategory", action: "view" }]}><ViewBlogCategories /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/tags`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogTags", action: "view" }]}><BlogTags /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/blogs/view-tags/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "BlogTags", action: "view" }]}><ViewBlogTag /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/appearance/sales-banner`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "SalesBanner", action: "view" }]}><SalesBanner /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/appearance/trash-sales-banner`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "SalesBanner", action: "view-trash" }]}><TrashSalesBanner /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-blogs`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Blog", action: "add" }]}><AddBlogs /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-blogs/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Blog", action: "edit" }]}><EditBlogs /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-blogs/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Blog", action: "view" }]}><ViewBlogs /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/testimonials`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Testimonial", action: "view" }]}><Testimonials /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/add-testimonials`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Testimonial", action: "add" }]}><AddTestimonials /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/edit-testimonials/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Testimonial", action: "edit" }]}><EditTestimonials /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/cms/trash-testimonials`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Testimonial", action: "view-trash" }]}><TrashTestimonial /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/settings/specifications`, element: <Specifications /> },
  { path: `${import.meta.env.BASE_URL}/settings/return-cancellation-policies`, element: <ReturnCancellationPOlicy /> },
  { path: `${import.meta.env.BASE_URL}/inventor/view-invertory-with-varient/:TYPE/:ID`, element: <ViewWithVarient /> },
  { path: `${import.meta.env.BASE_URL}/inventor/add-invertory-with-varient`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InventoryWithVarient", action: "add" }]}><AddInventoryWithVariant /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/inventor/edit-invertory-with-varient/:modelType/:modelId`, element: <RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InventoryWithVarient", action: "edit" }]}><EditInventoryWithVariant /></RouteGuard> },
  // { path: `${import.meta.env.BASE_URL}/inventor/list-variant-edit/:id`, element: <ListVariantEdit /> },
  { path: `${import.meta.env.BASE_URL}/settings/system-setting`, element: <SystemSettings /> },
  { path: `${import.meta.env.BASE_URL}/settings/global-settings`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Global", action: "view" }]}><GlobalSettings /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/settings/desput-text`, element: <DisputeText /> },
  { path: `${import.meta.env.BASE_URL}/settings/clients`, element: <Clients /> },
  // { path: `${import.meta.env.BASE_URL}/support-desk/disputes`, element: <Disputes /> },
  // { path: `${import.meta.env.BASE_URL}/support-desk/view-dispute/:id`, element: <ViewDispute /> },
  // { path: `${import.meta.env.BASE_URL}/support-desk/reply-disputes/:id`, element: <ReplyDispute /> },
  { path: `${import.meta.env.BASE_URL}/support-desk/notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "View" }]}><Notification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/support-desk/notification-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "view-trash" }]}><NotificationTrash /></RouteGuard>) },
  // { path: `${import.meta.env.BASE_URL}/message/messages-inbox`, element: <MailInbox /> },
  // { path: `${import.meta.env.BASE_URL}/message/message-sent`, element: <MailSent /> },
  // { path: `${import.meta.env.BASE_URL}/message/message-draft`, element: <MailDraft /> },
  // { path: `${import.meta.env.BASE_URL}/message/message-spam`, element: <MailSpam /> },
  // { path: `${import.meta.env.BASE_URL}/message/message-trash`, element: <MailTrash /> },
  { path: `${import.meta.env.BASE_URL}/catalogue/medicines`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "view" }]}><Medicine /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/medicines-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "view-trash" }]}><MedicineTrash /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/add-medicines`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "add" }]}><AddMedicine /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/view-medicines/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "view" }]}><ViewMedicine /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/edit-medicines/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "edit" }]}><EditMedicine /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-images`, element: <ViewImage /> },
  { path: `${import.meta.env.BASE_URL}/catalogue/custom-field-value/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "CustomFiledValue", action: "view" }]}><CustumFieldValue /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/marketer-manufacturer`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Marketer", action: "view" }]}><MarketManufacturer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/marketer-manufacturer-deleted-item`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Marketer", action: "view-trash" }]}><ManufacturerDeletedItem /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-manufacturer`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Marketer", action: "add" }]}><AddNewManufacturer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-manufacturer/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Marketer", action: "edit" }]}><EditManufacturer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-manufacturer/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Marketer", action: "view" }]}><ViewNewManufacturer /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/brand`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Brand", action: "view" }]}><Brand /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-brand`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Brand", action: "add" }]}><AddBrand /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-brand/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Brand", action: "edit" }]}><EditBrand /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-brand/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Brand", action: "view" }]}><ViewBrand /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/brand-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Brand", action: "view-trash" }]}><BrandDeletedItem /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-images`, element: <ViewImage /> },
  { path: `${import.meta.env.BASE_URL}/product-review`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Review", action: "add" }]}><ProductReview /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/homepage`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Home_Page", action: "view" }]}><CMSForm /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/pages`, element: <CMSPages /> },
  { path: `${import.meta.env.BASE_URL}/cms/privacy-policy`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Privacy_policy", action: "view" }]}><CMSPrivacyPolicy /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/terms-condition`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[{ category: "Term_condition", action: "view" }]}><CMSTermsCondition /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/refund-return-policy`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Refund_return", action: "view" }]}><CMSRefunReturnPolicy /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/grievance-redressal-policy`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Shipping_policy", action: "view" }]}><CMSShippingPolicy /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/cancellation-policy`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Customer_support", action: "view" }]}><CMSCustomerSupportPolicy /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/notification/add-notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "add" }]}><AddNewNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/notification/edit-notification/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Notification", action: "edit" }]}><EditNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/push-notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "view" }]}><PushNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/push-notification-deleted-items`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "view-trash" }]}><PushNotificationTrash /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/push-notification/add-push-notification`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "add" }]}><AddNewPushNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/push-notification/edit-push-notification/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "PushNotification", action: "edit" }]}><EditPushNotification /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/subscribers`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Subscriber", action: "view" }]}><Subscribers /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/currency-settings`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "ExchangeRates", action: "view" }]}><CurrencySettings /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/seo`, element: <SeoPage /> },
  { path: `${import.meta.env.BASE_URL}/soft-delete`, element: <SoftDelete /> },
  { path: `${import.meta.env.BASE_URL}/contact-enquiries`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Contact", action: "view" }]}><ContctEnquiry /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/product-reviews/:TYPE/:ID`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Review", action: "view" }]}><SingleReviews /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-reviews/:TYPE/:PRODUCTID/:ID`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Review", action: "edit" }]}><EditReview /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/tags`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Tags", action: "view" }]} ><Tags /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/contact-us`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "ContactUs", action: "view" }]}><ContactUs /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/career`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Career", action: "view" }]}><Careers /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/about-us`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "AboutUs", action: "view" }]}><AboutUs /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/job-position`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Position", action: "view" }]}><JobPosition /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/job-position/add`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Position", action: "add" }]}><AddJobPosition /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/job-position/edit/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Position", action: "edit" }]}><EditJobPosition /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/job-position/view/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Position", action: "view" }]}><ViewJobPosition /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/cms/job-application-received`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Application", action: "view" }]}><JobApplicationReceived /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/media-list`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Media", action: "view" }]}><Media /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/uses`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Uses", action: "view" }]}><Uses /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/trash-uses`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Uses", action: "view-trash" }]}><TrashUsesList /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/form`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Form", action: "view" }]}><Form /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/catalogue/trash-form`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Form", action: "view-trash" }]}><TrashForm /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/dispute`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "NeedHelp", action: "view" }]}><Dispute /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/dispute/view-disputes/:id`, element: <ViewDisputeDetails /> },
  //staff permissions
  { path: `${import.meta.env.BASE_URL}/staff-permissions`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[]}><StaffPermission /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-staff-permissions`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[]}><AddStaffPermissions /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-staff-permissions/:id`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[]}><ViewStaffPermissions /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-staff-permissions/:id`, element: (<RouteGuard requiredRoles={["Admin"]} requiredPermissions={[]}><EditStaffPermissions /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/not-found-searches`, element: <NotFoundSearchTable /> },
  { path: `${import.meta.env.BASE_URL}/pop-ups`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Popups", action: "view" }]}><PopUp /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/add-pop-up`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Popups", action: "add" }]}><AddPopUp /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/edit-pop-up/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Popups", action: "edit" }]}><EditPopUp /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-pop-up/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Popups", action: "edit" }]}><ViewPopUp /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/staff-login`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "StaffLogin", action: "view" }]}><StaffLogin /></RouteGuard>) },
  //review
  { path: `${import.meta.env.BASE_URL}/review-medicine-list`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "reviewer" }]}><ReviewMedicine /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/view-review-medicine/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "Medicine", action: "reviewer" }]}><ViewReVieMedicine /></RouteGuard>) },
  { path: `${import.meta.env.BASE_URL}/coupon-page`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "CouponPageContent", action: "view" }]}><CouponPage /></RouteGuard>) },

  { path: `${import.meta.env.BASE_URL}/inventory-report/medicine`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><MedicineReport /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/inventory-report/product`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><ProductReport /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/inventory-report/equipment`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><EquipmentReport /></RouteGuard>), },
  { path: `${import.meta.env.BASE_URL}/inventory/without-variant/:type/:id`, element: (<RouteGuard requiredRoles={["Admin", "Staff"]} requiredPermissions={[{ category: "InvertoryWithoutVarient", action: "view" }]}><InventoryHistory /></RouteGuard>), },

];