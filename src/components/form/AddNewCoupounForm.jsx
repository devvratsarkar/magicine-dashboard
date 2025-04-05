import React, { useEffect, useState } from "react";
import { Button, Form, Row, Col } from "react-bootstrap";
import { useFormik } from "formik";
import { AddCoupounSchema } from "../../commondata/formvalidations";
import Select from "react-select";
import axios from "axios";
import { useAddNewCouponMutation, useGetCategoryQuery, useGetCouponDataQuery, useGetProductMedicineEquipmentQuery } from "../../redux/features/catalogueEndPoints";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from 'react-hot-toast';
import { useNavigate } from "react-router-dom";
import { useGetCurrencyQuery } from "../../redux/features/globalSettingEndPoints";

const initialValues = {
  couponCode: "",
  couponType: "",
  value: 0,
  number_coupon: "",
  expirey_date: "",
  minimum_cart_value: "",
  status: true,
  usd: 0,
  description: "",
  categories: "",
  products: {},
  first_time: false,
  start_date: ""
};

export default function AddNewCoupons() {

  const [query, setQuery] = useState({
    status: "",
    type: ""
  })

  const { data, isLoading: loading, refetch: refetchCurrency, isSuccess } = useGetCurrencyQuery()
  const [productId, setProductId] = useState("")
  const usdConversionRate = data?.data?.conversion_rate
  const navigate = useNavigate()
  const [exchangeRates, setExchangeRates] = useState({});
  const [addNewCoupon, { isLoading }] = useAddNewCouponMutation()
  const { data: everything, isLoading: loadingEverything } = useGetProductMedicineEquipmentQuery()
  const { data: categoriesData, isLoading: categoriesDataLoading } = useGetCategoryQuery(query)

  const activeCategory = categoriesData?.data?.activeCategories || [];
  const everthingAll = everything?.data || [];


  const searchProductOptions = Array.isArray(everthingAll) && everthingAll?.length > 0 ? everthingAll?.map((item) => ({
    value: item.id,
    label: item.product_name,
  })) : []


  const searchCategoryOptions = Array.isArray(activeCategory) && activeCategory?.length > 0 ? activeCategory?.map((item) => ({
    value: item.id,
    label: item.category_name,
  })) : []

  const { refetch } = useGetCouponDataQuery()
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, validateForm } = useFormik({
    initialValues: initialValues,
    validationSchema: AddCoupounSchema,
    onSubmit: async (values) => {
      values.couponType = values.couponType.value.toString()

      try {
        const response = await addNewCoupon(values);
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          resetForm()
          refetch()
          refetchCurrency()
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
      if (values.couponType.value == "fixed") {
        if (usdRate) setFieldValue('usd', values.value * usdConversionRate);
      } else {
        if (usdRate) setFieldValue('usd', 0);
      }
    }
  }, [values.value, exchangeRates, setFieldValue]);


  const couponValueData = () => {
    if (values.couponType.value == "fixed") {
      return (
        <>
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
              <Form.Control type="number" name="usd" value={(values.usd).toFixed(3)} readOnly />
            </Form.Group>
          </Row>
        </>
      )
    } else if (values.couponType.value == "percentage") {
      return (
        <>
          <Row className="mb-4">
            <Form.Group as={Col} md="6">
              <Form.Label>
                Value <span className="required_icon">*</span>
              </Form.Label>
              <Form.Control
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

  // const productMedicineEquipmentOption = everthingAll && everthingAll.map((item) => ({
  //   label: item?.product_name,
  //   value: item?.id
  // }));

  // const categoryOption = activeCategory && activeCategory?.map((item) => ({
  //   label: item?.category_name,
  //   value: item?.id
  // }))

  return (
    <>
      <Form onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
        handleScrollToError();
      }}>
        {isLoading && <Loader /> || loadingEverything && <Loader /> || categoriesDataLoading && <Loader />}
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
        {couponValueData()}
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
              value={values.status.toString()}
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
                className="border border-black-3 rounded-3 w-100"
                rows={5}
              />
            </Form.Group>
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
            Save
          </Button>
        </Row>
      </Form >
    </>
  );
}
