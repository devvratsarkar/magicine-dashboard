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
import { useAddSurgicalEquipmentMutation, useGetCategoryQuery, useGetManufactutrerQuery, useGetSurgicalEquipmentQuery, } from '../../../redux/features/catalogueEndPoints';
import { Link, useNavigate } from 'react-router-dom';
import { useGetSurgicalEquipmentInventoryQuery } from '../../../redux/features/productEndPoints';
import { MEDIA_BASE_URL, USER_BASE_URL } from '../../../utils/config';
import { generateSchemaMarkupDurgicalEquipment } from '../../../commondata/schemaMarkup';

export default function SurgicalEquipment() {
    const navigate = useNavigate()
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [selectedThumbnails, setSelectedThumbnails] = useState([]);
    const [queryParams, setQueryParams] = useState({
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
    });

    const [categoryQuery, setCategoryQuery] = useState({
        status: true,
        type: "equipment"
    })


    const [addNew, setAddNew] = useState(false)
    const [addNewEquipment, { isLoading }] = useAddSurgicalEquipmentMutation()
    const { data: manufacturer } = useGetManufactutrerQuery()
    const { data: equipment, refetch, isError } = useGetSurgicalEquipmentInventoryQuery(queryParams)
    const { data: category } = useGetCategoryQuery(categoryQuery)
    const { refetch: allEquipmentRefetch } = useGetSurgicalEquipmentQuery(queryParams)
    const categoryData = category?.data?.activeCategories
    const manufacturerData = manufacturer?.data?.manufacturer
    const equipmentData = equipment?.data?.length > 0 ? equipment?.data : null;


    const manufacturerSelectOption = Array.isArray(manufacturerData) && manufacturerData?.length > 0 ? manufacturerData?.filter((item) => item.status === true && item.deleted_at === null)?.map((item) => ({
        value: item.id,
        label: item.manufacturer_name
    })) : []

    const [shortdescription, setShortdescription] = useState(true)
    const [description, setdescription] = useState(true)
    const dispatch = useDispatch()
    const initialValues = {
        product_name: "",
        featured_image: "",
        status: true,
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
        seo_discount: "",
        tax_percentage: ""

    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, isValid, validateForm } = useFormik({
        initialValues: initialValues,
        validationSchema: SurgicalEquipmentSchema,
        onSubmit: async (values) => {
            console.log("values", values);

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
                    value.forEach(linkedItem => {
                        formData.append('linked_items', linkedItem.value);
                    })
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
                const response = await addNewEquipment(formData);
                if (response?.data?.http_status_code === 201) {
                    allEquipmentRefetch()
                    refetch()
                    if (addNew) {
                        allEquipmentRefetch()
                        refetch()
                        navigate("/catalogue/surgical-equipment")
                    }
                    resetForm()
                    toast.success(response.data.message)
                }
            } catch (error) {
                console.error(error);
                toast.error(error.message)
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

    const Linked_item_options = equipmentData ? equipmentData.filter(item => item.status !== false).map((device) => ({
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

    const generateMetaTitle = (productName, seoDiscount) => {
        let metaTitle = `Buy ${productName} online | Magicine Pharma.`;

        if (seoDiscount) {
            metaTitle = `Get up to ${seoDiscount}% off : Buy ${productName} Online at Best Price - Magicine Pharma.`;
        }

        setFieldValue("meta_title", metaTitle.trim());
    };

    const generateMetaDescription = (productName, seoDiscount) => {

        const discount = seoDiscount ? ` & Get Up to ${seoDiscount}% off` : "";


        const metaDescription = `Buy ${productName} Online at Magicine Pharma ${discount}.Know More About ${productName} at Magicine Pharma.✔ Best Quality ✔ Order Now.`;

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
          <meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">
    
          <!-- Twitter Card Tags -->
          <meta name="twitter:card" content="summary_large_image">
          <meta name="twitter:title" content="${values.meta_title || "undefined"}">
          <meta name="twitter:description" content="${values.meta_description || "undefined"}">
          <meta name="twitter:url" content="${USER_BASE_URL}/product/surgical-equipments/${values.slug || "undefined"}">
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



    if (isLoading) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }
    return (
        <>
            {isLoading && <Loader />}
            <PageHeader titles="Catalogue- Surgical Equipment" active="Add surgical equipment" items={["Home", "Surgical Equipment List"]} links={["/dashboard", "/catalogue/surgical-equipment"]} />
            <Row>
                <Col md={12} lg={12}>
                    <Card>
                        <Card.Header>
                            <h3 className="card-title">Add Surgical Equipment</h3>
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
                                                        <img src={selectedThumbnail} alt="Selected Thumbnail" accept="image/*" width={50} height={50} />
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
                                            <p className="text-danger">{errors.status}</p>
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
                                            accept="image/*"
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
                                                        <img src={thumbnail.preview} alt={`Thumbnail ${index}`} accept="image/*" width={50} height={50} />
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
                                        // checked={values.isEnquired}
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
                                            value={values.short_description.content}
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
                                            value={values.description.content}
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
                                                name='seo_discount'
                                                type='number'
                                                value={values.seo_discount}
                                                onChange={handleSeoDiscountChange}
                                                onBlur={handleBlur}
                                            />
                                            {
                                                errors.seo_discount && touched.seo_discount ? (
                                                    <p className='text-danger'>{errors.seo_discount}</p>
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
                                    <Col as={Col} md={6} className='text-end'>
                                        <Button type="submit" onClick={() => setAddNew(true)} className="btn-primary mx-auto w-auto">Save</Button>
                                    </Col>
                                    <Col as={Col} md={6} >
                                        <Button type="submit" className="btn-primary mx-auto w-auto">Save and Add New</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row >
        </>
    )
}
