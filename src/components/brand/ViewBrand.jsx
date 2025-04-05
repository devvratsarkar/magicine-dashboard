import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Card, Col, Button, Form, } from "react-bootstrap";
import { Link, useParams } from "react-router-dom";
import { useFormik } from "formik";
import { AddBrandValidation } from "../../commondata/formvalidations";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import SeoForm from "../seo-page/SeoForm";
import { useGetBrandByIdQuery, useGetProductMedicineEquipmentQuery } from "../../redux/features/catalogueEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import Error from "../../layouts/layoutcomponents/Error";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Select from "react-select";

export default function ViewBrand() {
  const { id } = useParams();

  const [featuredImage, setFeaturedImage] = useState(null)
  const [imageOne, setImageOne] = useState(null)
  const [imageTwo, setImageTwo] = useState(null)
  const [imageThree, setImageThree] = useState(null)
  const [imageFour, setImageFour] = useState(null)
  const [imageFive, setImageFive] = useState(null)


  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetBrandByIdQuery(id, { refetchOnMountOrArgChange: true })
  const branData = data?.data?.brand
  const { data: productMedicineEquipment } = useGetProductMedicineEquipmentQuery()
  const productMedicineEquipmentData = productMedicineEquipment?.data
  const initialValues = {
    brand_name: '',
    slug: '',
    short_description: '',
    featured_image: '',
    featured_image_status: true,
    status: '',

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
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddBrandValidation,
    onSubmit: async (values) => {
      console.log("Form submitted with values:", values);
    },
  });


  const generateSlug = (values) => {
    const slug = slugify(values);
    setFieldValue("slug", slug);
  };
  const handleBrandName = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };


  useEffect(() => {
    setFieldValue('brand_name', branData?.brand_name)
    setFieldValue('slug', branData?.slug)
    setFieldValue('short_description', branData?.short_description)
    setFieldValue('status', branData?.status)
    setFieldValue('meta_title', branData?.meta_title)
    setFieldValue('og_tag', branData?.og_tag)
    setFieldValue('meta_description', branData?.meta_description)
    setFieldValue('meta_keywords', branData?.meta_keywords)
    setFieldValue('schema_markup', branData?.schema_markup)
    setFieldValue('seo_discount', branData?.seo_discount)
    setFieldValue('seo_discount', branData?.type || "Medicine")
    setFieldValue("top_deals", branData && branData.top_deals ?
      branData.top_deals.map(item => ({
        id: item.id,
        type: item.type,
        product_name: item.product_name,
      })) : []
    );

    setFieldValue("top_deals_status", branData?.top_deals_status);

    setFieldValue("featured_image", branData?.featured_image)
    setFieldValue("featured_image_status", branData?.featured_image_status)


    setFieldValue("banner_img_center_one", branData?.banner_img_center_one)
    setFieldValue("banner_img_center_one_name", branData?.banner_img_center_one_name)
    setFieldValue("banner_img_center_one_link", branData?.banner_img_center_one_link)
    setFieldValue("banner_img_center_one_status", branData?.banner_img_center_one_status)

    setFieldValue("banner_img_center_two", branData?.banner_img_center_two)
    setFieldValue("banner_img_center_two_name", branData?.banner_img_center_two_name)
    setFieldValue("banner_img_center_two_link", branData?.banner_img_center_two_link)
    setFieldValue("banner_img_center_two_status", branData?.banner_img_center_two_status)

    setFieldValue("banner_img_center_three", branData?.banner_img_center_three)
    setFieldValue("banner_img_center_three_name", branData?.banner_img_center_three_name)
    setFieldValue("banner_img_center_three_link", branData?.banner_img_center_three_link)
    setFieldValue("banner_img_center_three_status", branData?.banner_img_center_three_status)

    setFieldValue("banner_img_center_four", branData?.banner_img_center_four)
    setFieldValue("banner_img_center_four_name", branData?.banner_img_center_four_name)
    setFieldValue("banner_img_center_four_link", branData?.banner_img_center_four_link)
    setFieldValue("banner_img_center_four_status", branData?.banner_img_center_four_status)

    setFieldValue("banner_img_center_five", branData?.banner_img_center_five)
    setFieldValue("banner_img_center_five_name", branData?.banner_img_center_five_name)
    setFieldValue("banner_img_center_five_link", branData?.banner_img_center_five_link)
    setFieldValue("banner_img_center_five_status", branData?.banner_img_center_five_status)

  }, [isSuccess]);

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


  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }

  if (isSuccess) {
    return (
      <>

        <Row className="align-items-center">
          <Col>
            <PageHeader titles="Brand" active={["View Brand/",]} items={["Home", "Brand List"]} links={["/dashboard", "/brand"]} />
          </Col>
          <Col className="text-end">
            <Link to="/brand" className="btn btn-success text-white me-3">View All Brands</Link>
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>View Brand</Card.Header>
              <Card.Body >

                <Form onSubmit={handleSubmit} >
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
                          onChange={handleBrandName}
                          onBlur={handleBlur}
                          readOnly={true}
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
                          readOnly={true}
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
                                  onChange={handleChange}
                                  checked={values?.featured_image_status}
                                  disabled
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
                              disabled
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
                        <Form.Select name="status" value={values.status} disabled>
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
                          setContents={values.short_description}
                          readOnly={true}
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
                                    disabled
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
                              disabled
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
                        disabled
                      />
                    </Col>

                    <Col as={Col} md={6}>
                      <Form.Label>Banner image 1 center Link</Form.Label>
                      <Form.Control
                        name="banner_img_center_one_link"
                        value={values?.banner_img_center_one_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
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
                                    disabled
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
                              disabled
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
                        disabled
                      />
                    </Col>

                    <Col as={Col} md={6}>
                      <Form.Label>Banner image 2 center Link</Form.Label>
                      <Form.Control
                        name="banner_img_center_two_link"
                        value={values?.banner_img_center_two_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
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
                                  disabled
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
                              disabled
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
                        disabled
                      />
                    </Col>

                    <Col as={Col} md={6}>
                      <Form.Label>Banner image 3 center Link</Form.Label>
                      <Form.Control
                        name="banner_img_center_three_link"
                        value={values?.banner_img_center_three_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
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
                                    disabled
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
                              disabled
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
                        disabled
                      />
                    </Col>

                    <Col as={Col} md={6}>
                      <Form.Label>Banner image 4 center Link</Form.Label>
                      <Form.Control
                        name="banner_img_center_four_link"
                        value={values?.banner_img_center_four_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
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
                                    disabled
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
                              disabled
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
                        disabled
                      />
                    </Col>

                    <Col as={Col} md={6}>
                      <Form.Label>Banner image 5 center Link</Form.Label>
                      <Form.Control
                        name="banner_img_center_five_link"
                        value={values?.banner_img_center_five_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled
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
                                disabled
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
                          // onChange={handleTypeChange}
                          onBlur={handleBlur}
                          disabled
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
                          type="number"
                          name="seo_discount"
                          value={values.seo_discount}
                          disabled
                        />
                        {
                          errors.seo_discount && touched.seo_discount ? (
                            <p className="text-danger">{errors.seo_discount}</p>
                          ) : null
                        }
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row >
                    <SeoForm
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      touched={touched}
                      readOnlyStatus={true}
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
                            disabled
                          />
                          <span className="custom-switch-indicator custum-green-btn"></span>
                        </label>
                      </Form.Group>
                    </Col>
                  </Row>

                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
