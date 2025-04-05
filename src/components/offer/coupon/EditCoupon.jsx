import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import { useFormik } from "formik";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { AddCoupounSchema } from "../../../commondata/formvalidations";
import Select from "react-select";
import Error from "../../../layouts/layoutcomponents/Error";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useEditCouponMutation, useGetCategoryQuery, useGetCouponDataQuery, useGetProductMedicineEquipmentQuery, useGetSingleCouponQuery } from "../../../redux/features/catalogueEndPoints";
import toast from "react-hot-toast";
import axios from "axios";
import { useGetCurrencyQuery } from "../../../redux/features/globalSettingEndPoints";

export default function EditCoupon() {
  const location = useLocation()
  const navigate = useNavigate()
  const { id } = useParams();
  const [productId, setProductId] = useState("")
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: refechSingleItems } = useGetSingleCouponQuery(id, { refetchOnMountOrArgChange: true });

  const coupon = data?.data?.coupons;

  const { data: exchangeate, isLoading: loadingExchangeRate } = useGetCurrencyQuery()
  const usdConversionRate = exchangeate?.data?.conversion_rate


  const [editCoupon, { isLoading: loading }] = useEditCouponMutation()
  const { refetch } = useGetCouponDataQuery()

  const { data: everything, isLoading: loadingEverything } = useGetProductMedicineEquipmentQuery()

  const [query, setQuery] = useState({
    status: "",
    type: ""
  })

  const { data: categoriesData, isLoading: categoriesDataLoading } = useGetCategoryQuery(query)

  const activeCategory = categoriesData?.data?.activeCategories
  const everthingAll = everything?.data


  const searchProductOptions = Array.isArray(everthingAll) && everthingAll?.length > 0 ? everthingAll?.map((item) => ({
    value: item.id,
    label: item.product_name,
  })) : []


  const searchCategoryOptions = Array.isArray(activeCategory) && activeCategory?.length > 0 ? activeCategory?.map((item) => ({
    value: item.id,
    label: item.category_name,
  })) : []

  const [exchangeRates, setExchangeRates] = useState({});
  const initialValues = {
    couponCode: "",
    couponType: "",
    value: 0,
    number_coupon: "",
    expirey_date: "",
    start_date: "",
    minimum_cart_value: "",
    status: true,
    usd: 0,
    description: "",
    categories: "",
    products: {},
    first_time: false
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddCoupounSchema,
    onSubmit: async (values) => {
      values.couponType = values.couponType.value
      try {
        const response = await editCoupon({ couponId: id, couponData: values });
        console.log(response);
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          refechSingleItems()
          navigate("/coupon")
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


  useEffect(() => {
    refechSingleItems();
  }, []);


  useEffect(() => {
    if (coupon) {

      setFieldValue('couponCode', coupon?.couponCode)
      setFieldValue('couponType', { value: coupon?.couponType, label: coupon?.couponType });
      setFieldValue('value', coupon?.value)
      setFieldValue('number_coupon', coupon?.number_coupon)
      if (coupon?.expirey_date) {
        const dateTimeParts = coupon.expirey_date.split(" at ");
        const dateParts = dateTimeParts[0].split("-");
        const timePart = dateTimeParts[1];

        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const timeMatch = timePart.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
        let hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3];

        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

        const dateTimeValue = `${formattedDate}T${formattedTime}`;

        setFieldValue("expirey_date", dateTimeValue);
      }
      if (coupon?.start_date) {
        const dateTimeParts = coupon.start_date.split(" at ");
        const dateParts = dateTimeParts[0].split("-");
        const timePart = dateTimeParts[1];

        const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;

        const timeMatch = timePart.match(/(\d{1,2}):(\d{2})\s(AM|PM)/);
        let hours = parseInt(timeMatch[1], 10);
        const minutes = timeMatch[2];
        const ampm = timeMatch[3];

        if (ampm === "PM" && hours < 12) hours += 12;
        if (ampm === "AM" && hours === 12) hours = 0;

        const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

        const dateTimeValue = `${formattedDate}T${formattedTime}`;

        setFieldValue("start_date", dateTimeValue);
      }
      setFieldValue('minimum_cart_value', coupon?.minimum_cart_value)
      setFieldValue('status', coupon?.status)
      setFieldValue('usd', coupon?.usd)
      setFieldValue('description', coupon?.description)
      setFieldValue('products', coupon?.products)
      setFieldValue('categories', coupon?.categories)
      setFieldValue('first_time', coupon?.first_time)
      setProductId(coupon?.products?.id);
    }
  }, [coupon]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const response = await axios.get('https://open.er-api.com/v6/latest/INR');
        setExchangeRates(response?.data?.rates);
      } catch (error) {
        console.log('error on currency conversion', error);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    if (exchangeRates && values.value) {
      const usdRate = exchangeRates['USD'];
      const euroRate = exchangeRates['EUR'];
      const gbpRate = exchangeRates['GBP'];

      if (values.couponType.value == "fixed" || values.couponType == "fixed") {
        if (usdRate) setFieldValue('usd', (values.value * usdConversionRate).toFixed(2));
      } else if (values.couponType.value == "percentage" || values.couponType == "percentage") {
        if (usdRate) setFieldValue('usd', 0);
      }
    }
  }, [values.value, exchangeRates, setFieldValue]);


  const cuponValueDat = () => {
    if (values.couponType.value == "fixed" || values.couponType == "fixed") {
      return (
        <>
          {
            loadingExchangeRate && <Loader /> || loadingEverything && <Loader /> || categoriesDataLoading && <Loader />
          }
          <Row className="mb-4">
            <Form.Group as={Col} md="6">
              <Form.Label>
                Value <span className="required_icon">*</span>
              </Form.Label>
              <Row className="px-3">
                <Col as={Col} xxl={2} md={3} className="p-0">
                  <Form.Control
                    name="currency_type"
                    type="text"
                    value={`INR`}
                    className="select_currency"
                    readOnly
                  />
                </Col>
                <Col as={Col} xxl={10} md={9} className="p-0">
                  <Form.Control
                    name="value"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.value}
                    className="coupon_value"
                  />
                </Col>
              </Row>
              {errors.value && touched.value ? (
                <p className={`error`}>{errors.value}</p>
              ) : null}
            </Form.Group>
            <Form.Group as={Col} md={6}>
              <Form.Label>USD</Form.Label>
              <Form.Control type="number" name="usd" value={values.usd} readOnly />
            </Form.Group>
          </Row>
        </>
      )
    }
    else if (values.couponType.value == "percentage" || values.couponType == "percentage") {
      return (
        <>
          <Row className="mb-4">
            <Form.Group as={Col} md="6">
              <Form.Label>
                Value (%) <span className="required_icon">*</span>
              </Form.Label>
              <Form.Control
                type="number"
                name="value"
                value={values.value}
                onChange={handleChange}
                onBlur={handleBlur}

              />
              {errors.value && touched.value ? (
                <p className={`error`}>{errors.value}</p>
              ) : null}
            </Form.Group>
          </Row>

        </>
      )
    }
  }

  useEffect(() => {
    refetch()
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
        <Row>
          <Col>
            <PageHeader titles="Coupon" active={["Edit Coupon / "]} items={["Home", "Coupon List"]} links={["/dashboard", "/coupon/"]} />
          </Col>
          <Col className="d-flex justify-content-end align-items-center">
            <Link className="btn btn-success text-white me-3" to={"/coupon"}>
              View All Coupons
            </Link>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
            <Card>
              <Card.Header>
                <h3 className="card-title">Edit Coupon</h3>
              </Card.Header>
              <Card.Body className="add_new_product">
                {loading && <Loader />}
                <Form onSubmit={(e) => {
                  e.preventDefault();
                  handleSubmit();
                  handleScrollToError();
                }}>
                  {isLoading && <Loader />}
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Coupon Code <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="couponCode"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.couponCode}
                      />
                      {errors.couponCode && touched.couponCode ? (
                        <p className={`error`}>{errors.couponCode}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Coupon Type <span className="required_icon">*</span>
                      </Form.Label>
                      <Select
                        name="couponType"
                        onChange={(selectedOption) => setFieldValue("couponType", selectedOption)}
                        onBlur={handleBlur}
                        value={values.couponType}
                        options={[
                          { value: "fixed", label: "Fixed" },
                          { value: "percentage", label: "Percentage" },
                        ]}
                      />
                      {errors.couponType && touched.couponType ? (
                        <p className={`error`}>{errors.couponType}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  {cuponValueDat()}
                  <Row className="mb-4">
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        No Of Coupons <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="number_coupon"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.number_coupon}
                      />
                      {errors.number_coupon && touched.number_coupon ? (
                        <p className={`error`}>{errors.number_coupon}</p>
                      ) : null}
                    </Form.Group>

                  </Row>
                  <Row>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Start Date
                      </Form.Label>
                      <div className="wd-200 mg-b-30">
                        <input
                          type="datetime-local"
                          className="form-control fc-datepicker"
                          placeholder="MM/DD/YYYY"
                          name="start_date"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.start_date}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>
                        Expiry Date <span className="required_icon">*</span>
                      </Form.Label>
                      <div className="wd-200 mg-b-30">
                        <input
                          type="datetime-local"
                          className="form-control fc-datepicker"
                          placeholder="MM/DD/YYYY"
                          name="expirey_date"
                          onChange={handleChange}
                          onBlur={handleBlur}
                          value={values.expirey_date}
                          min={new Date().toISOString().split('T')[0]}
                        />
                      </div>
                      {errors.expirey_date && touched.expirey_date ? (
                        <p className={`error`}>{errors.expirey_date}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row>
                    <Form.Group as={Col} md={6}>
                      <Form.Label>
                        Minimum Cart Value <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="number"
                        name="minimum_cart_value"
                        value={values.minimum_cart_value}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.minimum_cart_value && touched.minimum_cart_value ? (
                        <p className="error"> {errors.minimum_cart_value}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="6">
                      <Form.Label>Status</Form.Label>
                      <Form.Select
                        name="status"
                        value={values.status}
                        onChange={(e) => {
                          const newStatus = e.target.value === "true";
                          handleChange({
                            target: {
                              name: "status",
                              value: newStatus,
                            },
                          });
                        }}
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </Form.Select>
                    </Form.Group>
                  </Row>
                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Description</Form.Label>
                        <textarea
                          name="description"
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="border border-2 border-black rounded-3 w-100"
                          rows={5}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6}>
                      <Form.Label>Products</Form.Label>
                      <Select
                        name="products"
                        value={searchProductOptions.find(option => option.value === productId) || null}
                        options={searchProductOptions}
                        isSearchable
                        placeholder="Select product"
                        onChange={(selectedOption) => {
                          setProductId(selectedOption.value);
                          const selectedProduct = everthingAll.find(item => item.id === parseInt(selectedOption.value));
                          if (selectedProduct) {
                            setFieldValue("products", { type: selectedProduct.type, id: selectedProduct.id });
                          }
                        }}
                        onBlur={handleBlur}
                        styles={{ menu: (provided) => ({ ...provided, maxHeight: '200px', overflowY: 'auto' }) }}
                      />
                    </Col>

                    <Col md={6}>
                      <Form.Label>Category</Form.Label>
                      <Select
                        name="categories"
                        value={searchCategoryOptions.find(option => option.value === values.categories) || null}
                        options={searchCategoryOptions}
                        isSearchable
                        placeholder="Select Category"
                        onChange={(selectedOption) => setFieldValue('categories', selectedOption.value)}
                        onBlur={handleBlur}
                        styles={{ menu: (provided) => ({ ...provided, maxHeight: '200px', overflowY: 'auto' }) }}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>First Time Apply</Form.Label>
                        <div className="ps-6">
                          <Form.Check
                            type="checkbox"
                            name="first_time"
                            checked={values.first_time}
                            onChange={(e) => setFieldValue("first_time", e.target.checked)}
                            onBlur={handleBlur}
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="w-100 justify-content-center mt-5">
                    <Button type="submit" className="w-auto">
                      Update
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
}
