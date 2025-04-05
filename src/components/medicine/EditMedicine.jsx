import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import { Button, Card, Col, Form, Row, Tab, Tabs } from "react-bootstrap";
import { AddNewMediaValidation, AddNewMedicineSchema } from "../../commondata/formvalidations";
import "react-quill/dist/quill.snow.css";
import { formats, modules, options_for_sunEditor, } from "../../commondata/formEditorOptions";
import Select from "react-select";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { getStoredAccordionOrder, getDefaultAccordionOrder, getsafetyAdvice, saftyOptions, setStoredAccordionOrder, } from "../medicine/AddMedicineFunction";
import slugify from "slugify";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import productImage from "../../assets/images/dashboard/inventory.png";
import SeoForm from "../seo-page/SeoForm";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import CreatableSelect from 'react-select/creatable';
import Loader from "../../layouts/layoutcomponents/loader";
import { useEditMedicineMutation, useGetMedicineInventoryQuery, useGetMedicinesQuery, useGetSingleMedicinesQuery } from "../../redux/features/productEndPoints";
import { useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryQuery, useGetManufactutrerQuery, useGetTagsQuery } from "../../redux/features/catalogueEndPoints";
import Error from "../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import { getMedicinePage } from "../../utils/routes";
import { API_BASE_URL, MEDIA_BASE_URL, USER_BASE_URL } from "../../utils/config";
import { generateSchemaMarkupMedicine } from "../../commondata/schemaMarkup";
import axios from "axios";

export default function EditMedicine() {
  const [query, setQuery] = useState({
    brand: "",
    marketer: "",
    status: "",
    fromDate: "",
    toDate: "",
    limit: 10,
    page: 1
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
  const { id } = useParams()
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: refetchSingleMedicine } = useGetSingleMedicinesQuery(id, { refetchOnMountOrArgChange: true })
  const singleMedicine = data?.data?.medicine;
  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const moreDetails = data?.data?.medicine?.more_details
  const [accordion, setAccordion] = useState(getStoredAccordionOrder() || getDefaultAccordionOrder());;
  const [safetyAdvice, setSafetyAdvice] = useState(getsafetyAdvice());
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [readOnly, setReadOnly] = useState(null);
  const [editMedicine, { isLoading: loading }] = useEditMedicineMutation()
  const { data: manufacturer } = useGetManufactutrerQuery()
  const { data: brand, isLoading: brandDataLoading } = useGetBrandQuery(queryBrand)
  const { data: products, refetch } = useGetMedicineInventoryQuery()
  const { data: tags } = useGetTagsQuery()
  const { data: category, isLoading: loadingCategoryGet } = useGetCategoryQuery(categoryQuery)
  const { data: uses } = useGetAllUsesQuery()
  const { data: form } = useGetAllFormQuery()
  const manufacturerData = manufacturer?.data?.manufacturer
  const brandData = brand?.data?.allBrand;
  const productsData = products?.data?.filteredMedicine;
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


  const [viewThubnail, setViewThubnail] = useState(true);
  const [selectedThubnail, setSelectedThubnail] = useState(null);
  const initialValues = {
    product_name: "",
    featured_image: "",
    status: "",
    slug: "",
    gallery_image: [],
    hsn_code: "",
    generic_name: "",
    composition: "",
    strength: "",
    storage: "",
    form: "",
    has_variant: null,
    prescription_required: null,
    packOf: "",
    indication: "",
    category: [],
    marketer: "",
    brand: "",
    weight: "",
    length: "",
    width: "",
    height: "",
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
    age: [],
    uses: "",
    substitute_product: [],
    isEnquired: false,
    seo_discount: "",
    tax_percentage: ""
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewMedicineSchema,
    onSubmit: async (values) => {
      const faqData = faqList?.map((faq) => ({
        question: faq.question,
        answer: faq.answer,
      })) || [];

      const safetyData = safetyAdvice?.map((safety) => ({
        title: safety.title,
        content: safety.content,
        advices: safety.advices,
      })) || [];

      const accordionOrder = accordion?.map((item) => ({
        title: item.title,
        content: item.content,
        status: item.status,
      })) || [];



      if (accordionOrder.length > 0) {
        values.more_details = accordionOrder;

        const faqIndex = values.more_details.findIndex(
          (section) => section.title === "FAQs"
        );
        if (faqIndex !== -1) {
          values.more_details[faqIndex].content = faqData;
        } else {
          values.more_details.push({ title: "FAQs", content: faqData });
        }

        const safetyIndex = values.more_details.findIndex(
          (section) => section.title === "Safety Advice"
        );
        if (safetyIndex !== -1) {
          values.more_details[safetyIndex].content = safetyData;
        } else {
          values.more_details.push({ title: "Safety Advice", content: safetyData });
        }
      }
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'gallery_image' && Array.isArray(value)) {
          value.forEach(file => {
            formData.append('gallery_image', file);
          });
        } else if (key === 'category' && Array.isArray(value)) {
          value.forEach(cate => {
            formData.append('category', cate.value);
          });
        } else if (key === 'tags' && Array.isArray(value)) {
          value.forEach(tag => {
            formData.append('tags', tag.label);
          });
        } else if (key === 'substitute_product') {
          if (Array.isArray(value) && value.length === 0) {
            formData.append('substitute_product', JSON.stringify([]));
          } else {
            value.forEach(substitute_product => {
              formData.append('substitute_product', substitute_product.value ?? []);
            });
          }
        } else if (key === 'age' && Array.isArray(value)) {
          value.forEach(age => {
            formData.append('age', age.label);
          });
        } else if (key === 'linked_items') {
          if (Array.isArray(value) && value.length === 0) {
            formData.append('linked_items', JSON.stringify([]));
          } else {
            value.forEach(linkedItem => {
              formData.append('linked_items', linkedItem.value ?? []);
            });
          }
        } else if (key === 'more_details') {
          if (values.more_details && values.more_details.length > 0) {
            formData.append(key, JSON.stringify(values.more_details));
          }
        } else {
          formData.append(key, value);
        }
      });

      try {
        const response = await editMedicine({ medicineData: formData, medicineId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          allMedicines()
          refetch()
          refetchSingleMedicine()
          navigate(`${getMedicinePage()}`)
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

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    const existingImages = values.gallery_image || [];
    setFieldValue('gallery_image', [...existingImages, ...files]);
  };


  const addNewAccordion = () => {
    const newSectionId = (accordion?.length + 1).toString();
    const newSection = {
      id: newSectionId,
      title: "New Section",
      content: "",
    };
    setAccordion([...accordion, newSection]);
  };
  const handleAccordionContentChange = (index, value) => {
    setAccordion(prevAccordion =>
      prevAccordion.map((item, i) =>
        i === index ? { ...item, content: value } : item
      )
    );
  };
  const handleAccordionTitleChange = (index, e) => {
    const updatedAccordion = [...accordion];
    const updatedItem = { ...updatedAccordion[index] };
    updatedItem.title = e.target.value;
    updatedAccordion[index] = updatedItem;
    setAccordion(updatedAccordion);
  };
  const handleAccordionStatusChange = (index, e) => {
    setAccordion(prevAccordion =>
      prevAccordion.map((item, i) =>
        i === index ? { ...item, status: e.target.checked } : item
      )
    );
  };
  const handleSaftyAdviceContentChange = (index, e) => {
    setSafetyAdvice(prevSafetyAdvice => {
      const updatedSaftyAdvice = [...prevSafetyAdvice];
      updatedSaftyAdvice[index] = {
        ...updatedSaftyAdvice[index],
        content: e.target.value
      };
      return updatedSaftyAdvice;
    });

  };
  const handleSaftyAdviceOptioChange = (index, e) => {
    setSafetyAdvice(prevSafetyAdvice => {
      const updatedSaftyAdvice = [...prevSafetyAdvice];
      updatedSaftyAdvice[index] = {
        ...updatedSaftyAdvice[index],
        advices: e.target.value
      };
      return updatedSaftyAdvice;
    });
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
    updatedFaqList[index] = {
      ...updatedFaqList[index],
      question: e.target.value
    };
    setFaqList(updatedFaqList);
  };

  const handleAnswerChange = (index, value) => {
    setFaqList(prevFaqList => {
      const updatedFaqList = [...prevFaqList];
      updatedFaqList[index] = {
        ...updatedFaqList[index],
        answer: value
      };
      return updatedFaqList;
    });
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
  };
  const generateSlug = (value) => {
    const slug = slugify(value, { lower: true });
    setFieldValue("slug", slug);
  };
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
  const Linked_item_options = productsData
    ? productsData
      .filter(medicine => medicine.status === "active" && medicine.deleted_at === null)
      .map(product => ({
        value: product?.id,
        label: product?.product_name
      }))
    : [];

  const tagOptions = Array.isArray(tagData) ? tagData.map(tag => ({
    value: tag?.id,
    label: tag?.name,
  })) : [];

  const AgeOptions = [
    { value: "Adult", label: "Adult" },
    { value: "Child", label: "Child" },
    { value: "Elderly", label: "Elderly" }
  ]

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
    if (!singleMedicine) return;

    setFieldValue('product_name', singleMedicine?.product_name);
    setFieldValue('featured_image', singleMedicine?.featured_image);
    setFieldValue('status', singleMedicine?.status);
    setFieldValue('slug', singleMedicine?.slug);
    setFieldValue('gallery_image', singleMedicine?.gallery_image);
    setFieldValue('hsn_code', singleMedicine?.hsn_code);
    setFieldValue('generic_name', singleMedicine?.generic_name);
    setFieldValue('composition', singleMedicine?.composition);
    setFieldValue('strength', singleMedicine?.strength);
    setFieldValue('storage', singleMedicine?.storage);
    setFieldValue('form', singleMedicine?.form?.id);
    setFieldValue('has_variant', singleMedicine?.has_variant);
    setFieldValue('isEnquired', singleMedicine?.isEnquired);
    setFieldValue('prescription_required', singleMedicine?.prescription_required);
    setFieldValue('packOf', singleMedicine?.packOf);
    setFieldValue('indication', singleMedicine?.indication);
    setFieldValue("seo_discount", singleMedicine?.seo_discount)
    setFieldValue(
      'category',
      singleMedicine?.category?.map((category) => ({
        value: category?.id,
        label: category?.category_name,
      }))
    );
    setFieldValue('marketer', singleMedicine?.marketer?.id);
    setFieldValue('brand', singleMedicine?.brand?.id);
    setFieldValue('weight', singleMedicine?.weight);
    setFieldValue('length', singleMedicine?.length);
    setFieldValue('width', singleMedicine?.width);
    setFieldValue('height', singleMedicine?.height);
    setFieldValue('minimum_order_quantity', singleMedicine?.minimum_order_quantity);
    setFieldValue('tax_percentage', singleMedicine?.tax_percentage);
    setFieldValue(
      'linked_items',
      singleMedicine?.linked_items?.map((linkedItem) => ({
        value: linkedItem?.id,
        label: linkedItem?.product_name,
      }))
    );
    setFieldValue(
      'substitute_product',
      singleMedicine?.substitute_product?.map((item) => ({
        value: item?.id,
        label: item?.product_name,
      }))
    );
    setFieldValue(
      'tags',
      singleMedicine?.tags?.map((tagItem) => ({
        value: tagItem?.name,
        label: tagItem?.name,
      }))
    );
    setFieldValue('short_description', singleMedicine?.short_description);
    setFieldValue('meta_title', singleMedicine?.meta_title);
    setFieldValue('meta_description', singleMedicine?.meta_description);
    setFieldValue('meta_keywords', singleMedicine?.meta_keywords);
    setFieldValue('og_tag', singleMedicine?.og_tag);
    setFieldValue('schema_markup', singleMedicine?.schema_markup);
    setFieldValue('uses', singleMedicine?.uses?.id);
    setFieldValue(
      'age',
      singleMedicine?.age?.map((item) => ({
        value: item,
        label: item,
      }))
    );

    if (moreDetails && moreDetails.length > 0) {
      setAccordion(moreDetails);

      const safetySection = moreDetails.find((item) => item.title === "Safety Advice");
      if (safetySection?.content) {
        try {
          // Try to parse as JSON
          const safetyAdvice = typeof safetySection.content === 'string'
            ? JSON.parse(safetySection.content.replace(/""/g, '"'))
            : safetySection.content;
          setSafetyAdvice(safetyAdvice);
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          setSafetyAdvice(getsafetyAdvice());
        }
      } else {
        setSafetyAdvice(getsafetyAdvice());
      }

      const faqSection = moreDetails.find(
        (item) => item.title.toUpperCase() === "FAQS" || item.title.toUpperCase() === "FAQ"
      );

      if (faqSection?.content) {
        try {
          const faqListData = typeof faqSection.content === 'string'
            ? JSON.parse(faqSection.content.replace(/""/g, '"'))
            : faqSection.content;
          setFaqList(faqListData);
        } catch (error) {
          console.error("Failed to parse JSON:", error);
          setFaqList([{ question: "", answer: "" }]);
        }
      } else {
        setFaqList([{ question: "", answer: "" }]);
      }
    }
  }, [isSuccess, singleMedicine, moreDetails]);


  const generateMetaTitle = (productName, userSeoDiscount, strength, form, categories) => {
    if (!productName || !form || !categories) {
      return;
    }

    let formName = formData?.find(item => item.id == form)?.name || '';

    const nameContainsStrength = strength
      && productName.toLowerCase().includes(`${strength}`.toLowerCase());

    const nameContainsForm = formName
      && productName.toLowerCase().includes(formName.toLowerCase());

    let effectiveSeoDiscount = userSeoDiscount;

    if (userSeoDiscount === "null" && categories) {
      const firstCategory = categories[0];
      const selectedCategory = categoryData?.find(item => item.id == firstCategory);
      effectiveSeoDiscount = selectedCategory?.seo_discount > 0 ? selectedCategory.seo_discount : '';
    }

    // Add strength to the product name if not already included
    let modifiedProductName = productName;
    if (strength && !nameContainsStrength) {
      modifiedProductName = `${productName} ${strength}mg`;
    }

    let discountText = effectiveSeoDiscount ? `Up to ${effectiveSeoDiscount}% Off` : "";
    let strengthText = (!nameContainsStrength && strength) ? `${strength}mg` : '';
    let formText = (!nameContainsForm && formName) ? formName : '';

    let metaTitle = `Buy ${modifiedProductName} ${formText} Online: Price${discountText ? ', ' + discountText : ''}, Uses, and Side Effects - Magicine Pharma`.trim();

    metaTitle = metaTitle.replace(/\s+/g, ' ');
    metaTitle = metaTitle.replace(/, Uses/, ' Uses');
    metaTitle = metaTitle.replace(/, ,/, ',');

    setFieldValue("meta_title", metaTitle.trim());
  };



  const generateMetaDescription = (productName, userSeoDiscount, strength, form, uses, categories) => {
    if (!productName || !form || !categories || !uses) {
      return;
    }

    let formName = form ? formData?.find(item => item.id == form)?.name : '';
    let useName = uses ? usesData?.find(item => item.id == uses)?.name : '';

    const nameContainsStrength = strength
      && productName.toLowerCase().includes(`${strength}`.toLowerCase());

    const nameContainsForm = formName
      && productName.toLowerCase().includes(formName.toLowerCase());

    // Get SEO discount from first selected category if no user discount
    let effectiveSeoDiscount = userSeoDiscount;
    if (userSeoDiscount === "null" && categories) {
      const firstCategory = categories[0];
      const selectedCategory = categoryData?.find(item => item.id == firstCategory);
      effectiveSeoDiscount = selectedCategory?.seo_discount > 0 ? selectedCategory.seo_discount : '';
    }

    // Add strength to the product name if not already included
    let modifiedProductName = productName;
    if (strength && !nameContainsStrength) {
      modifiedProductName = `${productName} ${strength}mg`;
    }

    let strengthText = (!nameContainsStrength && strength) ? `${strength}mg` : '';
    let formText = (!nameContainsForm && formName) ? formName : '';
    let discountText = effectiveSeoDiscount ? `Up to ${effectiveSeoDiscount}% Off` : "";

    // Construct the meta description
    let metaDescription = `Buy ${modifiedProductName} ${formText} Online at Magicine Pharma${discountText ? ' ' + discountText : ''}. ${modifiedProductName} ${formText} is used for the treatment of ${useName}. View uses and benefits of it.`;

    // Clean up the meta description
    metaDescription = metaDescription.replace(/\s+/g, ' ').trim(); // Remove extra spaces
    metaDescription = metaDescription.replace(/\s+\./g, '.'); // Fix spaces before periods

    setFieldValue("meta_description", metaDescription.trim());
  };

  // useEffect(() => {
  //   const productName = singleMedicine?.product_name
  //   const seoDiscount = singleMedicine?.seo_discount
  //   const strength = singleMedicine?.strength
  //   const formData = singleMedicine?.form
  //   const categoriesData = singleMedicine && singleMedicine.category.map((item) => item.id)
  //   const usesData = [singleMedicine?.uses.id]



  //   if (data) {
  //     generateMetaTitle(productName, seoDiscount, strength, formData, categoriesData)
  //     generateMetaDescription(productName, seoDiscount, strength, form, usesData, categoriesData)
  //   }


  // }, [data, category, uses])


  const handleProductNameChange = (event) => {
    handleChange(event);
    const productName = event.target.value;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const form = values.form;
    const uses = values.uses;
    const categories = values.category ? values.category.map(option => option.value) : [];

    generateSlug(productName);
    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };



  const handleCategoryChange = (selectedOptions) => {
    setFieldValue("category", selectedOptions && selectedOptions.map(item => ({ value: item.value, label: item.label })));

    const categories = selectedOptions ? selectedOptions.map(option => option.value) : "";

    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const form = values.form;
    const uses = values.uses;

    if (productName && form && categories) {
      generateMetaTitle(productName, seoDiscount, strength, form, categories);
      generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
    }
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


  const handleSeoDiscountChange = (event) => {
    handleChange(event);
    const seoDiscount = event.target.value;
    const productName = values.product_name;
    const strength = values.strength;
    const form = values.form;
    const uses = values.uses;
    const categories = values.category ? values.category.map(option => option.value) : [];

    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };


  const handleUsesChange = (event) => {
    handleChange(event);
    const uses = Array.from(event.target.selectedOptions, option => parseInt(option.value, 10));

    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const form = values.form;
    const categories = values.category ? values.category.map(option => option.value) : [];

    generateMetaTitle(productName, seoDiscount, strength, form);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories);
  };

  const handleFormChange = (event) => {
    handleChange(event);
    const form = parseInt(event.target.value, 10);

    const productName = values.product_name;
    const seoDiscount = values.seo_discount;
    const strength = values.strength;
    const uses = values.uses;
    const categories = values.category ? values.category.map(option => parseInt(option.value, 10)) : [];

    generateMetaTitle(productName, seoDiscount, strength, form, categories);
    generateMetaDescription(productName, seoDiscount, strength, form, uses, categories,);
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
        featured_image = `${MEDIA_BASE_URL} /public/media / images / 1725347476566 - 487ac3b8 - 6b91 - 4c13 - bc2f - 40003050a634.png`;
      } else {
        featured_image = image;
      }
    } else {
      featured_image = `${MEDIA_BASE_URL} /public/media / images / 1725347476566 - 487ac3b8 - 6b91 - 4c13 - bc2f - 40003050a634.png`;
    }

    const selected_form = values && values?.form ? formData?.find(item => item.id == values.form) : null

    const schemaMarkup = generateSchemaMarkupMedicine({
      ...values,
      marketer: manufacturerName,
      brand: brandName,
      featured_image: featured_image,
      selected_form: selected_form?.name
    });

    setFieldValue("schema_markup", schemaMarkup);
  }, [
    values.product_name, values.short_description, , values.featured_image, values.category, values.marketer, values.brand,
    values.weight, values.height, values.width, values.length, values.packOf, values.marketer,
    values.minimum_order_quantity, values.strength, values.storage, values.generic_name, values.composition, values.short_description
  ]);

  const generateOgAndTwitterTag = () => {
    const selectedForm = formData ? formData.filter(item => item.id === values.form) : [];

    console.log("selectedForm", selectedForm)

    const formName = selectedForm ? selectedForm[0]?.name : "undefined";

    console.log("formName", formName)

    const ogTag = `
    < !--Open Graph Tags-- >
      <meta property="og:type" content="website">
        <meta property="og:title" content='${values.meta_title || "undefined"}'>
          <meta property="og:description" content="${values.meta_description || " undefined"}">
          <meta property="og:url" content="${USER_BASE_URL}/${formName?.toLowerCase()}/${values.slug || " undefined"}">
          <meta property="og:site_name" content="Magicine Pharma">
            <meta property="og:image" content="${singleMedicine && singleMedicine.featured_image ? singleMedicine.featured_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">

              <!-- Twitter Card Tags -->
              <meta name="twitter:card" content="summary_large_image">
                <meta name="twitter:title" content="${values.meta_title || " undefined"}">
                <meta name="twitter:description" content="${values.meta_description || " undefined"}">
                <meta name="twitter:url" content="${USER_BASE_URL}/${formName?.toLowerCase()}/${values.slug || " undefined"}">
                <meta name="twitter:image" content="${singleMedicine && singleMedicine.featured_image ? singleMedicine.featured_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">
                  <meta name="twitter:site" content="@MagicinePharma">
                    `;

    setFieldValue("og_tag", ogTag.trim());
  }

  useEffect(() => {
    if (values.meta_title && values.meta_description && values.slug && values.form && formData) {
      generateOgAndTwitterTag();
    }
  }, [values.meta_title, values.meta_description, values.slug, values.form, formData]);




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
          loadingCategoryGet && <Loader /> || isLoading && <Loader /> || brandDataLoading && <Loader />
        }
        <Row>
          <Col>
            <PageHeader titles="Catalogue - Medicine" active={["Edit Medicine"]} items={["Home", "Medicine List"]} links={["/dashboard", "/catalogue/medicines"]} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>Edit Medicine</Card.Header>
              <Card.Body>
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                  handleScrollToError();
                }} encType="multipart/form-data">
                  {loading && <Loader />}
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
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Featured Image (JPG,JPEG,PNG){" "}
                        {/* <span className="required_icon">*</span> */}
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          {viewThubnail ? <div className="position-relative">
                            <Link ><img src={singleMedicine?.featured_image} alt="error" width={50} height={50} /></Link>
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
                            // onChange={(e) => setFieldValue('featured_image', e.target.files[0])}
                            onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                          />
                        </Col>
                      </Row>
                      {errors.featured_image && touched.featured_image ? (
                        <p className={`error`}>{errors.featured_image}</p>
                      ) : null}
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
                        onChange={handleStrengthChange}
                        onBlur={handleBlur}
                        value={values.strength}
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
                        checked={singleMedicine?.has_variant}
                        disabled
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
                        checked={values.prescription_required}
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
                          options={AgeOptions}
                          isSearchable
                          isMulti
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
                        setContents={singleMedicine?.indication}
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
                        onBlur={() => setFieldTouched("category", true)}
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
                        onChange={(e) =>
                          setFieldValue("isEnquired", e.target.checked)
                        }
                        onBlur={handleBlur}
                        className="d-flex justify-content-start ps-5 rounded-1"
                        checked={values.isEnquired}
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
                      />
                      {errors.minimum_order_quantity && touched.minimum_order_quantity ?
                        <p className="text-danger">{errors.minimum_order_quantity}</p> : null
                      }
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
                        defaultValue={singleMedicine ? singleMedicine?.tags?.map(tag => ({
                          value: tag?.name,
                          label: tag?.name,
                        })) : []}
                        isMulti
                      />
                    </Form.Group>
                  </Row>

                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Label>Substitute Product</Form.Label>
                      <Select
                        name="substitute_product"
                        value={values.substitute_product}
                        onChange={(selectedOption) => setFieldValue("substitute_product", selectedOption)}
                        onBlur={handleBlur}
                        isSearchable
                        isMulti
                        options={substituteMedicineOption}
                      />
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
                        setContents={singleMedicine?.short_description}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Label>More Details </Form.Label>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="accordion">
                        {(provided) => (
                          <div {...provided.droppableProps} ref={provided.innerRef} className="accordion medicine_more_detailss" >
                            {accordion?.map((item, index) => (
                              <Draggable key={item._id} draggableId={item._id} index={index} >
                                {(provided) => (
                                  <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="mb-3" order={index} >
                                    <div className={`p-3 accordion_box  ${activeAccordion === item._id ? "active" : ""}`} style={{ cursor: "move" }} onClick={() => toggleAccordion(item._id)} >
                                      <p className="mb-0">{item.title}</p>
                                    </div>
                                    <div className={`collapse ${activeAccordion === item._id ? "show" : ""}`} aria-labelledby={`heading${index}`} data-parent=".accordion" >
                                      <div className="accordion_body">
                                        {item.title === "Safety Advice" ? (
                                          <>
                                            <Row className={`mb-4 ${readOnly !== index ? "px-4" : ""}`} >
                                              <div className={`add_more_detail_row ${readOnly !== index ? "add_more_detail_row_disabled" : ""}`} >
                                                {readOnly !== index ? (<p className="add_more_details_disabled"> {item.title} </p>) : (
                                                  <input
                                                    type="text"
                                                    value={item.title}
                                                    onChange={(e) => handleAccordionTitleChange(index, e)}
                                                    className={`add_more_details_title`}
                                                    readOnly={readOnly !== index}
                                                    onClick={() => handleMoreDetailsTitleChange(index)} />
                                                )}
                                                <i className="fe fe-edit add_more_details_icon" onClick={() => handleMoreDetailsTitleChange(index)} ></i>
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
                                            {safetyAdvice?.map((safetyitem, index) => (
                                              <Row className="mb-4" key={index}>
                                                <Col md={3} xs={12} className="d-flex align-items-center gap-3 safety_col" >
                                                  <img src={safetyitem.src} alt="safety-advice" />
                                                  <span className="fs-6">{safetyitem.title}</span>
                                                </Col>
                                                <Col md={6} xs={12} className="safety_col" >
                                                  <Form.Group>
                                                    <Form.Control
                                                      type="text"
                                                      name={item.content}
                                                      onChange={(value) => handleSaftyAdviceContentChange(index, value)}
                                                      onBlur={handleBlur}
                                                      defaultValue={safetyitem?.content}
                                                    />
                                                  </Form.Group>
                                                </Col>
                                                <Col md={3} xs={12} className="safety_col" >
                                                  <Form.Group>
                                                    <Form.Select
                                                      name="alcohol_option"
                                                      onChange={(value) => handleSaftyAdviceOptioChange(index, value)}
                                                      onBlur={handleBlur}
                                                      defaultValue={safetyitem.advices}
                                                    >
                                                      <option value="">Select</option>
                                                      <option value="safe">Safe</option>
                                                      <option value="unsafe">Unsafe</option>
                                                      <option value="caution">Caution</option>
                                                      <option value="warning">Warning</option>
                                                      <option value="danger">Danger</option>
                                                      <option value="risky">Risky</option>
                                                      <option value="hazard">Hazard</option>
                                                      <option value="precaution">Precaution</option>
                                                      <option value="harmful">Harmful</option>
                                                      <option value="protective">Protective</option>
                                                      <option value="consult your doctor">Consult Your Doctor</option>
                                                      <option value="safe if prescribed">Safe If Prescribed</option>
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
                                            {faqList?.map((faq, index) => (
                                              <div className="mb-4 pb-4 border-bottom border-black" key={index}>
                                                <Row>
                                                  <Col xl={10} lg={10} md={10} xs={12}>
                                                    <Form.Group>
                                                      <Form.Label>Question</Form.Label>
                                                      <Form.Control
                                                        type="text"
                                                        onChange={(e) => handleQuestionChange(index, e)}
                                                        value={faq?.question || ''}
                                                      />
                                                    </Form.Group>
                                                    <Form.Group>
                                                      <Form.Label>Answer</Form.Label>
                                                      <SunEditor
                                                        modules={modules}
                                                        formats={formats}
                                                        className="faq_react_quill"
                                                        onChange={(value) => handleAnswerChange(index, value)}
                                                        setOptions={options_for_sunEditor}
                                                        setContents={faq?.answer || ''}
                                                      />
                                                    </Form.Group>
                                                  </Col>
                                                  <Col xl={2} lg={2} md={2} xs={12} className="faq_icon">
                                                    <Button
                                                      type="button"
                                                      className="btn btn-icon btn-danger"
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
                                              setContents={item?.content}
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
                          type="number"
                          name="seo_discount"
                          value={values.seo_discount}
                          onChange={handleSeoDiscountChange}
                          onClick={handleBlur}

                        />
                        {
                          errors.seo_discount && touched.seo_discount ?
                            (
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
                  <Row className="gap-3 justify-content-center">
                    <Button type="submit" className="btn-primary  w-auto">
                      Update
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
}
