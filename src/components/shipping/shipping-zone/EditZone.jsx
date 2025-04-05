import axios from "axios";
import { useFormik } from "formik";
import React, { useEffect } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import MultiSelect from "react-multiple-select-dropdown-lite";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { AddZoneValidation } from "../../../commondata/formvalidations";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import Select from "react-select";
import { useAddNewZoneMutation, useEditZoneMutation, useGetAllCountryListQuery, useGetAllZonesQuery } from "../../../redux/features/shippingZoneEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";


export default function EditZone() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  const [editZone, { isLoading }] = useEditZoneMutation();
  const { data: country } = useGetAllCountryListQuery();
  const { refetch } = useGetAllZonesQuery();
  const allCountryList = country?.data;
  const dispatch = useDispatch();


  const initialValues = {
    name: data?.name || '',
    status: "",
    country_id: [],
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: AddZoneValidation,
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        const selectedCountry = values?.country_id.map(items => items.value);
        values.country_id = selectedCountry;
        values.status = values.status;
        const response = await editZone({ zoneData: values, zoneId: data?._doc?.id });
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message);
          dispatch(closeModal());
          refetch();
        }
        else {
          dispatch(closeModal())
        }
      } catch (error) {
        toast.error(error.message)
      }
    },
  });

  useEffect(() => {
    setFieldValue("name", data?._doc?.name)
    setFieldValue("status", data?._doc?.status)
    setFieldValue('country_id', data && data?.countries.map(country => ({
      value: country?.country_id?.id,
      label: country?._doc?.country_name,
    })))
  }, []);

  const country_options = country ? allCountryList?.map(item => ({
    value: item?.id,
    label: item?.name
  })) : [];

  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-center mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">Edit Zone </Modal.Title>
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
                <Form.Select
                  name="status"
                  value={values.status}
                  onChange={(e) => setFieldValue("status", e.target.value)}
                  onBlur={handleBlur}
                >
                  <option>Select</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </Form.Select>
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
