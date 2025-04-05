import { useFormik } from 'formik';
import React, { useEffect } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useSelector } from 'react-redux';
import { closeModal } from '../../redux/slices/allModalSlice';
import { useDispatch } from 'react-redux';
import { useGetUserProfileQuery, useUpdateProfileMutation } from '../../redux/features/commonApiCall';
import Loader from '../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import { AdminProfileValidation } from '../../commondata/formvalidations';

export default function UpdateProfile() {
    const dispatch = useDispatch()
    const { isOpen } = useSelector((state) => state.allCommonModal);
    const { data, isSuccess, refetch } = useGetUserProfileQuery()
    const adminData = data?.data
    const [updateProfile, { isLoading }] = useUpdateProfileMutation();
    const initialValues = {
        name: "",
        email: "",
        phone_number: "",
        dob: "",
        profile_pic: "",
        about: "",
        designation: "",
        qualification: ""
    }

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: AdminProfileValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                formData.append(key, value);
            });
            try {
                const response = await updateProfile(formData);
                console.log("response", response);
                if (response?.data?.http_status_code === 200) {
                    toast.success(response?.data?.message)
                    refetch()
                    dispatch(closeModal())
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    useEffect(() => {
        setFieldValue("name", adminData?.name)
        setFieldValue("dob", adminData?.dob)
        setFieldValue("email", adminData?.email)
        setFieldValue("phone_number", adminData?.phone_number)
        setFieldValue("profile_pic", adminData?.profile_pic)
        setFieldValue("about", adminData?.about)
        setFieldValue("designation", adminData?.designation)
        setFieldValue("qualification", adminData?.qualification)

    }, [isSuccess])


    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen} size='lg'>
                <Modal.Header>
                    <Modal.Title>Update Profile</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit}>
                        <Row>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='name'
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {
                                        errors.name && touched.name ? (
                                            <p className='text-danger'>{errors.name}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Email <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='email'
                                        value={values.email}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {
                                        errors.email && touched.email ? (
                                            <p className='text-danger'>{errors.email}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Phone Number <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='phone_number'
                                        value={values.phone_number}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {
                                        errors.phone_number && touched.phone_number ? (
                                            <p className='text-danger'>{errors.phone_number}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>

                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Date Of Birth <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='date'
                                        name='dob'
                                        value={values.dob}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                    {
                                        errors.dob && touched.dob ? (
                                            <p className='text-danger'>{errors.dob}</p>
                                        ) : ""
                                    }
                                </Form.Group>
                            </Col>
                        </Row>

                        <Row>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Profile Picture </Form.Label>
                                    <Form.Control
                                        type='file'
                                        name='profile_pic'
                                        onChange={(event) => setFieldValue("profile_pic", event.target.files[0])}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </Col>
                            <Col as={Col} md={6}>
                                <Form.Group>
                                    <Form.Label>Designation </Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='designation'
                                        value={values.designation}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                    />
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col as={Col} md={12}>
                                <Form.Label>About</Form.Label>
                                <textarea className='border border-black rounded-3 w-100 ' name='about' value={values.about} onChange={handleChange} onBlur={handleBlur} rows={3}/>
                            </Col>
                        </Row><Row>
                            <Col as={Col} md={12}>
                                <Form.Label>Qualification</Form.Label>
                                <textarea className='border border-black rounded-3 w-100 ' name='qualification' value={values.qualification} onChange={handleChange} onBlur={handleBlur} rows={3} />
                            </Col>
                        </Row>
                        <Row className='mt-4 gap-5' >
                            <Col className='text-end'>
                                <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                                    Cancel
                                </Button>
                                &nbsp;
                                <Button type='submit' className="btn btn-primary" variant="primary">
                                    Save
                                </Button>
                            </Col>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>


    )
}

