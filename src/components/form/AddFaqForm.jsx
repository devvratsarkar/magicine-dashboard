import { useFormik } from 'formik';
import React, { useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import ReactQuill from 'react-quill';
import { formats, modules } from '../../commondata/formEditorOptions';



export default function AddFaqForm() {
    const [faqList, setFaqList] = useState([{ question: '', answer: '' }]);

    const initialValues = {
        faq: []
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
        initialValues: initialValues,
        validationSchema: "",
        onSubmit: async () => {
            const formData = faqList.map((faq, index) => ({
                [`question_${index}`]: faq.question,
                [`answer_${index}`]: faq.answer
            }));
            values.faq = formData;
            console.log("FAQ Data:", values);
        }
    });

    const addFaq = () => {
        setFaqList([...faqList, { question: '', answer: '' }]);
    };

    const deleteFaq = (index) => {
        const updatedFaqList = [...faqList];
        updatedFaqList.splice(index, 1);
        setFaqList(updatedFaqList);
    };

    const handleQuestionChange = (index, e) => {
        const updatedFaqList = [...faqList];
        updatedFaqList[index].question = e.target.value;
        setFaqList(updatedFaqList);
    };

    const handleAnswerChange = (index, value) => {
        const updatedFaqList = [...faqList];
        updatedFaqList[index].answer = value;
        setFaqList(updatedFaqList);
    };

    return (
        <Form onSubmit={handleSubmit} encType="multipart/form-data">
            {faqList.map((faq, index) => (
                <div className="mb-4 border-bottom" key={index}>
                    <Row>
                        <Col md={11} xs={12}>
                            <Form.Group>
                                <Form.Label>Question</Form.Label>
                                <Form.Control type="text" onChange={(e) => handleQuestionChange(index, e)} value={faq.question} />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Answer</Form.Label>
                                <ReactQuill theme="snow" modules={modules} formats={formats} className="faq_react_quill" onChange={(value) => handleAnswerChange(index, value)} />
                            </Form.Group>
                        </Col>
                        <Col md={1} xs={12} className='faq_icon'>
                            <i className="fe fe-edit text-warning"></i>
                            <i className="fe fe-trash text-light" onClick={() => deleteFaq(index)}></i>
                            <i className="fa fa-plus-square text-primary" onClick={addFaq}></i>
                        </Col>
                    </Row>
                </div>
            ))}

            <Row>
                <Button type="submit" className="btn-primary mx-auto w-auto">Save</Button>
            </Row>
        </Form>
    );
}
