import React, { useEffect, useState } from "react";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import { Row, Col, Card, Table, Button } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { useFormik } from "formik";
// import { AddInventoryWithVariantSchema } from "../../commondata/formvalidations";

const initialValues = {
  variant: [],
  image: [],
  sku: [],
  stock_quantity: [],
  mrp: [],
  selling_price: [],
};

function ListVariantEdit() {
  const location = useLocation();
  const formData = location.state;

  const [combinations, setCombinations] = useState([]);

  useEffect(() => {
    if (formData && formData.size && formData.tags) {
      const sizeOptions = formData.size.map((option) => option.value);
      const tagsOptions = formData.tags.map((option) => option.value);

      const newCombinations = [];
      sizeOptions.forEach((size) => {
        tagsOptions.forEach((tags) => {
          newCombinations.push({ size, tags });
        });
      });

      setCombinations(newCombinations);
    }
  }, [formData]);

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    setFieldValue,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: "",
    onSubmit: async (values) => {
      const inventoryData = combinations.map((combination, index) => {
        return {
          variant:
            combination.size + " " + combination.tags + " " + formData.strength,
          image: values.image[index],
          sku: values.sku[index],
          stock_quantity: values.stock_quantity[index],
          mrp: values.mrp[index],
          selling_price: values.selling_price[index],
        };
      });
      console.log("Inventory Data:", inventoryData);
    },
  });

  return (
    <>
      <PageHeader
        titles="Stock-Inventory"
        active="Stock / add"
        items={["Home"]}
      />
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Header>
              <Card.Title as="h3"></Card.Title>
            </Card.Header>
            <Card.Body>
              <div className="table-responsive inventory_with_variant_form">
                <form onSubmit={handleSubmit}>
                  <Table className="variant_form">
                    <thead className="border-bottom">
                      <tr>
                        <td className="fw-bold">Variant</td>
                        <td className="fw-bold">Image</td>
                        <td className="fw-bold">SKU</td>
                        <td className="fw-bold">Stock Quantity</td>
                        <td className="fw-bold">MRP*</td>
                        <td className="fw-bold">Selling/Offer Price *</td>
                      </tr>
                    </thead>
                    <tbody>
                      {combinations.map((combination, index) => (
                        <tr key={index} className="border-bottom">
                          <td className="variant_field">
                            <input
                              type="text"
                              value={
                                combination.size +
                                " " +
                                combination.tags +
                                " " +
                                formData.strength
                              }
                              name={`variant[${index}]`}
                              readOnly
                            />
                          </td>
                          <td className="add_variant_image_field">
                            <label>(JPG,JPEG,PNG max size 1 MB)</label>
                            <input
                              type="file"
                              name={`image[${index}]`}
                              accept=".jpg,.jpeg,.png,.webp"
                              onChange={(event) =>
                                setFieldValue(
                                  `image[${index}]`,
                                  event.currentTarget.files[0]
                                )
                              }
                              onBlur={handleBlur}
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="text"
                              value={values.sku[index]}
                              name={`sku[${index}]`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              value={values.stock_quantity[index]}
                              name={`stock_quantity[${index}]`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              value={values.mrp[index]}
                              name={`mrp[${index}]`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              value={values.selling_price[index]}
                              name={`selling_price[${index}]`}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              required
                              className="variant_input_field"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                  <Row className="pb-2">
                    <Button
                      type="submit"
                      className="btn-primary mx-auto w-auto"
                    >
                      Update
                    </Button>
                  </Row>
                </form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ListVariantEdit;
