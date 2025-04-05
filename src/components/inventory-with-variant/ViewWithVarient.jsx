import React from "react";
import { Row, Col, Card, Table } from "react-bootstrap";
import { useParams } from "react-router-dom";
import { useGetInventoryVariantsQuery } from "../../redux/features/stockInventoryEndPoint";
import PageHeader from "../../layouts/layoutcomponents/pageheader";

function ViewWithVarient() {
  const { TYPE, ID } = useParams();
  const { data, refetch } = useGetInventoryVariantsQuery({ modelType: TYPE, modelId: ID });
  const singleProductVariants = data?.data || [];

  return (
    <>
      <PageHeader titles="Stock-Inventory" active="view" items={['Home', 'Inventory List']} links={["/dashboard", "/stocks/inventory"]} />
      <Row className="row-sm">
        <Col lg={12}>
          <Card>
            <Card.Body>
              <div className="table-responsive inventory_with_variant_form">
                <form>
                  <Table className="variant_form">
                    <thead className="border-bottom">
                      <tr>
                        <th>Variant<span className="text-danger">*</span></th>
                        <th>Image<span className="text-danger">*</span></th>
                        <th>Sku<span className="text-danger">*</span></th>
                        <th>Stock<span className="text-danger">*</span></th>
                        <th>MRP<span className="text-danger">*</span></th>
                        <th>Selling Price<span className="text-danger">*</span></th>
                        <th>Discount (%)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {singleProductVariants.map((variant, indec) => (
                        <tr key={indec} className="border-bottom">
                          <td className="variant_field">
                            <input
                              type="text"
                              name={`variant_${variant?.variant}`}
                              value={variant?.variant}
                              readOnly
                            />
                          </td>
                          <td className="add_variant_image_field">
                            <img src={variant.image} alt="variant" width={50} height={50} />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="text"
                              defaultValue={variant.sku}
                              name={`sku_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.stock_quantity}
                              name={`stock_quantity_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.mrp}
                              name={`mrp_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.selling_price}
                              name={`selling_price_${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                          <td className="boxed-content">
                            <input
                              type="number"
                              defaultValue={variant.discount_percent}
                              name={`discount_percent${variant._id}`}
                              readOnly
                              className="variant_input_field"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </form>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default ViewWithVarient;
