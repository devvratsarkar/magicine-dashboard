import React, { useEffect } from 'react';
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import { useFormik } from 'formik';
import { CurrencySettingValidation } from '../../commondata/formvalidations';
import { useAddUpdateCurrencyMutation, useGetCurrencyQuery } from '../../redux/features/globalSettingEndPoints';
import Loader from '../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';

export default function CurrencySettings() {
    const { data, isLoading: loading, refetch, isSuccess } = useGetCurrencyQuery()
    const [addUpdate, { isLoading }] = useAddUpdateCurrencyMutation();

    const currencyData = data?.data || null

    const initialValues = {
        usd_price: 0,
        id: ''
    };



    const formik = useFormik({
        initialValues: initialValues,
        validationSchema: CurrencySettingValidation,
        onSubmit: async (values) => {
            const conversion = 1 / values.usd_price;

            values.conversion_rate = conversion.toFixed(3)

            try {
                const response = await addUpdate(values).unwrap();
                if (response?.http_status_code === 201 || response?.http_status_code === 200) {
                    refetch()
                    toast.success(response.message);
                    // formik.resetForm();
                }
            } catch (error) {
                toast.error("Failed to update currency settings.");
                console.error("Error:", error);
            }
        },
    });

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, isSubmitting } = formik;

    useEffect(() => {
        formik.setFieldValue("usd_price", currencyData?.usd_price || "")
        formik.setFieldValue("id", currencyData?.id || '')
    }, [isSuccess])

    return (
        <>
            {isLoading && <Loader /> || loading && <Loader />}
            <Row>
                <PageHeader titles="Currency-Settings" active="Currency Settings" items={["Home"]} links={['/dashboard']} />
            </Row>
            <Row>
                <Card>
                    <Card.Header>
                        Set Rates
                    </Card.Header>
                    <Card.Body>
                        <Form onSubmit={handleSubmit}>
                            <Col md={12} className='p-0'>
                                <Row className='mb-4 align-items-center'>
                                    <Col md={3}>USD&nbsp;</Col>
                                    <Col md={3} className='text-sm-center rounded-2'>1</Col>
                                    <Col md={3} className='text-sm-center'></Col>
                                    <Col md={3}>(USD - United States Dollar)</Col>
                                </Row>
                                <Row className='mb-6 align-items-center'>
                                    <Col md={3}>INR&nbsp;</Col>
                                    <Col md={3}>
                                        <Form.Control
                                            type="number"
                                            name='usd_price'
                                            value={values.usd_price}
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            min={1}
                                        />
                                        {errors.usd_price && touched.usd_price ? (
                                            <p className='text-danger'>{errors.usd_price}</p>
                                        ) : null}
                                    </Col>
                                    <Col md={3} className='text-sm-center'></Col>
                                    <Col md={3}>(INR - Indian Rupee)</Col>
                                </Row>
                                <Row className='justify-content-center mt-6'>
                                    <Button className='w-auto' type="submit" disabled={isSubmitting}>
                                        {isSubmitting ? 'Saving...' : 'Save'}
                                    </Button>
                                </Row>
                            </Col>
                        </Form>
                    </Card.Body>
                </Card>
            </Row>
        </>
    );
}
