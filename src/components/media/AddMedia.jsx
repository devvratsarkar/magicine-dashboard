import React, { useState } from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useAddMediaMutation, useGetAllMediaQuery } from '../../redux/features/MediaEndPoints';
import { useFormik } from 'formik';
import { AddNewMediaValidation } from '../../commondata/formvalidations';
import { closeModal } from '../../redux/slices/allModalSlice';
import Loader from "../../layouts/layoutcomponents/loader"
import toast from 'react-hot-toast';

export default function AddMedia() {
    const { isOpen } = useSelector((state) => state.allCommonModal);

    const [query, setQuery] = useState({
        fromDate: "",
        toDate: ""
    })

    const dispatch = useDispatch();
    const { refetch } = useGetAllMediaQuery(query);
    const [addMedia, { isLoading }] = useAddMediaMutation();



    const initialValues = {
        // name: "",
        image: []
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: AddNewMediaValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'image') {
                    Array.from(value).forEach(image => {
                        formData.append('image', image);
                    });
                } else {
                    formData.append(key, value);
                }
            });


            try {
                const response = await addMedia(formData);
                console.log("response", response);
                if (response?.data?.http_status_code === 201) {
                    toast.success(response.data.message);
                    refetch();
                    dispatch(closeModal());
                }
            } catch (error) {
                console.error(error);
            }
        },
    });



    const handleGalleryChange = (e) => {
        const files = Array.from(e.target.files);
        setFieldValue('image', files);
    };

    return (
        <Modal show={isOpen} onHide={() => dispatch(closeModal())}>
            <Modal.Header className="bg-primary">
                <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                    Add Media
                </Modal.Title>
                <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="">
                    <i className="fe fe-x"></i>
                </Button>
            </Modal.Header>
            <Modal.Body>
                {isLoading && <Loader />}
                <Form onSubmit={handleSubmit} className="p-2">
                    {/* <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type='text'
                                    name='name'
                                    value={values.name}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                />
                                {errors.name && touched.name ? (
                                    <p className='text-danger'>{errors.name}</p>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row> */}
                    <Row>
                        <Col>
                            <Form.Group>
                                <Form.Label>Image <span className='text-danger'>*</span></Form.Label>
                                <Form.Control
                                    type='file'
                                    name='image'
                                    accept=".jpg,.jpeg,.png,.webp"
                                    onChange={handleGalleryChange}
                                    onBlur={handleBlur}
                                    multiple
                                />
                                {errors.image && touched.image ? (
                                    <p className='text-danger'>{errors.image}</p>
                                ) : null}
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row className="my-2 justify-content-center">
                        <Button type="submit" className="btn btn-primary w-auto mt-3">
                            Save
                        </Button>
                    </Row>
                </Form>
            </Modal.Body>
        </Modal>
    );
}
