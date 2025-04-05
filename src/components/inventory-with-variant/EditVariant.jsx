import { Formik, useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { EditVariantSchema } from "../../commondata/formvalidations";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
import Select from "react-select";
import { useNavigate, useParams } from "react-router-dom";
import { useGetInventoryAttributesQuery } from "../../redux/features/stockInventoryEndPoint";
import Loader from "../../layouts/layoutcomponents/loader";



export default function EditVariant() {
  const [initialValues, setInitialValues] = useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const { data: getAttributeData, isLoading } = useGetInventoryAttributesQuery({ modelType: data.type, modelId: data.id });
  const selectedAttributes = getAttributeData?.data?.customFields || [];
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: "",
    onSubmit: async (values) => {
      console.log("values", values);
      navigate(`/inventor/add-invertory-with-varient`, { state: { values: values, productData: data, attributes: selectedAttributes } });
      resetForm();
      dispatch(closeModal());
    },
  });


  if (isLoading) {
    return <Loader />;
  }
  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Add Variant
          </Modal.Title>
        </Modal.Header>
        <Button
          onClick={() => dispatch(closeModal())}
          className="btn-close position-absolute end-0 p-3"
          variant=""
        >
          <i className="fe fe-x fw-bolder"></i>
        </Button>
        <Modal.Body className="p-2">
          <Form
            className="border rounded-2 p-2"
            onSubmit={handleSubmit}
          >
            {selectedAttributes.map((item, index) => (
              <Row className="pb-3" key={index}>
                <Col md="3">
                  <Form.Label>
                    {item.attribute_name} <span className="required_icon">*</span>
                  </Form.Label>
                </Col>
                <Col md="9">
                  <Select
                    options={
                      item.values.map((item) => {
                        return {
                          value: item.id,
                          label: item.attribute_name,
                        }
                      })
                    }
                    value={values.tags}
                    onChange={(selectedOptions) =>
                      setFieldValue(
                        item.attribute_name,
                        selectedOptions ? selectedOptions.map(option => option) : []
                      )
                    }
                    onBlur={handleBlur}
                    isSearchable={true}
                    isClearable={true}
                    classNamePrefix="background"
                    isMulti
                  />
                </Col>
              </Row>
            ))}

            <Button type="submit">Submit</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
