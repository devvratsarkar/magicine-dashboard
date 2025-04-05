import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { EditInventoryWithoutVariantdatasValidation } from "../../commondata/formvalidations";
import { useLocation, useNavigate } from "react-router-dom";
import { useAddInventoryWithoutVariantMutation, useGetAllInventoryWithoutVariantQuery } from "../../redux/features/stockInventoryEndPoint";
import { getInventoryPage } from "../../utils/routes";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";

export default function AddInventoryWithoutVariant() {
  const location = useLocation()
  const navigate = useNavigate()
  const [queryParam, setQueryParam] = useState({
    medicinepage: "" || 1,
    medicinelimit: "" || 10,
    medicinesearch: "",
    productpage: "" || 1,
    productlimit: "" || 10,
    productsearch: "",
    equipmentpage: "" || 1,
    equipmentlimit: "" || 10,
    equipmentsearch: "",
    isOutOfStock: false
  })

  const [discount, setDiscount] = useState(true)
  const [addInventoryWithoutVariant, { isLoading }] = useAddInventoryWithoutVariantMutation()
  const { refetch } = useGetAllInventoryWithoutVariantQuery(queryParam)

  const initialValues = {
    sku: "",
    stock_quantity: "",
    mrp: "",
    selling_price: "",
    discount_percent: "",
    itemType: location?.state?.type,
    itemId: location?.state?.id,
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, } = useFormik({
    initialValues: initialValues,
    validationSchema: EditInventoryWithoutVariantdatasValidation,
    onSubmit: async (values) => {
      try {
        const response = await addInventoryWithoutVariant(values);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message)
          refetch()
          navigate(-1)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const calculateDiscountPercentage = () => {
    const mrp = parseFloat(values.mrp);
    const offerPrice = parseFloat(values.selling_price);
    if (!isNaN(mrp) && !isNaN(offerPrice)) {
      const difference = mrp - offerPrice
      const discountPercentage = (difference * 100) / mrp;
      const discountPercentageNumber = Number(discountPercentage);
      setFieldValue("discount_percent", discountPercentageNumber);
    } else {
      setFieldValue("discount_percent", '');
    }
  };

  const calculateOfferPrice = () => {
    const mrp = parseFloat(values.mrp);
    const discountPrice = parseFloat(values.discount_percent);
    if (!isNaN(mrp) && !isNaN(discountPrice)) {
      setDiscount(false);
      let selling_price = mrp - (mrp * discountPrice) / 100;
      selling_price = Number(selling_price);
      setFieldValue("selling_price", selling_price);
    } else {
      setFieldValue("selling_price", '');
    }
  };

  const handleOfferPriceChange = (e) => {
    let inputValue = e.target.value;
    const mrp = parseFloat(values.mrp);
    setDiscount(true)
    if (parseInt(inputValue) > mrp) {
      inputValue = mrp;
    }
    setFieldValue('selling_price', inputValue);
  };
  const handleDiscountChange = (e) => {
    let inputValue = e.target.value;
    if (parseInt(inputValue) > 100) {
      inputValue = '100';
    }
    setFieldValue('discount_percent', inputValue);
  };

  useEffect(() => {
    if (discount) {
      calculateDiscountPercentage();
    }
  }, [values.selling_price]);

  useEffect(() => {
    calculateOfferPrice();
  }, [values.mrp, values.discount_percent]);


  return (
    <>
      <PageHeader titles="Stocks-Inventory" active={["Add Inventory"]} items={["Home", "Inventory List"]} links={["/dashboard", "/stocks/inventory"]} />
      <Row>
        <Col>
          <Card>
            <Card.Body className="p-4">
              {isLoading ? <Loader /> : null}
              <Form onSubmit={handleSubmit}>
                <Row className="mb-4">
                  <Form.Group as={Col} md="6">
                    <Form.Label>SKU</Form.Label>
                    <Form.Control
                      type="text"
                      name="sku"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.sku}
                    />
                    {errors.sku && touched.sku ? (
                      <p className={`error`}>{errors.sku}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="6">
                    <Form.Label> Stock Quantity <span className="required_icon">*</span> </Form.Label>
                    <Form.Control
                      type="text"
                      name="stock_quantity"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.stock_quantity}
                    />
                    {errors.stock_quantity && touched.stock_quantity ? (
                      <p className={`error`}>{errors.stock_quantity}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row className="mb-4">
                  <Form.Group as={Col} md="4">
                    <Form.Label> MRP</Form.Label>
                    <Form.Control
                      type="text"
                      name="mrp"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.mrp}
                    />
                    {errors.mrp && touched.mrp ? (
                      <p className={`error`}>{errors.mrp}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label> Selling Price/Offer Price </Form.Label>
                    <Form.Control
                      type="text"
                      name="selling_price"
                      onChange={handleOfferPriceChange}
                      onBlur={handleBlur}
                      value={values.selling_price}
                    />
                    {errors.selling_price && touched.selling_price ? (
                      <p className={`error`}>{errors.selling_price}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label> Discount Percentage </Form.Label>
                    <Form.Control
                      type="text"
                      name="discount_percent"
                      onChange={handleDiscountChange}
                      onBlur={handleBlur}
                      value={values.discount_percent}
                    />
                    {errors.discount_percent && touched.discount_percent ? (
                      <p className={`error`}>{errors.discount_percent}</p>
                    ) : null}
                  </Form.Group>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group controlId="isOutOfStock">
                      <Form.Check
                        type="checkbox"
                        label="Out Of Stock"
                        name="isOutOfStock"
                        onChange={(e) => setFieldValue("isOutOfStock", e.target.checked)}
                        onBlur={handleBlur}
                        checked={values.isOutOfStock}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Button type="submit" className="btn-primary mx-auto w-auto">Update</Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
