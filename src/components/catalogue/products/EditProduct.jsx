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
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import productImage from "../../../assets/images/dashboard/inventory.png";
import AddNewManufacturer from "../../market-manufacturer/AddNewManufacturer";
import SeoForm from "../../seo-page/SeoForm";
import { useDispatch } from "react-redux";
import { openModal } from "../../../redux/slices/allModalSlice";
import CreatableSelect from 'react-select/creatable';
import { useDeleteComboItemsMutation, useEditProductMutation, useGetProductInventoryQuery, useGetProductsQuery, useGetSingleProductsQuery, useUpdateCartPriceMutation } from "../../../redux/features/productEndPoints";
import { useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryQuery, useGetManufactutrerQuery, useGetTagsQuery } from "../../../redux/features/catalogueEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import Error from "../../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";
import { generateSchemaMarkup } from "../../../commondata/schemaMarkup";

export default function EditProduct() {
  const [selfCombo, setSelfCombo] = useState([
    { pack: "", combo_single_price: "", discount_percent: "" }
  ]);
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
  const { refetch: getAllProducts } = useGetProductsQuery(query)

  const navigate = useNavigate()
  const dispatch = useDispatch();
  const [viewThubnail, setViewThubnail] = useState(true);
  const [selectedThubnail, setSelectedThubnail] = useState(null);
  const { id } = useParams()
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: singleProductRefetch } = useGetSingleProductsQuery(id, { refetchOnMountOrArgChange: true })
  const [deleteComboItems, { isLoading: loadingDelete }] = useDeleteComboItemsMutation()

  const [UpdateCartPrice, { isSuccess: updateCartPriceSuccess }] = useUpdateCartPriceMutation()


  const [categoryQuery, setCategoryQuery] = useState({
    status: true,
    type: "general_product"
  })

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


  const marketerSelectOption = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.filter((item) => item.status === true && item?.deleted_at === null)?.map((item) => ({
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
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewProductSchema,
    onSubmit: async (values) => {
      const inventory = {}
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'gallery_image') {
          value.forEach(file => {
            formData.append('gallery_image', file);
          });
        } else if (key === 'category') {
          value.forEach(category => {
            formData.append('category', category.value);
          })
        }
        else if (key === 'tags') {
          value.forEach(tag => {
            formData.append('tags', tag.label);
          })
        }
        else if (key === 'linked_items' && Array.isArray(value)) {
          value.forEach(linkedItem => {
            formData.append('linked_items', linkedItem.value);
          });
        }
        else if (key === 'age') {
          value.forEach(age => {
            formData.append('age', age.value);
          })
        }
        else if (key === 'gender') {
          value.forEach(age => {
            formData.append('gender', age.value);
          })
        }
        else if (key === "sku" || key === "stock_quantity" || key === "mrp" || key === "selling_price" || key === "discount_percent") {
          inventory[key] = value;
        }
        else {
          formData.append(key, value);
        }
      });
      formData.append("inventoryData", JSON.stringify(inventory));
      formData.append("selfComboData", JSON.stringify(selfCombo))

      try {
        const response = await editProduct({ updatedproduct: formData, productId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          getAllProducts()
          singleProductRefetch()

          const cartData = {
            product_id: id,
            type: "Product"
          }
          navigate("/catalogue/products")

          if (values.combo_product) {
            await UpdateCartPrice(cartData)
          }
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

  const options = categoryData ? categoryData.map(category => ({
    value: category?.id,
    label: category?.category_name
  })) : [];
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
    { value: "Elderly", label: "Elderly" },
  ]

  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };


  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const existingImages = values.gallery_image || [];
    setFieldValue('gallery_image', [...existingImages, ...files]);
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
    setFieldValue('isEnquired', singleProduct?.isEnquired);
    setFieldValue('marketer', singleProduct?.marketer?.id);
    setFieldValue('brand', singleProduct?.brand?.id);
    setFieldValue('weight', singleProduct?.weight);
    setFieldValue('length', singleProduct?.length);
    setFieldValue('width', singleProduct?.width);
    setFieldValue('height', singleProduct?.height);
    setFieldValue('form', singleProduct?.form?.id);
    setFieldValue('uses', singleProduct?.uses?.id);
    setFieldValue('packOf', singleProduct?.packOf);
    setFieldValue('long_description', singleProduct?.long_description);
    setFieldValue('minimum_order_quantity', singleProduct?.minimum_order_quantity);
    setFieldValue('tax_percentage', singleProduct?.tax_percentage);
    setFieldValue('manufacturer_name', singleProduct?.manufacturer_name);
    setFieldValue('country_origin', singleProduct?.country_origin);
    setFieldValue('fssai_license', singleProduct?.fssai_license);
    setFieldValue('food', singleProduct?.food);
    setFieldValue('vegitarian', singleProduct?.vegitarian);
    setFieldValue('customer_service_number', singleProduct?.customer_service_number);
    setFieldValue('customer_service_email_id', singleProduct?.customer_service_email_id);

    setFieldValue(
      'linked_items',
      singleProduct?.linked_items?.map((linkedItem) => ({
        value: linkedItem?.id,
        label: linkedItem?.product_name,
      }))
    );

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
    setFieldValue('age', singleProduct?.age.map(item => ({
      value: item,
      label: item,
    })));
    setFieldValue('gender', singleProduct?.gender?.map(item => ({
      value: item,
      label: item,
    })));
    setFieldValue('sku', singleProduct?.inventoryData?.sku);
    setFieldValue('stock_quantity', singleProduct?.inventoryData?.stock_quantity);
    setFieldValue('mrp', singleProduct?.inventoryData?.mrp);
    setFieldValue('selling_price', singleProduct?.inventoryData?.selling_price);
    setFieldValue('discount_percent', singleProduct?.inventoryData?.discount_percent);
    setFieldValue('seo_discount', singleProduct?.seo_discount);


    if (singleProduct?.selfComboData) {
      setSelfCombo(singleProduct.selfComboData.map(combo => ({
        pack: combo.pack || "",
        single_price: combo.single_price || "",
        combo_single_price: combo.combo_single_price || "",
        discount_percent: combo.discount_percent.toFixed(2) || "",
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

  const handleDeleteCombo = async (index, id) => {
    try {
      if (id) {
        const res = await deleteComboItems(id);
        if (res?.data?.http_status_code === 200) {
          singleProductRefetch();
          refetch();
          navigate("/catalogue/products")
          toast.success("Combo Product Deleted Successfully")
        }
      } else {
        const updatedSelfCombo = selfCombo.filter((_, i) => i !== index);
        setSelfCombo(updatedSelfCombo);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const generateMetaTitle = (productName, seoDiscount, categories = []) => {

    let categoryDiscount = seoDiscount;

    if (!seoDiscount && Array.isArray(categories) && categories.length > 0) {
      const firstCategory = categories[0];

      const selectedCategory = categoryData?.find(item => item.id === firstCategory.value);


      categoryDiscount = selectedCategory?.seo_discount || '';
    }

    let discountText = categoryDiscount ? `Up to ${categoryDiscount}% Off :` : "";



    const categoryNames = Array.isArray(categories) ? categories.map(categoryId => {
      const category = categoryData?.find(item => item.id === categoryId);
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

    let discountText = categoryDiscount ? `Up to ${categoryDiscount}% off on` : "";

    const metaDescription = `Buy ${productName} Online at Best Price from Magicine Pharma.${discountText} ${productName} ✔ Best Quality ✔ Order Now.`;


    setFieldValue("meta_description", metaDescription.trim());
  };



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
    setFieldValue("category", selectedOptions);

    const categories = selectedOptions ?
      selectedOptions.map(option => parseInt(option.value, 10)) : [];

    const productName = values.product_name;
    const seoDiscount = values.seo_discount;

    generateMetaTitle(productName, seoDiscount, categories);
    generateMetaDescription(productName, seoDiscount, categories);
  };


  useEffect(() => {
    generateMetaTitle(values.product_name, values.seo_discount, values?.category);
    generateMetaDescription(values.product_name, values.seo_discount, values?.category);

  }, [values.product_name, values?.category])


  const generateOgAndTwitterTag = () => {

    const ogTag = `
      <meta property="og:type" content="website">
      <meta property="og:title" content='${values.meta_title || "undefined"}'>
      <meta property="og:description" content="${values.meta_description || "undefined"}">
      <meta property="og:url" content="${USER_BASE_URL}/product/general-product/${values.slug || "undefined"}">
      <meta property="og:site_name" content="Magicine Pharma">
      <meta property="og:image" content="${singleProduct && singleProduct.featured_image ? singleProduct.featured_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">
      
      <!-- Twitter Card data -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${values.meta_title || "undefined"}">
      <meta name="twitter:description" content="${values.meta_description || "undefined"}">
      <meta name="twitter:image" content="${singleProduct && singleProduct.featured_image ? singleProduct.featured_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">
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
    const selectedManufacturer = manufacturerData?.find((item) => values.marketer == item.id);
    const manufacturerName = selectedManufacturer ? selectedManufacturer.manufacturer_name : '';

    const selectedBrand = brandData?.find((item) => values.brand == item.id)
    const brandName = selectedBrand ? selectedBrand.brand_name : '';

    const image = singleProduct?.featured_image

    let featured_image
    if (image) {
      const isComplete = image.startsWith("http")
      if (!isComplete) {
        featured_image = `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`
      } else {
        featured_image = singleProduct.featured_image
      }
    }


    const schemaMarkup = generateSchemaMarkup({
      ...values,
      marketer: manufacturerName,
      brand: brandName,
      featured_image: featured_image
    });
    setFieldValue("schema_markup", schemaMarkup);
  }, [values.product_name, values.featured_image, values.long_description, values?.category, values.marketer, values.brand, values.weight, values.height, values.width, values.length, values.packOf, values.marketer, values.minimum_order_quantity, singleProduct]);

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
        {
          loadingDelete && <Loader /> || isLoading && <Loader />
        }
        <Row>
          <Col>
            <PageHeader titles="Catalogue - General Product" active={["Edit General Product/"]} items={["Home", "General Product List"]} links={["/dashboard", "/catalogue/products"]} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h3 className="card-title">Edit Product</h3>
              </Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                  handleScrollToError();
                }} encType="multipart/form-data">
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
                            <Link><img src={singleProduct?.featured_image} alt="error" width={50} height={50} /></Link>
                            <span className="position-absolute">
                              <button className="p-0 px-1" onClick={() => { setViewThubnail(false), setFieldValue('featured_image', null) }}><i className="icon icon-close text-danger"></i></button>
                            </span>
                          </div> : (<div className="position-relative"><img src={selectedThubnail} alt="error" width={50} height={50} /></div>)}
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
                        <p className="text-danger">{errors.slug}</p>
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
                        <p className="error">{errors.gallery_image}</p>
                      ) : null}

                      <Row className="mt-2">
                        {values.gallery_image && values.gallery_image.map((file, index) => (
                          <Col key={index} md={3} className="mb-2">
                            <div className="position-relative">
                              <img
                                src={typeof file === 'string' ? file : URL.createObjectURL(file)}
                                alt={`Gallery ${index}`}
                                width={50}
                                height={50}
                              />
                              <span className="position-absolute end-0 top-0">
                                <button
                                  className="p-0 px-1"
                                  type="button"
                                  onClick={() => {
                                    const newImages = values.gallery_image.filter((_, i) => i !== index);
                                    setFieldValue('gallery_image', newImages);
                                  }}
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
                        value={values?.category}
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
                      <Form.Label>Marketer <span className="text-danger">*</span></Form.Label>
                      <Row>
                        <Col as={Col} md={10}>
                          <Select
                            name="marketer"
                            onBlur={handleBlur}
                            onChange={(selectedOption) => setFieldValue("marketer", selectedOption)}
                            // value={values.marketer}
                            value={marketerSelectOption?.find((item) => item.value === values?.marketer)}
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
                        value={brandSelectOption?.find((item) => item.value === values?.brand)}
                        options={brandSelectOption}
                        onChange={(selectedOptions) => setFieldValue("brand", selectedOptions.value)}
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
                        type="text" s
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
                        <Form.Label>Form</Form.Label>
                        <Select
                          name="form"
                          onBlur={handleBlur}
                          // value={values.form}
                          value={formSelectOption?.find((item) => item.value === values.form)}
                          options={formSelectOption}
                          onChange={(selectedOption) => setFieldValue("form", selectedOption)}
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
                          value={usesSelectOption?.find((item) => item?.value === values.uses)}
                          options={usesSelectOption}
                          onChange={(selectedOptions) => setFieldValue("uses", selectedOptions)}
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
                          options={AgeOptions}
                          onBlur={handleBlur}
                          value={values.age}
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
                        defaultValue={singleProduct ? singleProduct?.tags.map(tag => ({
                          value: tag?.name,
                          label: tag?.name,
                        })) : []}
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
                        setContents={singleProduct?.short_description}
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
                          <Button className="w-full" onClick={handleAddSelfCombo} >Add Self Combo</Button>
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
                                  min={1}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Selling Price Each <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  type="number"
                                  name="combo_single_price"
                                  value={combo.combo_single_price}
                                  onChange={(e) => handleComboChange(e, index)}
                                  onBlur={handleBlur}
                                />
                              </Form.Group>
                            </Col>
                            <Col md={3}>
                              <Form.Group>
                                <Form.Label>Selling Price <span className="text-danger">*</span></Form.Label>
                                <Form.Control
                                  disabled
                                  value={combo.combo_single_price * combo.pack}
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
                              <Button className="btn-danger" variant="" onClick={() => handleDeleteCombo(index, combo.id)}><i className="fe fe-trash"></i> </Button>
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
                    <Button type="submit" className="btn-primary mx-auto w-auto">Save</Button>
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

