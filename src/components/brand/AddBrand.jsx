import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, Form, } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { AddBrandValidation } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm"
import { useAddNewBrandMutation, useGetBrandQuery, useGetProductMedicineEquipmentQuery } from "../../redux/features/catalogueEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Select from "react-select";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../utils/config";
import { generateBrandSchemaMarkup } from "../../commondata/schemaMarkup";

export default function AddBrand() {
  const navigate = useNavigate()

  const [featuredImage, setFeaturedImage] = useState(null)
  const [imageOne, setImageOne] = useState(null)
  const [imageTwo, setImageTwo] = useState(null)
  const [imageThree, setImageThree] = useState(null)
  const [imageFour, setImageFour] = useState(null)
  const [imageFive, setImageFive] = useState(null)

  const { data: productMedicineEquipment } = useGetProductMedicineEquipmentQuery()
  const productMedicineEquipmentData = productMedicineEquipment?.data
  const initialValues = {
    brand_name: "",
    slug: "",
    featured_image: null,
    featured_image_status: true,
    status: true,
    short_description: "",
    banner_img_center_one: null,
    banner_img_center_one_status: true,
    banner_img_center_one_name: "",
    banner_img_center_one_link: "",
    banner_img_center_two: null,
    banner_img_center_two_status: true,
    banner_img_center_two_name: "",
    banner_img_center_two_link: "",
    banner_img_center_three: null,
    banner_img_center_three_status: true,
    banner_img_center_three_name: "",
    banner_img_center_three_link: "",
    banner_img_center_four: null,
    banner_img_center_four_status: true,
    banner_img_center_four_name: "",
    banner_img_center_four_link: "",
    banner_img_center_five: null,
    banner_img_center_five_status: true,
    banner_img_center_five_name: "",
    banner_img_center_five_link: "",

    meta_title: "",
    og_tag: "",
    meta_description: "",
    meta_keywords: "",
    schema_markup: "",
    top_deals: "",
    top_deals_status: true,
    seo_discount: "",
    type: "Medicine",
    shop_category_status: true
  };


  const [queryBrand, setQuerybrand] = useState({
    type: "",
    status: ""
  })

  const [addNewBrand, { isLoading }] = useAddNewBrandMutation();
  const { refetch } = useGetBrandQuery(queryBrand);
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddBrandValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'top_deals' && Array.isArray(value)) {
          value.forEach(item => {
            formData.append(key, JSON.stringify(item));
          });
        } else if (key !== 'top_deals') {
          formData.append(key, value);
        }
      });
      try {
        const response = await addNewBrand(formData);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message)
          refetch()
          resetForm()
          navigate("/brand")
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const generateSlug = (values) => {
    const slug = slugify(values, { lower: true });
    setFieldValue("slug", slug);
  };

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
    if (type === "General Product") {
      metaTitle = `Buy ${productName} Products Online at Best Price | Magicine Pharma`;
    } else {
      metaTitle = `Buy ${productName} Medicines Online at Best Price | Magicine Pharma`;
    }

    if (seoDiscount) {
      if (type === "General Product") {
        metaTitle = `Up to ${seoDiscount}% Off : Buy ${productName} Products Online at Best Price - Magicine Pharma`;
      } else {
        metaTitle = `Up to ${seoDiscount}% Off : Buy ${productName} Medicines Online at Best Price - Magicine Pharma`;
      }

    }

    setFieldValue("meta_title", metaTitle.trim());
  };

  const generateMetaDescription = (productName, seoDiscount, type) => {
    let metaDescription;
    if (type === "General Product") {
      metaDescription = `Magicine Pharma Largest Supplier of ${productName}. Buy ${productName} Products Online at best price and get ✔ Fastest Delivery.`;
    } else {
      metaDescription = `Magicine Pharma Largest Supplier of ${productName}. Buy ${productName} Medicines Online at best price and get ✔ Fastest Delivery.`;
    }


    if (seoDiscount) {
      if (type === "General Product") {
        metaDescription = `Magicine Pharma Largest Supplier of ${productName}. Buy ${productName} Products Online at best price. Get Up to ${seoDiscount}% off and get ✔ fastest Delivery.`;
      } else {
        metaDescription = `Magicine Pharma Largest Supplier of ${productName}. Buy ${productName} Medicines Online at best price. Get Up to ${seoDiscount}% off and get ✔ fastest Delivery.`;
      }
    }
    setFieldValue("meta_description", metaDescription.trim());
  };

  const handleBrandNameChange = (event) => {
    handleChange(event);
    const productName = event.target.value;
    const seoDiscount = values.seo_discount;
    const type = values?.type;

    generateSlug(event.target.value);
    generateMetaTitle(productName, seoDiscount, type);
    generateMetaDescription(productName, seoDiscount, type);
  };

  const handleSeoDiscountChange = (event) => {
    handleChange(event);
    const seoDiscount = event.target.value;
    const productName = values.brand_name;
    const type = values?.type

    generateMetaTitle(productName, seoDiscount, type);
    generateMetaDescription(productName, seoDiscount, type);
  };
  const handleTypeChange = (event) => {
    handleChange(event);
    const type = event.target.value;
    const productName = values.brand_name;
    const seoDiscount = values.seo_discount;
    setFieldValue("type", type);
    generateMetaTitle(productName, seoDiscount, type);
    generateMetaDescription(productName, seoDiscount, type);
  };


  const generateOgAndTwitterTag = () => {
    const ogTag = `
      <!-- Open Graph Tags -->
      <meta property="og:type" content="website">
      <meta property="og:title" content='${values.meta_title || "undefined"}'>
      <meta property="og:description" content="${values.meta_description || "undefined"}">
      <meta property="og:url" content="${USER_BASE_URL}/brands/${values.slug || "undefined"}">
      <meta property="og:site_name" content="Magicine Pharma">
      <meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">

      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${values.meta_title || "undefined"}">
      <meta name="twitter:description" content="${values.meta_description || "undefined"}">
      <meta name="twitter:url" content="${USER_BASE_URL}/brands/${values.slug || "undefined"}">
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
    const schemaMarkup = generateBrandSchemaMarkup({
      ...values,
      featured_image: `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`
    });
    setFieldValue("schema_markup", schemaMarkup);
  }, [values.category_name, values.slug, values.featured_image, values.short_description]);


  return (
    <>
      <Row className="align-items-center">
        <Col>
          <PageHeader titles="Brand" active="Add Brand" items={["Home", "Brand List"]} links={["/dashboard", "/brand"]} />
        </Col>
        <Col className="text-end">
          <Link to="/brand" className="btn btn-success text-white me-3">
            View All Brands
          </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Header>Add Brand</Card.Header>
            <Card.Body>
              {isLoading && <Loader />}
              <Form onSubmit={handleSubmit} className="p-2" encType="multipart/form-data">
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Brand Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="brand_name"
                        value={values.brand_name}
                        onChange={handleBrandNameChange}
                        onBlur={handleBlur}
                      />
                      {errors.brand_name && touched.brand_name ? (
                        <p className="error">{errors.brand_name}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Slug <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="slug"
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.slug && touched.slug ? (
                        <p className="error">{errors.slug}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="mt-3">
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Row>
                        <Col as={Col} md={10}>
                          <Form.Label>Featured Image</Form.Label>
                        </Col>
                        <Col as={Col} md={2}>
                          <Col as={Col} md={2}>
                            <label className="custom-switch">
                              <input
                                type="checkbox"
                                className="custom-switch-input"
                                name="featured_image_status"
                                checked={values?.featured_image_status}
                                onChange={handleChange}
                              />
                              <span className="custom-switch-indicator custum-green-btn"></span>
                            </label>
                          </Col>
                        </Col>
                      </Row>
                      <Row>
                        <Col as={Col} md={8}>
                          <Form.Control
                            type="file"
                            name="featured_image"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const fileUrl = URL.createObjectURL(file);
                                setFieldValue("featured_image", file);
                                setFeaturedImage(fileUrl)
                              }
                            }}
                            accept=".jpg,.jpeg,.png,.webp"
                            onBlur={handleBlur}
                          />
                        </Col>
                        <Col as={Col} md={4}>
                          <img src={featuredImage || values?.featured_image} alt={values?.brand_name} className="border border dark" width={100} height={100} />
                        </Col>
                      </Row>
                      {errors.featured_image &&
                        touched.featured_image ? (
                        <p className="error">{errors.featured_image}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>Status <span className="text-danger">*</span></Form.Label>
                      <Form.Select name="status" value={values.status.toString()} onChange={(e) => {
                        const newStatus = e.target.value === 'true';
                        handleChange({
                          target: {
                            name: "status",
                            value: newStatus,
                          },
                        })
                      }}>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Form.Label>Short Description</Form.Label>
                      <SunEditor
                        setOptions={options_for_sunEditor}
                        name="short_description"
                        onChange={(short_description) =>
                          setFieldValue("short_description", short_description)
                        }
                        onBlur={() =>
                          setFieldTouched("short_description", true)
                        }
                        value={values.short_description}
                      />
                      {errors.short_description && touched.short_description ? (
                        <p className="error">{errors.short_description}</p>
                      ) : null}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            Banner Image 1 Center (JPG, JPEG, PNG, 2MB Max)
                          </Col>
                          <Col as={Col} md={2}>
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
                          </Col>
                        </Row>
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={8}>
                          <Form.Control
                            name="banner_img_center_one"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const fileUrl = URL.createObjectURL(file)
                                setFieldValue("banner_img_center_one", file)
                                setImageOne(fileUrl)
                              }
                            }}
                            accept=".jpg,.jpeg,.png,.webp"
                            onBlur={handleBlur}
                          />
                        </Col>
                        <Col as={Col} md={4}>
                          <img src={imageOne || values?.banner_img_center_one} alt={values?.brand_name} className="border border-dark" width={100} height={100} />
                        </Col>
                      </Row>
                      {errors.banner_img_center_one && touched.banner_img_center_one ? (
                        <p className="error">{errors.banner_img_center_one}</p>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 1 center Name</Form.Label>
                    <Form.Control
                      name="banner_img_center_one_name"
                      value={values?.banner_img_center_one_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 1 center Link</Form.Label>
                    <Form.Control
                      name="banner_img_center_one_link"
                      value={values?.banner_img_center_one_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>


                </Row>

                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>

                        <Row>
                          <Col as={Col} md={8}>
                            Banner Image 2 Center (JPG, JPEG, PNG, 2MB Max)
                          </Col>
                          <Col as={Col} md={2}>
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
                          </Col>
                        </Row>
                      </Form.Label>
                      <Row >
                        <Col as={Col} md={8}>
                          <Form.Control
                            name="banner_img_center_two"
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const fileUrl = URL.createObjectURL(file)
                                setFieldValue("banner_img_center_two", file)
                                setImageTwo(fileUrl)
                              }
                            }}
                            onBlur={handleBlur}
                          />
                        </Col>
                        <Col as={Col} md={4}>
                          <img src={imageTwo || values?.banner_img_center_two} alt={values?.brand_name} className="border border-dark" width={100} height={100} />
                        </Col>
                      </Row>
                      {errors.banner_img_center_two && touched.banner_img_center_two ? (
                        <p className="error">{errors.banner_img_center_two}</p>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 2 center Name</Form.Label>
                    <Form.Control
                      name="banner_img_center_two_name"
                      value={values?.banner_img_center_two_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 2 center Link</Form.Label>
                    <Form.Control
                      name="banner_img_center_two_link"
                      value={values?.banner_img_center_two_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                </Row>

                <Row className="mt-3">
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            Banner Image 3 Center (JPG, JPEG, PNG, 2MB Max)
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
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={87}>
                          <Form.Control
                            name="banner_img_center_three"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const fileUrl = URL.createObjectURL(file)
                                setFieldValue("banner_img_center_three", file)
                                setImageThree(fileUrl)
                              }
                            }}
                            accept=".jpg,.jpeg,.png,.webp"
                            onBlur={handleBlur}
                          />
                        </Col>
                        <Col as={Col} md={4}>
                          <img src={imageThree || values?.banner_img_center_three} alt={values?.brand_name} className="border border-dark" width={100} height={100} />
                        </Col>
                      </Row>
                      {errors.banner_img_center_three && touched.banner_img_center_three ? (
                        <p className="error">{errors.banner_img_center_three}</p>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 3 center Name</Form.Label>
                    <Form.Control
                      name="banner_img_center_three_name"
                      value={values?.banner_img_center_three_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 3 center Link</Form.Label>
                    <Form.Control
                      name="banner_img_center_three_link"
                      value={values?.banner_img_center_three_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>


                </Row>

                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            Banner Image 4 Center (JPG, JPEG, PNG, 2MB Max)
                          </Col>
                          <Col as={Col} md={2}>
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
                          </Col>
                        </Row>
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={8}>
                          <Form.Control
                            name="banner_img_center_four"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const fileUrl = URL.createObjectURL(file)
                                setFieldValue("banner_img_center_four", file)
                                setImageFour(fileUrl)
                              }
                            }}
                            onBlur={handleBlur}
                          />
                        </Col>
                        <Col as={Col} md={4}>
                          <img src={imageFour || values?.banner_img_center_four} alt={values?.brand_name} className="border border-dark" width={100} height={100} />
                        </Col>

                      </Row>
                      {errors.banner_img_center_four && touched.banner_img_center_four ? (
                        <p className="error">{errors.banner_img_center_four}</p>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 4 center Name</Form.Label>
                    <Form.Control
                      name="banner_img_center_four_name"
                      value={values?.banner_img_center_four_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 4 center Link</Form.Label>
                    <Form.Control
                      name="banner_img_center_four_link"
                      value={values?.banner_img_center_four_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>
                </Row>


                <Row className="mt-3">
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            Banner Image 5 Center (JPG, JPEG, PNG, 2MB Max)
                          </Col>
                          <Col as={Col} md={2}>
                            <Col as={Col} md={2}>
                              <label className="custom-switch">
                                <input
                                  type="checkbox"
                                  className="custom-switch-input"
                                  name="banner_img_center_five_status"
                                  onChange={handleChange}
                                  checked={values?.banner_img_center_five_status}
                                />
                                <span className="custom-switch-indicator custum-green-btn"></span>
                              </label>
                            </Col>
                          </Col>
                        </Row>
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={8}>
                          <Form.Control
                            name="banner_img_center_five"
                            type="file"
                            onChange={(e) => {
                              const file = e.target.files[0]
                              if (file) {
                                const fileUrl = URL.createObjectURL(file)
                                setFieldValue("banner_img_center_five", file)
                                setImageFive(fileUrl)
                              }
                            }}
                            onBlur={handleBlur}
                            accept=".jpg,.jpeg,.png,.webp"
                          />
                        </Col>
                        <Col as={Col} md={4}>
                          <img src={imageFive || values?.banner_img_center_five} alt={values?.brand_name} className="border border-dark" width={100} height={100} />
                        </Col>
                      </Row>
                      {errors.banner_img_center_five && touched.banner_img_center_five ? (
                        <p className="error">{errors.banner_img_center_five}</p>
                      ) : null}
                    </Form.Group>
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 5 center Name</Form.Label>
                    <Form.Control
                      name="banner_img_center_five_name"
                      value={values?.banner_img_center_five_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Banner image 5 center Link</Form.Label>
                    <Form.Control
                      name="banner_img_center_five_link"
                      value={values?.banner_img_center_five_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </Col>

                </Row>

                <Row>
                  <Col as={Col} md={12}>
                    <Form.Group>
                      <Row>
                        <Col as={Col} md={10}>
                          <Form.Label>Top Deals</Form.Label>
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
                        value={Array.isArray(values.top_deals) ? values.top_deals.map((item) => ({
                          label: item.product_name,
                          value: JSON.stringify({ id: item.id, type: item.type })
                        })) : []}
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
                      <Form.Label>Type <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        type="text"
                        name="type"
                        value={values.type}
                        onChange={handleTypeChange}
                        onBlur={handleBlur}
                      >
                        <option value="">Select Type</option>
                        <option value="Medicine">Medicine</option>
                        <option value="General Product">General Product</option>
                      </Form.Select>
                      {
                        errors.type && touched.type ? (
                          <p className="text-danger">{errors.type}</p>
                        ) : null
                      }
                    </Form.Group>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>SEO Discount</Form.Label>
                      <Form.Control
                        type="Number"
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
                </Row>

                <Row className="my-2 justify-content-center">
                  <Button type="submit" className="btn btn-primary w-auto">
                    Save
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
