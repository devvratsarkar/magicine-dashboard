import React, { useEffect } from "react";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Row, Col, Form, Card, Button } from "react-bootstrap";
import ReactQuill from "react-quill";
import { useFormik, useFormikContext } from "formik";
import { ReplyDesputeValidation } from "../../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import "suneditor/dist/css/suneditor.min.css";
import { useLocation } from "react-router-dom";

function ReplyDispute() {
  const initialValues = {
    status: "",
    upload_attachment: "",
    content: "",
  };

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
    validationSchema: ReplyDesputeValidation,
    onSubmit: async (values) => {
      console.log(values);
    },
  });

  return (
    <>
      <Row>
        <Col>
          <PageHeader
            titles="Support Desk"
            active={["Reply/"]}
            items={["Home", "Dispute List"]}
            links={["/dashboard", "/support-desk/disputes"]}
          />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="data_table p-2">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Status</Form.Label>
                      <Form.Control
                        type="text"
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.status && touched.status && (
                        <div className="text-danger">{errors.status}</div>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>
                        Upload Attachment (Jpg, JPEG, PNG)
                      </Form.Label>
                      <Form.Control
                        type="file"
                        name="upload_attachment"
                        accept=".jpg,.jpeg,.png,.webp"
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.upload_attachment &&
                        touched.upload_attachment && (
                          <div className="text-danger">
                            {errors.upload_attachment}
                          </div>
                        )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label>Content</Form.Label>
                      <SunEditor
                        setOptions={options_for_sunEditor}
                        name="content"
                        onChange={(content) =>
                          setFieldValue("content", content)
                        }
                        onBlur={() => setFieldTouched("content", true)}
                        value={values.content}
                      />
                      {errors.content && touched.content && (
                        <div className="text-danger">{errors.content}</div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="my-5">
                  <Col className="text-center">
                    <Button type="submit">Submit</Button>
                  </Col>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ReplyDispute;
