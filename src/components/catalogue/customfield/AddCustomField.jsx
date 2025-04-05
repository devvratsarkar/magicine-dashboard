import React from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useFormik } from "formik";
import { TreeSelect } from "antd";
import { AddCustomFieldSchema } from '../../../commondata/formvalidations';
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { closeModal } from '../../../redux/slices/allModalSlice';
import { useAddNewCustomFieldMutation, useGetCategoryByParentChildQuery, useGetCustomFieldsQuery } from '../../../redux/features/catalogueEndPoints';
import Loader from '../../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';

export default function AddCustomField() {
    const initialValues = {
        attribute_type: "",
        attribute_name: "",
        list_order: "",
        category_id: [],
    }

    const dispatch = useDispatch();
    const { refetch } = useGetCustomFieldsQuery()
    const { isOpen, } = useSelector((state) => state.allCommonModal);
    const { data: parentChildCategory } = useGetCategoryByParentChildQuery()
    const parentChildCategoryData = parentChildCategory?.context?.data;

    const [newCustomField, { isLoading }] = useAddNewCustomFieldMutation()

    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: AddCustomFieldSchema,
        onSubmit: async (values) => {
            try {
                const response = await newCustomField(values);
                if (response?.data?.http_status_code === 201) {
                    toast.success(response.data.message)
                    refetch()
                    dispatch(closeModal())
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    const { values, errors, handleBlur, touched, setFieldValue } = formik;

    const handleCategoryChange = (value) => {
        setFieldValue("category_id", value);
    };

    const filterTreeNode = (inputValue, treeNode) => {
        return treeNode.title.toLowerCase().indexOf(inputValue.toLowerCase()) >= 0;
    };

    return (
        <div>
            <Modal show={isOpen}>
                <Modal.Header className='justify-content-center mx-2'>
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Add Custom Field</Modal.Title>
                </Modal.Header>
                <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
                <Modal.Body className='p-2'>
                    {isLoading && <Loader />}
                    <Form onSubmit={formik.handleSubmit} className="border rounded-2 p-2 overflow-hidden" >
                        <Row className="border-bottom pb-3">
                            <Form.Group>
                                <Form.Label>
                                    Attribute Type <span className="required_icon">*</span>
                                </Form.Label>
                                <Form.Select
                                    name="attribute_type"
                                    placeholder="Select Attribute Type"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={values.attribute_type}
                                >
                                    <option value=""></option>
                                    <option value="Select">Select</option>
                                    <option value="Color">Color</option>
                                </Form.Select>

                                {errors.attribute_type && touched.attribute_type ? (
                                    <p className={`error`}>{errors.attribute_type}</p>
                                ) : null}
                            </Form.Group>
                        </Row>
                        <Row className="border-bottom pb-3">
                            <Form.Group as={Col} md="6">
                                <Form.Label>
                                    Attribute Name <span className="required_icon">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="text"
                                    name="attribute_name"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={values.attribute_name}
                                />
                                {errors.attribute_name && touched.attribute_name ? (
                                    <p className={`error`}>{errors.attribute_name}</p>
                                ) : null}
                            </Form.Group>
                            <Form.Group as={Col} md="6">
                                <Form.Label>
                                    List Order <span className="required_icon">*</span>
                                </Form.Label>
                                <Form.Control
                                    type="number"
                                    name="list_order"
                                    onChange={formik.handleChange}
                                    onBlur={formik.handleBlur}
                                    value={values.list_order}
                                    min={0}
                                />
                                {errors.list_order && touched.list_order ? (
                                    <p className={`error`}>{errors.list_order}</p>
                                ) : null}
                            </Form.Group>
                        </Row>
                        <Row className="pb-3">
                            <Form.Group as={Col} md="12">
                                <Form.Label>Select Parent Category</Form.Label>

                                <TreeSelect
                                    className="w-100"
                                    value={values.category_id}
                                    name="category_id"
                                    onChange={handleCategoryChange}
                                    multiple={true}
                                    onBlur={handleBlur}
                                    showSearch
                                    // searchValue='label'
                                    treeData={parentChildCategoryData}
                                    filterTreeNode={(inputValue, treeNode) => {
                                        console.log("treeNode", treeNode)
                                        return treeNode.label.toLowerCase().includes(inputValue.toLowerCase());
                                    }}
                                    placeholder="Search categories"
                                />
                                {errors.category_id && touched.category_id ? (
                                    <p className={`error`}>{errors.category_id}</p>
                                ) : null}
                            </Form.Group>
                        </Row>
                        <Row className="mx-1">
                            <Button type="submit" className="btn-primary ms-auto w-auto">
                                Save
                            </Button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </div>
    )
}
