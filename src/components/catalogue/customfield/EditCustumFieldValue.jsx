import React from "react";
import { useFormik } from "formik";
import { AddCustomFieldSchema, AddCustomFieldValueSchema } from "../../../commondata/formvalidations";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useEditCustomFieldValuesMutation, useGetCustomFieldValueQuery } from "../../../redux/features/catalogueEndPoints";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";



export default function EditCustumFieldValue() {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  // const { data: singleField, isError, error, isLoading: loadSingleField, isFetching, isSuccess } = useGetSingleCustomFieldsQuery(data.id)
  const { refetch } = useGetCustomFieldValueQuery(data?.data?.data?.custom_field?._id);
  const [editCustomFieldValues, { isLoading }] = useEditCustomFieldValuesMutation()
  const initialValues = {
    attribute_name: data?.row?.attribute_name,
    list_order: data?.row?.list_order,
    color: data?.row?.color,
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddCustomFieldValueSchema,
    onSubmit: async (values) => {
      try {
        const response = await editCustomFieldValues({ fieldValue: values, fieldId: data?.row?.id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          dispatch(closeModal())
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const colorField = () => {
    const handleColorChange = (e) => {
      const color = e.target.value;
      setFieldValue("color", color);
      setFieldValue("colorCode", color);
    };

    const handleColorCodeChange = (e) => {
      const colorCode = e.target.value;
      setFieldValue("colorCode", colorCode);
      setFieldValue("color", colorCode);
    };

    if (data?.data?.data?.custom_field?.attribute_type === "Color" || data?.data?.data?.custom_field?.attribute_type === "color") {
      return (
        <>
          <Form.Group controlId="formBasicColorPicker" className="mb-3">
            <Form.Label>Color</Form.Label>
            <Row className="color_code_input">
              <Form.Control
                type="text"
                name="colorCode"
                value={values.colorCode}
                onChange={handleColorCodeChange}
                onBlur={handleBlur}
                placeholder="Enter color hex code"
              />
              <Form.Control
                type="color"
                name="color"
                value={values.color}
                onChange={handleColorChange}
                onBlur={handleBlur}
              />
            </Row>
          </Form.Group>
        </>
      );
    }
  };
  return (
    <div>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Edit Custom Field Value
          </Modal.Title>
        </Modal.Header>
        <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
        <Modal.Body className="p-2">
          {isLoading && <Loader />}
          <Form onSubmit={handleSubmit} className="border rounded-2 p-2 overflow-hidden" >
            <Row className="border-bottom pb-3">
              <Form.Group as={Col} md="6">
                <Form.Label>
                  Attribute Value <span className="required_icon">*</span>
                </Form.Label>
                <Form.Control
                  type="text"
                  name="attribute_name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.attribute_name}
                />
                {errors.attribute_name && touched.attribute_name ? (
                  <p className={`error`}>{errors.attribute_name}</p>
                ) : null}
              </Form.Group>
              <Form.Group as={Col} md="6">
                <Form.Label>
                  List Order <span className="required_icon">*</span>
                </Form.Label>
                <Form.Control
                  type="number"
                  name="list_order"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.list_order}
                  min={0}
                />
              </Form.Group>
            </Row>
            <Row>
              {colorField()}
            </Row>
            <Row className="mx-1">
              <Button type="submit" className="btn-primary ms-auto w-auto">Update</Button>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
