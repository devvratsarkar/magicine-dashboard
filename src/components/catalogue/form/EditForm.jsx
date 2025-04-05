import React, { useEffect } from 'react'
import { Button, Col, Form, Modal, Row } from 'react-bootstrap'
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';
import { useEditFormMutation, useGetAllFormQuery, useGetSingleFormQuery } from '../../../redux/features/catalogueEndPoints';
import { AddNewUsesValidation } from '../../../commondata/formvalidations';
import { closeModal } from '../../../redux/slices/allModalSlice';
import { useFormik } from 'formik';
import Loader from '../../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';

export default function EditForm() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const [editUses, { isLoading }] = useEditFormMutation();
    const { data: usesData, isLoading: loading, isSuccess: success, refetch: singleFetch } = useGetSingleFormQuery(data?.id)
    const { refetch } = useGetAllFormQuery()
    const initialValues = {
        name: ""
    };
    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
        initialValues: initialValues,
        validationSchema: AddNewUsesValidation,
        onSubmit: async (values) => {
            try {
                const response = await editUses({ usesId: data?.id, formData: values });
                if (response?.data?.http_status_code === 200) {
                    toast.success(response.data.message)
                    refetch()
                    singleFetch()
                    dispatch(closeModal())
                }
            } catch (error) {
                console.error(error);
            }
        },
    });
    useEffect(() => {
        setFieldValue("name", usesData?.data?.name)
    }, [success])
    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="bg-primary">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center text-light">
                        Edit Form
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
                                    <Form.Label>Name  <span className='text-danger'>*</span></Form.Label>
                                    <Form.Control
                                        type='text'
                                        name='name'
                                        value={values.name}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
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
                            <button type="submit" className="btn btn-primary w-auto mt-3">
                                Save
                            </button>
                        </Row>
                    </Form>
                </Modal.Body>
            </Modal>
        </>
    )
}