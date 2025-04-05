import React from "react";
import { useDispatch, useSelector } from "react-redux";
import AddRate from "../../components/shipping/shipping-zone/AddRate";
import AddZone from "../../components/shipping/shipping-zone/AddZone";
import EditZone from "../../components/shipping/shipping-zone/EditZone";
import EditRate from "../../components/shipping/shipping-zone/EditRate";
import SelectState from "../../components/shipping/shipping-zone/SelectStates";
import DeleteModal from "../../commondata/delete_modal/DeleteModal";
import AddInventoryWithoutVariant from "../../components/inventory-without-variant/AddInventoryWithoutVariant";
import EditVariant from "../../components/inventory-with-variant/EditVariant";
import ListVariantEditPopup from "../../components/inventory-with-variant/ListVariantEditPopup";
import ApproveReview from "../../components/reviews/ApproveReview";
import RejectReview from "../../components/reviews/RejectReview";
import AddNewManufacturer from "../../components/market-manufacturer/AddNewManufacturer";
import ApproveCancellation from "../../components/cancellation/ApproveCancellation";
import DeclineCancellation from "../../components/cancellation/DeclineCancellation";
import AddTags from "../../components/catalogue/tags/AddTags";
import EditTag from "../../components/catalogue/tags/EditTags";
import EditManufacturer from "../../components/market-manufacturer/EditManufacturer";
import ViewManufacturer from "../../components/market-manufacturer/ViewManufacturer";
import MarketerRestore from "../../components/market-manufacturer/MarketerRestore";
import BrandRestore from "../../components/brand/BrandRestore";
import DeleteManufacturer from "../../components/market-manufacturer/DeleteManufacturer";
import DeleteBrand from "../../components/brand/DeleteBrand";
import TagsDelete from "../../components/catalogue/tags/TagsDelete";
import DeleteCategory from "../../components/catalogue/category/DeleteCategory";
import CategoryRestore from "../../components/catalogue/category/CategoryRestore";
import DeleteCoupon from "../../components/offer/coupon/DeleteCoupon";
import CustomField from "../../components/catalogue/customfield/CustomField";
import AddCustomField from "../../components/catalogue/customfield/AddCustomField";
import EditCustomField from "../../components/catalogue/customfield/EditCustumField";
import DeleteField from "../../components/catalogue/customfield/DeleteField";
import CustomFieldRestore from "../../components/catalogue/customfield/CustomFieldRestore";
import AddCustumFieldValue from "../../components/catalogue/customfield/AddCustumFieldValue";
import ViewCustumFieldValue from "../../components/catalogue/customfield/ViewCustumFieldValue";
import EditCustumFieldValue from "../../components/catalogue/customfield/EditCustumFieldValue";
import DeleteFieldValue from "../../components/catalogue/customfield/DeleteFieldValue";
import CustomFieldValueRestore from "../../components/catalogue/customfield/CustomFieldValueRestore";
import RestoreCoupon from "../../components/offer/coupon/RestoreCoupon";
import DeleteProduct from "../../components/catalogue/products/DeleteProduct";
import RestoreProduct from "../../components/catalogue/products/RestoreProduct";
import DeleteMedicine from "../../components/medicine/DeleteMedicine";
import RestoreMedicine from "../../components/medicine/RestoreMedicine";
import DeleteSurgicalEquipment from "../../components/catalogue/surgical-equipment/DeleteSurgicalEquipment";
import RestoreSurgicalEquipment from "../../components/catalogue/surgical-equipment/RestoreSurgicalEquipment";
import EditSalesBanner from "../../components/appearance/sale-banner/EditSalesBanner";
import DeleteSalesBanner from "../../components/appearance/sale-banner/DeleteSalesBanner";
import RestoreSalesBanner from "../../components/appearance/sale-banner/RestoreSalesBanner";
import DeleteBlogCategory from "../../components/appearance/blogs/categories/DeleteBlogCategory";
import RestoreCategories from "../../components/appearance/blogs/categories/RestoreCategories";
import AddBlogTags from "../../components/appearance/blogs/tags/AddBlogTags";
import EditBlogTags from "../../components/appearance/blogs/tags/EditBlogTags";
import BlogTagsDelete from "../../components/appearance/blogs/tags/BlogTagsDelete";
import DeleteTestimonial from "../../components/cms/testimonials/DeleteTestimonial";
import RestoreTestimonials from "../../components/cms/testimonials/RestoreTestimonials";
import FeaturedImgModal from "../../commondata/delete_modal/FeaturedImgModal";
import DeleteBlog from "../../components/appearance/blogs/DeleteBlog";
import RestoreBlogs from "../../components/appearance/blogs/RestoreBlogs";
import DeleteZoneModal from "../../components/shipping/shipping-zone/DeleteZoneModal";
import DeleteNotifiation from "../../components/support desk/notification/DeleteNotifiation";
import RestoreNotification from "../../components/support desk/notification/RestoreNotification";
import DeleteInventoryWithoutVariant from "../../components/inventory-without-variant/DeleteInventoryWithoutVariant";
import RestoreInventoryWithoutVariant from "../../components/inventory-without-variant/RestoreInventoryWithoutVariant";
import DeleteCarrier from "../../components/shipping/carrier/DeleteCarrier";
import RestoreCarrier from "../../components/shipping/carrier/RestoreCarrier";
import DeletedPushNotification from "../../components/support desk/push-notification/DeletedPushNotification";
import RestorePushNotification from "../../components/support desk/push-notification/RestorePushNotification";
import DeleteSubscribers from "../../components/subscribers/DeleteSubscribers";
import DeleteJobPosition from "../../components/cms/job-position/DeleteJobPosition";
import AddTrashVariant from "../../components/inventory-with-variant/AddTrashVarient";
import RestoreInventoryWithVariant from "../../components/inventory-with-variant/RestoreInventoryWithVariant";
import AddVariant from "../../components/inventory-with-variant/AddVariant";
import DeleteJobApplication from "../../components/cms/jobApplication-received/DeleteJobAppication";
import ViewCart from "../../components/cart/ViewCart";
import AddSalesBanner from "../../components/appearance/sale-banner/AddSalesBanner";
import AddMedia from "../../components/media/AddMedia";
import ViewMedia from "../../components/media/ViewMedia";
import DeleteMedia from "../../components/media/DeleteMedia";
import AddUses from "../../components/catalogue/uses/AddUses";
import ViewUses from "../../components/catalogue/uses/ViewUses";
import EditUses from "../../components/catalogue/uses/EditView";
import DeleteUses from "../../components/catalogue/uses/DeleteUses";
import UsesRestore from "../../components/catalogue/uses/UsesRestore";
import AddForm from "../../components/catalogue/form/AddForm";
import EditForm from "../../components/catalogue/form/EditForm";
import ViewForm from "../../components/catalogue/form/ViewForm";
import DeleteForm from "../../components/catalogue/form/DeleteForm";
import FormRestore from "../../components/catalogue/form/FormRestore";
import UpdateProfile from "../../components/user-profile/updateProfile";
import ReplyDisputeMessage from "../../components/dispute/editDisputeDetail";
import DeletePopUpModel from "../../components/pop-ups/DeletePopUpModel";
import ViewBlogComment from "../../components/blog-comments/ViewBlogComment";
import ChangePassword from "../../components/user-profile/ChangePassword";
import BulkDelete from "../../components/appearance/blogs/BulkDelete";
import DeleteReview from "../../components/reviews/DeleteReview";
import TrackingModel from "../../components/orders/TrackingModel";

export default function Modal() {
    const { isOpen, componentName } = useSelector(
        (state) => state.allCommonModal
    );

    const renderComponent = () => {
        switch (componentName) {
            case "AddZone":
                return <AddZone />;
            case "AddRate":
                return <AddRate />;
            case "EditZone":
                return <EditZone />;
            case "EditRate":
                return <EditRate />;
            case "Delete":
                return <DeleteModal />;
            case "MarketerRestore":
                return <MarketerRestore />;
            case "DeleteManufacturer":
                return <DeleteManufacturer />;
            case "BrandRestore":
                return <BrandRestore />;
            case "DeleteBrand":
                return <DeleteBrand />;
            case "SelectStates":
                return <SelectState />;
            case "AddInventoryWithoutVariant":
                return <AddInventoryWithoutVariant />;
            case "EditVariant":
                return <EditVariant />;
            case "ListVariantEditPopup":
                return <ListVariantEditPopup />;
            case "ApproveReview":
                return <ApproveReview />;
            case "RejectReview":
                return <RejectReview />;
            case "AddNewManufacturer":
                return <AddNewManufacturer />;
            case "EditManufacturer":
                return <EditManufacturer />;
            case "ViewManufacturer":
                return <ViewManufacturer />;
            case "ApproveCancellation":
                return <ApproveCancellation />;
            case "DeclineCancellation":
                return <DeclineCancellation />;
            case "AddTags":
                return <AddTags />;
            case "TagsDelete":
                return <TagsDelete />;
            case "EditTag":
                return <EditTag />;
            case "DeleteCategory":
                return <DeleteCategory />;
            case "CategoryRestore":
                return <CategoryRestore />;
            case "DeleteCoupon":
                return <DeleteCoupon />;
            case "RestoreCoupon":
                return <RestoreCoupon />;
            case "AddCustomField":
                return <AddCustomField />;
            case "EditCustomField":
                return <EditCustomField />;
            case "DeleteField":
                return <DeleteField />;
            case "CustomFieldRestore":
                return <CustomFieldRestore />;
            case "AddCustumFieldValue":
                return <AddCustumFieldValue />;
            case "ViewCustumFieldValue":
                return <ViewCustumFieldValue />;
            case "EditCustumFieldValue":
                return <EditCustumFieldValue />;
            case "DeleteFieldValue":
                return <DeleteFieldValue />;
            case "CustomFieldValueRestore":
                return <CustomFieldValueRestore />;
            case "DeleteProduct":
                return <DeleteProduct />;
            case "RestoreProduct":
                return <RestoreProduct />;
            case "DeleteMedicine":
                return <DeleteMedicine />;
            case "RestoreMedicine":
                return <RestoreMedicine />;
            case "DeleteSurgicalEquipment":
                return <DeleteSurgicalEquipment />;
            case "RestoreSurgicalEquipment":
                return <RestoreSurgicalEquipment />;
            case "EditSalesBanner":
                return <EditSalesBanner />;
            case "DeleteSalesBanner":
                return <DeleteSalesBanner />;
            case "RestoreSalesBanner":
                return <RestoreSalesBanner />;
            case "DeleteBlogCategory":
                return <DeleteBlogCategory />;
            case "RestoreCategories":
                return <RestoreCategories />;
            case "AddBlogTags":
                return <AddBlogTags />;
            case "EditBlogTags":
                return <EditBlogTags />;
            case "BlogTagsDelete":
                return <BlogTagsDelete />;
            case "DeleteTestimonial":
                return <DeleteTestimonial />;
            case "RestoreTestimonials":
                return <RestoreTestimonials />;
            case "FeaturedImgModal":
                return <FeaturedImgModal />;
            case "DeleteBlog":
                return <DeleteBlog />;
            case "RestoreBlogs":
                return <RestoreBlogs />;
            case "DeleteZoneModal":
                return <DeleteZoneModal />;
            case "DeleteNotifiation":
                return <DeleteNotifiation />;
            case "RestoreNotification":
                return <RestoreNotification />;
            case "DeleteInventoryWithoutVariant":
                return <DeleteInventoryWithoutVariant />;
            case "RestoreInventoryWithoutVariant":
                return <RestoreInventoryWithoutVariant />;
            case "DeleteCarrier":
                return <DeleteCarrier />;
            case "RestoreCarrier":
                return <RestoreCarrier />;
            case "DeletedPushNotification":
                return <DeletedPushNotification />;
            case "RestorePushNotification":
                return <RestorePushNotification />;
            case "DeleteSubscribers":
                return <DeleteSubscribers />;
            case "DeleteJobPosition":
                return <DeleteJobPosition />
            case "AddTrashVariant":
                return <AddTrashVariant />
            case "RestoreInventoryWithVariant":
                return <RestoreInventoryWithVariant />
            case "AddVariant":
                return <AddVariant />
            case "DeleteJobApplication":
                return <DeleteJobApplication />
            case "ViewCart":
                return <ViewCart />
            case "AddSalesBanner":
                return <AddSalesBanner />
            case "AddMedia":
                return <AddMedia />
            case "ViewMedia":
                return <ViewMedia />
            case "DeleteMedia":
                return <DeleteMedia />
            case "AddUses":
                return <AddUses />
            case "ViewUses":
                return <ViewUses />
            case "EditUses":
                return <EditUses />
            case "DeleteUses":
                return <DeleteUses />
            case "UsesRestore":
                return <UsesRestore />
            case "AddForm":
                return <AddForm />
            case "EditForm":
                return <EditForm />
            case "ViewForm":
                return <ViewForm />
            case "DeleteForm":
                return <DeleteForm />
            case "FormRestore":
                return <FormRestore />
            case "updateProfile":
                return <UpdateProfile />
            case "ChangePassword":
                return <ChangePassword />
            case "ReplyDisputeMessage":
                return <ReplyDisputeMessage />
            case "DeletePopUpModel":
                return <DeletePopUpModel />
            case "ViewBlogComment":
                return <ViewBlogComment />
            case "BulkDelete":
                return <BulkDelete />
            case "DeleteReview":
                return <DeleteReview />
            case "TrackingModel":
                return <TrackingModel />

            default:
                return null;
        }
    };
    return <>{isOpen && renderComponent()}</>;
}