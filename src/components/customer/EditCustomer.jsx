import React, { useEffect, useState } from "react";
import { Button, Modal, Form, Row, Col, Card } from "react-bootstrap";
import { useFormik } from "formik";
import { AddCustomerForm, EditCustomerForm } from "../../commondata/formvalidations";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { Country, State, City } from "country-state-city";
import Select from "react-select";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEditUserMutation, useGetAllUsersQuery, useGetSingleUserQuery, useGetUserQuery } from "../../redux/features/customerDataEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import Error from "../../layouts/layoutcomponents/Error";
import moment from "moment/moment";
const initialValues = {
  name: "",
  phone_number: "",
  email: "",
  dob: "",
  address_line_one: "",
  address_line_two: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  profile_pic: null,
  status: "",
  gender: ""
};

export default function EditCustomer() {
  const { id } = useParams()
  const [showPassword, setShowPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const navigate = useNavigate()
  const [editUser, { isLoading: loading }] = useEditUserMutation()
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: refetchSingleUser } = useGetSingleUserQuery(id);
  const [queryParams, setQueryParams] = useState({
    name: '',
    email: '',
    country: '',
    fromDate: '',
    toDate: '',
  })
  const { refetch } = useGetAllUsersQuery(queryParams);
  const singleUser = data?.data?.user
  const singleUserAddress = data?.data?.user_address
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: EditCustomerForm,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      try {
        const response = await editUser({ userData: formData, userId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetchSingleUser()
          refetch()
          navigate('/customer')
        }
      } catch (error) {
        console.error(error);
      }
    },
  });


  const handleScrollToError = async () => {
    const formErrors = await validateForm();
    const errorFields = Object.keys(formErrors);

    if (errorFields.length > 0) {
      const errorElement = document.getElementsByName(errorFields[0])[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth' });
        errorElement.focus();
      }
    }
  };


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const toggleConfPasswordVisibility = () => {
    setShowConfPassword(!showConfPassword);
  };
  const countryOptions = Country.getAllCountries().map(country => ({
    label: country.name,
    value: country.name
  }));

  const selectedCountry = countryOptions.find(option => option.value === values.country);

  const country = Country.getAllCountries().find(country => country.name === values.country);
  const countryCode = country ? country.isoCode : null;

  const stateOptions = countryCode ? State.getStatesOfCountry(countryCode).map(state => ({
    label: state.name,
    value: state.name
  })) : [];

  useEffect(() => {
    if (isSuccess) {
      setFieldValue('name', singleUser?.name);
      setFieldValue('phone_number', singleUser?.phone_number);
      setFieldValue('email', singleUser?.email);
      setFieldValue('dob', singleUser?.dob ? moment(singleUser?.dob).format('YYYY-MM-DD') : "");
      setFieldValue('address_line_one', singleUserAddress?.address_line_one);
      setFieldValue('address_line_two', singleUserAddress?.address_line_two);
      setFieldValue('city', singleUserAddress?.city);
      setFieldValue('state', singleUserAddress?.state);
      setFieldValue('country', singleUserAddress?.country);
      setFieldValue('postal_code', singleUserAddress?.postal_code);
      setFieldValue('profile_pic', singleUser?.profile_pic);
      setFieldValue('status', singleUser?.status);
      setFieldValue('gender', singleUser?.gender);
    }
  }, [isSuccess])

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }

  if (isSuccess) {
    return (
      <>
        <Row className="align-items-center">
          <Col>
            <PageHeader titles="Edit New Customer" active="Edit new customer" items={["Home", "Customer List"]} links={['/dashboard', '/customer']} />
          </Col>
          <Col className="text-end">
            <Link to={`/customer`} className="btn btn-success text-white">
              Vew All Customer
            </Link>
          </Col>
        </Row>
        <Row>
          <Card>
            <Card.Header>
              <h3 className="card-title">Edit Customer</h3>
            </Card.Header>
            <Card.Body className="edit_product">
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                handleScrollToError();
              }}>
                {isLoading && <Loader /> || loading && <Loader />}
                <Row className="">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Full Name <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
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
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Phone No.<span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone_number"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.phone_number}
                    />
                    {errors.phone_number && touched.phone_number ? (
                      <p className={`error`}>{errors.phone_number}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Email ID<span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.email}
                    />
                    {errors.email && touched.email ? (
                      <p className={`error`}>{errors.email}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      DOB
                    </Form.Label>
                    <Form.Control
                      type="date"
                      name="dob"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.dob}
                      max={new Date().toISOString().split("T")[0]}
                      min="1900-01-01"
                    />
                  </Form.Group>
                </Row>
                <Row className="">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Country <span className="required_icon">*</span>
                    </Form.Label>
                    <Select
                      options={countryOptions}
                      name="country"
                      placeholder="Select Country"
                      onBlur={() => handleBlur("country")}
                      value={selectedCountry}
                      onChange={(selectedOption) => {
                        handleChange({ target: { name: "country", value: selectedOption.value } });
                        setFieldValue('state', '');
                      }} isSearchable
                    />
                    {errors.country && touched.country ? (
                      <p className="text-danger">{errors.country}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      State <span className="required_icon">*</span>
                    </Form.Label>
                    <Select
                      options={stateOptions}
                      name="state"
                      placeholder="Select State"
                      onBlur={() => handleBlur("state")}
                      value={stateOptions.find(option => option.value === values.state)}
                      onChange={(selectedOption) => handleChange({ target: { name: "state", value: selectedOption.value } })}
                      isSearchable
                    />
                    {errors.state && touched.state ? (
                      <p className='text-danger'> {errors.state}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      City<span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control name="city" value={values.city} onChange={handleChange} onBlur={handleBlur} />
                    {errors.city && touched.city ? (
                      <p className='text-danger'>{errors.city}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Zip/Postal Code <span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="postal_code"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.postal_code}
                    />

                    {errors.postal_code && touched.postal_code ? (
                      <p className='text-danger'>{errors.postal_code}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Address Line 1<span className="required_icon">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address_line_one"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address_line_one}
                    />
                    {errors.address_line_one && touched.address_line_one ? (
                      <p className='text-danger'>{errors.address_line_one}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Address Line 2
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="address_line_two"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.address_line_two}
                    />
                    {errors.address_line_two && touched.address_line_two ? (
                      <p className={errors}>{errors.address_line_two}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="">
                  <Form.Group as={Col} md="6">
                    <Form.Label className="text-start">
                      Photo (JPG,JPEG,PNG, 2MB Max)
                    </Form.Label>
                    <Form.Control
                      type="file"
                      name="profile_pic"
                      onChange={(e) => setFieldValue('profile_pic', e.target.files[0])}
                      onBlur={handleBlur}
                      accept=".jpg,.jpeg,.png,.webp"
                    />
                    {errors.profile_pic && touched.profile_pic ? (
                      <p className={errors}>{errors.profile_pic}</p>
                    ) : null}
                  </Form.Group>
                  <Col as={Col} md={6}>
                    <Form.Label>Gender <span className="text-danger">*</span></Form.Label>
                    <Form.Select
                      name="gender"
                      value={values.gender}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      <option >Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </Form.Select>
                  </Col>
                </Row>
                <Row>
                  <Col as={Col} md={6}>
                    <Form.Group as={Col} md={6}>
                      <Form.Label>Status</Form.Label>
                      <label className="custom-switch">
                        <input
                          type="checkbox"
                          name="status"
                          className="custom-switch-input"
                          onChange={() => setFieldValue('status', !values.status)}
                          onBlur={handleBlur}
                          value={values.status}
                          checked={values.status}
                        />
                        <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                      </label>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="my-2">
                  <Col as={Col}>Do you want to change password?</Col>
                  <Col as={Col}>
                    <Form.Check
                      onChange={() => setShowPasswordFields(!showPasswordFields)}
                      value={showPasswordFields}
                    />
                  </Col>
                </Row>
                {showPasswordFields && (
                  <Row className="">
                    <Form.Group as={Col} md="6">
                      <Form.Label className="text-start">
                        Password
                      </Form.Label>
                      <div className="input-icon">
                        <span
                          className="input-icon-addon pe-auto text-black-50"
                          style={{ cursor: "pointer" }}
                          onClick={togglePasswordVisibility}
                        >
                          {showPassword ? (
                            <i className="fa fa-eye eye_icon"></i>
                          ) : (
                            <i className="fa fa-eye-slash eye_icon"></i>
                          )}
                        </span>
                        <Form.Control
                          type={showPassword ? "type" : "password"}
                          name="password"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password}
                        />
                      </div>
                      {errors.password && touched.password ? (
                        <p className={`error`}>{errors.password}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label className="text-start">
                        Confirm Password
                      </Form.Label>
                      <div className="input-icon">
                        <span
                          className="input-icon-addon pe-auto text-muted"
                          style={{ cursor: "pointer" }}
                          onClick={toggleConfPasswordVisibility}
                        >
                          {showConfPassword ? (
                            <i className="fa fa-eye eye_icon"></i>
                          ) : (
                            <i className="fa fa-eye-slash eye_icon"></i>
                          )}
                        </span>
                        <Form.Control
                          type={showConfPassword ? "type" : "password"}
                          name="password_confirmation"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.password_confirmation}
                        />
                      </div>
                      {errors.password_confirmation && touched.password_confirmation ? (
                        <p className={`error`}>{errors.password_confirmation}</p>
                      ) : null}
                    </Form.Group>
                  </Row>)}
                <Row className="mt-4">
                  <Button type="submit" className="btn-primary mx-auto w-auto">Update</Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Row >
      </>
    );
  }
}
