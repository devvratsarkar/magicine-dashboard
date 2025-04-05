import React, { useEffect } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useAddUsesMutation, useGetSingleUsesQuery } from '../../../redux/features/catalogueEndPoints';
import { AddNewUsesValidation } from '../../../commondata/formvalidations';
import { closeModal } from '../../../redux/slices/allModalSlice';
import { useFormik } from 'formik';
import Loader from '../../../layouts/layoutcomponents/loader';

export default function ViewUses() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    // const [addUses, { isLoading }] = useAddUsesMutation();
    const { data: usesData, isLoading: loading, isSuccess: success } = useGetSingleUsesQuery(data?.id)
    const initialValues = {
        name: ""
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: AddNewUsesValidation,
        onSubmit: async (values) => {
            // try {
            //     const response = await addUses(values);
            //     if (response?.data?.http_status_code === 201) {
            //         toast.success(response.data.message)
            //         refetch()
            //         dispatch(closeModal())
            //     }
            // } catch (error) {
            //     console.error(error);
            // }
        },
    });


    useEffect(() => {
        setFieldValue("name", usesData?.data?.name)
    }, [success])
    return (
        <>
            {loading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="bg-primary">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                        View Uses
                    </Modal.Title>
                    <Button onClick={() => dispatch(closeModal())} className="btn-close text-light" variant="" >
                        <i className="fe fe-x"></i>
                    </Button>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSubmit} className="p-2">
                        <Row>
                            <Col>
                                <Form.Group>
                                    <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='name'
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        readOnly
                                    />
                                    {
                                        errors.name && touched.name ? (
                                            <p className='text-danger'>{errors.name}</p>)
                                            : null
                                    }
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row className="my-2 justify-content-center">
                            {/* <button type="submit" className="btn btn-primary w-auto mt-3">
                            Save
                        </button> */}
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}