import React, { useEffect, useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { AddNewProductSchema } from "../../commondata/formvalidations";
import Select from "react-select";
import slugify from "slugify";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import SeoForm from "../seo-page/SeoForm";
import { options_for_sunEditor } from "../../commondata/formEditorOptions";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import CreatableSelect from 'react-select/creatable';
import { useAddNewProductMutation, useGetProductInventoryQuery, useGetProductsQuery } from "../../redux/features/productEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryQuery, useGetManufactutrerQuery, useGetTagsQuery } from "../../redux/features/catalogueEndPoints";
import { useNavigate } from "react-router-dom";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../utils/config";
import { generateSchemaMarkup } from "../../commondata/schemaMarkup";



export default function AddNewProductForm() {
  const [discount, setDiscount] = useState(true)
  const [selfCombo, setSelfCombo] = useState([
    { pack: "", combo_single_price: "", discount_percent: "" }
  ]);


  const [addNew, setAddNew] = useState(false)
  const [viewThumbnail, setViewThumbnail] = useState(true);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedThumbnails, setSelectedThumbnails] = useState([]);
  const [query, setQuiery] = useState({
    brand: '',
    marketer: '',
    status: '',
    fromDate: '',
    toDate: '',
    search: "",
    page: 1 || "",
    limit: 10 || ""
  })

  const [queryBrand, setQuerybrand] = useState({
    type: "General Product",
    status: true
  })

  const [categoryQuery, setCategoryQuery] = useState({
    status: true,
    type: "general_product"
  })

  const { refetch: getAllProducts } = useGetProductsQuery(query)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [addNewProduct, { isLoading }] = useAddNewProductMutation()
  const { data: manufacturer } = useGetManufactutrerQuery()
  const { data: brand } = useGetBrandQuery(queryBrand)
  const { data: products, refetch } = useGetProductInventoryQuery()
  const { data: tags } = useGetTagsQuery()
  const { data: category } = useGetCategoryQuery(categoryQuery)
  const { data: uses } = useGetAllUsesQuery()
  const { data: form } = useGetAllFormQuery()
  const Options = manufacturer?.data?.manufacturer

  const brandData = brand?.data?.allBrand;
  const productsData = products?.data?.filteredProduct;
  const tagData = tags?.data
  const categoryData = category?.data?.activeCategories

  console.log("categoryData", categoryData?.length)

  const usesData = uses?.data;
  const formData = form?.data;

  const marketerSelectOption = Array.isArray(Options) && Options?.length > 0 ? Options?.filter((item) => item.status === true && item?.deleted_at === null)?.map((item) => ({
    value: item.id,
    label: item.manufacturer_name,
  })) : []

  const brandSelectOption = Array.isArray(brandData) && brandData?.length > 0 ? brandData?.filter((item) => item.status === true && item?.deleted_at === null)?.map((item) => ({
    value: item.id,
    label: item.brand_name,
  })) : []


  const formSelectOption = Array.isArray(formData) && formData?.length > 0 ? formData?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : []

  const usesSelectOption = Array.isArray(usesData) && usesData?.length > 0 ? usesData?.map((item) => ({
    value: item.id,
    label: item.name,
  })) : []

  const initialValues = {
    product_name: "",
    featured_image: null,
    status: "true",
    slug: "",
    gallery_image: [],
    category: [],
    has_variant: false,
    marketer: "",
    brand: "",
    weight: "",
    length: "",
    width: "",
    height: "",
    tags: [],
    hsn_code: "",
    long_description: "",
    minimum_order_quantity: "",
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
    age: [],
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


  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, isValid, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewProductSchema,
    onSubmit: async (values) => {
      const inventory = {}
      const formData = new FormData();

      Object.entries(values).forEach(([key, value]) => {
        if (key === "gallery_image") {
          value.forEach((file) => {
            formData.append("gallery_image", file);
          });
        } else if (key === "category") {
          value.forEach((category) => {
            formData.append("category", category.value);
          });
        } else if (key === "tags") {
          value.forEach((tag) => {
            formData.append("tags", tag.label);
          });
        } else if (key === "age") {
          value.forEach((age) => {
            formData.append("age", age.value);
          });
        } else if (key === "gender") {
          value.forEach((gender) => {
            formData.append("gender", gender.value);
          });
        } else if (key === "linked_items") {
          value.forEach((linkedItem) => {
            formData.append("linked_items", linkedItem.value);
          });
        } else if (key === "sku" || key === "stock_quantity" || key === "mrp" || key === "selling_price" || key === "discount_percent") {
          inventory[key] = value;
        } else {
          formData.append(key, value);
        }
      });

      formData.append("inventoryData", JSON.stringify(inventory));
      formData.append("selfComboData", JSON.stringify(selfCombo))


      try {
        const response = await addNewProduct(formData);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message);
          getAllProducts()
          refetch()
          resetForm()
          if (addNew) {
            console.log("addNew", addNew);
            navigate("/catalogue/products");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  });

  const handleScrollToError = async () => {
    const formErrors = await validateForm();
    const errorFields = Object.keys(formErrors);

    if (errorFields.length > 0) {
      const firstErrorField = errorFields[0];

      let errorElement = document.getElementById(firstErrorField);

      if (!errorElement) {
        const elementsByName = document.getElementsByName(firstErrorField);
        if (elementsByName.length > 0) {
          errorElement = elementsByName[0];
        }
      }

      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
        errorElement.focus();
      }
    }
  };

  const options = categoryData
    ? categoryData
      .filter(category => category.status === true)
      .map(category => ({
        value: category?.id,
        label: category?.category_name
      }))
    : [];
  const Linked_item_options = productsData ? productsData.filter(product => product.status === true && product?.deleted_at === null).map(product => ({
    value: product?.id,
    label: product?.product_name
  })) : [];
  const tagOptions = Array.isArray(tagData) ? tagData.map(tag => ({
    value: tag?.id,
    label: tag?.name,
  })) : [];

  const AgeOptions = [
    { value: "Adult", label: "Adult" },
    { value: "Child", label: "Child" },
    { value: "Elderly", label: "Elderly" }
  ];

  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };
  const generateMetaTitle = (productName, seoDiscount, categories = []) => {
    let categoryDiscount = seoDiscount;

    if (!seoDiscount && Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];
      const selectedCategory = categoryData?.find(item => item.id === firstCategory);
      categoryDiscount = selectedCategory?.seo_discount || '';
    }

    let discountText = categoryDiscount ? `Up to ${categoryDiscount}%  Off:` : "";

    const categoryNames = Array.isArray(categories) ? categories.map(categoryId => {
      const category = categoryData.find(item => item.id === categoryId);
      return category ? category.name : null;
    }).filter(Boolean).join(', ') : '';

    const metaTitle = `${discountText}  Buy ${productName} Online in ${categoryNames} at Best Price - Magicine Pharma`;

    setFieldValue("meta_title", metaTitle.trim());
  };

  const generateMetaDescription = (productName, seoDiscount, categories = []) => {

    let categoryDiscount = seoDiscount;

    if (!seoDiscount && Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];
      const selectedCategory = categoryData?.find(item => item.id === firstCategory);
      categoryDiscount = selectedCategory?.seo_discount || '';
    }

    let discountText = categoryDiscount ? `Up to ${categoryDiscount}% off on:` : "";

    const metaDescription = `Buy ${productName} Online at Best Price from Magicine Pharma.${discountText} ${productName} ✔ Best Quality ✔ Order Now.`;

    setFieldValue("meta_description", metaDescription.trim());
  };

  useEffect(() => {
    const selectedManufacturer = Options?.find((item) => values.marketer == item.id);
    const manufacturerName = selectedManufacturer ? selectedManufacturer.manufacturer_name : '';

    const selectedBrand = brandData?.find((item) => values.brand == item.id)
    const brandName = selectedBrand ? selectedBrand.brand_name : '';


    const schemaMarkup = generateSchemaMarkup({
      ...values,
      marketer: manufacturerName,
      brand: brandName,
      featured_image: `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`
    });
    setFieldValue("schema_markup", schemaMarkup);
  }, [values.product_name, values.featured_image, values.long_description, values.category, values.marketer, values.brand, values.weight, values.height, values.width, values.length, values.packOf, Options, values.minimum_order_quantity]);

  const handleProductNameChange = (event) => {
    handleChange(event);
    const productName = event.target.value;
    const seoDiscount = values.seo_discount;

    generateSlug(productName);
    generateMetaTitle(productName, seoDiscount);
    generateMetaDescription(productName, seoDiscount);
  };


  const handleSeoDiscountChange = (event) => {
    handleChange(event);
    const seoDiscount = event.target.value;
    const productName = values.product_name;

    generateMetaTitle(productName, seoDiscount);
    generateMetaDescription(productName, seoDiscount);
  };

  const handleCategoryChange = (selectedOptions) => {

    setFieldValue("category", selectedOptions)

    const categories = selectedOptions ?
      selectedOptions.map(option => parseInt(option.value, 10)) : [];

    const productName = values.product_name;
    const seoDiscount = values.seo_discount;

    generateMetaTitle(productName, seoDiscount, categories);
    generateMetaDescription(productName, seoDiscount, categories);
  };

  const generateOgAndTwitterTag = () => {

    const ogTag = `
      <meta property="og:type" content="website">
      <meta property="og:title" content='${values.meta_title || "undefined"}'>
      <meta property="og:description" content="${values.meta_description || "undefined"}">
      <meta property="og:url" content="${USER_BASE_URL}/product/general-product/${values.slug || "undefined"}">
      <meta property="og:site_name" content="Magicine Pharma">
      <meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">

      <!-- Twitter Card data -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${values.meta_title || "undefined"}">
      <meta name="twitter:description" content="${values.meta_description || "undefined"}">
      <meta name="twitter:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">
      <meta name="twitter:site" content="@MagicinePharma">
    `;

    setFieldValue("og_tag", ogTag);
  }

  useEffect(() => {
    generateOgAndTwitterTag();
  }, []);

  useEffect(() => {
    if (values.meta_title && values.meta_description && values.slug) {
      generateOgAndTwitterTag();
    }
  }, [values.meta_title, values.meta_description, values.slug]);

  useEffect(() => {
    if (values.product_name) {
      generateMetaTitle(values.product_name);
      generateMetaDescription(values.product_name);
    }
  }, [values.product_name]);

  const handleGalleryChange = (event) => {
    const files = Array.from(event.target.files);
    const fileReaders = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({ file, preview: reader.result });
        };
        reader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders).then(images => {
      setSelectedThumbnails(prevState => [...prevState, ...images]);
      setFieldValue('gallery_image', [...values.gallery_image, ...files]);
    });
  };

  const handleImageRemove = (indexToRemove) => {
    setSelectedThumbnails(prevState => prevState.filter((_, index) => index !== indexToRemove));
    setFieldValue('gallery_image', values.gallery_image.filter((_, index) => index !== indexToRemove));
  };

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setFieldValue('featured_image', file);

    if (file) {
      setViewThumbnail(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThumbnail(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setViewThumbnail(true);
      setSelectedThumbnail(null);
    }
  };

  const handleAddSelfCombo = () => {
    setSelfCombo(prevSelfCombo => [
      ...prevSelfCombo,
      {
        pack: "",
        combo_single_price: "",
        discount_percent: ""
      }
    ]);
  };

  const handleComboChange = (e, index) => {
    const { name, value } = e.target;
    const updatedSelfCombo = [...selfCombo];

    const newValue = value === '' ? '' : value;

    updatedSelfCombo[index] = {
      ...updatedSelfCombo[index],
      [name]: newValue
    };

    if ((name === "combo_single_price" || name === "pack") &&
      values.selling_price &&
      updatedSelfCombo[index].combo_single_price) {

      const sellingPrice = parseFloat(values.selling_price);
      const comboSinglePrice = parseFloat(updatedSelfCombo[index].combo_single_price);

      if (!isNaN(sellingPrice) && !isNaN(comboSinglePrice)) {
        const calculatedDiscount = ((sellingPrice - comboSinglePrice) * 100) / sellingPrice;
        updatedSelfCombo[index].discount_percent = calculatedDiscount.toFixed(2);
      }
    }

    setSelfCombo(updatedSelfCombo);
  };

  const calculateDiscountPercentage = () => {
    const mrp = parseFloat(values.mrp);
    const offerPrice = parseFloat(values.selling_price);
    if (!isNaN(mrp) && !isNaN(offerPrice)) {
      const difference = mrp - offerPrice;
      const discountPercentage = (difference * 100) / mrp;
      const discountPercentageNumber = Number(discountPercentage);
      setFieldValue("discount_percent", discountPercentageNumber);
    } else {
      setFieldValue("discount_percent", '');
    }
  };

  const calculateOfferPrice = () => {
    const mrp = parseFloat(values.mrp);
    const discountPrice = parseFloat(values.discount_percent);
    if (!isNaN(mrp) && !isNaN(discountPrice)) {
      setDiscount(false);
      let selling_price = mrp - (mrp * discountPrice) / 100;
      selling_price = Number(selling_price);
      setFieldValue("selling_price", selling_price);
    } else {
      setFieldValue("selling_price", '');
    }
  };

  const handleOfferPriceChange = (e) => {
    let inputValue = e.target.value;
    const mrp = parseFloat(values.mrp);
    setDiscount(true)
    if (parseInt(inputValue) > mrp) {
      inputValue = mrp;
    }
    setFieldValue('selling_price', inputValue);
  };
  const handleDiscountChange = (e) => {
    let inputValue = e.target.value;
    if (parseInt(inputValue) > 100) {
      inputValue = '100';
    }
    setFieldValue('discount_percent', inputValue);
  };

  useEffect(() => {
    if (discount) {
      calculateDiscountPercentage();
    }
  }, [values.selling_price]);

  useEffect(() => {
    calculateOfferPrice();
  }, [values.mrp, values.discount_percent]);


  const handleDeleteCombo = (index) => {
    const updatedSelfCombo = selfCombo.filter((_, i) => i !== index);
    setSelfCombo(updatedSelfCombo);
  };

  const genderOption = [
    { value: 'male', label: 'male' },
    { value: 'female', label: 'female' },
    { value: 'other', label: 'other' },
  ]

  return (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        handleScrollToError();
      }} encType="multipart/form-data">
        {isLoading && <Loader />}
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
            />
            {errors.product_name && touched.product_name ? (
              <p className={`error`}>{errors.product_name}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Featured Image (JPG, JPEG, PNG)<span className="required_icon">*</span></Form.Label>
            <Row>
              <Col as={Col} md={3} className="d-flex justify-content-center">
                {viewThumbnail ? (
                  <div className="position-relative">
                    <p>No image</p>
                    <span className="position-absolute">
                      <button className="p-0 px-1" onClick={() => { setViewThumbnail(true), setFieldValue('featured_image', null) }}>
                        <i className="icon icon-close text-danger"></i>
                      </button>
                    </span>
                  </div>
                ) : (
                  <div className="position-relative">
                    <img src={selectedThumbnail} alt="Selected Thumbnail" width={50} height={50} />
                    <span className="position-absolute">
                      <button className="p-0 px-1" onClick={() => { setViewThumbnail(true), setFieldValue('featured_image', null) }}>
                        <i className="icon icon-close text-danger"></i>
                      </button>
                    </span>
                  </div>
                )}
              </Col>
              <Col as={Col} md={9}>
                <Form.Control
                  type="file"
                  name="featured_image"
                  accept=".jpg,.jpeg,.png,.webp"
                  onChange={handleThumbnailChange}
                  onBlur={handleBlur}
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
            />
            {errors.gallery_image && touched.gallery_image ? (
              <p className={`error`}>{errors.gallery_image}</p>
            ) : null}
            <Row className="mt-2">
              {selectedThumbnails.map((thumbnail, index) => (
                <Col key={index} md={3} className="mb-2">
                  <div className="position-relative">
                    <img src={thumbnail.preview} alt={`Thumbnail ${index}`} width={50} height={50} />
                    <span className="position-absolute end-0 top-0">
                      <button
                        className="p-0 px-1"
                        type="button"
                        onClick={() => handleImageRemove(index)}
                      >
                        <i className="icon icon-close text-danger"></i>
                      </button>
                    </span>
                  </div>
                </Col>
              ))}
            </Row>
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
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="6">
            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
            <Select
              options={options}
              name="category"
              value={values.category}
              onChange={(selectedOptions) =>
                handleCategoryChange(selectedOptions)
              }
              onBlur={handleBlur}
              isMulti
              className="rounded-4"
              isSearchable
              id="category"
            />
            {
              errors.category && touched.category ? (
                <p className="text-danger">{errors.category}</p>
              ) : null
            }
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
            />
          </Form.Group>
          <Form.Group as={Col} md="2">
            <Form.Label>Has Variant</Form.Label>
            <Form.Check
              type="checkbox"
              id="has_variant"
              name="has_variant"
              checked={values.has_variant}
              onChange={(e) => setFieldValue("has_variant", e.target.checked)}
              onBlur={handleBlur}
              className="d-flex justify-content-start ps-5 rounded-1"
              disabled={values?.combo_product ? true : false}
            />
          </Form.Group>
          {
            !values.has_variant ? (
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
                />
              </Form.Group>
            ) : (
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
            <Form.Label>Marketer <span className="text-danger">*</span></Form.Label>
            <Row>
              <Col as={Col} md={10}>
                <Select
                  name="marketer"
                  onBlur={handleBlur}
                  onChange={(selectedOption) => setFieldValue("marketer", selectedOption.value || "")}
                  value={marketerSelectOption.find(option => option.value === values.marketer) || null}
                  options={marketerSelectOption}
                />
              </Col>
              <Col as={Col} md={2}>

                <Button type="button" onClick={() => { dispatch(openModal({ componentName: 'AddNewManufacturer' })) }} className="btn btn-icon btn-primary" variant="primary"><i className="fe fe-plus"></i></Button>
              </Col>
            </Row>                    {
              errors.marketer && touched.marketer ? (
                <p className={`error`}>{errors.marketer}</p>
              ) : null
            }
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Brand <span className="text-danger">*</span></Form.Label>
            <Select
              name="brand"
              onBlur={handleBlur}
              value={brandSelectOption.find(option => option.value === values.brand) || null}
              options={brandSelectOption}
              onChange={(selectedOptions) => setFieldValue("brand", selectedOptions?.value || "")}
            />
            {errors.brand && touched.brand ? (
              <p className={`error`}>{errors.brand}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              weight(g) <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="weight"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.weight}
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
              type="text"
              min="0"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.length}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Width(cm)</Form.Label>
            <Form.Control
              name="width"
              type="text"
              min="0"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.width}
            />
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Height(cm)</Form.Label>
            <Form.Control
              name="height"
              type="text"
              min="0"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.height}
            />
          </Form.Group>
        </Row>
        <Row>
          <Col as={Col} md={4}>
            <Form.Group>
              <Form.Label>Form <span className="text-danger">*</span></Form.Label>
              <Select
                name="form"
                onBlur={handleBlur}
                value={formSelectOption.find((item) => item.value === values.form)}
                options={formSelectOption}
                onChange={(selectedOption) => setFieldValue("form", selectedOption?.value || '')}
              />
              {errors.form && touched.form ? (
                <p className="text-danger">{errors.form}</p>
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
                min={1}
              />
              {errors.packOf && touched.packOf ? (
                <p className="text-danger">{errors.packOf}</p>
              ) : null}
            </Form.Group>
          </Col>
          <Col as={Col} md={4}>
            <Form.Group>
              <Form.Label>Recently Bought</Form.Label>
              <Form.Control
                name="recently_bought"
                type="number"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.recently_bought}
                min={1}
              />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Uses <span className="text-danger">*</span></Form.Label>
              <Select
                name="uses"
                onBlur={handleBlur}
                value={usesSelectOption.find(option => option.value === values.uses) || null}
                options={usesSelectOption}
                onChange={(selectedOption) => setFieldValue("uses", selectedOption?.value || "")}
              />
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
                onChange={(selectedOptions) =>
                  setFieldValue("age", selectedOptions)
                }
                onBlur={handleBlur}
                value={values.age}
                options={AgeOptions}
                isSearchable
                isMulti
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
              value={values.product_highlight}
            />
          </Form.Group>
        </Row>
        <Row>
          <Form.Group as={Col} md={12}>
            <Form.Label>Description</Form.Label>
            <SunEditor
              setOptions={options_for_sunEditor}
              name="long_description"
              onChange={(content) => setFieldValue("long_description", content)}
              onBlur={() => setFieldTouched("long_description", true)}
              value={values.long_description}
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
              name="minimum_order_quantity"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.minimum_order_quantity}
              min={1}
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
            />
            {errors.linked_items && touched.linked_items ? (
              <p className="text-danger">{errors.linked_items}</p>
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
                    required
                  />
                  {
                    values.combo_product &&
                      !values.sku ? (
                      <p className="text-danger">This field is required.</p>
                    ) : null
                  }
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
                    min={1}
                    required
                  />
                  {
                    values.combo_product &&
                      !values.stock_quantity ? (
                      <p className="text-danger">This field is required.</p>
                    ) : null
                  }
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
                    required
                    min={1}
                  />
                  {
                    values.combo_product &&
                      !values.mrp ? (
                      <p className="text-danger">This field is required.</p>
                    ) : null
                  }
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
                    onChange={handleOfferPriceChange}
                    onBlur={handleBlur}
                    required
                    min={1}
                  />
                  {
                    values.combo_product &&
                      !values.selling_price ? (
                      <p className="text-danger">This field is required.</p>
                    ) : null
                  }
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Discount Percentage <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="number"
                    name="discount_percent"
                    value={values.discount_percent}
                    onChange={handleDiscountChange}
                    onBlur={handleBlur}
                    required
                    min={1}
                  />
                  {
                    values.combo_product &&
                      !values.discount_percent ? (
                      <p className="text-danger">This field is required.</p>
                    ) : null
                  }
                </Form.Group>
              </Col>
              <Col md={4} className="d-flex w-auto align-items-center justify-content-center">
                <Button className="w-full" onClick={handleAddSelfCombo}>Add Self Combo</Button>
              </Col>
            </Row>
            <Row className="border border-3 border-dark rounded-3 my-2">
              {selfCombo.map((combo, index) => (
                <Row key={index} className="mb-1">
                  <Col md={2}>
                    <Form.Group>
                      <Form.Label>Packs <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="pack"
                        value={combo.pack || ''}
                        onChange={(e) => handleComboChange(e, index)}
                        onBlur={handleBlur}
                        required
                        min={2}
                      />
                      {
                        values.combo_product &&
                          !combo.pack ? (
                          <p className="text-danger">This field is required.</p>
                        ) : null
                      }
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Selling Price Each <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="number"
                        name="combo_single_price"
                        value={combo.combo_single_price || ''}
                        onChange={(e) => handleComboChange(e, index)}
                        onBlur={handleBlur}
                        required
                        min={1}
                      />
                      {
                        values.combo_product &&
                          !combo.combo_single_price ? (
                          <p className="text-danger">This field is required.</p>
                        ) : null
                      }
                    </Form.Group>
                  </Col>
                  <Col md={3}>
                    <Form.Group>
                      <Form.Label>Selling Price <span className="text-danger">*</span></Form.Label>
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
                  <Col as={Col} md={2} className="m-auto text-center">
                    <Button className="btn-danger" variant="" onClick={() => handleDeleteCombo(index)}><i className="fe fe-trash"></i> </Button>
                  </Col>
                </Row>
              ))}
            </Row>
          </>
        )}
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Seo Discount</Form.Label>
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
              <Form.Label>Gender</Form.Label>
              <Select
                name="gender"
                options={genderOption}
                value={values.gender}
                onChange={(selectedOptions) =>
                  setFieldValue("gender", selectedOptions)
                }
                onBlur={handleBlur}
                isSearchable
                isMulti
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
          />
        </Row>

        <Row className="my-5">
          <Col as={Col} md={6} className="text-end">
            <Button type="submit" className="btn-primary mx-auto w-auto" onClick={() => setAddNew(true)} >Save</Button>
          </Col>
          <Col as={Col} md={6}>
            <Button type="submit" className="btn-primary mx-auto w-auto ">Save and Add New</Button>
          </Col>
        </Row>
      </Form >
    </>
  );
}