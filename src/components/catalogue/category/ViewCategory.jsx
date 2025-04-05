import React, { useEffect, useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, InputGroup, Card, Dropdown, } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewCategorySchema } from "../../../commondata/formvalidations";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import productImage from "../../../assets/images/dashboard/inventory.png";
import { Link, useLocation, useParams } from "react-router-dom";
import { TreeSelect } from "antd";
import SeoForm from "../../seo-page/SeoForm";
import { useEditCategoryMutation, useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryByIdQuery, useGetCategoryByParentChildQuery, useGetProductMedicineEquipmentQuery } from "../../../redux/features/catalogueEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import "react-multiple-select-dropdown-lite/dist/index.css";
import Select from "react-select";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";

export default function ViewCategory() {
  const { id } = useParams();

  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedUses, setSelectedUses] = useState([]);
  const [selectedForm, setSelectedForm] = useState([]);

  const [query, setQuery] = useState({
    status: "",
    type: ""
  })

  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetCategoryByIdQuery(id, { refetchOnMountOrArgChange: true })
  const [editBrand, { isLoading: updating }] = useEditCategoryMutation();
  const { data: parentChildCategory } = useGetCategoryByParentChildQuery()
  const parentChildCategoryData = parentChildCategory?.context?.data;
  const categoryData = data?.data?.category;
  const { data: productMedicineEquipment } = useGetProductMedicineEquipmentQuery()
  const productMedicineEquipmentData = productMedicineEquipment?.data


  const { data: brandList, isLoading: loadingData } = useGetBrandQuery(query)
  const { data: usesList, isLoading: usesLoading } = useGetAllUsesQuery()
  const { data: formDataList, isLoading: loadingForm } = useGetAllFormQuery()
  const usesListData = usesList?.data || []
  const brandData = brandList?.data?.allBrand || []


  const [imageOne, setImageOne] = useState(null)
  const [imageTwo, setImageTwo] = useState(null)
  const [imageThree, setImageThree] = useState(null)
  const [imageFour, setImageFour] = useState(null)
  const [imageFive, setImageFive] = useState(null)
  const [imageSix, setImageSix] = useState(null)

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
    banner_imgage_left_one_link: "",
    banner_imgage_left_one_name: "",
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

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewCategorySchema,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        s
        const response = await editBrand({ categoryId: id, categoryData: formData });
        console.log(response);
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          // resetForm()
        }
      } catch (error) {
        console.error(error);
      }
    },
  });
  useEffect(() => {
    setFieldValue("category_name", categoryData?.category_name);
    setFieldValue("status", categoryData?.status);
    setFieldValue("category_description", categoryData?.category_description);
    setFieldValue("long_description", categoryData?.long_description);
    setFieldValue("slug", categoryData?.slug);
    setFieldValue("parent_category", categoryData?.parent_category?.id);
    setFieldValue("is_megamenu", categoryData?.is_megamenu);
    setFieldValue("meta_title", categoryData?.meta_title);
    setFieldValue("meta_description", categoryData?.meta_description);
    setFieldValue("meta_keywords", categoryData?.meta_keywords);
    setFieldValue("og_tag", categoryData?.og_tag);
    setFieldValue("schema_markup", categoryData?.schema_markup);
    setFieldValue("seo_discount", categoryData?.seo_discount);
    setFieldValue("type", categoryData?.type);
    setFieldValue("shop_brand_status", categoryData?.shop_brand_status);
    setFieldValue("shop_category_status", categoryData?.shop_category_status);
    setFieldValue("thumbnail_image_status", categoryData?.thumbnail_image_status);

    setFieldValue("banner_img_center_one", categoryData?.banner_img_center_one);
    setFieldValue("banner_img_center_one_name", categoryData?.banner_img_center_one_name);
    setFieldValue("banner_img_center_one_link", categoryData?.banner_img_center_one_link);
    setFieldValue("banner_img_center_one_status", categoryData?.banner_img_center_one_status);
    setFieldValue("banner_img_center_two", categoryData?.banner_img_center_two);
    setFieldValue("banner_img_center_two_status", categoryData?.banner_img_center_two_status);
    setFieldValue("banner_img_center_two_name", categoryData?.banner_img_center_two_name);
    setFieldValue("banner_img_center_two_link", categoryData?.banner_img_center_two_link);
    setFieldValue("banner_img_center_three", categoryData?.banner_img_center_three);
    setFieldValue("banner_img_center_three_name", categoryData?.banner_img_center_three_name);
    setFieldValue("banner_img_center_three_link", categoryData?.banner_img_center_three_link);
    setFieldValue("banner_img_center_three_status", categoryData?.banner_img_center_three_status);
    setFieldValue("banner_img_center_four", categoryData?.banner_img_center_four);
    setFieldValue("banner_img_center_four_name", categoryData?.banner_img_center_four_name);
    setFieldValue("banner_img_center_four_link", categoryData?.banner_img_center_four_link);
    setFieldValue("banner_img_center_four_status", categoryData?.banner_img_center_four_status);
    setFieldValue("banner_image_left_one", categoryData?.banner_image_left_one);
    setFieldValue("banner_image_left_one_name", categoryData?.banner_image_left_one_name);
    setFieldValue("banner_image_left_one_link", categoryData?.banner_image_left_one_link);
    setFieldValue("banner_image_left_one_status", categoryData?.banner_image_left_one_status);
    setFieldValue("banner_image_left_two", categoryData?.banner_image_left_two);
    setFieldValue("banner_image_left_two_name", categoryData?.banner_image_left_two_name);
    setFieldValue("banner_image_left_two_link", categoryData?.banner_image_left_two_link);
    setFieldValue("banner_image_left_two_status", categoryData?.banner_image_left_two_status);

    setSelectedBrands(categoryData?.brand)
    setSelectedUses(categoryData?.uses)
    setSelectedForm(categoryData?.form)

    setFieldValue("spotlight", categoryData && categoryData?.spotlight?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));
    setFieldValue("spotlight_status", categoryData?.spotlight_status);

    setFieldValue("top_product", categoryData && categoryData?.top_product?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));
    setFieldValue("top_product_status", categoryData?.top_product_status)

    setFieldValue("trending_product", categoryData && categoryData?.trending_product?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));
    setFieldValue("trending_product_status", categoryData?.trending_product_status);

    setFieldValue("top_deals", categoryData && categoryData?.top_deals?.map(item => ({
      id: item.id,
      type: item.type,
      product_name: item.product_name,
    })));

    setFieldValue("top_deals_status", categoryData?.top_deals_status);
    setFieldValue("position", categoryData?.position);

  }, [isSuccess])


  const options = productMedicineEquipmentData?.filter((item) => item?.deleted_at === null && (item?.status === "active" || item?.status === true))?.map((item) => ({
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



  const handleBrandChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    setSelectedBrands(values)
    setFieldValue("brand", values);
  };

  const handleUsesChange = (selectedOptions) => {
    const values = selectedOptions.map(option => option.value);
    console.log("values", values)
    setSelectedUses(values)
    setFieldValue("uses", values);
  };


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
            <PageHeader titles="Category-Image" active="View Category" items={["Home", "Categories"]} />
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
                <h3 className="card-title">View Category</h3>
              </Card.Header>
              <Card.Body className="edit_product">
                {updating && <Loader />}
                <Form onSubmit={handleSubmit} className="add_category_form">
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Category Name <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="category_name"
                        onBlur={handleBlur}
                        value={values.category_name}
                        readOnly
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
                              disabled
                              onChange={handleChange}
                            />
                            <span className="custom-switch-indicator custum-green-btn"></span>
                          </label>
                        </Col>
                      </Row>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          <div className="position-relative">
                            <Link to={"/view-images"} state={{ data: categoryData?.thumbnail_image }}><img src={categoryData?.thumbnail_image} alt={categoryData.category_name} width={50} height={50} /></Link>
                          </div>
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            name="thumbnail_image"
                            onBlur={handleBlur}
                            readOnly
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Status <span className="text-danger"></span></Form.Label>
                        <Form.Select name="status" value={values.status} onChange={handleChange} onBlur={handleBlur} disabled={true}>
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
                          readOnly
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
                        disable
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
                        disable
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
                        disabled
                      ></TreeSelect>
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
                              disabled
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
                            disabled
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
                          disabled
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
                          disabled
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
                            disabled
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
                          disabled
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
                          disabled
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
                              disabled
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
                            disabled
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
                          disabled
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
                          disabled
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
                              disabled
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
                            disabled
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
                          disabled
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
                          disabled
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
                                disabled
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
                            disabled
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
                          disabled
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
                          disabled
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
                                disabled
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
                            disabled
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
                          disabled
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
                          disabled
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
                                disabled
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
                          isDisabled
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
                                disabled
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
                          isDisabled
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
                                disabled
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
                          isDisabled
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
                                disabled
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
                          isDisabled
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
                          disabled
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
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
                          value={brandOptions.filter(option => Array.isArray(selectedBrands) && selectedBrands?.length > 0 ? selectedBrands.includes(String(option.value)) : [])} // Convert to string for comparison
                          onChange={handleBrandChange}
                          isMulti
                          isDisabled
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Uses</Form.Label>
                        <Select
                          name="uses"
                          options={usesOptions}
                          value={usesOptions.filter(option => selectedUses?.includes(String(option.value)))}
                          onChange={handleUsesChange}
                          isMulti
                          isDisabled
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
                          value={formDataOptions?.filter(option => selectedForm?.includes(String(option.value)))}
                          options={formDataOptions}
                          onChange={(selectedOptions) => setFieldValue("form", selectedOptions?.value)}
                          onBlur={handleBlur}
                          isSearchable
                          isDisabled
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
                          disabled
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
                      readOnlyStatus={true}
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
                          readOnly
                          disabled
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
                            disabled
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
