import React, { useState, useEffect } from 'react';
import { Button, Card, Col, Form, Row, Table } from 'react-bootstrap';
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import { useAddPopUpMutation, useGetAllPopUpsQuery } from '../../redux/features/popUpEndpoints';
import { useFormik } from 'formik';
import { AddPopUpValidation } from '../../commondata/formvalidations';
import { useGetGeneralProductOnlyQuery, useGetMedicineOnlyQuery, useGetMedicinesQuery, useGetProductsQuery } from '../../redux/features/productEndPoints';
import { useGetBrandQuery, useGetCategoryQuery, useGetSurgicalEquipmentQuery } from '../../redux/features/catalogueEndPoints';
import Select from 'react-select';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Loader from '../../layouts/layoutcomponents/loader';

export default function AddPopUp() {
    const navigate = useNavigate()
    const [viewThumbnail, setViewThumbnail] = useState(true);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [categoryOptions, setCategoryOptions] = useState([]);
    const [productOptions, setProductOptions] = useState([]);
    const [medicineOptions, setMedicineOptions] = useState([]);
    const [surgicalOptions, setSurgicalOptions] = useState([]);
    const [brandOptions, setBrandOptions] = useState([]);
    const [nameOptions, setNameOptions] = useState([]);
    const [selectedSubPages, setSelectedSubPages] = useState([]);

    const [queryParams, setQueryParams] = useState({
        brand: '',
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
    });

    const [queryParamsMedicine, setQueryParamsMedicine] = useState({
        brand: '',
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
        search: '',
        page: "" || 1,
        limit: "" || 10
    });

    const [surgicalQueryParams, setSurgicalQueryParams] = useState({
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
    });

    const [queryBrand, setQuerybrand] = useState({
        type: "",
        status: ""
    })

    const [categoryQuery, setCategoryQuery] = useState({
        status: "",
        type: ""
    })

    const { data: getGeneralProduct, isLoading: productLoading } = useGetGeneralProductOnlyQuery();
    // const {  isLoading: medicineLoading } = useGetMedicinesQuery(queryParamsMedicine);
    const { data: getMedicine, isLoading: medicineLoading } = useGetMedicineOnlyQuery();
    const { data: getSurgicalEquipment, isLoading: surgicalLoading } = useGetSurgicalEquipmentQuery(surgicalQueryParams);
    const { data: getBrand, isLoading: brandLoading } = useGetBrandQuery(queryBrand);
    const { data: getCategory, isLoading: categoryLoading } = useGetCategoryQuery(categoryQuery);

    useEffect(() => {
        if (getCategory) {
            const options = getCategory.data.activeCategories.map(category => ({
                label: category.category_name,
                value: category.slug,
            }));
            setCategoryOptions(options);
        }
    }, [getCategory]);

    useEffect(() => {
        if (getBrand) {
            const options = getBrand?.data?.allBrand.map(brand => ({
                label: brand.brand_name,
                value: brand.slug,
            }));
            setBrandOptions(options);
        }
    }, [getBrand]);

    useEffect(() => {
        if (getGeneralProduct) {
            const options = getGeneralProduct.data.map(product => ({
                label: product.product_name,
                value: product.slug,
            }));
            setProductOptions(options);
        }
    }, [getGeneralProduct]);

    useEffect(() => {
        if (getMedicine) {
            const options = getMedicine.data.map(medicine => ({
                label: medicine.product_name,
                value: medicine.slug,
            }));
            setMedicineOptions(options);
        }
    }, [getMedicine]);

    useEffect(() => {
        if (getSurgicalEquipment) {
            const options = getSurgicalEquipment.data.map(equipment => ({
                label: equipment.product_name,
                value: equipment.slug,
            }));
            setSurgicalOptions(options);
        }
    }, [getSurgicalEquipment]);

    const initialValues = {
        image: "",
        title: "",
        content: "",
        type: "",
        button_text: "",
        button_link: "",
        status: true,
        pages: [],
        sub_pages: [],
        time: "",
        countdown_timer: ""
    };

    const [addPopUp, { isLoading: loading }] = useAddPopUpMutation();
    const { refetch } = useGetAllPopUpsQuery();

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: AddPopUpValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === "sub_pages") {
                    const subPagesString = JSON.stringify(value);
                    formData.append('sub_pages', subPagesString);
                } else if (key === "pages") {
                    value.forEach(item => {
                        formData.append(key, item);
                    });
                }
                else {
                    formData.append(key, value);
                }
            });


            try {
                const response = await addPopUp(formData);
                if (response?.data?.http_status_code === 201) {
                    refetch();
                    toast.success(response.data.message);
                    navigate("/pop-ups")
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    const handleThumbnailChange = (event) => {
        const file = event.target.files[0];
        setFieldValue('image', file);

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

    const handlePageChange = (selectedOptions) => {
        const selectedPages = selectedOptions.map(option => option.value);

        setFieldValue('pages', selectedPages);

        let newOptions = [];
        if (selectedPages.includes('category')) {
            newOptions = [...newOptions, ...categoryOptions];
        }
        if (selectedPages.includes('general product')) {
            newOptions = [...newOptions, ...productOptions];
        }
        if (selectedPages.includes('Medicine')) {
            newOptions = [...newOptions, ...medicineOptions];
        }
        if (selectedPages.includes('surgical equipment')) {
            newOptions = [...newOptions, ...surgicalOptions];
        }
        if (selectedPages.includes('brand')) {
            newOptions = [...newOptions, ...brandOptions];
        }

        setNameOptions(newOptions);
        setFieldValue('sub_pages', newOptions);
    };



    const handleAddSubPage = (selectedOption) => {
        const newSubPages = [...selectedSubPages, selectedOption];
        setSelectedSubPages(newSubPages);
        setFieldValue('sub_pages', newSubPages);
    };

    const handleRemoveSubPage = (subPageValue) => {
        const updatedSubPages = selectedSubPages.filter(subPage => subPage.value !== subPageValue);
        setSelectedSubPages(updatedSubPages);
        setFieldValue('sub_pages', updatedSubPages);
    };

    const handleSelectAll = () => {
        setSelectedSubPages(nameOptions);
        setFieldValue('sub_pages', nameOptions.map(option => option.value));
    };
    const handleRemoveAll = () => {
        setSelectedSubPages([]);
        setFieldValue('sub_pages', []);
    };

    return (
        <>
            {
                loading && <Loader /> || productLoading && <Loader /> || medicineLoading && <Loader /> || surgicalLoading && <Loader /> || brandLoading && <Loader /> || categoryLoading && <Loader />
            }
            <Row>
                <Col>
                    <PageHeader titles="Pop-Up" active="add pop up" items={["Home", "Pop-Up List"]} links={['/dashboard', "/pop-ups"]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Type <span className='text-danger'>*</span></Form.Label>
                                            <Form.Select
                                                name='type'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.type}
                                            >
                                                <option value="">Select</option>
                                                <option value="Fullscreen">Fullscreen Popups</option>
                                                <option value="Coupon/Promotion">Coupon/Promotion Popups</option>
                                                <option value="Cart Abandonment">Cart Abandonment Popups</option>
                                                <option value="Scroll-In">Scroll-In Popups</option>
                                                <option value="Floating Bar">Floating Bar Popups(top-bar)</option>
                                                <option value="Subscription">Subscription Popups</option>
                                                <option value="Countdown Timer">Countdown Timer Popups</option>
                                                <option value="Exit Intent">Exit Intent Popups</option>
                                                <option value="Entry">Entry Popups</option>
                                            </Form.Select>
                                            {
                                                errors.type && touched.type ? (
                                                    <p className='text-danger'>{errors.type}</p>
                                                ) : null
                                            }
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col}>
                                        <Form.Group>
                                            <Form.Label>Title</Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='title'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.title}
                                            />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={12}>
                                        <Form.Group>
                                            <Form.Label>Content</Form.Label>
                                            <textarea
                                                className='form-control'
                                                name='content'
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                value={values.content}
                                            ></textarea>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    {
                                        values.type === "Coupon/Promotion" || values.type === "Exit Intent" ? (
                                            <>
                                                <Col as={Col} md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Coupon Code</Form.Label>
                                                        <Form.Control
                                                            type='text'
                                                            name='button_text'
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.button_text}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        ) : (
                                            <>
                                                <Col as={Col} md={6}>
                                                    <Form.Group>
                                                        <Form.Label>Button Text</Form.Label>
                                                        <Form.Control
                                                            type='text'
                                                            name='button_text'
                                                            onChange={handleChange}
                                                            onBlur={handleBlur}
                                                            value={values.button_text}
                                                        />
                                                    </Form.Group>
                                                </Col>
                                            </>
                                        )
                                    }
                                    {
                                        values.type === "Coupon/Promotion" || values.type === "Exit Intent" || values.type === "Countdown Timer" ?
                                            null
                                            : (
                                                <>
                                                    <Col Col as={Col} md={6}>
                                                        <Form.Group>
                                                            <Form.Label>Button Link</Form.Label>
                                                            <Form.Control
                                                                type='text'
                                                                name='button_link'
                                                                onChange={handleChange}
                                                                onBlur={handleBlur}
                                                                value={values.button_link}
                                                            />
                                                        </Form.Group>
                                                    </Col>
                                                </>
                                            )
                                    }
                                    {
                                        values.type === "Countdown Timer" ? (
                                            <Col Col as={Col} md={6}>
                                                <Form.Group>
                                                    <Form.Label>Countdown Timer</Form.Label>
                                                    <Form.Control
                                                        type='number'
                                                        min="1"
                                                        name='countdown_timer'
                                                        onChange={handleChange}
                                                        onBlur={handleBlur}
                                                        value={values.countdown_timer}
                                                    />
                                                </Form.Group>
                                            </Col>
                                        ) : null
                                    }
                                </Row>
                                <Row>
                                    <Col as={Col} md={8}>
                                        <Form.Label>Image</Form.Label>
                                        <Row>
                                            <Col as={Col} md={3} className="d-flex justify-content-center">
                                                {viewThumbnail ? (
                                                    <div className="position-relative">
                                                        <p>No image</p>
                                                        <span className="position-absolute">
                                                            <button className="p-0 px-1" onClick={() => { setViewThumbnail(true), setFieldValue('image', null) }}>
                                                                <i className="icon icon-close text-danger"></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                ) : (
                                                    <div className="position-relative">
                                                        <img src={selectedThumbnail} alt="Selected Thumbnail" className="img-thumbnail" />
                                                        <span className="position-absolute">
                                                            <button className="p-0 px-1" onClick={() => { setViewThumbnail(true), setFieldValue('image', null) }}>
                                                                <i className="icon icon-close text-danger"></i>
                                                            </button>
                                                        </span>
                                                    </div>
                                                )}
                                            </Col>
                                            <Col as={Col} md={9}>
                                                <Form.Control
                                                    type='file'
                                                    name='image'
                                                    accept='image/*'
                                                    onChange={handleThumbnailChange}
                                                    onBlur={handleBlur}
                                                />
                                            </Col>
                                        </Row>
                                    </Col>
                                    <Col as={Col} md={4}>
                                        <Form.Group>
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select
                                                name='status'
                                                value={values.status}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            >
                                                <option value="">Select</option>
                                                <option value="true">Active</option>
                                                <option value="false">InActive</option>
                                            </Form.Select>
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={6}>
                                        <Form.Group>
                                            <Form.Label>Delay(seconds)</Form.Label>
                                            <Form.Control
                                                type='number'
                                                name='time'
                                                value={values.time}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                            />
                                            {
                                                errors.time && touched.time ? (
                                                    <p className='text-danger'>{errors.time}</p>
                                                ) : null
                                            }
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row className='mb-6'>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Page</Form.Label>
                                            <Select
                                                isMulti
                                                name="pages"
                                                onChange={handlePageChange}
                                                onBlur={handleBlur}
                                                value={values.pages.map(value => ({ label: value, value }))}
                                                options={[
                                                    { label: 'Category', value: 'category' },
                                                    { label: 'Brand', value: 'brand' },
                                                    { label: 'General Product', value: 'general product' },
                                                    { label: 'Medicine', value: 'Medicine' },
                                                    { label: 'Surgical Equipment', value: 'surgical equipment' },
                                                    { label: 'Home', value: 'home' },
                                                    { label: 'About-Us', value: 'About-Us' },
                                                    { label: 'Contact-Us', value: 'Contact-Us' },
                                                    { label: 'Search', value: 'Search' },
                                                    { label: 'Return & Refund', value: 'Return & Refund' },
                                                    { label: 'Privacy Policy', value: 'Privacy Policy' },
                                                    { label: 'Grievance Redressal Policy', value: 'Grievance Redressal Policy' },
                                                    { label: 'Dashboard', value: 'Dashboard' },
                                                    { label: 'Prescription', value: 'Prescription' },
                                                    { label: 'Order Confirmed', value: 'Order Confirmed' },
                                                    { label: 'Checkout', value: 'Checkout' },
                                                    { label: 'Cart', value: 'Cart' },
                                                    { label: 'Career', value: 'career' },
                                                    { label: 'Cancellation Policy', value: 'Cancellation Policy' }
                                                ]}
                                            />
                                            {errors.pages && touched.pages ? (
                                                <p className='text-danger'>{errors.pages}</p>
                                            ) : null}
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group>
                                            <Form.Label>Sub-Pages</Form.Label>
                                            <Select
                                                name="sub_pages"
                                                onChange={handleAddSubPage}
                                                onBlur={handleBlur}
                                                value={null}
                                                options={nameOptions.filter(option => !selectedSubPages.some(subPage => subPage.value === option.value))}
                                                isSearchable
                                            />
                                            <Row className='mt-3'>
                                                <Col as={Col} md={6} className='text-end'>
                                                    <Button onClick={handleSelectAll} variant='secondary' className="mt-2 me-2">Select All</Button>
                                                </Col>
                                                <Col as={Col} md={6} className=''>
                                                    <Button onClick={handleRemoveAll} variant='danger' className="mt-2">Remove All</Button>
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    </Col>
                                </Row>

                                {/* Selected Sub-Pages Table */}
                                {selectedSubPages.length > 0 && (
                                    <Row className="mt-3">
                                        <Col style={{ maxHeight: "300px", overflowY: "scroll" }}>
                                            <Table bordered>
                                                <thead>
                                                    <tr>
                                                        <th>Sub-Page Label</th>
                                                        <th>Sub-Page Value</th>
                                                        <th>Action</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {selectedSubPages.map(subPage => (
                                                        <tr key={subPage.value}>
                                                            <td>{subPage.label}</td>
                                                            <td>{subPage.value}</td>
                                                            <td>
                                                                <Button
                                                                    variant="danger"
                                                                    onClick={() => handleRemoveSubPage(subPage.value)}
                                                                >
                                                                    Remove
                                                                </Button>
                                                            </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </Col>
                                    </Row>
                                )}
                                <Row className="mt-6 justify-content-center">

                                    <Button type="submit" className='w-auto mb-6'>
                                        Save
                                    </Button>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col >
            </Row >
        </>
    );
}
