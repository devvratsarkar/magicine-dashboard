import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Card, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { AddNewMedicineSchema } from "../../commondata/formvalidations";
import "react-quill/dist/quill.snow.css";
import { formats, modules, options_for_sunEditor, } from "../../commondata/formEditorOptions";
import Select from "react-select";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getDefaultAccordionOrder, getStoredAccordionOrder, getsafetyAdvice, saftyOptions, setStoredAccordionOrder, } from "../medicine/AddMedicineFunction";
import slugify from "slugify";
import CreatableSelect from 'react-select/creatable';
import SeoForm from "../seo-page/SeoForm";
import { openModal } from "../../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";
import { useAddNewMedicineMutation, useGetMedicineInventoryQuery, useGetMedicinesQuery, useGetProductsQuery } from "../../redux/features/productEndPoints";
import { useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryQuery, useGetManufactutrerQuery, useGetTagsQuery } from "../../redux/features/catalogueEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { getMedicinePage } from "../../utils/routes";
import { API_BASE_URL, MEDIA_BASE_URL, USER_BASE_URL } from "../../utils/config";
import { generateSchemaMarkup, generateSchemaMarkupMedicine } from "../../commondata/schemaMarkup";
import axios from "axios";

export default function AddNewMedicineForm() {
  const [query, setQuery] = useState({
    brand: '',
    marketer: '',
    status: '',
    fromDate: '',
    toDate: '',
    search: '',
    page: 1,
    limit: 10
  })


  const [filteredSaltMedicine, setFilteredSaltMedicine] = useState([])
  const [substituteMedicineOption, setSubstituteMedicineOption] = useState([]);

  const [categoryQuery, setCategoryQuery] = useState({
    status: true,
    type: "medicine"
  })

  const [queryBrand, setQuerybrand] = useState({
    type: "Medicine",
    status: true
  })

  const { refetch: allMedicines } = useGetMedicinesQuery(query)
  const [viewThumbnail, setViewThumbnail] = useState(true);
  const [selectedThumbnail, setSelectedThumbnail] = useState(null);
  const [selectedThumbnails, setSelectedThumbnails] = useState([]);
  const [addNew, setAddNEw] = useState(false)
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const [safetyAdvice, setSafetyAdvice] = useState(getsafetyAdvice());
  const [accordion, setAccordion] = useState(getStoredAccordionOrder() || getDefaultAccordionOrder());
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [readOnly, setReadOnly] = useState(null);
  const [addNewMedicine, { isLoading }] = useAddNewMedicineMutation()
  const { data: manufacturer } = useGetManufactutrerQuery()
  const { data: brand } = useGetBrandQuery(queryBrand)
  const { data: products, refetch } = useGetMedicineInventoryQuery()
  const { data: tags } = useGetTagsQuery()
  const { data: category } = useGetCategoryQuery(categoryQuery)
  const { data: uses } = useGetAllUsesQuery()
  const { data: form } = useGetAllFormQuery()
  const manufacturerData = manufacturer?.data?.manufacturer
  const brandData = brand?.data?.allBrand;
  const productsData = products?.data?.filteredMedicine;
  const tagData = tags?.data;
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


  const categoryData = category?.data?.activeCategories;
  const initialValues = {
    product_name: "",
    featured_image: "",
    status: "active",
    slug: "",
    gallery_image: [],
    hsn_code: "",
    generic_name: "",
    composition: "",
    strength: "",
    storage: "",
    form: "",
    has_variant: false,
    prescription_required: false,
    packOf: "",
    indication: "",
    category: [],
    marketer: "",
    brand: "",
    weight: "",
    length: null,
    width: null,
    height: null,
    tags: [],
    minimum_order_quantity: "",
    linked_items: [],
    short_description: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
    more_details: [],
    uses: "",
    age: [],
    substitute_product: [],
    isEnquired: false,
    seo_discount: "",
    tax_percentage: ""
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewMedicineSchema,
    onSubmit: async (values) => {


      const faqData = faqList.map((faq, index) => ({
        [`question`]: faq.question,
        [`answer`]: faq.answer,
      }));
      const safteyData = safetyAdvice.map((saftey, index) => ({
        [`content`]: saftey.content,
        [`advices`]: saftey.advices,
        [`title`]: saftey.title,
      }));
      const accordionOrder = accordion.map((item, index) => ({
        [`title`]: item.title,
        [`content`]: item.content,
        [`status`]: item.status,
      }));
      values.more_details = accordionOrder;
      const faqIndex = values.more_details.findIndex(
        (section) => section.title === "FAQs"
      );
      if (faqIndex !== -1) {
        values.more_details[faqIndex].content = faqData;
      }
      const safteyIndex = values.more_details.findIndex(
        (section) => section.title === "Safety Advice"
      );
      if (safteyIndex !== -1) {
        values.more_details[safteyIndex].content = safteyData;
      }
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'gallery_image') {
          value.forEach(file => {
            formData.append('gallery_image', file);
          });
        } else if (key === 'category') {
          value.forEach(cate => {
            formData.append('category', cate.value);
          })
        }
        else if (key === 'tags') {
          value.forEach(tag => {
            formData.append('tags', tag.label);
          })
        }
        else if (key === 'substitute_product') {
          value.forEach(substitute_product => {
            formData.append('substitute_product', substitute_product.value);
          })
        }
        else if (key === 'age') {
          value.forEach(age => {
            formData.append('age', age.value);
          })
        }
        else if (key === 'linked_items' && Array.isArray(value)) {
          value.forEach(linkedItem => {
            formData.append('linked_items', linkedItem.value);
          })
        }
        else if (key === 'more_details') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      try {
        const response = await addNewMedicine(formData);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message)
          allMedicines()
          refetch()
          resetForm()
          if (addNew) {
            navigate(`${getMedicinePage()}`)
          }
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  useEffect(() => {
    const fetchDataMedicine = async () => {
      try {
        const resp = await axios.get(`${API_BASE_URL}/get-all-medicine?composition=${values?.composition}`);

        if (resp?.data?.http_status_code === 200) {
          setFilteredSaltMedicine(resp.data?.data);
        } else {
          console.log("response", resp?.data?.message);
        }
      } catch (err) {
        console.log("err", err);
      }
    };

    if (values?.composition) {
      fetchDataMedicine();
    }
  }, [values?.composition]);

  useEffect(() => {
    if (Array.isArray(filteredSaltMedicine) && filteredSaltMedicine.length > 0) {
      setSubstituteMedicineOption(
        filteredSaltMedicine.map((item) => ({
          value: item.id,
          label: item.product_name,
        }))
      );
    } else {
      setSubstituteMedicineOption([]);
    }
  }, [filteredSaltMedicine]);



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


  const addNewAccordion = () => {
    const newSectionId = (accordion.length + 1).toString();
    const newSection = {
      id: newSectionId,
      title: "New Section",
      content: "",
    };
    setAccordion([...accordion, newSection]);
  };
  const handleAccordionContentChange = (index, value) => {
    const updatedAccordionContent = [...accordion];
    if (updatedAccordionContent[index]) {
      updatedAccordionContent[index].content = value;
    }
  };
  const handleAccordionTitleChange = (index, e) => {
    const updatedAccordion = [...accordion];
    updatedAccordion[index].title = e.target.value;
    setAccordion(updatedAccordion);
    setStoredAccordionOrder(updatedAccordion);
  };
  const handleAccordionStatusChange = (index, e) => {
    const updatedAccordion = [...accordion];
    updatedAccordion[index].status = e.target.checked;
    setAccordion(updatedAccordion);
  };
  const handleSaftyAdviceContentChange = (index, e) => {
    const updatedSaftyAdvice = [...safetyAdvice];
    updatedSaftyAdvice[index].content = e.target.value;
    setSafetyAdvice(updatedSaftyAdvice);
  };
  const handleSaftyAdviceOptioChange = (index, e) => {
    const updatedSaftyAdvice = [...safetyAdvice];
    updatedSaftyAdvice[index].advices = e.target.value;
    setSafetyAdvice(updatedSaftyAdvice);
  };

  const deleteAccordionSection = (index) => {
    const updatedAccordion = [...accordion];
    updatedAccordion.splice(index, 1);
    setAccordion(updatedAccordion);
  };
  const addFaq = () => {
    setFaqList([...faqList, { question: "", answer: "" }]);
  };

  const deleteFaq = (index) => {
    if (faqList.length > 1) {
      const updatedFaqList = [...faqList];
      updatedFaqList.splice(index, 1);
      setFaqList(updatedFaqList);
    }
  };


  const handleQuestionChange = (index, e) => {
    const updatedFaqList = [...faqList];
    updatedFaqList[index].question = e.target.value;
    setFaqList(updatedFaqList);
  };

  const handleAnswerChange = (index, value) => {
    const updatedFaqList = [...faqList];
    updatedFaqList[index].answer = value;
    setFaqList(updatedFaqList);
  };
  const toggleAccordion = (id) => {
    setActiveAccordion(id === activeAccordion ? null : id);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const newAccordion = Array.from(accordion);
    const [reorderedItem] = newAccordion.splice(result.source.index, 1);
    newAccordion.splice(result.destination.index, 0, reorderedItem);
    setAccordion(newAccordion);
    setStoredAccordionOrder(newAccordion);
  };

  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };

  const generateMetaTitle = (productName, seoDiscount, strength, form, categories) => {
    if (!productName || !form || !categories) {
      return;
    }

    let formName = formData.find(item => item.id == form)?.name || '';

    // Check if the product name already contains strength or form
    const nameContainsStrength = strength && productName.toLowerCase().includes(strength.split(',')[0].trim().toLowerCase());
    const nameContainsForm = formName && productName.toLowerCase().includes(formName.toLowerCase());

    let categoryDiscount = seoDiscount;
    if (!seoDiscount && categories.length) {
      const firstCategory = categories[0];
      const selectedCategory = categoryData?.find(item => item.id === firstCategory);
      categoryDiscount = selectedCategory?.seo_discount || '';
    }

    let discountText = categoryDiscount ? `Up to ${categoryDiscount}% Off` : "";
    let strengthText = (!nameContainsStrength && strength) ? `${strength.split(',')[0].trim()}mg` : '';
    let formText = (!nameContainsForm && formName) ? formName : '';

    let metaTitle = `Buy ${productName} ${strengthText} ${formText} Online: Price, ${discountText}, Uses, and Side Effects - Magicine Pharma`.trim();

    metaTitle = metaTitle.replace(/\s+/g, ' ');
    metaTitle = metaTitle.replace(/, Uses/, ' Uses');

    if (!categoryDiscount) {
      metaTitle = metaTitle.replace(/, ,/, ',');
    }
    setFieldValue("meta_title", metaTitle.trim());
  };



  const generateMetaDescription = (productName, seoDiscount, strength, form, uses, categories) => {
    if (!productName || !form || !categories || !uses) {
      return;
    }

    // Find form name and use name based on provided ids
    let formName = form ? formData.find(item => item.id == form)?.name : '';
    let useName = uses ? usesData.find(item => item.id == uses)?.name : '';

    // Check if product name already contains strength or form
    const nameContainsStrength = strength && productName.toLowerCase().includes(strength.split(',')[0].trim().toLowerCase());
    const nameContainsForm = formName && productName.toLowerCase().includes(formName.toLowerCase());

    // Build strength and form text if not already included in the product name
    let strengthText = (!nameContainsStrength && strength) ? `${strength.split(',')[0].trim()}mg` : '';
    let formText = (!nameContainsForm && formName) ? formName : '';

    // Determine the appropriate discount text (either from SEO discount or category)
    let categoryDiscount = seoDiscount !== null && seoDiscount !== undefined ? seoDiscount : '';
    if ((seoDiscount === null || seoDiscount === undefined) && categories.length) {
      const firstCategory = categories[0];
      const selectedCategory = categoryData?.find(item => item.id === firstCategory);
      categoryDiscount = selectedCategory?.seo_discount !== null && selectedCategory?.seo_discount !== undefined ? selectedCategory.seo_discount : '';
    }

    let discountText = categoryDiscount ? `- Up to ${categoryDiscount}% Off` : "";

    // Construct the meta description
    let metaDescription = `Buy ${productName} ${strengthText} ${formText} Online at Magicine Pharma ${discountText}. ${productName} ${strengthText} ${formText} is used for the treatment of ${useName}. View uses and benefits of it.`;

    // Clean up extra spaces and formatting issues
    metaDescription = metaDescription.replace(/\s+/g, ' ').trim(); // Remove extra spaces
    metaDescription = metaDescription.replace(/\s+\./g, '.'); // Handle spaces before periods

    // Set the final meta description in the form field
    setFieldValue("meta_description", metaDescription.trim());
  };



  useEffect(() => {
    const selectedManufacturer = manufacturerData?.find((item) => values.marketer == item.id);
    const manufacturerName = selectedManufacturer ? selectedManufacturer.manufacturer_name : '';

    const selectedBrand = brandData?.find((item) => values.brand == item.id);
    const brandName = selectedBrand ? selectedBrand.brand_name : '';

    const image = values.featured_image;
    let featured_image = '';

    if (image) {
      const isComplete = typeof image === 'string' && image.startsWith("http");
      if (!isComplete) {
        featured_image = `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`;
      } else {
        featured_image = image;
      }
    } else {
      featured_image = `${MEDIA_BASE_URL}/public/media/images/1725347476566-487ac3b8-6b91-4c13-bc2f-40003050a634.png`;
    }

    const selected_form = values && values.form ? formData.find(item => item.id == values.form) : null


    const schemaMarkup = generateSchemaMarkupMedicine({
      ...values,
      marketer: manufacturerName,
      brand: brandName,
      featured_image: featured_image,
      selected_form: selected_form?.name
    });

    setFieldValue("schema_markup", schemaMarkup);
  }, [
    values.product_name, values.short_description, values.featured_image, values.category, values.marketer, values.brand,
    values.weight, values.height, values.width, values.length, values.packOf, values.marketer,
    values.minimum_order_quantity, values.strength, values.storage, values.generic_name, values.composition
  ]);



  const handleProductNameChange = (event) => {
    handleChange(event);
    const productName = event.target.value;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const form = values.form;
    const uses = values.uses;
    const categories = values.category.map(option => option.value);

    generateSlug(productName);
    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };

  const handleSeoDiscountChange = (event) => {
    handleChange(event);

    const seoDiscount = event.target.value.trim();
    const productName = values.product_name;
    const strength = values.strength;
    const form = values.form;
    const uses = values.uses;
    const categories = values.category.map(option => option.value);

    const validSeoDiscount = seoDiscount && !isNaN(seoDiscount) ? parseFloat(seoDiscount) : '';

    generateMetaTitle(productName, validSeoDiscount, strength, form, categories);
    generateMetaDescription(productName, validSeoDiscount, strength, form, uses, categories);
  };



  const handleUsesChange = (event) => {
    handleChange(event);
    const uses = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));
    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const form = values.form;
    const categories = values.category.map(option => option.value); // Get category IDs

    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };

  const handleFormChange = (event) => {
    handleChange(event);
    const form = parseInt(event.target.value, 10);
    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const uses = values.uses;
    const categories = values.category.map(option => option.value);

    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };

  const handleCategoryChange = (selectedOptions) => {
    setFieldValue("category", selectedOptions);

    const categories = selectedOptions.map(option => parseInt(option.value, 10));
    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const form = values.form;
    const uses = values.uses;

    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };
  const handleStrengthChange = (event) => {
    const strength = event.target.value;
    setFieldValue("strength", strength);

    const categories = values.category.map(option => parseInt(option.value, 10));
    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const form = values.form;
    const uses = values.uses;

    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };




  const generateOgAndTwitterTag = () => {
    const selectedForm = formData ? formData.filter(item => item.id === values.form) : null;
    const formName = selectedForm ? selectedForm[0].name : "";

    const ogTag = `
      <!-- Open Graph Tags -->
      <meta property="og:type" content="website">
      <meta property="og:title" content='${values.meta_title || "undefined"}'>
      <meta property="og:description" content="${values.meta_description || "undefined"}">
      <meta property="og:url" content="${USER_BASE_URL}/${formName.toLowerCase()}/${values.slug || "undefined"}">
      <meta property="og:site_name" content="Magicine Pharma">
      <meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">

      <!-- Twitter Card Tags -->
      <meta name="twitter:card" content="summary_large_image">
      <meta name="twitter:title" content="${values.meta_title || "undefined"}">
      <meta name="twitter:description" content="${values.meta_description || "undefined"}">
      <meta name="twitter:url" content="${USER_BASE_URL}/${formName.toLowerCase()}/${values.slug || "undefined"}">
      <meta name="twitter:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">
      <meta name="twitter:site" content="@MagicinePharma">
    `;

    setFieldValue("og_tag", ogTag.trim());
  }

  useEffect(() => {
    if (values.meta_title && values.meta_description && values.slug && values.form) {
      generateOgAndTwitterTag();
    }
  }, [values.meta_title, values.meta_description, values.slug, values.form]);


  useEffect(() => {
    if (values.product_name) {
      generateMetaTitle(values.product_name);
      generateMetaDescription(values.product_name);
    }
  }, [values.product_name]);

  const handleTagsChange = (newTags) => {
    handleChange({ target: { name: "tags", value: newTags } });
  };
  const handleMoreDetailsTitleChange = (index) => {
    setReadOnly(index);
  };
  const options = categoryData ? categoryData.filter(category => category.status === true).map(category => ({
    value: category?.id,
    label: category?.category_name
  })) : [];
  const Linked_item_options = productsData ? productsData.filter(product => product.status === "active" && product.deleted_at === null).map(product => ({
    value: product?.id,
    label: product?.product_name
  })) : [];
  const tagOptions = Array.isArray(tagData) ? tagData.map(tag => ({
    value: tag?.id,
    label: tag?.name,
  })) : [];


  const ageOptions = [
    { value: "Adult", label: "Adult" },
    { value: "Child", label: "Child" },
    { value: "Elderly", label: "Elderly" }
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
          <Form.Group as={Col} md={4}>
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
            <Form.Label>Featured Image (JPG, JPEG, PNG)</Form.Label>
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
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Status <span className="required_icon">*</span>
            </Form.Label>
            <Form.Select
              name="status"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.status}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="draft">Draft</option>
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
              name="hsn_code"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.hsn_code}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Generic Name <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="generic_name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.generic_name}
            />
            {errors.generic_name && touched.generic_name ? (
              <p className={`error`}>{errors.generic_name}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Composition <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="composition"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.composition}
            />
            {errors.composition && touched.composition ? (
              <p className={`error`}>{errors.composition}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Strength <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="strength"
              value={values.strength || ''}
              onChange={handleStrengthChange}
              placeholder="Enter strength"
            />
            {errors.strength && touched.strength ? (
              <p className="text-danger">{errors.strength}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Storage <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="storage"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.storage}
            />
            {errors.storage && touched.storage ? (
              <p className={`error`}>{errors.storage}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Form <span className="required_icon">*</span>
            </Form.Label>
            <Select
              name="form"
              onBlur={handleBlur}
              value={formSelectOption?.find((item) => item.value === values.form)}
              onChange={(selectedValued) => setFieldValue("form", selectedValued.value)}
              options={formSelectOption}
            />
            {errors.form && touched.form ? (
              <p className={`error`}>{errors.form}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="2">
            <Form.Label>Has Variant</Form.Label>
            <Form.Check
              type="checkbox"
              id="has_variant"
              name="has_variant"
              value={values.has_variant}
              onChange={(e) => setFieldValue("has_variant", e.target.checked)}
              onBlur={handleBlur}
              className="d-flex justify-content-start ps-5 rounded-1"
            />
          </Form.Group>
          <Form.Group as={Col} md="2">
            <Form.Label>Prescription Required</Form.Label>
            <Form.Check
              type="checkbox"
              id="prescription_required"
              name="prescription_required"
              value={values.prescription_required}
              onChange={(e) =>
                setFieldValue("prescription_required", e.target.checked)
              }
              onBlur={handleBlur}
              className="d-flex justify-content-start ps-5 rounded-1"
            />
          </Form.Group>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>Uses <span className="text-danger">*</span></Form.Label>
              <Select
                name="uses"
                onBlur={handleBlur}
                value={usesSelectOption?.find((item) => item.value === values.uses)}
                options={usesSelectOption}
                onChange={(selectedOption) => setFieldValue("uses", selectedOption.value)}
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
                onChange={(selectedOptions) => setFieldValue("age", selectedOptions)}
                onBlur={handleBlur}
                value={values.age}
                options={ageOptions}
                isMulti
                isSearchable
                id="age"
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
            <Form.Label>
              Indication <span className="required_icon">*</span>
            </Form.Label>
            <SunEditor
              name="indication"
              value={values.indication}
              onChange={(content) => setFieldValue("indication", content)}
              onBlur={() => setFieldTouched("indication", true)}
              setOptions={options_for_sunEditor}
            />

            {errors.indication && touched.indication ? (
              <p className={`error`}>{errors.indication}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md={10}>
            <Form.Label>Category <span className="text-danger">*</span></Form.Label>
            <Select
              options={options}
              name="category"
              value={values.category}
              onChange={(selectedOptions) => handleCategoryChange(selectedOptions)}
              onBlur={handleBlur}
              isMulti
              className="select_box rounded-4"
              isSearchable
              id="category"
            />
            {errors.category && touched.category ? (
              <p className="text-danger">{errors.category}</p>
            ) : null}
          </Form.Group>

          <Form.Group as={Col} md="2">
            <Form.Label>Is Enquired</Form.Label>
            <Form.Check
              type="checkbox"
              id="isEnquired"
              name="isEnquired"
              value={values.isEnquired}
              onChange={(e) => setFieldValue("isEnquired", e.target.checked)}
              onBlur={handleBlur}
              className="d-flex justify-content-start ps-5 rounded-1"
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Marketer/Manufacturer <span className="required_icon">*</span>
            </Form.Label>
            <Row >
              <Col as={Col} md={10}>
                <Select
                  name="marketer"
                  onBlur={handleBlur}
                  value={marketerSelectOption?.find((item) => item.value === values.marketer)}
                  options={marketerSelectOption}
                  onChange={(selectedOption) => setFieldValue("marketer", selectedOption.value)}
                />
              </Col>
              <Col as={Col} md={2}>
                <Button
                  type="button"
                  className="btn btn-icon btn-primary"
                  variant="primary"
                  onClick={() => { dispatch(openModal({ componentName: 'AddNewManufacturer', data: 'check' })) }}
                >
                  <i className="fe fe-plus"></i>
                </Button>
              </Col>
            </Row>
            {errors.marketer && touched.marketer ? (
              <p className={`error`}>{errors.marketer}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Brand <span className="required_icon">*</span>
            </Form.Label>
            <Select
              name="brand"
              onBlur={handleBlur}
              value={brandSelectOption?.filter((item) => item.value === values.brand)}
              options={brandSelectOption}
              onChange={(selectedOption) => setFieldValue("brand", selectedOption.value)}
            />

            {errors.brand && touched.brand ? (
              <p className={`error`}>{errors.brand}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>
              Weight (g) <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="weight"
              value={values.weight}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.weight && touched.weight ? (
              <p className={`error`}>{errors.weight}</p>
            ) : null}
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label>Length (cm) </Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="length"
              value={values.length}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.length && touched.length ? (
              <p className={`error`}>{errors.length}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Width (cm) </Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="width"
              value={values.width}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.width && touched.width ? (
              <p className={`error`}>{errors.width}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
            <Form.Label>Height (cm) </Form.Label>
            <Form.Control
              type="number"
              min="0"
              name="height"
              value={values.height}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.height && touched.height ? (
              <p className={`error`}>{errors.height}</p>
            ) : null}
          </Form.Group>
        </Row>

        <Row className="mb-4">
          <Form.Group as={Col} md="4">
            <Form.Label>
              Minimum Order Quantity <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="number"
              name="minimum_order_quantity"
              value={values.minimum_order_quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              min={1}
            />
            {errors.minimum_order_quantity && touched.minimum_order_quantity ? (
              <p className={`error`}>{errors.minimum_order_quantity}</p>
            ) : null}
          </Form.Group>
          <Form.Group as={Col} md="4">
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
          <Form.Group as={Col} md={4}>
            <Form.Label>
              Pack Of <span className="required_icon">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="packOf"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.packOf}
              min={1}
            />
            {errors.packOf && touched.packOf ? (
              <p className={`error`}>{errors.packOf}</p>
            ) : null}
          </Form.Group>
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
              className="rounded-4 tags_index"
              isSearchable
              placeholder="Add Tags..."
              isMulti
            />
          </Form.Group>
        </Row>

        <Row>
          <Col as={Col} md={12}>
            <Form.Label>Substitute Product </Form.Label>
            <Select
              name="substitute_product"
              value={Linked_item_options.find(option => option.value === values.substitute_product)}
              onChange={(selectedOption) => setFieldValue("substitute_product", selectedOption)}
              onBlur={handleBlur}
              isMulti
              isSearchable
              options={substituteMedicineOption}
            />
            {
              errors.substitute_product && touched.substitute_product ? (
                <p className="text-danger">{errors.substitute_product}</p>
              ) : null
            }
          </Col>
        </Row>
        <Row className="mb-4">
          <Form.Group as={Col}>
            <Form.Label>Overview</Form.Label>
            <SunEditor
              name="short_description"
              value={values.short_description}
              onChange={(content) =>
                setFieldValue("short_description", content)
              }
              onBlur={() => setFieldTouched("short_description", true)}
              setOptions={options_for_sunEditor}
            />
          </Form.Group>
        </Row>
        <Row className="mb-4">
          <Form.Label>Add More Details </Form.Label>
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="accordion">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="accordion medicine_more_detailss"
                >
                  {accordion.map((item, index) => (
                    <Draggable
                      key={item.id}
                      draggableId={item.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          order={index}
                        >
                          <div
                            className={`p-3 accordion_box  ${activeAccordion === item.id ? "active" : ""
                              }`}
                            style={{ cursor: "move" }}
                            onClick={() => toggleAccordion(item.id)}
                          >
                            <p className="mb-0">{item.title}</p>
                          </div>
                          <div
                            className={`collapse ${activeAccordion === item.id ? "show" : ""
                              }`}
                            aria-labelledby={`heading${index}`}
                            data-parent=".accordion"
                          >
                            <div className="accordion_body">
                              {item.title === "Safety Advice" ? (
                                <>
                                  <Row className={`mb-4 ${readOnly !== index ? "px-4" : ""}`} >
                                    <div className={`add_more_detail_row ${readOnly !== index ? "add_more_detail_row_disabled" : ""}`} >
                                      {readOnly !== index ? (
                                        <p className="add_more_details_disabled">
                                          {item.title}
                                        </p>
                                      ) : (
                                        <input
                                          type="text"
                                          value={item.title}
                                          onChange={(e) =>
                                            handleAccordionTitleChange(index, e)
                                          }
                                          className={`add_more_details_title`}
                                          readOnly={readOnly !== index}
                                          onClick={() =>
                                            handleMoreDetailsTitleChange(index)
                                          }
                                        />
                                      )}
                                      <i
                                        className="fe fe-edit add_more_details_icon"
                                        onClick={() =>
                                          handleMoreDetailsTitleChange(index)
                                        }
                                      ></i>
                                    </div>
                                  </Row>
                                  <Row className="mb-4">
                                    <label className="custom-switch add_more_details_status">
                                      <input
                                        type="checkbox"
                                        name="more_details.safety_advice.status"
                                        className="custom-switch-input"
                                        onChange={(e) =>
                                          handleAccordionStatusChange(index, e)
                                        }
                                        onBlur={handleBlur}
                                        value={item.status}
                                        checked={item.status}
                                      />
                                      Status &nbsp;
                                      <span className="custom-switch-indicator custum-green-btn"></span>
                                    </label>
                                  </Row>
                                  {safetyAdvice.map((safetyitem, index) => (
                                    <Row className="mb-4" key={index}>
                                      <Col md={3} xs={12} className="d-flex align-items-center gap-3 safety_col" >
                                        <img src={safetyitem.src} alt="safety-advice" />
                                        <span className="fs-6">{safetyitem.title}</span>
                                      </Col>
                                      <Col md={6} xs={12} className="safety_col" >
                                        <Form.Group>
                                          <Form.Control
                                            type="text"
                                            name={safetyitem.title}
                                            onChange={(value) => handleSaftyAdviceContentChange(index, value)}
                                            onBlur={handleBlur}
                                          />
                                        </Form.Group>
                                      </Col>
                                      <Col md={3} xs={12} className="safety_col" >
                                        <Form.Group>
                                          <Form.Select
                                            name="alcohol_option"
                                            onChange={(value) => handleSaftyAdviceOptioChange(index, value)}
                                            onBlur={handleBlur}
                                          >
                                            <option value="">Select</option>
                                            {saftyOptions.map(
                                              (option, index) => (
                                                <option value={option.value} key={index} >{option.label} </option>
                                              )
                                            )}
                                          </Form.Select>
                                        </Form.Group>
                                      </Col>
                                    </Row>
                                  ))}
                                </>
                              ) : item.title.toUpperCase() === "FAQS" || item.title.toUpperCase() === "FAQ" ? (
                                <>
                                  <Row className={`mb-4 ${readOnly !== index ? "px-4" : ""}`} >
                                    <div className={`add_more_detail_row ${readOnly !== index ? "add_more_detail_row_disabled" : ""}`} >
                                      {readOnly !== index ? (
                                        <p className="add_more_details_disabled">{item.title}</p>) : (
                                        <input type="text" value={item.title} onChange={(e) => handleAccordionTitleChange(index, e)}
                                          className={`add_more_details_title`}
                                          readOnly={readOnly !== index}
                                          onClick={() => handleMoreDetailsTitleChange(index)} />
                                      )}
                                      <i
                                        className="fe fe-edit add_more_details_icon"
                                        onClick={() => handleMoreDetailsTitleChange(index)} ></i>
                                    </div>
                                  </Row>
                                  <Row className="mb-4">
                                    <label className="custom-switch add_more_details_status">
                                      <input
                                        type="checkbox"
                                        name="more_details.faqs.status"
                                        className="custom-switch-input"
                                        onChange={(e) => handleAccordionStatusChange(index, e)}
                                        onBlur={handleBlur}
                                        value={item.status}
                                        checked={item.status}
                                      />
                                      Status &nbsp;
                                      <span className="custom-switch-indicator custum-green-btn"></span>
                                    </label>
                                  </Row>
                                  {faqList.map((faq, index) => (
                                    <div
                                      className="mb-4 pb-4 border-bottom border-black"
                                      key={index}
                                    >
                                      <Row>
                                        <Col xl={10} lg={10} md={10} xs={12}>
                                          <Form.Group>
                                            <Form.Label>Question</Form.Label>
                                            <Form.Control
                                              type="text"
                                              onChange={(e) =>
                                                handleQuestionChange(index, e)
                                              }
                                              value={faq.question}
                                            />
                                          </Form.Group>
                                          <Form.Group>
                                            <Form.Label>Answer</Form.Label>
                                            <SunEditor
                                              modules={modules}
                                              formats={formats}
                                              className="faq_react_quill"
                                              onChange={(value) =>
                                                handleAnswerChange(index, value)
                                              }
                                              setOptions={options_for_sunEditor}
                                            />
                                          </Form.Group>
                                        </Col>
                                        <Col
                                          xl={2}
                                          lg={2}
                                          md={2}
                                          xs={12}
                                          className="faq_icon"
                                        >
                                          {/* <Button className="btn btn-icon btn-warning border-warning"><i className="fe fe-edit"></i></Button> */}
                                          <Button
                                            type="button"
                                            className="btn btn-icon  btn-danger"
                                            variant=""
                                            onClick={() => deleteFaq(index)}
                                          >
                                            <i className="fe fe-trash text-white"></i>
                                          </Button>
                                          <Button
                                            className="btn btn-icon btn-primary"
                                            onClick={addFaq}
                                          >
                                            <i className="fe fe-plus"></i>
                                          </Button>
                                        </Col>
                                      </Row>
                                    </div>
                                  ))}
                                </>
                              ) : (
                                <>
                                  <Row className={`mb-4 ${readOnly !== index ? "px-4" : ""}`} >
                                    <div className={`add_more_detail_row ${readOnly !== index ? "add_more_detail_row_disabled" : ""}`} >
                                      {readOnly !== index ? (
                                        <p className="add_more_details_disabled"> {item.title} </p>
                                      ) : (
                                        <input type="text" value={item.title} onChange={(e) => handleAccordionTitleChange(index, e)} className={`add_more_details_title`}
                                          readOnly={readOnly !== index}
                                          onClick={() => handleMoreDetailsTitleChange(index)}
                                        />
                                      )}
                                      <i className="fe fe-edit add_more_details_icon" onClick={() => handleMoreDetailsTitleChange(index)} ></i>
                                    </div>
                                  </Row>
                                  <Row className="mb-4">
                                    <label className="custom-switch add_more_details_status">
                                      <input
                                        type="checkbox"
                                        className="custom-switch-input"
                                        onChange={(e) => handleAccordionStatusChange(index, e)}
                                        onBlur={handleBlur}
                                        value={item.status}
                                        checked={item.status}
                                      />
                                      Status &nbsp;
                                      <span className="custom-switch-indicator custum-green-btn"></span>
                                    </label>
                                  </Row>
                                  <SunEditor
                                    modules={modules}
                                    formats={formats}
                                    className="faq_react_quill"
                                    onChange={(value) => handleAccordionContentChange(index, value)}
                                    setOptions={options_for_sunEditor}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </Row>
        <Row>
          <Col as={Col} md={6}>
            <Form.Group>
              <Form.Label>SEO Discount</Form.Label>
              <Form.Control
                name="seo_discount"
                type="text"
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
              <Form.Label>Tax Percentage <span className="text-danger">*</span></Form.Label>
              <Form.Control
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
        <Row className="mb-4">
          <SeoForm
            handleChange={handleChange}
            values={values}
            errors={errors}
            handleBlur={handleBlur}
            touched={touched}
            readOnlyStatus={false}
          />
        </Row>
        <Row >
          <Col as={Col} md={6} className="text-end">
            <Button type="submit" onClick={() => setAddNEw(true)} className="btn-primary  w-auto">
              Save
            </Button>
          </Col>
          <Col as={Col} md={6}>
            <Button type="submit" className="btn-primary  w-auto">
              Save and Add New
            </Button>
          </Col>
        </Row>
      </Form>
    </>
  );
}