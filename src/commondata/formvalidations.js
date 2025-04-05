import { message } from "antd";
import { off } from "rsuite/esm/DOMHelper";
import * as Yup from "yup";

const FILE_SIZE_LIMIT = 2 * 1024 * 1024;

export const UserLoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
});

export const passwordResetSchema = Yup.object().shape({
  password: Yup.string().required("This field is required"),
  password_confirmation: Yup.string().required("This field is required"),
});
export const ResetEmail = Yup.object().shape({
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
});

export const UserResgistrationSchema = Yup.object().shape({
  full_name: Yup.string().required("This field is required"),
  mobile_number: Yup.string()
    .required("This field is required")
    .matches(/^[0-9+\-() ]+$/, "Invalid phone number format")
    .typeError("Phone number must be a number"),
  email: Yup.string()
    .email("Enter a valid email address")
    .required("This field is required"),
  password: Yup.string().required("This field is required"),
  confirm_password: Yup.string()
    .oneOf([Yup.ref("password"), null], "Confirm Password must Match")
    .required("This field is required"),
  term_conditions: Yup.boolean()
    .oneOf([true], "You must accept the terms and conditions")
    .required("You must accept the terms and conditions"),
});
export const AddNewProductSchema = Yup.object().shape({
  product_name: Yup.string().required("This field is required"),
  featured_image: Yup.string().required("Featured image is required"),
  category: Yup.array().min(1, "This Field is required.").required("Categories are required"),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  marketer: Yup.string().required("This field is required"),
  brand: Yup.string().required("This field is required"),
  hsn_code: Yup.string(),
  weight: Yup.number()
    .min(1, "Minimum 1 Gram")
    .required("This field is required"),
  // length: Yup.number(),
  // width: Yup.number(),
  // height: Yup.number(),
  tags: Yup.array(),
  minimum_order_quantity: Yup.number().required("This field is required"),
  tax_percentage: Yup.number().required("This field is required"),
  linked_items: Yup.array(),
  short_description: Yup.string(),
  packOf: Yup.string().required("This field is required."),
  form: Yup.string().required("This field is required."),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
  uses: Yup.string().required("This Field is required."),
  age: Yup.array().of(
    Yup.object().shape({
      value: Yup.string().required("This field is required."),
      label: Yup.string().required("This field is required."),
    })
  ).required("This field is required."),
  // tax_percent: Yup.number().required("This field is required.")
});
export const SurgicalEquipmentSchema = Yup.object().shape({
  product_name: Yup.string().required("This field is required"),
  featured_image: Yup.string().required("This field is required"),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field required"),
  // marketer: Yup.string().required("This field is required"),
  minimum_order_quantity: Yup.number().min(1, "Minimum value must be 1 or greater.").required("This field is required."),
});

export const AddNewCategorySchema = Yup.object().shape({
  category_name: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
});

export const AddCustomFieldSchema = Yup.object().shape({
  attribute_type: Yup.string().required("This field is required"),
  attribute_name: Yup.string().required("This field is required"),
  list_order: Yup.number()
    .required("This field is required")
    .min(0, "List order can not be negative."),
  category_id: Yup.array()
    .required("This field is required")
    .min(1, "This field is required"),
});
export const AddCustomFieldValueSchema = Yup.object().shape({
  attribute_type: Yup.string(),
  attribute_name: Yup.string().required("This field is required"),
  list_order: Yup.number()
    .required("This field is required")
    .min(0, "List order can not be negative."),
});

export const AddNewOrder = Yup.object().shape({
  order_type: Yup.string().required("This field is required."),
  customer: Yup.string().required("This field is required."),
});
export const EditVariantSchema = Yup.object().shape({
  strength: Yup.string().required("This field is required."),
  size: Yup.array()
    .required("This field is required.")
    .min(1, "At least one size must be selected."),
  tags: Yup.array()
    .required("This field is required.")
    .min(1, "At least one tag must be selected."),
});
export const AddInventoryWithVariantSchema = Yup.object().shape({
  // sku: Yup.string(),
  image: Yup.mixed().typeError("This field is requi.").required("This field is required."),
  stock_quantity: Yup.number().typeError("This field is required.").required("This field is required."),
  // mrp: Yup.number().typeError("This field is required.").min(0, "This field can not be negative.").required("This field is required."),
  // selling_price: Yup.number().typeError("This field is required.").min(0, "This field can not be negative.").required("This field is required."),
  // discount_percent: Yup.number().typeError("This field is required.").min(0, "This field can not be negative.").required("This field is required."),
});

export const AddNewCarrierSchema = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  tracking_url: Yup.string().required("This field is required."),
  phone: Yup.number()
    .required("This field is required.")
    .typeError("Phone Number must be a number"),
  email: Yup.string().required("This field is required."),
  logo: Yup.string(),
  status: Yup.boolean(),
});

export const AddCustomerForm = Yup.object().shape({
  name: Yup.string()
    .required("This Field is required.")
    .max(255, "Full name must be 50 characters or less."),
  phone_number: Yup.number()
    .required("This field is required.")
    .typeError("Phone Number must be a number"),
  email: Yup.string().required("This field is required."),
  password: Yup.string()
    .required("This Field is required.")
    .min(8, "Password must be at least 8 characters long."),
  password_confirmation: Yup.string()
    .required("This Field is required.")
    .oneOf(
      [Yup.ref("password")],
      "Password and Confirm Password must be the same."
    ),
  address_line_one: Yup.string().required("This field is required."),
  city: Yup.string().required("This field is required."),
  state: Yup.string().required("This field is required."),
  postal_code: Yup.number()
    .required("This field is required.")
    .typeError("Zip code must be a number"),
  country: Yup.string().required("This field is required."),
  gender: Yup.string().required("This field is required.")
});
export const EditCustomerForm = Yup.object().shape({
  name: Yup.string()
    .required("This Field is required.")
    .max(255, "Full name must be 50 characters or less."),
  phone_number: Yup.number()
    .required("This field is required.")
    .typeError("Phone Number must be a number"),
  email: Yup.string().required("This field is required."),
  address_line_one: Yup.string().required("This field is required."),
  city: Yup.string().required("This field is required."),
  state: Yup.string().required("This field is required."),
  postal_code: Yup.number()
    .required("This field is required.")
    .typeError("Zip code must be a number"),
  country: Yup.string().required("This field is required."),
});

export const AddCoupounSchema = Yup.object().shape({
  couponCode: Yup.string().required("This Field is required."),
  couponType: Yup.object().required("This field is required."),
  value: Yup.number()
    .required("This Field is required")
    .min(1, "INR value must be at least 1")
    .typeError("Value must be a number"),
  number_coupon: Yup.number().min(1, "This field can not be negative.").required("This field is required."),
  expirey_date: Yup.string().required("This field is required."),
  minimum_cart_value: Yup.number().min(1, "This field can not be negative.").required("This field is required."),
  usd: Yup.number(),
  euro: Yup.number(),
  gbp: Yup.number(),
  description: Yup.string()
  // status: Yup.boolean(),
});
export const AddPromocodeSchema = Yup.object().shape({
  promocode_code: Yup.string().required("This Field is required."),
  promocode_type: Yup.string().required("This field is required."),
  amount: Yup.string().required("This Field is required,"),
  number_of_promocode: Yup.number().required("This field is required."),
  expirey_date: Yup.string().required("This field is required."),
  status: Yup.string(),
});
export const AddNewPageValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  page_type: Yup.string().required("This field is required."),
  banner_image: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
  slug: Yup.string(),
  content: Yup.string().required("This field is required."),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const AddEmailTemplateValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  template_type: Yup.string().required("This field is required."),
  template_for: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
  sender_name: Yup.string().required("This field is required."),
  sender_email: Yup.string().required("This field is required."),
  subject: Yup.string().required("This field is required."),
  short_codes: Yup.string().required("This field is required."),
  body: Yup.string().required("This field is required."),
});

export const AddDynamicContentValidation = Yup.object().shape({
  type: Yup.string().required("This field is requied"),
  banner_image: Yup.string().required("This field is requied"),
  slug: Yup.string().required("This field is requied"),
  content: Yup.string().required("This field is requied"),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const AddTopicValidation = Yup.object().shape({
  topic_name: Yup.string().required("This field is required."),
  for: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
});

export const AddFAQValidation = Yup.object().shape({
  topic: Yup.string().required("This field is required."),
  status: Yup.string().required("This field is required."),
  question: Yup.string().required("This field is required."),
  answer: Yup.string().required("This field is required."),
});

export const AddZoneValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  status: Yup.mixed().required("This field is required."),
  country_id: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
});

export const AddRateValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  carrier_id: Yup.string().required("This field is required."),
  delivery_takes: Yup.string()
    .required("This field is required."),
  mini_order: Yup.number().min(1, "This field can not be negative.")
    .required("This field is required."),
  max_order: Yup.number()
    .required("This field is required.")
    .test(
      "is-greater-than-minimum",
      "Maximum order must be greater than minimum order",
      function (value) {
        const minimumOrder = this.parent.mini_order;
        return value > minimumOrder;
      }
    ),
  rate: Yup.number()
    .required("This field is required.")
    .typeError("Rate must be a number"),
  free_shipping: Yup.boolean().required("This field is required."),
});

export const AddBlogsValidation = Yup.object().shape({
  title: Yup.string().required("This field is required."),
  banner_image: Yup.mixed()
    .required("This field is required.")
    .test("fileSize", "File size should be less than 2MB", (value) => {
      return value && value.size <= FILE_SIZE_LIMIT;
    }),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required."),
  tags: Yup.array(),
  excerpt: Yup.string().required("This field is required."),
  category: Yup.mixed().required("This field is required."),
  content: Yup.string().required("This field is required."),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const AddBlogsCategoryValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  slug: Yup.string().required("This field is required."),
  banner_image: Yup.string().required("This field is required.")
});

export const AddTestimonialsValidation = Yup.object().shape({
  customer_name: Yup.string().required("This field is requied"),
  rating: Yup.number()
    .required("This field is requied")
    .min(1, "Minimum one rating is required")
    .max(5, "Maximum five rating is allowed"),
  image: Yup.string().required("This field is requied"),
  status: Yup.boolean().required("This field is requied"),
  designation: Yup.string().required("This field is requied"),
  content: Yup.string(),
});

export const salesBannerSchema = Yup.object().shape({
  banner_image: Yup.mixed().required("This field is required."),
  link: Yup.string().required("This field is required."),
  status: Yup.boolean(),
});

export const returnCancellationPolicyValidation = Yup.object().shape({
  category: Yup.string().required("This field is required"),
  subject: Yup.string().required("This field is required"),
  message: Yup.string().required("This field is required"),
});

export const EditInventoryWithoutVariantdatasValidation = Yup.object().shape({
  // sku: Yup.string().required("This field is requied"),
  stock_quantity: Yup.number()
    .required("This field is requied")
    .typeError("Stock quantity must be a number"),
  // mrp: Yup.number()
  //   .required("This field is requied")
  //   .typeError("Price must be a number"),
  // selling_price: Yup.number()
  //   .required("This field is required")
  //   .typeError("Offer price must be a number")
  //   .test(
  //     "offer-price-less-than-mrp",
  //     "Offer price must be less than or equal to MRP",
  //     function (value) {
  //       const mrp = this.parent.mrp;
  //       return value <= mrp;
  //     }
  //   ),
  discount_percent: Yup.number().typeError("Offer price must be a number"),
  // product_img: Yup.string().required("This field is requied"),
});

export const SystemSettingValidation = Yup.object().shape({
  marketplace_name: Yup.string().required("This field is requied"),
  legal_name: Yup.string().required("This field is requied"),
  email_address: Yup.string().required("This field is requied"),
  business_area: Yup.string().required("This field is requied"),
  country: Yup.string().required("This field is requied"),
  brand_logo: Yup.string(),
  icon: Yup.string(),
});

export const GlobalSettingsValidation = Yup.object().shape({
  google_analytics_id: Yup.string().required("This field is required"),
  google_tag_manager: Yup.string().required("This field is required"),
  search_console: Yup.string().required("This field is required"),
  facebook_pixel: Yup.string().required("This field is required"),
  bing_tracking_code: Yup.string().required("This field is required"),
  microsoft_clarity: Yup.string().required("This field is required"),
  logo: Yup.string().required("This field is required"),
  icon_image: Yup.string().required("This field is required"),
  email: Yup.string().required("This field is required"),
  phone: Yup.string().required("This field is required"),
  whatsapp_link: Yup.string().required("This field is required"),
  alt_phone: Yup.string(),
  android_app_url: Yup.string(),
  iphone_app_url: Yup.string(),
  copy_right_text: Yup.string().required("This field is required"),
  marketplace_name: Yup.string().required("This field is required"),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
  address: Yup.string().required("This field is required")
});

export const DesputeTextValidation = Yup.object().shape({
  dispute_right_text: Yup.string().required("This field is required"),
  dispute_left_text: Yup.string().required("This field is required"),
});

export const addClientValidations = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  link: Yup.string().required("This field is required."),
  status: Yup.boolean(),
});

export const ReplyDesputeValidation = Yup.object().shape({
  status: Yup.string().required("This field id required."),
  upload_attachment: Yup.string().required("This field id required."),
  content: Yup.string().required("This field id required."),
});

export const AddNewMedicineSchema = Yup.object().shape({
  product_name: Yup.string().required("This field is required"),
  // featured_image: Yup.string().required("This field is required"),
  status: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  category: Yup.array().min(1, "This Field is required.").required("Categories are required"),
  generic_name: Yup.string().required("This field is required"),
  composition: Yup.string().required("This field is required"),
  strength: Yup.string().required("This field is required"),
  storage: Yup.string().required("This field is required"),
  form: Yup.string().required("This field is required"),
  indication: Yup.string().required("This field is required"),
  packOf: Yup.string().required("This field is required"),
  marketer: Yup.string().required("This field is required"),
  brand: Yup.string().required("This field is required"),
  weight: Yup.number()
    .required("This field is required")
    .typeError("Weight must be a number"),
  minimum_order_quantity: Yup.number().min(1, "This field can not have negative values.").required("This field is required"),
  uses: Yup.string().required("This field is required."),
  age: Yup.array().min(1, "This Field is required.").required("This field is required."),
  substitute_product: Yup.array().required("This field is required."),
  tax_percentage: Yup.number().required("This field is required")
});

export const AddNewSpecificationValidation = Yup.object().shape({
  product: Yup.string().required("This field is rerquied."),
  message: Yup.string().required("This field is rerquied."),
});

export const AddNewManuFacturerValidation = Yup.object().shape({
  manufacturer_name: Yup.string().required("This field is required"),
  status: Yup.boolean(),
  description: Yup.string()
});

export const AddBrandValidation = Yup.object().shape({
  brand_name: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  type: Yup.string().required("This field is required")
});

export const productReviewValidation = Yup.object().shape({
  // product: Yup.string().required("This field is required."),
  // images: Yup.string().required("This field is required."),
  // customer: Yup.string().required("This field is required."),
  // star_rating: Yup.number()
  //   .required("This field is required.")
  //   .typeError("Rating must be a number.")
  //   .max(5, "Rating must be between 0 and 5."),
  // status: Yup.boolean().required("This field is required."),
  // youtube_video_link: Yup.string(),
  // text_content: Yup.string().required("This field is required."),
});

export const CMSHomeValidation = Yup.object().shape({
  image_one: Yup.string().required("This field is required"),
  image_two: Yup.string().required("This field is required"),
  image_three: Yup.string().required("This field is required"),
  image_four: Yup.string().required("This field is required"),
  image_five: Yup.string().required("This field is required"),
  image_six: Yup.string().required("This field is required"),
  image_seven: Yup.string().required("This field is required"),
  image_eight: Yup.string().required("This field is required"),
  image_nine: Yup.string().required("This field is required"),
  image_ten: Yup.string().required("This field is required"),
  image_eleven: Yup.string().required("This field is required"),
  image_twelve: Yup.string().required("This field is required"),
  image_thirteen: Yup.string().required("This field is required"),
  image_fourteen: Yup.string().required("This field is required"),
  slider_image: Yup.string().required("This field is required.")
});


export const PrivacyPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
})


export const CMSTermsConditionValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  thumbnail: Yup.string(),
  video: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const CMSShippingPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
});

export const CMSRefundReturnPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  thumbnail: Yup.string(),
  video: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});

export const CMSCustomerSupportPolicyValidation = Yup.object().shape({
  page_title: Yup.string().required("This field is required."),
  heading: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  banner_image: Yup.string(),
  video: Yup.string(),
  meta_title: Yup.string(),
  meta_description: Yup.string(),
  meta_keywords: Yup.string(),
  og_tag: Yup.string(),
  schema_markup: Yup.string(),
});
export const CMSCouponContentPage = Yup.object().shape({
  content: Yup.string().required("This field is required."),
  banner_image: Yup.string(),
});

export const AddNotificationValidation = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  title: Yup.string().required("This field is required"),
  content: Yup.string().required("This field is required."),
  date: Yup.string().required("This field is required."),
  time: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});
export const AddNotificationValidationWithouSchedule = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  title: Yup.string().required("This field is required"),
  content: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});

export const AddPushNotificationValidation = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  type: Yup.array().min(1, "Select at least one option"),
  title: Yup.string().required("This field is required"),
  // url: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  date: Yup.string().required("This field is required."),
  time: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});
export const AddPushNotificationValidationWithouSchedule = Yup.object().shape({
  to: Yup.array()
    .required("This field is required.")
    .min(1, "This field is required."),
  type: Yup.array().min(1, "Select at least one option"),
  title: Yup.string().required("This field is required"),
  // url: Yup.string().required("This field is required."),
  content: Yup.string().required("This field is required."),
  product_type: Yup.string().required("This field is required."),
  category: Yup.array().min(1, "Select at least one category"),
});
export const OrderDetailsValidation = Yup.object().shape({
  status: Yup.string().required("This field is required."),
  reason: Yup.string().required("This field is required."),
});

export const ReviewValidations = Yup.object().shape({
  customer: Yup.string().required("This field is required."),
  product: Yup.string().required("This field is required."),
  slug: Yup.string().required("This field is required."),
  star_rating: Yup.number()
    .min(1, "Minimum 1 Star Rating")
    .max(5, "Maximum 5 Star Rating")
    .required("This field is required."),
  text_content: Yup.string().required("This field is required"),
  images: Yup.mixed().required("Tis field is required")
});

export const TagsValidationForm = Yup.object().shape({
  name: Yup.string().required("This field is required"),
  slug: Yup.string(),
});
export const contactUsValidation = Yup.object().shape({
  email_details: Yup.string().required("This field is required"),
  phone_number_one: Yup.string()
    .required("This field is required.")
    .typeError("Phone number one must be a number."),
  phone_number_two: Yup.string().typeError(
    "Phone number two must be a number."
  ),
  banner_image: Yup.string().required("This field is required.")
});

export const CareerPageValidation = Yup.object().shape({
  image_one: Yup.string().required("This field is required."),
  image_five: Yup.string().required("This field is required."),
  image_ten: Yup.string().required("This field is required."),
  section_one: Yup.object().shape({
    banner_text: Yup.string().required("This field is required"),
  }),
});

export const AboutUsValidation = Yup.object().shape({
  section_two: Yup.object().shape({
    heading: Yup.string().required("This field is required"),
    text: Yup.string().required("This field is required"),
    box_heading_one: Yup.string().required("This field is required"),
    box_heading_two: Yup.string().required("This field is required"),
    box_heading_three: Yup.string().required("This field is required"),
    box_heading_four: Yup.string().required("This field is required"),
  }),
  section_three: Yup.object().shape({
    text: Yup.string().required("This field is required"),
  }),
  section_five: Yup.object().shape({
    text: Yup.string().required("This field is required"),
  }),
  // section_six: Yup.object().shape({
  //   founders_name: Yup.string().required("This field is required"),
  //   text: Yup.string().required("This field is required")
  // }),
  image_one: Yup.string().required("This field is required"),
  image_two: Yup.string().required("This field is required"),
  image_three: Yup.string().required("This field is required"),
  image_four: Yup.string().required("This field is required"),
  image_five: Yup.string().required("This field is required"),
  image_six: Yup.string().required("This field is required"),
  image_seven: Yup.string().required("This field is required"),
  image_eight: Yup.string().required("This field is required"),
  image_nine: Yup.string().required("This field is required"),
  image_ten: Yup.string().required("This field is required"),
  image_eleven: Yup.string().required("This field is required"),
  image_twelve: Yup.string().required("This field is required"),
  image_thirteen: Yup.string().required("This field is required"),
  image_fourteen: Yup.string().required("This field is required"),
  image_fifteen: Yup.string().required("This field is required"),
  image_sixteen: Yup.string().required("This field is required"),
  image_seventeen: Yup.string().required("This field is required"),
  image_eighteen: Yup.string().required("This field is required"),
});

export const AddCmsJobApplicatioValidation = Yup.object().shape({
  title: Yup.string().required("This field is required"),
  slug: Yup.string().required("This field is required"),
  no_positions: Yup.string().required("This field is required"),
  location: Yup.string().required("This field is required"),
  category: Yup.string().required("This field is required"),
  work_type: Yup.string().required("This field is required"),
  experience: Yup.string().required("This field is required"),
  status: Yup.string().required("This field is required"),
  description: Yup.string().required("This field is required"),
  banner_image: Yup.string().required("This field is required"),
});

export const AddNewMediaValidation = Yup.object().shape({
  // name: Yup.string().required("This field is required"),
  image: Yup.array().required("This field is required")
})

export const AddNewUsesValidation = Yup.object().shape({
  name: Yup.string().required("This field is required.")
})
export const AdminProfileValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  email: Yup.string().required("This field is required."),
  dob: Yup.date().required("This field is required."),
  phone_number: Yup.string().required("Thid field is required."),
  // profile_pic: Yup.string(),
})

export const ChangePasswordValidation = Yup.object().shape({
  password: Yup.string().required("This field is required."),
  password_confirmation: Yup.string().required("This field is required."),

})

export const DisputeMessageValidation = Yup.object().shape({
  message: Yup.string().required("This field id required.")
})

export const AddStaffValidation = Yup.object().shape({
  name: Yup.string().required("This field is required."),
  email: Yup.string().required("This field is required."),
  phone_number: Yup.string().required("This field is required."),
  // date: Yup.date().required("This field is required."),
  // password: Yup.string().required("This field is required."),
  // password_confirmation: Yup.string().required("This field is required."),
  // user_permission: Yup.array()
  profile_pic: Yup.string().required("This field is required.")
})

export const AddPopUpValidation = Yup.object().shape({
  type: Yup.string().required("This Field is required."),
  image: Yup.string().required("This field is reqired")
})

export const CurrencySettingValidation = Yup.object().shape({
  usd_price: Yup.number().min(1, "This field can not be negative").required("This field is required.")
})