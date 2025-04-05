import { useFormik } from 'formik';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import "react-multiple-select-dropdown-lite/dist/index.css";
import { EditVariantSchema } from '../../commondata/formvalidations';
import { useDispatch, useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/allModalSlice';
import Select from "react-select";
import { useNavigate } from 'react-router-dom';

const initialValues = {
    strength: '',
    size: [],
    tags: []
};

export default function ListVariantEdit() {
    const dispatch = useDispatch()
    const navigate = useNavigate();
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    console.log('new', data);
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: EditVariantSchema,
        onSubmit: async (values) => {
            console.log(values);
            navigate(`inventor/list-variant-edit/${data.ID}`, { state: values });
            resetForm();
            dispatch(closeModal())
        },
    });

    const options = [
        { value: "20ml", label: "20ml" },
        { value: "30ml", label: "30ml" },
        { value: "40ml", label: "40ml" },
        { value: "50ml", label: "50ml" },
        { value: "60ml", label: "60ml" },
        { value: "70ml", label: "70ml" },
        { value: "80ml", label: "80ml" },
    ];

    return (
        <>
            <Modal show={isOpen}>
                <Modal.Header className='justify-content-center mx-2'>
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Edit Variant</Modal.Title>
                </Modal.Header>
                <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
                <Modal.Body className='p-2'>
                    <Form className='border rounded-2 p-2' onSubmit={handleSubmit}>
                        <Row className='pb-3'>
                            <Col md="3">
                                <Form.Label>Strength <span className='required_icon'>*</span></Form.Label>
                            </Col>
                            <Col md="9">
                                <Form.Control
                                    type="text"
                                    name="strength"
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    value={values.strength}
                                />
                                {errors.strength && touched.strength && <div className="error">{errors.strength}</div>}
                            </Col>
                        </Row>
                        <Row className='pb-3'>
                            <Col md="3">
                                <Form.Label>Size <span className='required_icon'>*</span></Form.Label>
                            </Col>
                            <Col md="9">
                                <Select
                                    options={options}
                                    value={values.size}
                                    onChange={(selectedOptions) => setFieldValue("size", selectedOptions)}
                                    onBlur={handleBlur}
                                    isFilterOption={true}
                                    isSearchable={false}
                                    isClearable={true}
                                    classNamePrefix="background"
                                    isMulti
                                />
                                {errors.size && touched.size && <div className="error">{errors.size}</div>}
                            </Col>
                        </Row>
                        <Row className='pb-3'>
                            <Col md="3">
                                <Form.Label>Tags <span className='required_icon'>*</span></Form.Label>
                            </Col>
                            <Col md="9">
                                <Select
                                    options={options}
                                    value={values.tags}
                                    onChange={(selectedOptions) => setFieldValue("tags", selectedOptions)}
                                    onBlur={handleBlur}
                                    isFilterOption={true}
                                    isSearchable={false}
                                    isClearable={true}
                                    classNamePrefix="background"
                                    isMulti
                                />
                                {errors.tags && touched.tags && <div className="error">{errors.tags}</div>}
                            </Col>
                        </Row>
                        <Button type="submit">Submit</Button>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
