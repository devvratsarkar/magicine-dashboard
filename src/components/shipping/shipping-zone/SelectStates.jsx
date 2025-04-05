import React, { useState } from "react";
import { Button, Col, Form, Modal, Row } from "react-bootstrap";
import "react-multiple-select-dropdown-lite/dist/index.css";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../../redux/slices/allModalSlice";
import { useFormik } from "formik";
import { useEditCountryStatesMutation, useGetAllZonesQuery } from "../../../redux/features/shippingZoneEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";

export default function SelectState() {
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  console.log("data", data)
  const dispatch = useDispatch();
  const [countryStatesData, { isLoading }] = useEditCountryStatesMutation();
  const { refetch } = useGetAllZonesQuery();
  const avlStates = data?._doc?.states || [];
  const [searchTerm, setSearchTerm] = useState("");

  const initialValues = {
    states: avlStates,
  };

  const { values, handleBlur, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: "",
    onSubmit: async (values) => {
      try {
        const response = await countryStatesData({ countryStatesData: values, countryId: data?._doc?.id });
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message);
          refetch();
          dispatch(closeModal());
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    if (checked) {
      setFieldValue("states", [...values.states, value]);
    } else {
      setFieldValue("states", values.states.filter((state) => state !== value));
    }
  };

  const filteredStates = data?.country_id?.states?.filter((state) =>
    state.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Modal show={isOpen}>
        <Modal.Header className="justify-content-start mx-2">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-start">
            States
          </Modal.Title>
        </Modal.Header>
        <Button className="btn-close position-absolute end-0 p-3" variant="" onClick={() => dispatch(closeModal())}>
          <i className="fe fe-x fw-bolder"></i>
        </Button>
        <Modal.Body className="p-2">
          <Form onSubmit={handleSubmit}>
            {isLoading && <Loader />}
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Search states..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="mb-3"
              />
              {filteredStates?.map((value, index) => (
                <Form.Check
                  type="checkbox"
                  id={`stateCheckbox-${index}`}
                  key={index}
                  label={value}
                  value={value}
                  checked={values.states.includes(value)}
                  onChange={handleCheckboxChange}
                  onBlur={handleBlur}
                  className="my-1 background-color-secoundary px-5 py-1 rounded-1"
                />
              ))}
            </Form.Group>
            <Row className="mb-1 mt-3">
              <Col className="text-end"><Button className="btn btn-primary" type="submit">Update</Button></Col>
            </Row>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
