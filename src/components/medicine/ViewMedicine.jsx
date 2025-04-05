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
import { getsafetyAdvice } from "../medicine/AddMedicineFunction";
import slugify from "slugify";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import SeoForm from "../seo-page/SeoForm";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { openModal } from "../../redux/slices/allModalSlice";
import CreatableSelect from 'react-select/creatable';
import Loader from "../../layouts/layoutcomponents/loader";
import { useEditMedicineMutation, useGetMedicineInventoryQuery, useGetMedicinesQuery, useGetSingleMedicinesQuery } from "../../redux/features/productEndPoints";
import { useGetAllFormQuery, useGetAllUsesQuery, useGetBrandQuery, useGetCategoryQuery, useGetManufactutrerQuery, useGetTagsQuery } from "../../redux/features/catalogueEndPoints";
import Error from "../../layouts/layoutcomponents/Error";
import toast from "react-hot-toast";
import axios from "axios";
import { API_BASE_URL } from "../../utils/config";

export default function EditMedicine() {
  const { id } = useParams()
  const [query, setQuery] = useState({
    brand: '',
    marketer: '',
    status: '',
    fromDate: '',
    toDate: ''
  })


  const [filteredSaltMedicine, setFilteredSaltMedicine] = useState([])
  const [substituteMedicineOption, setSubstituteMedicineOption] = useState([]);

  const [categoryQuery, setCategoryQuery] = useState({
    status: "",
    type: ""
  })


  const [queryBrand, setQuerybrand] = useState({
    type: "",
    status: ""
  })
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const { data, isError, error, isLoading, isFetching, isSuccess } = useGetSingleMedicinesQuery(id)
  const singleMedicine = data?.data?.medicine;
  const [faqList, setFaqList] = useState([{ question: "", answer: "" }]);
  const moreDetails = data?.data?.medicine?.more_details
  const [accordion, setAccordion] = useState([]);
  const [safetyAdvice, setSafetyAdvice] = useState(getsafetyAdvice());
  const [activeAccordion, setActiveAccordion] = useState(null);
  const [readOnly, setReadOnly] = useState(null);
  const [editMedicine, { isLoading: loading }] = useEditMedicineMutation()
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
  const categoryData = category?.data?.activeCategories;
  const usesData = uses?.data;
  const formData = form?.data;

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
    uses: "",
    age: "",
    substitute_product: [],
    isEnquired: false,
    seo_discount: "",
    tax_percentage: ""
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddNewMedicineSchema,
    onSubmit: async (values) => {
      const faqData = faqList?.map((faq, index) => ({
        [`question`]: faq.question,
        [`answer`]: faq.answer,
      }));
      const safetyData = safetyAdvice?.map((safety, index) => ({
        [`title`]: safety.title,
        [`content`]: safety.content,
        [`advices`]: safety.advices,
      }));
      const accordionOrder = accordion?.map((item, index) => ({
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
      const safetyIndex = values.more_details.findIndex(
        (section) => section.title === "Safety Advice"
      );
      if (safetyIndex !== -1) {
        values.more_details[safetyIndex].content = safetyData;
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
        else if (key === 'linked_items' && Array.isArray(value)) {
          value.forEach(linkedItem => {
            formData.append('linked_items', linkedItem.value);
          })
        }
        else if (key === 'substitute_product' && Array.isArray(value)) {
          value.forEach(substitute_product => {
            formData.append('substitute_product', substitute_product.value);
          })
        }
        else if (key === 'more_details') {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });
      try {
        const response = await editMedicine({ medicineData: formData, medicineId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          resetForm()
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

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setFieldValue("gallery_image", files);
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
    // const updatedAccordionContent = [...accordion];
    // if (updatedAccordionContent[index]) {
    //   updatedAccordionContent[index].content = value;
    // }
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
    // setStoredAccordionOrder(updatedAccordion);
  };
  const handleAccordionStatusChange = (index, e) => {
    // const updatedAccordion = [...accordion];
    // updatedAccordion[index].status = e.target.checked;
    // setAccordion(updatedAccordion);
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
    const updatedFaqList = [...faqList];
    updatedFaqList.splice(index, 1);
    setFaqList(updatedFaqList);
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
    // setStoredAccordionOrder(newAccordion);
  };
  const handleProductNameChange = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
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
  const options = categoryData ? categoryData.map(category => ({
    value: category?.id,
    label: category?.category_name
  })) : [];
  const Linked_item_options = productsData ? productsData.map(product => ({
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
    setFieldValue('seo_discount', singleMedicine?.seo_discount);
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
            <PageHeader titles="Catalogue - Medicine" active={["View Medicine"]} items={["Home", "Medicine List"]} links={["/dashboard", "/catalogue/medicines"]} />
          </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <Card.Header>View Medicine</Card.Header>
              <Card.Body>
                <Form onSubmit={handleSubmit} encType="multipart/form-data">
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
                        readOnly
                      />
                      {errors.product_name && touched.product_name ? (
                        <p className={`error`}>{errors.product_name}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Featured Image (JPG,JPEG,PNG)
                        {/* <span className="required_icon">*</span> */}
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          <div className="position-relative">
                            <Link to={"/view-images"} state={{ data: singleMedicine?.featured_image }}>
                              <img src={singleMedicine?.featured_image} alt="error" width={50} height={50} />
                            </Link>
                          </div>
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            name="featured_image"
                            accept=".jpg,.jpeg,.png,.webp"
                            // onChange={(e) => setFieldValue('featured_image', e.target.files[0])}
                            // onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                            disabled
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
                        disabled
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
                        onChange={handleFileChange}
                        onBlur={handleBlur}
                        // value={values.gallery_image}
                        disabled
                      />
                      <div className="d-flex flex-wrap gap-1 justify-content-between mt-2">
                        {singleMedicine?.gallery_image?.map((items, index) => (
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
                        name="hsn_code"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.hsn_code}
                        readOnly
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
                        readOnly
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
                        readOnly
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
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.strength}
                        readOnly
                      />
                      {errors.strength && touched.strength ? (
                        <p className={`error`}>{errors.strength}</p>
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
                        readOnly
                      />
                      {errors.storage && touched.storage ? (
                        <p className={`error`}>{errors.storage}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Form <span className="required_icon">*</span>
                      </Form.Label>
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
                    <Form.Group as={Col} md="2">
                      <Form.Label>Has Variant</Form.Label>
                      <Form.Check
                        type="checkbox"
                        id="has_variant"
                        name="has_variant"
                        value={values.has_variant}
                        onChange={(e) => setFieldValue("has_variant", e.target.checked)}
                        onBlur={handleBlur}
                        // className="d-flex justify-content-start ps-5 rounded-1 custom_checkbox"
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
                        checked={singleMedicine?.prescription_required}
                        disabled
                      />
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Uses <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          name="uses"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.uses}
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
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.age}
                          isMulti
                          options={AgeOptions}
                          isSearchable
                          isDisabled
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
                        readOnly
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
                        onChange={(selectedOptions) =>
                          setFieldValue("category", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="select_box rounded-4"
                        isSearchable
                        isDisabled
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
                        value={values.isEnquired}
                        onChange={(e) => setFieldValue("isEnquired", e.target.checked)}
                        onBlur={handleBlur}
                        className="d-flex justify-content-start ps-5 rounded-1"
                        checked={values.isEnquired}
                        disabled
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Marketer/Manufacturer <span className="required_icon">*</span>
                      </Form.Label>
                      <div className="manufacturer_btn">
                        <Form.Select
                          name="marketer"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.marketer}
                          disabled
                        >
                          <option value="">Select</option>
                          {manufacturerData?.map((item, index) => (<option value={item.id} key={index}>{item.manufacturer_name}</option>))}

                        </Form.Select>
                        <Button
                          type="button"
                          className="btn btn-icon btn-primary"
                          variant="primary"
                          disabled
                          onClick={() => { dispatch(openModal({ componentName: 'AddNewManufacturer', data: 'check' })) }}
                        >
                          <i className="fe fe-plus"></i>
                        </Button>
                      </div>
                      {errors.marketer && touched.marketer ? (
                        <p className={`error`}>{errors.marketer}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md={4}>
                      <Form.Label>
                        Brand <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Select
                        name="brand"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.brand}
                        disabled
                      >
                        <option value="">Select</option>
                        {brandData?.map((item, index) => (<option value={item.id} key={index}>{item.brand_name}</option>))}
                      </Form.Select>

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
                        readOnly
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
                        readOnly
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
                        readOnly
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
                        readOnly
                      />
                      {errors.height && touched.height ? (
                        <p className={`error`}>{errors.height}</p>
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
                        className="rounded-4"
                        isSearchable
                        placeholder="Add Tags..."
                        defaultValue={singleMedicine ? singleMedicine?.tags?.map(tag => ({
                          value: tag?.name,
                          label: tag?.name,
                        })) : []}
                        isMulti
                        isDisabled
                      />
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
                        readOnly
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
                        isDisabled
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
                        readOnly
                      />
                      {errors.packOf && touched.packOf ? (
                        <p className={`error`}>{errors.packOf}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row >
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Substitute Product</Form.Label>
                        <Select
                          name="substitute_product"
                          options={substituteMedicineOption}
                          value={values.substitute_product}
                          onChange={(selectedOptions) =>
                            setFieldValue("substitute_product", selectedOptions)
                          }
                          onBlur={handleBlur}
                          isSearchable
                          isMulti
                          isDisabled
                        />
                      </Form.Group>
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
                        readOnly
                      />
                    </Form.Group>
                  </Row>
                  <Row className="mb-4">
                    <Form.Label>More Details</Form.Label>
                    <DragDropContext onDragEnd={onDragEnd}>
                      <Droppable droppableId="accordion">
                        {(provided) => (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="accordion medicine_more_detailss"
                          >
                            {accordion?.map((item, index) => (
                              <Draggable key={item._id} draggableId={item._id} index={index}>
                                {(provided) => (
                                  <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    {...provided.dragHandleProps}
                                    className="mb-3"
                                    order={index}
                                  >
                                    <div
                                      className={`p-3 accordion_box ${activeAccordion === item._id ? "active" : ""}`}
                                      style={{ cursor: "move" }}
                                      onClick={() => toggleAccordion(item._id)}
                                    >
                                      <p className="mb-0">{item.title}</p>
                                    </div>
                                    <div
                                      className={`collapse ${activeAccordion === item._id ? "show" : ""}`}
                                      aria-labelledby={`heading${index}`}
                                      data-parent=".accordion"
                                    >
                                      <div className="accordion_body">
                                        {item.title === "Safety Advice" ? (
                                          <>
                                            <Row className="mb-4 px-4">
                                              <div className="add_more_detail_row add_more_detail_row_disabled">
                                                <p className="add_more_details_disabled">{item.title}</p>
                                                <i
                                                  className="fe fe-edit add_more_details_icon"
                                                  onClick={() => handleMoreDetailsTitleChange(index)}
                                                ></i>
                                              </div>
                                            </Row>
                                            <Row className="mb-4">
                                              <label className="custom-switch add_more_details_status">
                                                <input
                                                  type="checkbox"
                                                  name="more_details.safety_advice.status"
                                                  className="custom-switch-input"
                                                  onChange={(e) => handleAccordionStatusChange(index, e)}
                                                  onBlur={handleBlur}
                                                  value={item.status}
                                                  checked={item.status}
                                                  disabled
                                                />
                                                Status &nbsp;
                                                <span className="custom-switch-indicator custom-green-btn"></span>
                                              </label>
                                            </Row>
                                            {safetyAdvice?.map((safetyitem, safetyIndex) => (
                                              <Row className="mb-4" key={safetyIndex}>
                                                <Col md={3} xs={12} className="d-flex align-items-center gap-3 safety_col">
                                                  <img src={safetyitem.src} alt="safety-advice" />
                                                  <span className="fs-6">{safetyitem.title}</span>
                                                </Col>
                                                <Col md={6} xs={12} className="safety_col">
                                                  <Form.Group>
                                                    <Form.Control
                                                      type="text"
                                                      name={item.content}
                                                      onChange={(value) => handleSaftyAdviceContentChange(safetyIndex, value)}
                                                      onBlur={handleBlur}
                                                      defaultValue={safetyitem?.content}
                                                      readOnly
                                                    />
                                                  </Form.Group>
                                                </Col>
                                                <Col md={3} xs={12} className="safety_col">
                                                  <Form.Group>
                                                    <Form.Select
                                                      name="alcohol_option"
                                                      onChange={(value) => handleSaftyAdviceOptioChange(safetyIndex, value)}
                                                      onBlur={handleBlur}
                                                      defaultValue={item?.content?.[safetyIndex]?.advices}
                                                      disabled
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
                                                    </Form.Select>
                                                  </Form.Group>
                                                </Col>
                                              </Row>
                                            ))}
                                          </>
                                        ) : item.title.toUpperCase() === "FAQS" || item.title.toUpperCase() === "FAQ" ? (
                                          <>
                                            <Row className="mb-4 px-4">
                                              <div className="add_more_detail_row add_more_detail_row_disabled">
                                                <p className="add_more_details_disabled">{item.title}</p>
                                                <i
                                                  className="fe fe-edit add_more_details_icon"
                                                  onClick={() => handleMoreDetailsTitleChange(index)}
                                                ></i>
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
                                                  disabled
                                                />
                                                Status &nbsp;
                                                <span className="custom-switch-indicator custom-green-btn"></span>
                                              </label>
                                            </Row>
                                            {faqList && faqList.map((faq, faqIndex) => (
                                              <div className="mb-4 pb-4 border-bottom border-black" key={faqIndex}>
                                                <Row>
                                                  <Col xl={10} lg={10} md={10} xs={12}>
                                                    <Form.Group>
                                                      <Form.Label>Question</Form.Label>
                                                      <Form.Control
                                                        type="text"
                                                        onChange={(e) => handleQuestionChange(faqIndex, e)}
                                                        value={faq.question}
                                                        readOnly
                                                      />
                                                    </Form.Group>
                                                    <Form.Group>
                                                      <Form.Label>Answer</Form.Label>
                                                      <SunEditor
                                                        modules={modules}
                                                        formats={formats}
                                                        className="faq_react_quill"
                                                        onChange={(value) => handleAnswerChange(faqIndex, value)}
                                                        setOptions={options_for_sunEditor}
                                                        setContents={faq.answer}
                                                        readOnly
                                                      />
                                                    </Form.Group>
                                                  </Col>
                                                  <Col xl={2} lg={2} md={2} xs={12} className="faq_icon">
                                                    <Button
                                                      type="button"
                                                      className="btn btn-icon btn-danger"
                                                      variant=""
                                                      onClick={() => deleteFaq(faqIndex)}
                                                      disabled
                                                    >
                                                      <i className="fe fe-trash text-white"></i>
                                                    </Button>
                                                    <Button
                                                      className="btn btn-icon btn-primary"
                                                      onClick={addFaq}
                                                      disabled
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
                                            <Row className="mb-4 px-4">
                                              <div className="add_more_detail_row add_more_detail_row_disabled">
                                                <p className="add_more_details_disabled">{item.title}</p>
                                                <i
                                                  className="fe fe-edit add_more_details_icon"
                                                  onClick={() => handleMoreDetailsTitleChange(index)}
                                                ></i>
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
                                                  disabled
                                                />
                                                Status &nbsp;
                                                <span className="custom-switch-indicator custom-green-btn"></span>
                                              </label>
                                            </Row>
                                            <SunEditor
                                              modules={modules}
                                              formats={formats}
                                              className="faq_react_quill"
                                              onChange={(value) => handleAccordionContentChange(index, value)}
                                              setOptions={options_for_sunEditor}
                                              setContents={item?.content}
                                              readOnly
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
                          type="text"
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
                        <Form.Label>Tax Percentage <span className="text-danger">*</span></Form.Label>
                        <Form.Control
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
                  <Row className="mb-4">
                    <SeoForm
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      touched={touched}
                      readOnlyStatus={true}
                    />
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
