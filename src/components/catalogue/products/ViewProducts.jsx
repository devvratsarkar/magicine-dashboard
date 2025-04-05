import React, { useState, useEffect } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col, Card } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewProductSchema } from "../../../commondata/formvalidations";
import Select from "react-select";
import slugify from "slugify";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useLocation, useParams } from "react-router-dom";
import productImage from "../../../assets/images/dashboard/inventory.png";
import AddNewManufacturer from "../../market-manufacturer/AddNewManufacturer";
import SeoForm from "../../seo-page/SeoForm";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import CreatableSelect from 'react-select/creatable';
import { useEditProductMutation, useGetProductInventoryQuery, useGetProductsQuery, useGetSingleProductsQuery } from "../../../redux/features/productEndPoints";
import { useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryQuery, useGetManufactutrerQuery, useGetTagsQuery } from "../../../redux/features/catalogueEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";

export default function ViewProducts() {
  const [selfCombo, setSelfCombo] = useState([
    { pack: "", combo_single_price: "", discount_percent: "" }
  ]);


  const [categoryQuery, setCategoryQuery] = useState({
    status: "",
    type: ""
  })

  const [queryBrand, setQuerybrand] = useState({
    type: "",
    status: ""
  })

  const dispatch = useDispatch();
  const [viewThubnail, setViewThubnail] = useState(true);
  const [selectedThubnail, setSelectedThubnail] = useState(null);
  const { id } = useParams()
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetSingleProductsQuery(id, { refetchOnMountOrArgChange: true })
  const singleProduct = data?.data?.allProducts;
  const { data: manufacturer } = useGetManufactutrerQuery()
  const { data: brand } = useGetBrandQuery(queryBrand)
  const { data: products, refetch } = useGetProductInventoryQuery()
  const { data: tags } = useGetTagsQuery()
  const { data: category } = useGetCategoryQuery(categoryQuery)
  const { data: uses } = useGetAllUsesQuery()
  const { data: form } = useGetAllFormQuery()
  const manufacturerData = manufacturer?.data?.manufacturer
  const brandData = brand?.data?.allBrand;
  const productsData = products?.data?.filteredProduct;
  const tagData = tags?.data;
  const categoryData = category?.data?.activeCategories;
  const usesData = uses?.data;
  const formData = form?.data;

  const [editProduct, { isLoading: loading }] = useEditProductMutation()

  const initialValues = {
    product_name: "",
    featured_image: null,
    status: "",
    slug: "",
    gallery_image: "",
    category: [],
    has_variant: null,
    marketer: "",
    brand: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    tags: [],
    hsn_code: "",
    long_description: "",
    minimumOrder: "",
    linked_items: [],
    short_description: "",
    packOf: "",
    form: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",

    recently_bought: "",
    product_highlight: "",

    uses: "",
    age: "",
    isEnquired: false,
    combo_product: false,
    sku: "",
    stock_quantity: "",
    mrp: "",
    selling_price: "",
    discount_percent: "",
    seo_discount: "",
    tax_percentage: "",

    manufacturer_name: "",
    country_origin: "",
    fssai_license: "",
    food: true,
    vegitarian: true,
    customer_service_number: "",
    customer_service_email_id: "",
    gender: []
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewProductSchema,
  });

  const options = categoryData ? categoryData.filter(category => category.status === true).map(category => ({
    value: category?.id,
    label: category?.category_name
  })) : [];
  const Linked_item_options = productsData ? productsData.filter(product => product.status === true).map(product => ({
    value: product?.id,
    label: product?.product_name
  })) : [];
  const tagOptions = Array.isArray(tagData) ? tagData.map(tag => ({
    value: tag?.id,
    label: tag?.name,
  })) : [];

  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };

  const handleProductNameChange = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setFieldValue('gallery_image', files);
  };
  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setFieldValue('featured_image', file)
    if (file) {
      setViewThubnail(false)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThubnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    // Set form values with singleProduct data
    setFieldValue('product_name', singleProduct?.product_name);
    setFieldValue('featured_image', singleProduct?.featured_image);
    setFieldValue('status', singleProduct?.status);
    setFieldValue('slug', singleProduct?.slug);
    setFieldValue('gallery_image', singleProduct?.gallery_image);
    setFieldValue('hsn_code', singleProduct?.hsn_code);
    setFieldValue('category', singleProduct?.category.map(category => ({
      value: category?.id,
      label: category?.category_name,
    })));
    setFieldValue('has_variant', singleProduct?.has_variant);
    setFieldValue('combo_product', singleProduct?.combo_product);
    setFieldValue('combo_product', singleProduct?.combo_product);
    setFieldValue('isEnquired', singleProduct?.isEnquired);
    setFieldValue('marketer', singleProduct?.marketer?.id);
    setFieldValue('brand', singleProduct?.brand?.id);
    setFieldValue('weight', singleProduct?.weight);
    setFieldValue('length', singleProduct?.length);
    setFieldValue('width', singleProduct?.width);
    setFieldValue('height', singleProduct?.height);
    setFieldValue('form', singleProduct?.form?.id);
    setFieldValue('packOf', singleProduct?.packOf);
    setFieldValue('long_description', singleProduct?.long_description);
    setFieldValue('minimum_order_quantity', singleProduct?.minimum_order_quantity);
    setFieldValue('seo_discount', singleProduct?.seo_discount)
    setFieldValue('tax_percentage', singleProduct?.tax_percentage)
    setFieldValue('manufacturer_name', singleProduct?.manufacturer_name);
    setFieldValue('country_origin', singleProduct?.country_origin);
    setFieldValue('fssai_license', singleProduct?.fssai_license);
    setFieldValue('food', singleProduct?.food);
    setFieldValue('vegitarian', singleProduct?.vegitarian);
    setFieldValue('customer_service_number', singleProduct?.customer_service_number);
    setFieldValue('customer_service_email_id', singleProduct?.customer_service_email_id);

    setFieldValue('linked_items', singleProduct?.linked_items.map(linkedItem => ({
      value: linkedItem?.id,
      label: linkedItem?.product_name,
    })));
    setFieldValue('tags', singleProduct?.tags.map(item => ({
      value: item?.name,
      label: item?.name,
    })));
    setFieldValue('meta_title', singleProduct?.meta_title);
    setFieldValue('meta_description', singleProduct?.meta_description);
    setFieldValue('meta_keywords', singleProduct?.meta_keywords);
    setFieldValue('og_tag', singleProduct?.og_tag);
    setFieldValue('schema_markup', singleProduct?.schema_markup);
    setFieldValue('recently_bought', singleProduct?.recently_bought);
    setFieldValue('product_highlight', singleProduct?.product_highlight);
    setFieldValue('uses', singleProduct?.uses?.id);
    setFieldValue('age', singleProduct?.age.map(item => ({
      value: item,
      label: item,
    })));

    setFieldValue('gender', singleProduct?.gender);

    setFieldValue('sku', singleProduct?.inventoryData?.sku);
    setFieldValue('stock_quantity', singleProduct?.inventoryData?.stock_quantity);
    setFieldValue('mrp', singleProduct?.inventoryData?.mrp);
    setFieldValue('selling_price', singleProduct?.inventoryData?.selling_price);
    setFieldValue('discount_percent', singleProduct?.inventoryData?.discount_percent);
    setFieldValue('gender', singleProduct?.gender);


    if (singleProduct?.selfComboData) {
      setSelfCombo(singleProduct.selfComboData.map(combo => ({
        pack: combo.pack || "",
        single_price: combo.single_price || "",
        combo_single_price: combo.combo_single_price || "",
        discount_percent: combo.discount_percent || "",
        id: combo.id
      })));
    }

  }, [singleProduct]);



  const handleAddSelfCombo = () => {
    setSelfCombo(prevSelfCombo => [
      ...prevSelfCombo,
      {
        pack: "",
        combo_single_price: "",
        discount_percent: "",
        id: ""
      }
    ]);
  };

  const handleComboChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSelfCombo = [...selfCombo];

    updatedSelfCombo[index] = {
      ...updatedSelfCombo[index],
      [name]: value
    };

    const sellingPrice = parseFloat(values.selling_price);
    const comboSinglePrice = parseFloat(updatedSelfCombo[index].combo_single_price);

    if (name === "combo_single_price" || name === "pack") {
      const calculatedDiscount = sellingPrice && comboSinglePrice
        ? ((sellingPrice - comboSinglePrice) * 100) / sellingPrice
        : "";
      updatedSelfCombo[index].discount_percent = calculatedDiscount;
    }

    setSelfCombo(updatedSelfCombo);
  };


  const genderOption = [
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
    { value: 'other', label: 'other' },
  ]

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }
  if (isSuccess) {
    return (
      <>
        <Row>
          <Col>
            <PageHeader titles="Catalogue - Generic Product" active={["View General Product/"]} items={["Home", "General Product List"]} links={["/dashboard", "/catalogue/products"]} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h3 className="card-title">View Product</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
                  {loading && <Loader />}
                  <Row className="mb-4">
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Product Name <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="product_name"
                        onChange={handleProductNameChange}
                        onBlur={handleBlur}
                        value={values.product_name}
                        readOnly
                      />
                      {errors.product_name && touched.product_name ? (
                        <p className={`error`}>{errors.product_name}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label> Featured Image (JPG,JPEG,PNG)<span className="required_icon">*</span></Form.Label>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          {viewThubnail ? <div className="position-relative">
                            <Link to={"/view-images"} state={{ data: singleProduct?.featured_image }}><img src={singleProduct?.featured_image} alt="error" width={50} height={50} /></Link>
                          </div> : (<div className="position-relative"><img src={selectedThubnail} alt="error" width={50} height={50} /></div>)}
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            name="featured_image"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                            disabled
                          />
                          {errors.featured_image && touched.featured_image ? (
                            <p className={`error`}>{errors.featured_image}</p>
                          ) : null}
                        </Col>
                      </Row>
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Status <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Select
                        name="status"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.status}
                        disabled
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Form.Select>
                      {errors.status && touched.status ? (
                        <p className={`error`}>{errors.status}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md="4">
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
                    <Form.Group as={Col} md="4">
                      <Form.Label>Gallery Image</Form.Label>
                      <Form.Control
                        type="file"
                        multiple
                        accept=".jpg,.jpeg,.png,.webp"
                        name="gallery_image"
                        onChange={handleGalleryChange}
                        onBlur={handleBlur}
                        disabled
                      // value={values.gallery_img}
                      />
                      <div className="d-flex flex-wrap gap-1 justify-content-between mt-2">
                        {singleProduct?.gallery_image?.map((items, index) => (
                          <div key={index}>
                            <img src={items} alt="error" width={50} height={50} />
                          </div>

                        ))}
                      </div>
                      {errors.gallery_image && touched.gallery_image ? (
                        <p className={`error`}>{errors.gallery_image}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>HSN Code</Form.Label>
                      <Form.Control
                        type="text"
                        id="formFileMultiple"
                        name="hsn_code"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.hsn_code}
                        readOnly
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Select
                        options={options}
                        name="categories"
                        value={values.category}
                        onChange={(selectedOptions) =>
                          setFieldValue("categories", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="rounded-4"
                        isSearchable
                        isDisabled
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                      <Form.Label>Is Enquired</Form.Label>
                      <Form.Check
                        type="checkbox"
                        id="isEnquired"
                        name="isEnquired"
                        checked={values.isEnquired}
                        onChange={(e) => setFieldValue("isEnquired", e.target.checked)}
                        onBlur={handleBlur}
                        className="d-flex justify-content-start ps-5 rounded-1"
                        disabled
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="2">
                      <Form.Label>Has Variant</Form.Label>
                      <Form.Check
                        type="checkbox"
                        id="has_variant"
                        name="has_variant"
                        checked={values.has_variant}
                        // onChange={(e) => setFieldValue("has_variant", e.target.checked)}
                        // onBlur={handleBlur}
                        className="d-flex justify-content-start ps-5 rounded-1"
                        disabled
                      />
                    </Form.Group>
                    {
                      !values.has_variant && (
                        <Form.Group as={Col} md="2">
                          <Form.Label>isComboProduct</Form.Label>
                          <Form.Check
                            type="checkbox"
                            id="combo_product"
                            name="combo_product"
                            checked={values.combo_product}
                            onChange={(e) => setFieldValue("combo_product", e.target.checked)}
                            onBlur={handleBlur}
                            className="d-flex justify-content-start ps-5 rounded-1"
                            disabled
                          />
                        </Form.Group>
                      )
                    }
                  </Row>

                  <Row className="mb-4">
                    <Form.Group as={Col} md="4" >
                      <Form.Label>Marketer/Manufacturer <span className="text-danger">*</span></Form.Label>
                      <div className="manufacturer_btn">
                        <Form.Select
                          name="marketer"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.marketer}
                          disabled
                        >
                          <option value="">Select</option>
                          {manufacturerData?.map((item, index) => (
                            item.status === true ? (
                              <option value={item.id} key={index}>{item.manufacturer_name}</option>
                            ) : null
                          ))}
                        </Form.Select>
                        <Button type="button" disabled onClick={() => { dispatch(openModal({ componentName: 'AddNewManufacturer' })) }} className="btn btn-icon btn-primary" variant="primary"><i className="fe fe-plus"></i></Button>
                      </div>                    {
                        errors.marketer && touched.marketer ? (
                          <p className={`error`}>{errors.marketer}</p>
                        ) : null
                      }
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Brand <span className="text-danger">*</span></Form.Label>
                      <Form.Select
                        name="brand"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.brand}
                        disabled >
                        <option value="select">Select</option>
                        {brandData?.map((item, index) => (
                          item.status === true ? (
                            <option value={item.id} key={index}>{item.brand_name}</option>
                          ) : null
                        ))}
                      </Form.Select>
                      {errors.brand && touched.brand ? (
                        <p className={`error`}>{errors.brand}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        weight(g) <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="weight"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.weight}
                        readOnly
                      />
                      {errors.weight && touched.weight ? (
                        <p className={`error`}>{errors.weight}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md="4">
                      <Form.Label>Length(cm)</Form.Label>
                      <Form.Control
                        name="length"
                        type="number"
                        min="0"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.length}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Width(cm)</Form.Label>
                      <Form.Control
                        name="width"
                        type="number"
                        min="0"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.width}
                        readOnly
                      />
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Height(cm)</Form.Label>
                      <Form.Control
                        name="height"
                        type="number"
                        min="0"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.height}
                        readOnly
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col as={Col} md={4}>
                      <Form.Group>
                        <Form.Label>Form <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="form"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.form}
                          disabled
                        >
                          <option value="">Select</option>
                          {formData?.map((item, index) => (<option value={item.id} key={index}>{item.name}</option>))}
                        </Form.Select>
                        {errors.form && touched.form ? (
                          <p className={`error`}>{errors.form}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={4}>
                      <Form.Group>
                        <Form.Label>Pack Of <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          name="packOf"
                          type="text"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.packOf}
                          readOnly
                        />
                        {errors.packOf && touched.packOf ? (
                          <p className={`error`}>{errors.packOf}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={4}>
                      <Form.Group>
                        <Form.Label>Recently Bought</Form.Label>
                        <Form.Control
                          name="recently_bought"
                          type="number"
                          min="0"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.recently_bought}
                          readOnly
                        />
                        {errors.packOf && touched.packOf ? (
                          <p className={`error`}>{errors.packOf}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Uses <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="uses"
                          value={values.uses}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        >
                          <option >Select</option>
                          {usesData?.map((item, index) => (<option value={item.id} key={index}>{item.name}</option>))}
                        </Form.Select>
                        {errors.uses && touched.uses ? (
                          <p className="text-danger">{errors.uses}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Age <span className="text-danger">*</span></Form.Label>
                        <Select
                          name="age"
                          value={values.age}
                          isDisabled
                          isMulti
                          isSearchable
                        />

                        {
                          errors.age && touched.age ? (
                            <p className="text-danger">{errors.age}</p>
                          ) : null
                        }
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col}>
                      <Form.Label>Tags</Form.Label>
                      <CreatableSelect
                        options={tagOptions}
                        name="tags"
                        value={tagOptions.find(option => option.value === values.tags)}
                        onChange={(selectedOption) => setFieldValue("tags", selectedOption)}
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Add Tags..."
                        isMulti
                        defaultValue={singleProduct ? singleProduct?.tags.map(tag => ({
                          value: tag?.name,
                          label: tag?.name,
                        })) : []}
                        isDisabled
                      />
                      {errors.tags && touched.tags ? (
                        <p className={`error`}>{errors.tags}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md={12}>
                      <Form.Label>Product Heighlight</Form.Label>
                      <SunEditor
                        name="product_highlight"
                        onChange={(content) => setFieldValue("product_highlight", content)}
                        onBlur={() => setFieldTouched("product_highlight", true)}
                        setOptions={options_for_sunEditor}
                        setContents={values.product_highlight}
                        disable
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md={12}>
                      <Form.Label>Description</Form.Label>
                      <SunEditor
                        name="long_description"
                        onChange={(content) => setFieldValue("long_description", content)}
                        onBlur={() => setFieldTouched("long_description", true)}
                        setOptions={options_for_sunEditor}
                        value={values.long_description}
                        setContents={singleProduct?.long_description}
                        readOnly
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Minimum Order Quantity <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        min="0"
                        name="minimum_order_quantity"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.minimum_order_quantity}
                        readOnly
                      />
                      {errors.minimum_order_quantity && touched.minimum_order_quantity ? (
                        <p className={`error`}>{errors.minimum_order_quantity}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md={8}>
                      <Form.Label>Linked Items</Form.Label>
                      <Select
                        options={Linked_item_options}
                        name="linked_items"
                        value={values.linked_items}
                        onChange={(selectedOptions) =>
                          setFieldValue("linked_items", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="rounded-4 select-dropdown"
                        isSearchable
                        isDisabled
                      />
                      {errors.linked_items && touched.linked_items ? (
                        <p className={`error`}>{errors.linked_items}</p>
                      ) : null}
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Manufacturer Name</Form.Label>
                        <Form.Control
                          name="manufacturer_name"
                          value={values?.manufacturer_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Country Of Origin</Form.Label>
                        <Form.Control
                          name="country_origin"
                          value={values?.country_origin}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>FSSAI License</Form.Label>
                        <Form.Control
                          name="fssai_license"
                          value={values?.fssai_license}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Is Food</Form.Label>
                        <Form.Select
                          name="food"
                          value={values?.food}
                          onChange={handleChange}
                          onBlur={handleBlur}

                        >
                          <option value={true}>True</option>
                          <option value={false}>False</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Vegitarian Product</Form.Label>
                        <Form.Select
                          name="vegitarian"
                          value={values?.vegitarian}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        >
                          <option value={true}>True</option>
                          <option value={false}>False</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Customer Service Number</Form.Label>
                        <Form.Control
                          name="customer_service_number"
                          value={values?.customer_service_number}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Customer Service Email Id</Form.Label>
                        <Form.Control
                          name="customer_service_email_id"
                          value={values?.customer_service_email_id}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Tax Percentage <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="number"
                          name="tax_percentage"
                          value={values.tax_percentage}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        />
                        {
                          errors?.tax_percentage && touched?.tax_percentage && (
                            <p className="text-danger">{errors?.tax_percentage}</p>
                          )
                        }
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Form.Group as={Col} md={12}>
                      <Form.Label>Overview</Form.Label>
                      <SunEditor
                        name="short_description"
                        onChange={(content) =>
                          setFieldValue("short_description", content)
                        }
                        onBlur={() => setFieldTouched("short_description", true)}
                        setOptions={options_for_sunEditor}
                        value={values.short_description}
                        setContents={singleProduct?.short_description}
                        readOnly
                      />
                    </Form.Group>
                  </Row>
                  {values.combo_product && (
                    <>
                      <Row>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>SKU <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="text"
                              name="sku"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.sku}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Stock Quantity <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="number"
                              name="stock_quantity"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.stock_quantity}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>MRP <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="number"
                              name="mrp"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.mrp}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Row>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Selling Price <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="number"
                              name="selling_price"
                              value={values.selling_price}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4}>
                          <Form.Group>
                            <Form.Label>Discount Percentage <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              type="number"
                              name="discount_percent"
                              value={values.discount_percent}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled
                            />
                          </Form.Group>
                        </Col>
                        <Col md={4} className="d-flex w-auto align-items-center justify-content-center">
                          <Button className="w-full" onClick={handleAddSelfCombo}>Add Self Combo</Button>
                        </Col>
                      </Row>
                      <Row className="border border-3 border-dark rounded-3 my-2">
                        {selfCombo.map((combo, index) => (
                          <Row key={index} className="mb-1 justify-content-around">
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>Packs <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="number"
                                  name="pack"
                                  value={combo.pack}
                                  onChange={(e) => handleComboChange(e, index)}
                                  onBlur={handleBlur}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>Single Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="number"
                                  name="single_price"
                                  value={combo.single_price}
                                  onChange={(e) => handleComboChange(e, index)}
                                  onBlur={handleBlur}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>Selling Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="number"
                                  name="combo_single_price"
                                  value={combo.combo_single_price}
                                  onChange={(e) => handleComboChange(e, index)}
                                  onBlur={handleBlur}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>MRP <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  value={combo.combo_single_price * combo.pack}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                            <Col md={2}>
                              <Form.Group>
                                <Form.Label>Discount Percentage <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="number"
                                  name="discount_percent"
                                  value={combo.discount_percent}
                                  onChange={(e) => handleComboChange(e, index)}
                                  onBlur={handleBlur}
                                  disabled
                                />
                              </Form.Group>
                            </Col>
                          </Row>
                        ))}
                      </Row>
                    </>
                  )}
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
                        <Form.Label>Gender</Form.Label>
                        <Select
                          name="gender"
                          options={genderOption}
                          value={values.gender?.map((item) => ({
                            value: item,
                            label: item
                          }))}
                          onChange={(selectedOptions) =>
                            setFieldValue("gender", selectedOptions)
                          }
                          onBlur={handleBlur}
                          isSearchable
                          isMulti
                          isDisabled
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <SeoForm
                      setFieldValue={setFieldValue}
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      touched={touched}
                      readOnlyStatus={true}
                    />
                  </Row>

                  {/* <Row className="my-5">
                    <Button type="submit" className="btn-primary mx-auto w-auto">Save</Button>
                  </Row> */}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </>
    );
  }
}
