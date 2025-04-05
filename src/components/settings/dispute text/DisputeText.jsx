import React, { useState } from "react";
import "react-multiple-select-dropdown-lite/dist/index.css";
import {
  Button,
  Form,
  Row,
  Col,
  InputGroup,
  Card,
  Dropdown,
} from "react-bootstrap";
import { useFormik } from "formik";
import { DesputeTextValidation } from "../../../commondata/formvalidations";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import ReactQuill from "react-quill";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";

const initialValues = {
  dispute_right_text: "",
  dispute_left_text: "",
};
export default function DisputeText() {
  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: DesputeTextValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <PageHeader
        titles="Settings"
        active="Dispute Text"
        items={["Home",]}
        links={["/dashboard"]}
      />
      <Row>
        <Col>
          <Card>
            <Card.Body className="edit_product">
              <Form onSubmit={handleSubmit} className="add_category_form">
                <Row className="mb-4">
                  <Form.Group as={Col} md="12">
                    <Form.Label>
                      Dispute Right Text
                      <span className="required_icon">*</span>
                    </Form.Label>
                    <SunEditor
                      setOptions={options_for_sunEditor}
                      name="dispute_right_text"
                      onChange={(dispute_right_text) =>
                        setFieldValue("dispute_right_text", dispute_right_text)
                      }
                      onBlur={() => setFieldTouched("dispute_right_text", true)}
                      value={values.dispute_right_text}
                    />
                    {errors.dispute_right_text && touched.dispute_right_text ? (
                      <p className={`error`}>{errors.dispute_right_text}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md="12">
                    <Form.Label>
                      Dispute Left Text <span className="required_icon">*</span>
                    </Form.Label>
                    <SunEditor
                      setOptions={options_for_sunEditor}
                      name="dispute_left_text"
                      onChange={(dispute_left_text) =>
                        setFieldValue("dispute_left_text", dispute_left_text)
                      }
                      onBlur={() => setFieldTouched("dispute_left_text", true)}
                      value={values.dispute_left_text}
                    />
                    {errors.dispute_left_text && touched.dispute_left_text ? (
                      <p className={`error`}>{errors.dispute_left_text}</p>
                    ) : null}
                  </Form.Group>
                </Row>

                <Row className="mt-5">
                  <Button type="submit" className="btn-primary mx-auto w-auto">
                    Submit
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
