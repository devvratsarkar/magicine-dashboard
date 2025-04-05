import React, { useEffect, useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Card, Dropdown, } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewCategorySchema } from "../../../commondata/formvalidations";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { TreeSelect } from "antd";
import SeoForm from "../../seo-page/SeoForm";
import { useEditCategoryMutation, useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryByIdQuery, useGetCategoryByParentChildQuery, useGetCategoryQuery, useGetProductMedicineEquipmentQuery } from "../../../redux/features/catalogueEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Select from "react-select";
import slugify from "slugify";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";
import { generateCategorySchemaMarkup } from "../../../commondata/schemaMarkup";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";

export default function EditCategory() {
  const navigate = useNavigate()

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedUses, setSelectedUses] = useState([]);
  const [selectedForm, setSelectedForm] = useState([]);


  const { id } = useParams();
  const [query, setQuery] = useState({
    status: "",
    type: ""
  })
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: singelCategoryRefetch } = useGetCategoryByIdQuery(id, { refetchOnMountOrArgChange: true })
  const { refetch } = useGetCategoryQuery(query)
  const [editBrand, { isLoading: updating }] = useEditCategoryMutation();
  const { data: parentChildCategory, refetch: parentRefetch } = useGetCategoryByParentChildQuery()
  const parentChildCategoryData = parentChildCategory?.context?.data;
  const categoryData = data?.data?.category;
  const [viewThubnail, setViewThubnail] = useState(true);
  const [selectedThubnail, setSelectedThubnail] = useState(null);

  const [imageOne, setImageOne] = useState(null)
  const [imageTwo, setImageTwo] = useState(null)
  const [imageThree, setImageThree] = useState(null)
  const [imageFour, setImageFour] = useState(null)
  const [imageFive, setImageFive] = useState(null)
  const [imageSix, setImageSix] = useState(null)

  const { data: productMedicineEquipment } = useGetProductMedicineEquipmentQuery()
  const productMedicineEquipmentData = productMedicineEquipment?.data

  const { data: brandList, isLoading: loadingData } = useGetBrandQuery(query)
  const { data: usesList, isLoading: usesLoading } = useGetAllUsesQuery()
  const { data: formDataList, isLoading: loadingForm } = useGetAllFormQuery()

  const usesListData = usesList?.data || []
  const brandData = brandList?.data?.allBrand || []

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setFieldValue('thumbnail_image', file)
    if (file) {
      setViewThubnail(false)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThubnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const initialValues = {
    category_name: "",
    thumbnail_image: "",
    thumbnail_image_status: true,
    status: "",
    category_description: "",
    long_description: "",
    slug: "",
    parent_category: "",
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
    banner_image_left_one_link: "",
    banner_image_left_one_name: "",
    banner_image_left_two: "",
    banner_image_left_two_status: true,
    banner_image_left_two_link: "",
    banner_image_left_two_name: "",
    is_megamenu: "",
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
    position: null
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, validateForm, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCategorySchema,
    onSubmit: async (values) => {

      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {

        if (key === 'spotlight' || key === 'top_deals' || key === 'trending_product' || key === 'top_product') {
          value.forEach(item => {
            formData.append(key, JSON.stringify(item));
          });
        }
        else if (key === 'brand' || key === 'uses' || key === 'form') {
          if (Array.isArray(value) && value.length > 0) {
            value.forEach(item => {
              formData.append(key, item);
            });
          } else {
            formData.append(key, []);
          }
        }
        else if (key === 'type' && !value) {
          formData.append(key, "medicine");
        }
        else {
          formData.append(key, value);
        }
      });
      try {
        const response = await editBrand({ categoryData: formData, categoryId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          singelCategoryRefetch()
          parentRefetch()
          navigate(`/catalogue/category`)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

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


  useEffect(() => {
    setFieldValue("category_name", categoryData?.category_name);
    setFieldValue("status", categoryData?.status);
    setFieldValue("slug", categoryData?.slug);
    setFieldValue("parent_category", categoryData?.parent_category?.id);
    setFieldValue("is_megamenu", categoryData?.is_megamenu);
    setFieldValue("meta_title", categoryData?.meta_title);
    setFieldValue("meta_description", categoryData?.meta_description);
    setFieldValue("meta_keywords", categoryData?.meta_keywords);
    setFieldValue("og_tag", categoryData?.og_tag);
    setFieldValue("schema_markup", categoryData?.schema_markup);
    setFieldValue("thumbnail_image", categoryData?.thumbnail_image || true);
    setFieldValue("thumbnail_image_status", categoryData?.thumbnail_image_status ?? true);
    setFieldValue("banner_img_center_one", categoryData?.banner_img_center_one ?? "");
    setFieldValue("banner_img_center_one_name", categoryData?.banner_img_center_one_name ?? "");
    setFieldValue("banner_img_center_one_link", categoryData?.banner_img_center_one_link ?? "");
    setFieldValue("banner_img_center_one_status", categoryData?.banner_img_center_one_status);
    setFieldValue("banner_img_center_two", categoryData?.banner_img_center_two ?? "");
    setFieldValue("banner_img_center_two_status", categoryData?.banner_img_center_two_status);
    setFieldValue("banner_img_center_two_name", categoryData?.banner_img_center_two_name ?? "");
    setFieldValue("banner_img_center_two_link", categoryData?.banner_img_center_two_link ?? "");
    setFieldValue("banner_img_center_three", categoryData?.banner_img_center_three ?? "");
    setFieldValue("banner_img_center_three_name", categoryData?.banner_img_center_three_name ?? "");
    setFieldValue("banner_img_center_three_link", categoryData?.banner_img_center_three_link ?? "");
    setFieldValue("banner_img_center_three_status", categoryData?.banner_img_center_three_status);
    setFieldValue("banner_img_center_four", categoryData?.banner_img_center_four ?? "");
    setFieldValue("banner_img_center_four_name", categoryData?.banner_img_center_four_name ?? "");
    setFieldValue("banner_img_center_four_link", categoryData?.banner_img_center_four_link ?? "");
    setFieldValue("banner_img_center_four_status", categoryData?.banner_img_center_four_status);
    setFieldValue("banner_image_left_one", categoryData?.banner_image_left_one ?? "");
    setFieldValue("banner_image_left_one_name", categoryData?.banner_image_left_one_name ?? "");
    setFieldValue("banner_image_left_one_link", categoryData?.banner_image_left_one_link ?? "");
    setFieldValue("banner_image_left_one_status", categoryData?.banner_image_left_one_status);
    setFieldValue("banner_image_left_two", categoryData?.banner_image_left_two ?? "");
    setFieldValue("banner_image_left_two_name", categoryData?.banner_image_left_two_name ?? "");
    setFieldValue("banner_image_left_two_link", categoryData?.banner_image_left_two_link ?? "");
    setFieldValue("banner_image_left_two_status", categoryData?.banner_image_left_two_status);
    setFieldValue("seo_discount", categoryData?.seo_discount);
    setFieldValue("type", categoryData?.type);
    setFieldValue("shop_brand_status", categoryData?.shop_brand_status);
    setFieldValue("shop_category_status", categoryData?.shop_category_status);
    setFieldValue("type", categoryData?.type);
    setFieldValue("position", categoryData?.position);

    setSelectedBrands(categoryData?.brand)
    setFieldValue("brand", categoryData?.brand)

    setSelectedUses(categoryData?.uses)
    setFieldValue("uses", categoryData?.uses)

    setSelectedForm(categoryData?.form)
    setFieldValue("form", categoryData?.form)

    setFieldValue("spotlight", categoryData && categoryData?.spotlight?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));
    setFieldValue("spotlight_status", categoryData?.spotlight_status ?? true);

    setFieldValue("top_product", categoryData && categoryData?.top_product?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));
    setFieldValue("top_product_status", categoryData?.top_product_status ?? true);

    setFieldValue("trending_product", categoryData && categoryData?.trending_product?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));

    setFieldValue("trending_product_status", categoryData?.trending_product_status ?? true);

    setFieldValue("top_deals", categoryData && categoryData?.top_deals?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));

    setFieldValue("top_deals_status", categoryData?.top_deals_status ?? true);

    if (categoryData) {
      setFieldValue("category_description", categoryData.category_description);
      setFieldValue("long_description", categoryData.long_description);
    }

  }, [categoryData])




  const options = productMedicineEquipmentData ? productMedicineEquipmentData?.filter((item) => item?.deleted_at === null && (item?.status === "active" || item?.status === true))?.map((item) => ({
    label: item.product_name,
    value: JSON.stringify({ id: item.id, type: item.type })
  })) : [];

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
        metaTitle = `Up to  ${seoDiscount}% Off: Buy ${productName} Products Online at Best Price - Magicine Pharma`;
      } else {
        metaTitle = `Up to  ${seoDiscount}% Off: Buy ${productName} Medicines Online at Best Price - Magicine Pharma`;
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
    const type = event?.target?.value;
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
      <meta property="og:image" content="${categoryData && categoryData.thumbnail_image ? categoryData.thumbnail_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">

      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${values.meta_title || "undefined"}">
      <meta name="twitter:description" content="${values.meta_description || "undefined"}">
      <meta name="twitter:url" content="${USER_BASE_URL}/categories/${values.slug || "undefined"}">
      <meta name="twitter:image" content="${categoryData && categoryData.thumbnail_image ? categoryData.thumbnail_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">
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

    let thumbNailData;
    if (categoryData?.thumbnail_image) {
      thumbNailData = categoryData.thumbnail_image
    } else {
      thumbNailData = `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`
    }


    const schemaMarkup = generateCategorySchemaMarkup({
      ...values,
      thumbnail_image: thumbNailData,
    });
    setFieldValue("schema_markup", schemaMarkup);
  }, [values.category_name, values.thumbnail_image, values.long_description]);

  const brandOptions = Array.isArray(brandData) ? brandData.map((item) => ({
    label: item?.brand_name || "Unknown",
    value: String(item?.id)
  })) : [];


  const usesOptions = Array.isArray(usesListData) ? usesListData.map((item) => ({
    label: item?.name || "Unknown",
    value: String(item?.id)
  })) : [];


  const formDataOptions = Array.isArray(formDataList?.data) ? formDataList.data.map((item) => ({
    label: item?.name || "Unknown",
    value: String(item?.id)
  })) : [];

  const handleBrandChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedBrands(selectedOptions);
    setFieldValue("brand", values);
  };

  const handleUsesChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedUses(selectedOptions);
    setFieldValue("uses", values);
  };

  const handleFormChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedForm(selectedOptions);
    setFieldValue("form", values);
  };


  useEffect(() => {
    if (categoryData) {
      setSelectedBrands(brandOptions.filter(option => categoryData.brand?.includes(option.value)));
      setSelectedUses(usesOptions.filter(option => categoryData.uses?.includes(option.value)));
      setSelectedForm(formDataOptions.filter(option => categoryData.form?.includes(option.value)));
    }
  }, [categoryData, formDataList, brandData, usesListData]);


  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }
  if (isSuccess) {
    return (
      <>
        {
          loadingData && <Loader /> || usesLoading && <Loader /> || loadingForm && <Loader />
        }
        <Row className="align-items-center">
          <Col>
            <PageHeader titles="Edit Category" active={["Edit Category/"]} items={["Home", "Category List"]} links={["/dashboard", "/catalogue/category/"]} />
          </Col>
          <Col className="text-end">
            <Link to="/catalogue/add-new-category" className="btn btn-primary text-white me-3" >Add category</Link>
            <Link to="/catalogue/category" className="btn btn-success text-white me-3" >View All category</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
              </Card.Header>
              <Card.Body className="edit_product">
                {updating && <Loader />}
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                  handleScrollToError();
                }} className="add_category_form">
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
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center">
                          {/* Show the thumbnail if available */}
                          {viewThubnail ? (
                            <div className="position-relative">
                              <Link>
                                <img src={categoryData?.thumbnail_image} alt={categoryData.category_name} width={50} height={50} />
                              </Link>
                              <span className="position-absolute">
                                <p
                                  className="p-0 px-1 cursor-pointer"
                                  onClick={() => {
                                    setViewThubnail(false);
                                    setSelectedThubnail(null);
                                    setFieldValue('thumbnail_image', "");
                                  }}
                                >
                                  <i className="icon icon-close text-danger"></i>
                                </p>
                              </span>
                            </div>
                          ) : (
                            selectedThubnail && (
                              <div className="position-relative">
                                <img src={selectedThubnail} alt={categoryData?.category_name || 'thumbnail'} width={50} height={50} />
                              </div>
                            )
                          )}
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            name="thumbnail_image"
                            onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Status <span className="text-danger"></span></Form.Label>
                        <Form.Select name="status" value={values.status} onChange={handleChange} onBlur={handleBlur}>
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
                    <Col as={Col} md={6}>
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
                        setContents={values.category_description}
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
                        setContents={values.long_description}
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
                              checked={values?.banner_img_center_one_status ? true : false}
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
                              checked={values?.banner_img_center_two_status ? true : false}
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
                              checked={values?.banner_img_center_three_status ? true : false}
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
                              checked={values?.banner_img_center_four_status ? true : false}
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
                                checked={values?.banner_image_left_one_status ? true : false}
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
                          name="banner_image_left_one_link"
                          value={values?.banner_image_left_one_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image 5 Left Side 1 Name</Form.Label>
                        <Form.Control
                          name="banner_image_left_one_name"
                          value={values?.banner_image_left_one_name}
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
                                checked={values?.banner_image_left_two_status ? true : false}
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
                          name="banner_image_left_two_link"
                          value={values?.banner_image_left_two_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image 6 Left Side 2 Name</Form.Label>
                        <Form.Control
                          name="banner_image_left_two_name"
                          value={values?.banner_image_left_two_name}
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
                          value={values?.spotlight?.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
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
                          value={values?.top_deals?.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
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
                          value={values?.trending_product?.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
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
                          value={values?.top_product?.map((item) => ({ label: item.product_name, value: JSON.stringify({ id: item.id, type: item.type }) }))}
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
                          value={values.type || "medicine"}
                          onChange={handleTypeChange}
                          onBlur={handleBlur}
                        >
                          {/* <option value="">Select</option> */}
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
                          value={brandOptions.filter(option => selectedBrands?.some(selected => selected.value == option.value))}
                          onChange={handleBrandChange}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Uses</Form.Label>
                        <Select
                          name="uses"
                          options={usesOptions}
                          value={usesOptions.filter(option => selectedUses?.some(selected => selected.value == option.value))}
                          onChange={handleUsesChange}
                          isMulti
                          isSearchable
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
                          options={formDataOptions}
                          value={formDataOptions.filter(option => selectedForm?.some(selected => selected.value == option.value))}
                          onChange={handleFormChange}
                          isMulti
                          isSearchable
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
                          id="is_megamenu"
                          name="is_megamenu"
                          className="mb-0"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          checked={values.is_megamenu}
                        />
                        <Form.Label htmlFor="is_megamenu" className="mt-0">
                          Add To Mega Menu
                        </Form.Label>
                        {errors.is_megamenu && touched.is_megamenu ? (
                          <p className="errors">{errors.is_megamenu}</p>
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
                      Update
                    </Button>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row >
      </>
    );
  }
}
