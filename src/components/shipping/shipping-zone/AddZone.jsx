import axios from "axios";
import { useFormik } from "formik";
import React from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { AddZoneValidation } from "../../../commondata/formvalidations";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Select from "react-select";
import { useAddNewZoneMutation, useGetAllCountryListQuery, useGetAllZonesQuery } from "../../../redux/features/shippingZoneEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";

const initialValues = {
  name: "",
  status: null,
  country_id: [],
};

export default function AddZone() {
  const { isOpen } = useSelector((state) => state.allCommonModal)
  const [addNewZone, { isLoading }] = useAddNewZoneMutation()
  const { data: country } = useGetAllCountryListQuery()
  const { refetch } = useGetAllZonesQuery()
  const allCountryList = country?.data
  const dispatch = useDispatch()
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: AddZoneValidation,
    onSubmit: async (values) => {
      try {
        const selectedCountry = values?.country_id.map(items => items.value)
        values.country_id = selectedCountry
        values.status = values.status.value;
        // setFieldValue('country_id', '')
        const response = await addNewZone(values);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message)
          dispatch(closeModal())
          refetch()
        } else {
          dispatch(closeModal())
        }
      } catch (error) {
        toast.error(error.message)
      }
    },
  });

  const country_options = country ? allCountryList?.map(item => ({
    value: item?.id,
    label: item?.name
  })) : [];
  const status_option = [
    { value: "true", label: "Active" },
    { value: "false", label: "Inactive" },
  ];

  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center"> Add Zone </Modal.Title>
        </Modal.Header>
        <Button onClick={() => dispatch(closeModal())} className="btn-close position-absolute end-0 p-3" variant="" ><i className="fe fe-x fw-bolder"></i></Button>
        <Modal.Body className="p-2">
          <Form className="border rounded-2 p-2" onSubmit={handleSubmit} >
            {isLoading && <Loader />}
            <Row className="pb-3">
              <Col as={Col} md="6">
                <Form.Group>
                  <Form.Label> Name <span className="required_icon">*</span> </Form.Label> <Form.Control
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name ? (
                    <p className={`error`}>{errors.name}</p>
                  ) : null}
                </Form.Group>
              </Col>
              <Col as={Col} md="6">
                <Form.Label> Status<span className="required_icon">*</span> </Form.Label>
                <Select
                  options={status_option}
                  value={values.status}
                  onChange={(selected) => setFieldValue("status", selected)}
                  onBlur={handleBlur("status")}
                  labelledBy="Select"
                  disableSearch={true}
                />
                {errors.status && touched.status && (
                  <div className="error">{errors.status}</div>
                )}
              </Col>
            </Row>
            <Row className="pb-3">
              <Col as={Col} md="12">
                <Form.Label>Country<span className="required_icon">*</span></Form.Label>

                <Select
                  options={country_options}
                  value={values.country_id}
                  onChange={(selected) => setFieldValue("country_id", selected)}
                  onBlur={handleBlur}
                  isSearchable={true}
                  isMulti
                />
                {errors.country_id && touched.country_id && (
                  <div className="error">{errors.country_id}</div>
                )}
              </Col>
            </Row>
            <Row className="text-end">
              <Col>
                <Button type="submit">Submit</Button>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>

    </>
  );
}
