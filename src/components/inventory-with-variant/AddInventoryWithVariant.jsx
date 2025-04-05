import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card, Table, Button, Form } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { useAddInventoryWithVariantMutation, useGetAllInventoryWithoutVariantQuery, useGetAllInventoryWithVariantQuery } from "../../redux/features/stockInventoryEndPoint";
import toast from "react-hot-toast";
import { AddInventoryWithVariantSchema } from "../../commondata/formvalidations";
import Loader from "../../layouts/layoutcomponents/loader";

const initialValues = {
  modelType: [],
  modelId: [],
  variant: [],
  image: [],
  sku: [],
  stock_quantity: [],
  mrp: [],
  selling_price: [],
  discount_percent: [],
  attribute: [],
  attribute_value: [],
  isOutOfStock: [],
};



function AddInventoryWithVariant() {
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
  })
  const [discount, setDiscount] = useState(true);
  const navigate = useNavigate();
  const [addInventoryWithVariant, { isLoading }] = useAddInventoryWithVariantMutation();
  const { data: getInventoryWithVariant, refetch } = useGetAllInventoryWithVariantQuery();
  const { data: getInventoryWithOutVariant, refetch: inventoryWithoutFetch } = useGetAllInventoryWithoutVariantQuery(queryParam);
  const location = useLocation();
  const formData = location.state.values || null;
  const ProductData = location.state.productData;
  const allAttributes = location.state.attributes;
  const [combinations, setCombinations] = useState([]);
  const [attributeValuesCombinations, setAttributeValuesCombinations] = useState([]);
  const attributesArray = Object.keys(formData);
  const selectedAttributesIds = attributesArray.map((attributeName) => {
    const attribute = allAttributes.find((attr) => attr.attribute_name === attributeName);
    return attribute ? attribute.id : null;
  });
  const attributeValuesArray = attributesArray.map(key => formData[key].map(item => item.value));

  const generateCombinations = (arrays, prefix = []) => {
    if (!arrays.length) {
      return [prefix];
    }
    const [firstArray, ...remainingArrays] = arrays;
    const combinations = [];
    firstArray.forEach(value => {
      const newPrefix = [...prefix, value];
      combinations.push(...generateCombinations(remainingArrays, newPrefix));
    });
    return combinations;
  };

  useEffect(() => {
    if (attributeValuesArray.length > 0) {
      const newCombinations = generateCombinations(attributeValuesArray);
      setAttributeValuesCombinations(newCombinations);
    }
  }, []);

  useEffect(() => {
    if (formData) {
      const keys = Object.keys(formData);
      if (keys.length > 0) {
        const newCombinations = [];
        const [firstKey, ...remainingKeys] = keys;
        formData[firstKey].forEach((value) => {
          newCombinations.push({ [firstKey]: value.label });
        });
        remainingKeys.forEach((key) => {
          const currentValues = formData[key];
          const tempCombinations = [];
          newCombinations.forEach((items) => {
            currentValues.forEach((value) => {
              tempCombinations.push({ ...items, [key]: value.label });
            });
          });
          newCombinations.length = 0;
          newCombinations.push(...tempCombinations);
        });
        setCombinations(newCombinations);
      }
    }
  }, [formData]);

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue, resetForm, setFieldError, setFieldTouched } = useFormik({
    initialValues: initialValues,
    validationSchema: AddInventoryWithVariantSchema,
    onSubmit: async (values) => {
      const formType = new FormData();
      combinations.forEach((items, index) => {
        const inventoryName = Object.values(items).join(" ");
        formType.append(`inventoryData[${index}][modelType]`, ProductData.type);
        formType.append(`inventoryData[${index}][modelId]`, ProductData.id);
        formType.append(`inventoryData[${index}][variant]`, inventoryName);
        formType.append(`inventoryData[${index}][sku]`, values.sku[index]);
        formType.append(`inventoryData[${index}][isOutOfStock]`, values.isOutOfStock[index]);
        formType.append(`inventoryData[${index}][mrp]`, values.mrp[index]);
        formType.append(`inventoryData[${index}][selling_price]`, values.selling_price[index]);
        formType.append(`inventoryData[${index}][stock_quantity]`, values.stock_quantity[index]);
        formType.append(`inventoryData[${index}][image]`, values.image[index] || '');
        formType.append(`inventoryData[${index}][discount_percent]`, values.discount_percent[index]);
        attributeValuesCombinations[index].forEach((attrValue, attrIndex) => {
          formType.append(`inventoryData[${index}][attribute_value][${attrIndex}]`, attrValue);
        });
        selectedAttributesIds.forEach(attributeId => {
          formType.append(`inventoryData[${index}][attribute]`, attributeId);
        });
      });
      try {
        const response = await addInventoryWithVariant(formType);
        if (response?.data?.http_status_code === 201) {
          toast.success(response.data.message);
          resetForm();
          refetch();
          inventoryWithoutFetch();
          // navigate(`/stocks/inventory`);
          navigate(-1)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleOfferPriceChange = (e, index) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setFieldValue(`selling_price[${index}]`, '');
      setFieldValue(`discount_percent[${index}]`, '');
      return;
    }
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      return;
    }
    const mrp = parseFloat(values.mrp[index]);
    const validSellingPrice = Math.min(Math.max(numericValue, 0), mrp);
    const discountPercent = calculateDiscountPercentage(mrp, validSellingPrice);
    setFieldValue(`selling_price[${index}]`, validSellingPrice);
    setFieldValue(`discount_percent[${index}]`, discountPercent);
  };

  const handleDiscountChange = (e, index) => {
    const inputValue = e.target.value;
    if (inputValue === '') {
      setFieldValue(`discount_percent[${index}]`, '');
      setFieldValue(`selling_price[${index}]`, '');
      return;
    }
    const numericValue = parseFloat(inputValue);
    if (isNaN(numericValue)) {
      return;
    }
    const validDiscountPercent = Math.min(Math.max(numericValue, 0), 100);
    const mrp = parseFloat(values.mrp[index]);
    const sellingPrice = calculateOfferPrice(mrp, validDiscountPercent);
    setFieldValue(`discount_percent[${index}]`, validDiscountPercent);
    setFieldValue(`selling_price[${index}]`, sellingPrice);
  };

  const handleIsOutOfStockChange = (e, index) => {
    const isChecked = e.target.checked;
    setFieldValue(`isOutOfStock[${index}]`, isChecked ? true : false);
    if (isChecked) {
      setFieldValue(`stock_quantity[${index}]`, 0);
      setFieldValue(`mrp[${index}]`, 0);
      setFieldValue(`selling_price[${index}]`, 0);
      setFieldValue(`discount_percent[${index}]`, 0);
      setFieldTouched(`stock_quantity[${index}]`, false, false);
      setFieldTouched(`mrp[${index}]`, false, false);
      setFieldTouched(`selling_price[${index}]`, false, false);
      setFieldTouched(`discount_percent[${index}]`, false, false);
      setFieldError(`stock_quantity[${index}]`, '');
      setFieldError(`mrp[${index}]`, '');
      setFieldError(`selling_price[${index}]`, '');
      setFieldError(`discount_percent[${index}]`, '');
    }
  };

  const calculateDiscountPercentage = (mrp, sellingPrice) => {
    if (mrp <= 0 || sellingPrice < 0) return 0;
    return Math.round(((mrp - sellingPrice) / mrp) * 100);
  };

  const calculateOfferPrice = (mrp, discountPercent) => {
    if (mrp <= 0 || discountPercent < 0) return mrp;
    return Math.round(mrp * (1 - discountPercent / 100));
  };

  return (
    <>
      {isLoading && <Loader />}
      <div>
        <PageHeader titles="Stocks-Inventory" active={["Add Inventory"]} items={["Home", "Inventory List"]} links={["/dashboard", "/stocks/inventory"]} />
        <Row>
          <Col>
            <Card>
              <Card.Body className="overflow-auto">
                <Form onSubmit={handleSubmit} className="form-custom-width">
                  <Table>
                    <thead>
                      <tr>
                        <th>Variant <span className="text-danger">*</span></th>
                        <th>Image <span className="text-danger">*</span></th>
                        <th>Out of Stock</th>
                        <th>SKU</th>
                        <th>Stock Quantity <span className="text-danger">*</span></th>
                        <th>MRP </th>
                        <th>Selling Price</th>
                        <th>Discount (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {combinations.map((item, index) => (
                        <tr key={index}>
                          <td>{Object.values(item).join(", ")}</td>
                          <td>
                            <Form.Control
                              type="file"
                              // accept="JPEG"
                              name={`image[${index}]`}
                              onChange={(e) => setFieldValue(`image[${index}]`, e.currentTarget.files[0])}
                              onBlur={handleBlur}
                              readOnly={values.isOutOfStock[index] ? true : false}
                            />
                            {errors.image && touched.image ? (
                              <p className="text-danger">{errors.image}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Check
                              type="checkbox"
                              name={`isOutOfStock[${index}]`}
                              checked={values.isOutOfStock[index]}
                              onChange={(e) => handleIsOutOfStockChange(e, index)}
                              onBlur={handleBlur}
                              className="d-flex justify-content-start ps-5 rounded-1"
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              name={`sku[${index}]`}
                              value={values.sku[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              readOnly={values.isOutOfStock[index] ? true : false}
                            />
                            {errors.sku && touched.sku ? (
                              <p className="text-danger">{errors.sku}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name={`stock_quantity[${index}]`}
                              value={values.stock_quantity[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              readOnly={values.isOutOfStock[index] ? true : false}
                              min={0}
                            />
                            {errors.stock_quantity && touched.stock_quantity ? (
                              <p className="text-danger">{errors.stock_quantity}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name={`mrp[${index}]`}
                              value={values.mrp[index]}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              min={0}
                              readOnly={values.isOutOfStock[index] ? true : false}
                            />
                            {errors.mrp && touched.mrp ? (
                              <p className="text-danger">{errors.mrp}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name={`selling_price[${index}]`}
                              value={values.selling_price[index]}
                              onChange={(e) => handleOfferPriceChange(e, index)}
                              onBlur={handleBlur}
                              min={0}
                              readOnly={values.isOutOfStock[index] ? true : false}
                            />
                            {errors.selling_price && touched.selling_price ? (
                              <p className="text-danger">{errors.selling_price}</p>
                            ) : null}
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              name={`discount_percent[${index}]`}
                              value={values.discount_percent[index]}
                              onChange={(e) => handleDiscountChange(e, index)}
                              onBlur={handleBlur}
                              min={0}
                              readOnly={values.isOutOfStock[index] ? true : false}
                            />
                            {errors.discount_percent && touched.discount_percent ? (
                              <p className="text-danger">{errors.discount_percent}</p>
                            ) : null}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Row className="justify-content-center">
                    <Button type="submit" className="w-auto">
                      Submit
                    </Button>
                  </Row>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </>
  );
}

export default AddInventoryWithVariant;
