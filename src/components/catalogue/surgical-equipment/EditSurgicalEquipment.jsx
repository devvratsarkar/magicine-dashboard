import React, { useEffect, useState } from 'react'
import PageHeader from '../../../layouts/layoutcomponents/pageheader'
import { Button, Card, Col, Form, Row } from 'react-bootstrap'
import { useFormik } from 'formik';
import SeoForm from '../../seo-page/SeoForm';
import { useDispatch } from "react-redux";
import Select from "react-select";
import slugify from "slugify";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from '../../../commondata/formEditorOptions';
import { openModal } from '../../../redux/slices/allModalSlice';
import { SurgicalEquipmentSchema } from '../../../commondata/formvalidations';
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useAddSurgicalEquipmentMutation, useGetCategoryQuery, useGetManufactutrerQuery, useGetSurgicalEquipmentIDQuery, useGetSurgicalEquipmentQuery, useUpdateSurgicalEquipmentIDMutation } from '../../../redux/features/catalogueEndPoints';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetSurgicalEquipmentInventoryQuery } from '../../../redux/features/productEndPoints';
import { MEDIA_BASE_URL, USER_BASE_URL } from '../../../utils/config';
import { generateSchemaMarkupDurgicalEquipment } from '../../../commondata/schemaMarkup';

export default function EditSurgicalEquipment() {
    const [queryParams, setQueryParams] = useState({
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
    });

    const [categoryQuery, setCategoryQuery] = useState({
        status: "",
        type: ""
    })

    const { data: equipment, refetch } = useGetSurgicalEquipmentInventoryQuery(queryParams, { refetchOnMountOrArgChange: true })
    const navigate = useNavigate()
    const { id } = useParams()
    const [viewThubnail, setViewThubnail] = useState(true);
    const [selectedThubnail, setSelectedThubnail] = useState(null);
    const { data: category } = useGetCategoryQuery(categoryQuery)
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch: refetchSurgicalEquipment } = useGetSurgicalEquipmentIDQuery(id, { refetchOnMountOrArgChange: true })
    const categoryData = category?.data?.activeCategories
    const singleSurgicalEquipment = data?.data
    const [updateSurgicalEquipmentID, { isLoading: loading }] = useUpdateSurgicalEquipmentIDMutation()
    const { data: manufacturer } = useGetManufactutrerQuery()
    const manufacturerData = manufacturer?.data?.manufacturer

    const manufacturerSelectOption = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.filter((item) => item.status === true && item.deleted_at === null)?.map((item) => ({
        value: item.id,
        label: item.manufacturer_name
    })) : []

    const equipmentData = equipment?.data;
    const [shortdescription, setShortdescription] = useState(true)
    const [description, setdescription] = useState(true)
    const dispatch = useDispatch()
    const initialValues = {
        product_name: "",
        featured_image: "",
        status: false,
        slug: "",
        gallery_image: [],
        category: [],
        marketer: "",
        hsn_code: "",
        description: {
            name: 'Description',
            status: true,
            content: '',
        },
        linked_items: [],
        short_description: {
            name: 'Overview',
            status: true,
            content: '',
        },
        meta_title: "",
        meta_description: "",
        meta_keywords: "",
        og_tag: "",
        schema_markup: "",
        product_highlight: "",
        isEnquired: false,
        minimum_order_quantity: 1,
        seo_discount: null,
        tax_percentage: ""
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, isValid, validateForm } = useFormik({
        initialValues: initialValues,
        validationSchema: SurgicalEquipmentSchema,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'gallery_image') {
                    value.forEach(file => {
                        formData.append('gallery_image', file);
                    });
                } else if (key === "category") {
                    if (Array.isArray(value)) {
                        value.forEach((category) => {
                            formData.append("category", category.value);
                        });
                    }
                } else if (key === 'linked_items') {
                    if (Array.isArray(value)) {
                        if (value.length === 0) {
                        } else {
                            value.forEach(linkedItem => {
                                formData.append('linked_items', linkedItem.value);
                            });
                        }
                    }
                } else if (key === 'short_description' || key === 'description') {
                    formData.append(`${key}.name`, value.name);
                    formData.append(`${key}.status`, value.status);
                    formData.append(`${key}.content`, value.content);
                }

                else {
                    formData.append(key, value);
                }
            });
            try {
                const response = await updateSurgicalEquipmentID({ updateEquipment: formData, equipmentID: id });
                if (response?.data?.http_status_code === 200) {
                    refetch()
                    refetchSurgicalEquipment()
                    navigate("/catalogue/surgical-equipment")
                    toast.success(response.data.message)
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

    const Linked_item_options = equipmentData ? equipmentData.filter(item => item.status === true).map(device => ({
        value: device?.id,
        label: device?.product_name
    })) : [];

    const options = categoryData
        ? categoryData
            .filter(category => category.status === true)
            .map(category => ({
                value: category?.id,
                label: category?.category_name
            }))
        : [];

    const generateSlug = (value) => {
        const slug = slugify(value, { lower: true });
        setFieldValue("slug", slug);
    };
    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        const existingImages = values.gallery_image || [];
        setFieldValue('gallery_image', [...existingImages, ...files]);
    };


    useEffect(() => {
        if (isSuccess && singleSurgicalEquipment) {
            setFieldValue('product_name', singleSurgicalEquipment?.product_name);
            setFieldValue('featured_image', singleSurgicalEquipment?.featured_image);
            setFieldValue('status', singleSurgicalEquipment?.status);
            setFieldValue('slug', singleSurgicalEquipment?.slug);
            setFieldValue("isEnquired", singleSurgicalEquipment?.isEnquired);
            setFieldValue('gallery_image', singleSurgicalEquipment?.gallery_image || []);
            setFieldValue('hsn_code', singleSurgicalEquipment?.hsn_code);
            setFieldValue('marketer', singleSurgicalEquipment?.marketer?.id);
            setFieldValue('linked_items', singleSurgicalEquipment?.linked_items?.map(linkedItem => ({
                value: linkedItem?.id,
                label: linkedItem?.product_name,
            })));
            setFieldValue('category', singleSurgicalEquipment?.category?.map(categoryItem => ({
                value: categoryItem?.id,
                label: categoryItem?.category_name,
            })));
            setFieldValue('short_description.name', singleSurgicalEquipment?.short_description?.name);
            setFieldValue('short_description.status', singleSurgicalEquipment?.short_description?.status);
            setFieldValue('short_description.content', singleSurgicalEquipment?.short_description?.content);
            setFieldValue('description.name', singleSurgicalEquipment?.description?.name);
            setFieldValue('description.status', singleSurgicalEquipment?.description?.status);
            setFieldValue('description.content', singleSurgicalEquipment?.description?.content);
            setFieldValue('meta_title', singleSurgicalEquipment?.meta_title);
            setFieldValue('meta_description', singleSurgicalEquipment?.meta_description);
            setFieldValue('meta_keywords', singleSurgicalEquipment?.meta_keywords);
            setFieldValue('og_tag', singleSurgicalEquipment?.og_tag);
            setFieldValue('schema_markup', singleSurgicalEquipment?.schema_markup);
            setFieldValue('product_highlight', singleSurgicalEquipment?.product_highlight);
            setFieldValue('minimum_order_quantity', singleSurgicalEquipment?.minimum_order_quantity);
            setFieldValue('seo_discount', singleSurgicalEquipment?.seo_discount);
            setFieldValue('tax_percentage', singleSurgicalEquipment?.tax_percentage);
        }
    }, [isSuccess, singleSurgicalEquipment, setFieldValue]);



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



    const generateMetaTitle = (productName, seoDiscount) => {
        let metaTitle = `Buy ${productName} online | Magicine Pharma.`;


        if (seoDiscount) {
            metaTitle = `${seoDiscount}% : Buy ${productName} Online at Best Price - Magicine Pharma.`;
        }

        setFieldValue("meta_title", metaTitle);
    };

    const generateMetaDescription = (productName, seoDiscount) => {

        const discount = seoDiscount ? `& Get Up to ${seoDiscount}% off ` : "";



        const metaDescription = `Buy ${productName} Online at Magicine Pharma ${discount}.Know More About ${productName} at Magicine Pharma.✔ Best Quality ✔ Order Now.`;


        setFieldValue("meta_description", metaDescription);
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
        const seoDiscount = event.target.value ? Number(event.target.value) : null;
        const productName = values.product_name;

        setFieldValue('seo_discount', seoDiscount);

        generateMetaTitle(productName, seoDiscount);
        generateMetaDescription(productName, seoDiscount);
    };


    useEffect(() => {
        const selectedManufacturer = manufacturerData?.find((item) => values.marketer == item.id);
        const manufacturerName = selectedManufacturer ? selectedManufacturer.manufacturer_name : '';

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

        const schemaMarkup = generateSchemaMarkupDurgicalEquipment({
            ...values,
            marketer: manufacturerName,
            featured_image: featured_image
        });

        setFieldValue("schema_markup", schemaMarkup);
    }, [
        values.product_name, values.featured_image, values.description.content, values.slug
    ]);




    const generateOgAndTwitterTag = () => {

        const ogTag = `
          <!-- Open Graph Tags -->
          <meta property="og:type" content="website">
          <meta property="og:title" content='${values.meta_title || "undefined"}'>
          <meta property="og:description" content="${values.meta_description || "undefined"}">
          <meta property="og:url" content="${USER_BASE_URL}/product/surgical-equipments/${values.slug || "undefined"}">
          <meta property="og:site_name" content="Magicine Pharma">
          <meta property="og:image" content="${singleSurgicalEquipment && singleSurgicalEquipment.featured_image ? singleSurgicalEquipment.featured_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">
          
          <!-- Twitter Card Tags -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${values.meta_title || "undefined"}">
          <meta name="twitter:description" content="${values.meta_description || "undefined"}">
          <meta name="twitter:url" content="${USER_BASE_URL}/product/surgical-equipments/${values.slug || "undefined"}">
          <meta name="twitter:image" content="${singleSurgicalEquipment && singleSurgicalEquipment.featured_image ? singleSurgicalEquipment.featured_image : `${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png`}">
          <meta name="twitter:site" content="@MagicinePharma">
        `;

        setFieldValue("og_tag", ogTag);
    }

    useEffect(() => {
        if (values.meta_title && values.meta_description && values.slug) {
            generateOgAndTwitterTag();
        }
    }, [values.meta_title, values.meta_description, values.slug]);



    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    if (isSuccess) {
        return (
            <>
                {loading && <Loader />}
                <PageHeader titles="Catalogue- Surgical Equipment" active="Edit surgical equipment" items={["Home", "Surgical Equipment List"]} links={["/dashboard", "/catalogue/surgical-equipment/"]} />
                <Row>
                    <Col md={12} lg={12}>
                        <Card>
                            <Card.Header>
                                <h3 className="card-title">Edit Surgical Equipment</h3>
                            </Card.Header>
                            <Card.Body className="add_new_product">
                                <Form onSubmit={(e) => {
                                    e.preventDefault();
                                    handleSubmit();
                                    handleScrollToError();
                                }}>
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
                                            <Form.Label>
                                                Featured Image (JPG,JPEG,PNG)
                                                <span className="required_icon">*</span>
                                            </Form.Label>
                                            <Row>
                                                <Col as={Col} md={3} className="d-flex justify-content-center" >
                                                    {viewThubnail ? <div className="position-relative">
                                                        <Link ><img src={singleSurgicalEquipment?.featured_image} alt="error" width={50} height={50} /></Link>
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
                                                Choose Status<span className="required_icon">*</span>
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
                                        <Form.Group as={Col} md={5} >
                                            <Form.Label>Marketer/Manufacturer </Form.Label>
                                            <Row>
                                                <Col as={Col} md={10}>
                                                    <Select
                                                        name="marketer"
                                                        onBlur={handleBlur}
                                                        value={manufacturerSelectOption?.find((item) => item.value === values.marketer)}
                                                        options={manufacturerSelectOption}
                                                        onChange={(selectedOptions) => setFieldValue("marketer", selectedOptions.value)}
                                                    />
                                                </Col>
                                                <Col as={Col} md={2}>
                                                    <Button type="button" onClick={() => { dispatch(openModal({ componentName: 'AddNewManufacturer', data: 'check' })) }} className="btn btn-icon btn-primary" variant="primary"><i className="fe fe-plus"></i></Button>
                                                </Col>
                                            </Row>                    {
                                                errors.marketer && touched.marketer ? (
                                                    <p className="text-danger">{errors.marketer}</p>
                                                ) : null
                                            }
                                        </Form.Group>
                                        <Form.Group as={Col} md={5}>
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
                                        <Form.Group as={Col} md={2}>
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
                                    <Row className='mb-4'>
                                        <Col as={Col} md={8}>
                                            <Form.Group >
                                                <Form.Label>Category</Form.Label>
                                                <Select
                                                    options={options}
                                                    name="category"
                                                    value={values.category}
                                                    onChange={(selectedOptions) =>
                                                        setFieldValue("category", selectedOptions)
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
                                        </Col>
                                        <Col as={Col} md={4}>
                                            <Form.Group>
                                                <Form.Label>Minimum Order Quantity <span className='text-danger'>*</span></Form.Label>
                                                <Form.Control
                                                    type='number'
                                                    name='minimum_order_quantity'
                                                    value={values.minimum_order_quantity}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    min={1}
                                                />
                                                {
                                                    errors.minimum_order_quantity && touched.minimum_order_quantity ?
                                                        (<p className='text-danger'>{errors.minimum_order_quantity}</p>)
                                                        : null
                                                }
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row className="mb-4">
                                        <Form.Group as={Col} md={12}>
                                            {shortdescription ? <div className={`mb-4 bg-primary d-flex flex-wrap align-items-center text-white rounded-2 justify-content-between px-2`}>
                                                <div className={`d-flex`}>
                                                    <Form.Control
                                                        // name='short_description.name'
                                                        value={values.short_description.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`border-0 bg-transparent text-white p-0`}
                                                        readOnly
                                                    />
                                                    <i className="fe fe-edit add_more_details_icon" onClick={() => setShortdescription(!shortdescription)}></i>
                                                </div>
                                                <div className='text-end'>
                                                    <label className="custom-switch add_more_details_statu">
                                                        <input
                                                            type="checkbox"
                                                            name="short_description.status"
                                                            className="custom-switch-input"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values.short_description.status}
                                                            checked={values.short_description.status}
                                                        />
                                                        Status &nbsp;
                                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                                    </label>
                                                </div>
                                            </div> : <Row className={`align-items-center mb-4`}>
                                                <Col as={Col} sm={10} xs={12} className='d-flex'>
                                                    <Form.Control
                                                        name='short_description.name'
                                                        value={values.short_description.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className='description_input'
                                                    />
                                                    <i className="fe fe-edit add_more_details_icon" onClick={() => setShortdescription(!shortdescription)}></i>
                                                </Col>
                                                <Col as={Col} sm={2} xs={12} className='text-sm-end my-2'>
                                                    <label className="custom-switch add_more_details_statu">
                                                        <input
                                                            type="checkbox"
                                                            name="short_description.status"
                                                            className="custom-switch-input"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values.short_description.status}
                                                            checked={values.short_description.status}
                                                        />
                                                        Status &nbsp;
                                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                                    </label>
                                                </Col>
                                            </Row>}
                                            <SunEditor
                                                name="short_description.content"
                                                onChange={(content) =>
                                                    setFieldValue("short_description.content", content)
                                                }
                                                onBlur={() => setFieldTouched("short_description.content", true)}
                                                setOptions={options_for_sunEditor}
                                                setContents={values.short_description.content}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row className="mb-4">
                                        <Form.Group as={Col} md={12}>
                                            {description ? <div className={`mb-4 bg-primary d-flex flex-wrap align-items-center text-white rounded-2 justify-content-between px-2`}>
                                                <div className={`d-flex`}>
                                                    <Form.Control
                                                        name='description.name'
                                                        value={values.description.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className={`border-0 bg-transparent text-white p-0`}
                                                        readOnly
                                                    />
                                                    <i className="fe fe-edit add_more_details_icon" onClick={() => setdescription(!description)}></i>
                                                </div>
                                                <div className='text-end'>
                                                    <label className="custom-switch add_more_details_statu">
                                                        <input
                                                            type="checkbox"
                                                            name="description.status"
                                                            className="custom-switch-input"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values.description.status}
                                                            checked={values.description.status}
                                                        />
                                                        Status &nbsp;
                                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                                    </label>
                                                </div>
                                            </div> : <Row className={`align-items-center mb-4`}>
                                                <Col as={Col} sm={10} xs={12} className='d-flex'>
                                                    <Form.Control
                                                        name='description.name'
                                                        value={values.description.name}
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        className='description_input'
                                                    />
                                                    <i className="fe fe-edit add_more_details_icon" onClick={() => setdescription(!description)}></i>
                                                </Col>
                                                <Col as={Col} sm={2} xs={12} className='text-sm-end my-2'>
                                                    <label className="custom-switch add_more_details_statu">
                                                        <input
                                                            type="checkbox"
                                                            name="description.status"
                                                            className="custom-switch-input"
                                                            onBlur={handleBlur}
                                                            onChange={handleChange}
                                                            value={values.description.status}
                                                            checked={values.description.status}
                                                        />
                                                        Status &nbsp;
                                                        <span className="custom-switch-indicator custum-green-btn"></span>
                                                    </label>
                                                </Col>
                                            </Row>}
                                            <SunEditor
                                                name="description.content"
                                                onChange={(content) => setFieldValue("description.content", content)}
                                                onBlur={() => setFieldTouched("description.content", true)}
                                                setOptions={options_for_sunEditor}
                                                setContents={values.description.content}
                                            />
                                        </Form.Group>
                                    </Row>
                                    <Row>
                                        <Col as={Col}>
                                            <Form.Group>
                                                <Form.Label>Highlights</Form.Label>
                                                <textarea
                                                    name="product_highlight"
                                                    value={values.product_highlight}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                    className='w-100 rounded-3 border border-black'
                                                    rows={5}
                                                />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col as={Col} md={6}>
                                            <Form.Group>
                                                <Form.Label>SEO Discount</Form.Label>
                                                <Form.Control
                                                    type='number'
                                                    name='seo_discount'
                                                    value={values.seo_discount !== null ? values.seo_discount : ''}
                                                    onChange={handleSeoDiscountChange}
                                                    onBlur={handleBlur}
                                                    min={0}
                                                />
                                                {
                                                    errors.seo_discount && touched.seo_discount ? (
                                                        <div className="text-danger">{errors.seo_discount}</div>
                                                    ) : null
                                                }
                                            </Form.Group>
                                        </Col>
                                        <Col as={Col} md={6}>
                                            <Form.Group>
                                                <Form.Label>Tax Percentage <span className="text-danger">*</span></Form.Label>
                                                <Form.Control
                                                    type='number'
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
                                        <Button type="submit" className="btn-primary mx-auto w-auto">Update</Button>
                                    </Row>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row >
            </>
        )
    }
}
