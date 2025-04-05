import React, { useEffect, useRef, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { useFormik } from "formik";
import { EditInventoryWithoutVariantdatasValidation } from "../../commondata/formvalidations";
import { useNavigate, useParams } from "react-router-dom";
import { useEditInventoryWithoutVariantMutation, useGetAllInventoryWithoutVariantQuery, useGetSingleInventoryWithoutVariantQuery } from "../../redux/features/stockInventoryEndPoint";
import { getInventoryPage } from "../../utils/routes";
import Loader from "../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useUpdateCartPriceMutation } from "../../redux/features/productEndPoints";

const initialValues = {
  sku: "",
  stock_quantity: "",
  mrp: "",
  selling_price: "",
  discount_percent: "",
  isOutOfStock: false
};

export default function EditInventoryWithoutVariant() {
  const debounceTimeout = useRef(null);
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
  });
  const { id } = useParams();
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(true);
  const [editInventoryWithoutVariant, { isLoading }] = useEditInventoryWithoutVariantMutation();
  const [UpdateCartPrice, { isSuccess: updateCartPriceSuccess }] = useUpdateCartPriceMutation();

  const { refetch } = useGetAllInventoryWithoutVariantQuery(queryParam);
  const { data, isError, error, isLoading: loading, isFetching, isSuccess, refetch: inventoryWithoutVariantId } = useGetSingleInventoryWithoutVariantQuery(id);
  const singleInventoryWithoutVarientData = data?.data;

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue } = useFormik({
    initialValues: initialValues,
    validationSchema: EditInventoryWithoutVariantdatasValidation,
    onSubmit: async (values) => {
      try {
        const response = await editInventoryWithoutVariant({ inventoryWithoutVarientData: values, inventoryWithoutVarientId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message);
          refetch();
          inventoryWithoutVariantId();

          const cartData = {
            product_id: singleInventoryWithoutVarientData?.itemId?.id,
            type: singleInventoryWithoutVarientData?.itemType
          };
          navigate(-1);
          await UpdateCartPrice(cartData);
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const calculateDiscountPercentage = () => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const mrp = parseFloat(values.mrp);
      const offerPrice = parseFloat(values.selling_price);
      if (!isNaN(mrp) && !isNaN(offerPrice)) {
        const difference = mrp - offerPrice;
        const discountPercentage = (difference * 100) / mrp;
        setFieldValue("discount_percent", Number(discountPercentage));
      } else {
        setFieldValue("discount_percent", '');
      }
    }, 600);
  };

  const calculateOfferPrice = () => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      const mrp = parseFloat(values.mrp);
      const discountPrice = parseFloat(values.discount_percent);
      if (!isNaN(mrp) && !isNaN(discountPrice)) {
        setDiscount(false);
        let selling_price = mrp - (mrp * discountPrice) / 100;
        setFieldValue("selling_price", Number(selling_price).toFixed(2));
      } else {
        setFieldValue("selling_price", '');
      }
    }, 600);
  };

  const handleOfferPriceChange = (e) => {
    let inputValue = e.target.value;
    const mrp = parseFloat(values.mrp);
    setDiscount(true);
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

  useEffect(() => {
    if (singleInventoryWithoutVarientData) {
      setFieldValue('sku', singleInventoryWithoutVarientData?.sku || '');
      setFieldValue('stock_quantity', singleInventoryWithoutVarientData?.stock_quantity || '');
      setFieldValue('mrp', singleInventoryWithoutVarientData?.mrp || '');
      setFieldValue('selling_price', singleInventoryWithoutVarientData?.selling_price || '');
      setFieldValue('isOutOfStock', singleInventoryWithoutVarientData?.isOutOfStock || false);
      setFieldValue('discount_percent', singleInventoryWithoutVarientData?.discount_percent?.toFixed(2) || '');
    }
  }, [singleInventoryWithoutVarientData]);

  if (isError) {
    return <Error error_mes={error} />;
  }

  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <>
      <Row>
        <Col>
          <PageHeader titles="Stocks-Inventory" active={["Edit Inventory"]} items={["Home", "Inventory List"]} links={["/dashboard", handleBackClick]} />
        </Col>
      </Row>
      <Row>
        <Col>
          <Card>
            <Card.Body className="p-4">
              {loading || isFetching || isLoading ? <Loader /> : null}
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
                      min={0}
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
                      min={0}
                    />
                    {errors.mrp && touched.mrp ? (
                      <p className={`error`}>{errors.mrp}</p>
                    ) : null}
                  </Form.Group>
                  <Form.Group as={Col} md="4">
                    <Form.Label> Selling Price/Offer Price</Form.Label>
                    <Form.Control
                      type="text"
                      name="selling_price"
                      onChange={handleOfferPriceChange}
                      onBlur={handleBlur}
                      value={values.selling_price}
                      min={0}
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
                      value={values?.discount_percent}
                      min={0}
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