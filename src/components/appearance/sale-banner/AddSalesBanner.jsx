import axios from 'axios';
import { useFormik } from 'formik';
import React from 'react';
import { Button, Col, Form, Modal, Row } from 'react-bootstrap';
import "react-multiple-select-dropdown-lite/dist/index.css";
import { salesBannerSchema } from '../../../commondata/formvalidations';
import Loader from '../../../layouts/layoutcomponents/loader';
import { useAddSalesBannerMutation, useGetSalesBannerQuery } from '../../../redux/features/cmsEndPoints';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { closeModal } from '../../../redux/slices/allModalSlice';
import { useSelector } from 'react-redux';

const initialValues = {
    banner_image: '',
    link: '',
    status: true
};

export default function AddSalesBanner() {
    const dispatch = useDispatch()
    const { isOpen } = useSelector((state) => state.allCommonModal);
    const { refetch } = useGetSalesBannerQuery()
    const [addSalesBanner, { isLoading }] = useAddSalesBannerMutation()
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: salesBannerSchema,
        onSubmit: async (values) => {
            console.log(values);
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });

            try {
                const response = await addSalesBanner(formData);
                if (response?.data?.http_status_code === 201) {
                    refetch()
                    dispatch(closeModal());
                    toast.success(response?.data?.message)

                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    return (
        <>
            <Modal show={isOpen}>
                {isLoading && <Loader />}
                <Modal.Header className='justify-content-center mx-2'>
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Add Sale Banner</Modal.Title>
                </Modal.Header>
                <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
                <Modal.Body className='p-2'>
                    <Form className='border p-4 rounded-2 p-2 overflow-hidden' onSubmit={handleSubmit}>
                        <Row className='pb-3'>
                            <Form.Label>Banner Image (jpg, jpeg, png, 2mb size) <span className='required_icon'>*</span></Form.Label>
                            <Form.Control
                                type='file'
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file && /\.(jpg|jpeg|png|webp)$/i.test(file.name)) {
                                        setFieldValue("banner_image", file);
                                    } else {
                                        toast.error("Invalid file type. Only JPG, JPEG, PNG, and WEBP files are allowed.");
                                        e.target.value = null;
                                    }
                                }}
                                onBlur={handleBlur}
                                name='banner_image'
                            />
                            {errors.banner_image && touched.banner_image && <div className="error">{errors.banner_image}</div>}
                        </Row>
                        <Row className='pb-3'>
                            <Form.Label>Link <span className='required_icon'>*</span></Form.Label>
                            <Form.Control
                                type="URL"
                                name="link"
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.link}
                            />
                            {errors.link && touched.link ? (
                                <p className={`error`}>{errors.link}</p>
                            ) : null}
                        </Row>
                        <Row className='pb-3'>
                            <Form.Label>Status <span className='required_icon'>*</span></Form.Label>
                            <Form.Select
                                type="text"
                                name="status"
                                onChange={(e) => {
                                    const newStatus = e.target.value === 'true';
                                    handleChange({
                                        target: {
                                            name: 'status',
                                            value: newStatus
                                        }
                                    })
                                }}
                                onBlur={handleBlur}
                                value={values.status.toString()}
                            >
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                            </Form.Select>
                            {errors.status && touched.status ? (
                                <p className={`error`}>{errors.status}</p>
                            ) : null}
                        </Row>
                        <Row className='pb-3'>
                            <Button type="submit" className="btn ms-auto w-auto">Submit</Button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    );
}
