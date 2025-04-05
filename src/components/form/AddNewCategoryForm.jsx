import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewCategorySchema } from "../../commondata/formvalidations";
import slugify from "slugify";
import { TreeSelect } from "antd";
import SeoForm from "../seo-page/SeoForm";
import { useAddNewCategoryMutation, useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryByParentChildQuery, useGetCategoryQuery, useGetProductMedicineEquipmentQuery } from "../../redux/features/catalogueEndPoints";
import toast from "react-hot-toast";
import Loader from "../../layouts/layoutcomponents/loader";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Select from "react-select";
import { useNavigate } from "react-router-dom";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../utils/config";
import { generateCategorySchemaMarkup } from "../../commondata/schemaMarkup";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";



export default function AddNewCategoryForm() {
  const navigate = useNavigate()
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedUses, setSelectedUses] = useState([]);
  const [selectedForm, setSelectedForm] = useState([]);
  const [query, setQuery] = useState({
    status: "",
    type: ""
  })

  const { data: formDataList, isLoading: loadingForm } = useGetAllFormQuery()

  const [imageOne, setImageOne] = useState(null)
  const [imageTwo, setImageTwo] = useState(null)
  const [imageThree, setImageThree] = useState(null)
  const [imageFour, setImageFour] = useState(null)
  const [imageFive, setImageFive] = useState(null)
  const [imageSix, setImageSix] = useState(null)

  const { data, refetch } = useGetCategoryQuery(query)
  const catergoryData = data?.data?.activeCategories || []

  const [addNewCategory, { isLoading }] = useAddNewCategoryMutation()
  const { data: parentChildCategory, refetch: parentCategory } = useGetCategoryByParentChildQuery()
  const { data: productMedicineEquipment } = useGetProductMedicineEquipmentQuery()
  const productMedicineEquipmentData = productMedicineEquipment?.data
  const parentChildCategoryData = parentChildCategory?.context?.data;

  const { data: brandList, isLoading: loadingData } = useGetBrandQuery(query)
  const { data: usesList, isLoading: usesLoading } = useGetAllUsesQuery()

  const usesListData = usesList?.data || []
  const brandData = brandList?.data?.allBrand || []

  const initialValues = {
    category_name: "",
    thumbnail_image: "",
    thumbnail_image_status: true,
    status: true,
    category_description: "",
    long_description: "",
    slug: "",
    parent_category: null,
    banner_img_center_one: "",
    banner_img_center_one_status: true,
    banner_img_center_one_link: "",
    banner_img_center_one_name: "",
    banner_img_center_two: "",
    banner_img_center_two_status: true,
    banner_img_center_two_link: "",
    banner_img_center_two_name: "",
    banner_img_center_three: "",
    banner_img_center_three_status: true,
    banner_img_center_three_link: "",
    banner_img_center_three_name: "",
    banner_img_center_four: "",
    banner_img_center_four_status: true,
    banner_img_center_four_link: "",
    banner_img_center_four_name: "",
    banner_image_left_one: "",
    banner_image_left_one_status: true,
    banner_imgage_left_one_link: "",
    banner_imgage_left_one_name: "",
    banner_image_left_two: "",
    banner_image_left_two_status: true,
    banner_imgage_left_two_link: "",
    banner_imgage_left_two_name: "",
    is_megaMenu: true,
    meta_title: "",
    og_tag: "",
    meta_description: "",
    meta_keywords: "",
    schema_markup: "",
    spotlight: [],
    spotlight_status: true,
    top_deals: [],
    top_deals_status: true,
    trending_product: [],
    trending_product_status: true,
    top_product: [],
    top_product_status: true,
    seo_discount: "",
    type: "medicine",
    brand: [],
    uses: [],
    form: [],
    shop_brand_status: true,
    shop_category_status: true,
    position: null,
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCategorySchema,
    onSubmit: async (values) => {
      console.log("values", values)
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'spotlight' || key === 'top_deals' || key === 'trending_product' || key === 'top_product' || key === 'brand' || key === 'uses' || key === "form") {
          value.forEach(item => {
            formData.append(key, JSON.stringify(item));
          });
        } else {
          formData.append(key, value);
        }
      });

      try {
        const response = await addNewCategory(formData);
        if (response?.data?.http_status_code === 201) {
          refetch()
          parentCategory()
          navigate(`/catalogue/category`)
          toast.success(response.data.message)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });


  const brandOptions = Array.isArray(brandData) && brandData?.length > 0 ? brandData?.map((item) => ({
    label: item?.brand_name,
    value: item?.id
  })) : []

  const usesOptions = Array.isArray(usesListData) && usesListData?.length > 0 ? usesListData?.map((item) => ({
    label: item?.name,
    value: item?.id
  })) : []

  const formDataOptions = Array.isArray(formDataList?.data) && formDataList?.data?.length > 0 ? formDataList?.data?.map((item) => ({
    label: item?.name,
    value: item?.id
  })) : []

  const handleScrollToError = async () => {
    const formErrors = await validateForm();
    const errorFields = Object.keys(formErrors);

    if (errorFields.length > 0) {
      const errorElement = document.getElementsByName(errorFields[0])[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
        errorElement.focus();
      }
    }
  };

  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };

  const options = productMedicineEquipmentData
    ?.filter((item) => item?.deleted_at === null && (item?.status == "active" || item?.status == true))
    ?.map((item) => ({
      label: item.product_name,
      value: JSON.stringify({ id: item.id, type: item.type })
    }));

  const handleSelectChange = (field, selectedOptions) => {
    const parsedOptions = selectedOptions?.map(option => {
      const value = JSON.parse(option.value);
      return { ...value, product_name: option.label };
    }) || [];
    setFieldValue(field, parsedOptions);
  }


  const generateMetaTitle = (productName, seoDiscount, type) => {
    let metaTitle;
    if (type === "general_product") {
      metaTitle = `Buy ${productName} Products Online at Best Price | Magicine Pharma`;
    } else {
      metaTitle = `Buy ${productName} Medicines Online at Best Price | Magicine Pharma`;
    }

    if (seoDiscount) {
      if (type === "general_product") {
        metaTitle = `Up to  ${seoDiscount}% Off : Buy ${productName} Products Online at Best Price - Magicine Pharma`;
      } else {
        metaTitle = `Up to  ${seoDiscount}% Off : Buy ${productName} Medicines Online at Best Price - Magicine Pharma`;
      }
    }

    setFieldValue("meta_title", metaTitle.trim());
  };

  const generateMetaDescription = (productName, seoDiscount, type) => {
    let metaDescription;

    if (type === "general_product") {
      metaDescription = `Buy ${productName} Products Online from Magicine Pharma and get the fastest home delivery at the best price.`;
      if (seoDiscount) {
        metaDescription = `Buy ${productName} Products Online from Magicine Pharma${seoDiscount ? `. Up to ${seoDiscount}% Off on ${productName} products online` : ""} and get the fastest home delivery at the best price.`;
      }

    } else {
      if (seoDiscount) {
        metaDescription = `Magicine Pharma Largest supplier of ${productName}. Up to ${seoDiscount}% Off & order ${productName} specialty Medicines and get ✔ Fastest Delivery.`;

      } else {
        metaDescription = `Magicine Pharma Largest supplier of ${productName}. Order ${productName} Medicines and get ✔ Fastest Delivery.`;
      }
    }

    setFieldValue("meta_description", metaDescription.trim());
  };

  const handleCategoryNameChange = (event) => {
    handleChange(event);
    const productName = event.target.value;
    const seoDiscount = values.seo_discount;
    const type = values.type;

    generateSlug(productName);
    generateMetaTitle(productName, seoDiscount, type);
    generateMetaDescription(productName, seoDiscount, type);
  };

  const handleSeoDiscountChange = (event) => {
    handleChange(event);
    const seoDiscount = event.target.value;
    const productName = values.category_name;
    const type = values.type;

    generateMetaTitle(productName, seoDiscount, type);
    generateMetaDescription(productName, seoDiscount, type);
  };

  const handleTypeChange = (event) => {
    handleChange(event);
    const type = event.target.value;
    const productName = values.category_name;
    const seoDiscount = values.seo_discount;
    generateMetaTitle(productName, seoDiscount, type);
    generateMetaDescription(productName, seoDiscount, type);
  };

  const generateOgAndTwitterTag = () => {
    const ogTag = `
      <!-- Open Graph Tags -->
      <meta property="og:type" content="website">
      <meta property="og:title" content='${values.meta_title || "undefined"}'>
      <meta property="og:description" content="${values.meta_description || "undefined"}">
      <meta property="og:url" content="${USER_BASE_URL}/categories/${values.slug || "undefined"}">
      <meta property="og:site_name" content="Magicine Pharma">
      <meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">

      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${values.meta_title || "undefined"}">
      <meta name="twitter:description" content="${values.meta_description || "undefined"}">
      <meta name="twitter:url" content="${USER_BASE_URL}/categories/${values.slug || "undefined"}">
      <meta name="twitter:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">
      <meta name="twitter:site" content="@MagicinePharma">
    `;

    setFieldValue("og_tag", ogTag.trim());
  }

  useEffect(() => {
    if (values.meta_title && values.meta_description && values.slug) {
      generateOgAndTwitterTag();
    }
  }, [values.meta_title, values.meta_description, values.slug]);

  useEffect(() => {

    const schemaMarkup = generateCategorySchemaMarkup({
      ...values,
      thumbnail_image: `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`
    });
    setFieldValue("schema_markup", schemaMarkup);
  }, [values.category_name, values.thumbnail_image, values.long_description, values.slug]);

  const handleBrandChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedBrands(values)
    setFieldValue("brand", values);
  };

  const handleUsesChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedUses(values)
    setFieldValue("uses", values);
  };
  const handleFormChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedForm(values)
    setFieldValue("form", values);
  };


  return (
    <>
      {
        loadingData && <Loader /> || usesLoading && <Loader /> || loadingForm && <Loader />
      }
      <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        handleScrollToError();
      }} className="add_category_form">
        {isLoading && <Loader />}
        <Row className="mb-4">
          <Form.Group as={Col} md="6">
            <Form.Label>
              Category Name <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="category_name"
              onChange={handleCategoryNameChange}
              onBlur={handleBlur}
              value={values.category_name}
            />
            {errors.category_name && touched.category_name ? (
              <p className={`error`}>{errors.category_name}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="6">
            <Row>
              <Col as={Col} md={10}>
                <Form.Label>Thumbnail Image (JPG,JPEG,PNG)</Form.Label>
              </Col>
              <Col as={Col} md={2}>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    name="thumbnail_image_status"
                    checked={values?.thumbnail_image_status}
                    onChange={handleChange}
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>
              </Col>
            </Row>
            <Form.Control
              type="file"
              accept=".jpg,.jpeg,.png,.webp"
              name="thubnail_image"
              onChange={(e) => setFieldValue('thumbnail_image', e.target.files[0])}
              onBlur={handleBlur}
            />
          </Form.Group>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Status <span className="text-danger">*</span></Form.Label>
              <Form.Select name="status" value={values.status.toString()} onChange={(e) => {
                const newValue = e.target.value === 'true';
                handleChange({
                  target: {
                    name: 'status',
                    value: newValue,
                  },
                });
              }} onBlur={handleBlur}>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </Form.Select>
              {
                errors.status && touched.status ? (
                  <p className={`error`}>{errors.status}</p>
                ) : null
              }
            </Form.Group>
          </Col>
          <Col as={Col} md="6">
            <Form.Group>
              <Form.Label>
                Slug <span className="required_icon">*</span>
              </Form.Label>
              <Form.Control
                type="text"
                name="slug"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.slug}
              />
              {errors.slug && touched.slug ? (
                <p className={`error`}>{errors.slug}</p>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Category Description</Form.Label>
            <SunEditor
              // className="form-control mb-4"
              name="category_description"
              onChange={(content) => setFieldValue("category_description", content)}
              onBlur={() => setFieldTouched("category_description", true)}
              setOptions={options_for_sunEditor}
              value={values.category_description}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Long Description</Form.Label>
            <SunEditor
              // className="form-control mb-4"
              name="long_description"
              onChange={(content) => setFieldValue("long_description", content)}
              onBlur={() => setFieldTouched("long_description", true)}
              setOptions={options_for_sunEditor}
              value={values.long_description}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="12">
            <Form.Label>Select Parent Category</Form.Label>
            <TreeSelect
              className="w-100"
              value={values.parent_category}
              name="parent_category"
              onChange={(value) => {
                handleChange({
                  target: { name: "parent_category", value },
                });
              }}
              onBlur={handleBlur}
              showSearch
              treeData={parentChildCategoryData}
              filterTreeNode={(inputValue, treeNode) => {
                return treeNode.label.toLowerCase().includes(inputValue.toLowerCase());
              }}
              placeholder="Search categories"
            />
          </Form.Group>
        </Row>
        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Row>
              <Col as={Col} md={10}>
                <Form.Label>Banner Image 1 center (JPG, JPEG, PNG, 2MB)</Form.Label>
              </Col>
              <Col as={Col} md={2}>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    name="banner_img_center_one_status"
                    onChange={handleChange}
                    checked={values?.banner_img_center_one_status}
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>
              </Col>
            </Row>
            <Row>
              <Col as={Col} md={8}>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="banner_img_center_one"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileURL = URL.createObjectURL(file);
                      setFieldValue('banner_img_center_one', file);
                      setImageOne(fileURL);
                    }
                  }}
                  onBlur={handleBlur}
                />
              </Col>
              <Col as={Col} md={4}>
                <img src={imageOne || values?.banner_img_center_one} alt={values?.category_name} className="border border-dark rounded-3" width={100} height={100} />
              </Col>
            </Row>
          </Form.Group>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 1 Link</Form.Label>
              <Form.Control
                name="banner_img_center_one_link"
                value={values?.banner_img_center_one_link}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 1 Name</Form.Label>
              <Form.Control
                name="banner_img_center_one_name"
                value={values?.banner_img_center_one_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group as={Col} md="6">
            <Row>
              <Col as={Col} md={10}>
                <Form.Label>Banner Image 2 center (JPG, JPEG, PNG, 2MB)</Form.Label>
              </Col>
              <Col as={Col} md={2}>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    name="banner_img_center_two_status"
                    onChange={handleChange}
                    checked={values?.banner_img_center_two_status}
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>

              </Col>
            </Row>
            <Row>
              <Col as={Col} md={8}>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="banner_img_center_two"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileURL = URL.createObjectURL(file);
                      setFieldValue('banner_img_center_two', file);
                      setImageTwo(fileURL);
                    }
                  }}
                  onBlur={handleBlur}
                />
              </Col>
              <Col as={Col} md={4}>
                <img src={imageTwo || values?.banner_img_center_two} alt={values?.category_name ?? ""} className="border border-dark" width={100} height={100} />
              </Col>
            </Row>
          </Form.Group>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 2 Link</Form.Label>
              <Form.Control
                name="banner_img_center_two_link"
                value={values?.banner_img_center_two_link}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 2 Name</Form.Label>
              <Form.Control
                name="banner_img_center_two_name"
                value={values?.banner_img_center_two_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Row>
              <Col as={Col} md={10}>
                <Form.Label>Banner Image 3 center (JPG, JPEG, PNG, 2MB)</Form.Label>
              </Col>
              <Col as={Col} md={2}>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    name="banner_img_center_three_status"
                    onChange={handleChange}
                    checked={values?.banner_img_center_three_status}
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>

              </Col>
            </Row>
            <Row>
              <Col as={Col} md={8}>

                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="banner_img_center_three"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileURL = URL.createObjectURL(file);
                      setFieldValue('banner_img_center_three', file);
                      setImageThree(fileURL);
                    }
                  }}
                  onBlur={handleBlur}
                />
              </Col>
              <Col as={Col} md={4}>
                <img src={imageThree || values?.banner_img_center_three} alt={values?.category_name ?? ""} className="border border-dark" width={100} height={100} />
              </Col>
            </Row>
          </Form.Group>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 3 Link</Form.Label>
              <Form.Control
                name="banner_img_center_three_link"
                value={values?.banner_img_center_three_link}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 3 Name</Form.Label>
              <Form.Control
                name="banner_img_center_three_name"
                value={values?.banner_img_center_three_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group as={Col} md="6">
            <Row>
              <Col as={Col} md={10}>
                <Form.Label>Banner Image 4 center (JPG, JPEG, PNG, 2MB)</Form.Label>
              </Col>
              <Col as={Col} md={2}>
                <label className="custom-switch">
                  <input
                    type="checkbox"
                    className="custom-switch-input"
                    name="banner_img_center_four_status"
                    onChange={handleChange}
                    checked={values?.banner_img_center_four_status}
                  />
                  <span className="custom-switch-indicator custum-green-btn"></span>
                </label>

              </Col>
            </Row>
            <Row>
              <Col as={Col} md={8}>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="banner_img_center_four"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileURL = URL.createObjectURL(file);
                      setFieldValue('banner_img_center_four', file);
                      setImageFour(fileURL);
                    }
                  }}
                  onBlur={handleBlur}
                />
              </Col>
              <Col>
                <img src={imageFour || values?.banner_img_center_four} alt={values?.category_name ?? ""} className="border border-dark" width={100} height={100} />
              </Col>
            </Row>
          </Form.Group>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 4 Link</Form.Label>
              <Form.Control
                name="banner_img_center_four_link"
                value={values?.banner_img_center_four_link}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 4 Name</Form.Label>
              <Form.Control
                name="banner_img_center_four_name"
                value={values?.banner_img_center_four_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Form.Group as={Col} md="6">
            <Form.Label>
              <Row>
                <Col as={Col} md={10}>
                  <Form.Label>Banner Image 5 Left Side 1 (JPG, JPEG, PNG, 2MB)</Form.Label>
                </Col>
                <Col as={Col} md={2}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      className="custom-switch-input"
                      name="banner_image_left_one_status"
                      onChange={handleChange}
                      checked={values?.banner_image_left_one_status}
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>
                </Col>
              </Row>
            </Form.Label>
            <Row>
              <Col as={Col} md={8}>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="banner_image_left_one"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileURL = URL.createObjectURL(file);
                      setFieldValue('banner_image_left_one', file);
                      setImageFive(fileURL);
                    }
                  }}
                  onBlur={handleBlur}
                />
              </Col>
              <Col as={Col} md={4}>
                <img src={imageFive ?? values?.banner_image_left_one} alt={values?.category_name || ""} className="border border-dark" width={100} height={100} />
              </Col>
            </Row>
          </Form.Group>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 5 Left Side 1 Link</Form.Label>
              <Form.Control
                name="banner_imgage_left_one_link"
                value={values?.banner_imgage_left_one_link}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 5 Left Side 1 Name</Form.Label>
              <Form.Control
                name="banner_imgage_left_one_name"
                value={values?.banner_imgage_left_one_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Form.Group as={Col} md="6">
            <Form.Label>
              <Row>
                <Col as={Col} md={10}>
                  <Form.Label>Banner Image 6 Left Side 2 (JPG, JPEG, PNG, 2MB)</Form.Label>
                </Col>
                <Col as={Col} md={2}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      className="custom-switch-input"
                      name="banner_image_left_two_status"
                      onChange={handleChange}
                      checked={values?.banner_image_left_two_status}
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>

                </Col>
              </Row>
            </Form.Label>
            <Row>
              <Col as={Col} md={8}>
                <Form.Control
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  name="banner_image_left_two"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const fileURL = URL.createObjectURL(file);
                      setFieldValue('banner_image_left_two', file);
                      setImageSix(fileURL);
                    }
                  }}
                  onBlur={handleBlur}
                />
              </Col>
              <Col as={Col} md={4}>
                <img src={imageSix || values?.banner_image_left_two} alt={values?.category_name || ""} className="border border-dark" width={100} height={100} />
              </Col>
            </Row>
          </Form.Group>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 6 Left Side 2 Link</Form.Label>
              <Form.Control
                name="banner_imgage_left_two_link"
                value={values?.banner_imgage_left_two_link}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Banner Image 6 Left Side 2 Name</Form.Label>
              <Form.Control
                name="banner_imgage_left_two_name"
                value={values?.banner_imgage_left_two_name}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col as={Col} md={6}>
            <Form.Group>
              <Row >
                <Col as={Col} md={10}>
                  <Form.Label>In The Spotlight</Form.Label>
                </Col>
                <Col as={Col} md={2}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      className="custom-switch-input"
                      name="spotlight_status"
                      onChange={handleChange}
                      checked={values?.spotlight_status}
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>
                </Col>
              </Row>
              <Select
                name="spotlight"
                value={values.spotlight.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
                options={options}
                onChange={(selectedOptions) => handleSelectChange('spotlight', selectedOptions)}
                onBlur={handleBlur}
                isMulti
                className="rounded-4"
                isSearchable
              />
            </Form.Group>
          </Col>

          <Col as={Col} md={6}>
            <Form.Group>
              <Row>
                <Col as={Col} md={10}>
                  <Form.Label>Suggested Products</Form.Label>
                </Col>
                <Col as={Col} md={2}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      className="custom-switch-input"
                      name="top_deals_status"
                      onChange={handleChange}
                      checked={values?.top_deals_status}
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>
                </Col>
              </Row>
              <Select
                name="top_deals"
                value={values.top_deals.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
                options={options}
                onChange={(selectedOptions) => handleSelectChange('top_deals', selectedOptions)}
                onBlur={handleBlur}
                isMulti
                className="rounded-4"
                isSearchable
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Row>
                <Col as={Col} md={10}>
                  <Form.Label>Trending Products</Form.Label>
                </Col>
                <Col as={Col} md={2}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      className="custom-switch-input"
                      name="trending_product_status"
                      onChange={handleChange}
                      checked={values?.trending_product_status}
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>
                </Col>
              </Row>
              <Select
                name="trending_product"
                value={values.trending_product.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
                options={options}
                onChange={(selectedOptions) => handleSelectChange('trending_product', selectedOptions)}
                onBlur={handleBlur}
                isMulti
                className="rounded-4"
                isSearchable
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Row>
                <Col as={Col} md={10}>
                  <Form.Label>Top Products</Form.Label>
                </Col>
                <Col as={Col} md={2}>
                  <label className="custom-switch">
                    <input
                      type="checkbox"
                      className="custom-switch-input"
                      name="top_product_status"
                      onChange={handleChange}
                      checked={values?.top_product_status}
                    />
                    <span className="custom-switch-indicator custum-green-btn"></span>
                  </label>
                </Col>
              </Row>
              <Select
                name="top_product"
                value={values.top_product.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
                options={options}
                onChange={(selectedOptions) => handleSelectChange('top_product', selectedOptions)}
                onBlur={handleBlur}
                isMulti
                className="rounded-4"
                isSearchable
              />
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>SEO Discount</Form.Label>
              <Form.Control
                type="number"
                name="seo_discount"
                value={values.seo_discount}
                onChange={handleSeoDiscountChange}
                onBlur={handleBlur}
              />
              {
                errors.seo_discount && touched.seo_discount ? (
                  <p className="text-danger">{errors.seo_discount}</p>
                ) : null
              }
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Type</Form.Label>
              <Form.Select
                name="type"
                value={values.type}
                onChange={handleTypeChange}
                onBlur={handleBlur}
              >
                <option value="general_product">General Product</option>
                <option value="medicine">Medicine</option>
                <option value="equipment">Surgical Equipment</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Brand</Form.Label>
              <Select
                name="brand"
                options={brandOptions}
                value={brandOptions.filter(option => selectedBrands.includes(option.value))}
                onChange={handleBrandChange}
                isMulti
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Uses</Form.Label>
              <Select
                name="uses"
                options={usesOptions}
                value={usesOptions.filter(option => selectedUses.includes(option.value))}
                onChange={handleUsesChange}
                isMulti
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Form</Form.Label>
              <Select
                name="form"
                value={formDataOptions.filter(option => selectedForm.includes(option.value))}
                options={formDataOptions}
                onChange={handleFormChange}
                onBlur={handleBlur}
                isSearchable
                isMulti
              />
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Position</Form.Label>
              <Form.Control
                name="position"
                type="number"
                value={values.position}
                onChange={handleChange}
                onBlur={handleBlur}
                min={1}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <SeoForm
            handleChange={handleChange}
            values={values}
            errors={errors}
            handleBlur={handleBlur}
            touched={touched}
            readOnlyStatus={false}
          />
        </Row>

        <Row>
          <Col as={Col} md={6} className="mt-5 ms-5">
            <Form.Group className="mb-0">
              <Form.Check
                type="checkbox"
                id="is_megaMenu"
                name="is_megaMenu"
                className="mb-0"
                onChange={handleChange}
                onBlur={handleBlur}
                checked={values.is_megaMenu}
              />
              <Form.Label htmlFor="is_megaMenu" className="mt-0">
                Add To Mega Menu
              </Form.Label>
              {errors.is_megaMenu && touched.is_megaMenu ? (
                <p className="errors">{errors.is_megaMenu}</p>
              ) : null}
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Show By Category Status</Form.Label>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  className="custom-switch-input"
                  name="shop_category_status"
                  onChange={handleChange}
                  checked={values?.shop_category_status}
                />
                <span className="custom-switch-indicator custum-green-btn"></span>
              </label>
            </Form.Group>
          </Col>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Show By Brand Status</Form.Label>
              <label className="custom-switch">
                <input
                  type="checkbox"
                  className="custom-switch-input"
                  name="shop_brand_status"
                  onChange={handleChange}
                  checked={values?.shop_brand_status}
                />
                <span className="custom-switch-indicator custum-green-btn"></span>
              </label>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mt-5">
          <Button type="submit" className="btn-primary mx-auto w-auto">
            Save
          </Button>
        </Row>
      </Form>
    </>
  );
}
