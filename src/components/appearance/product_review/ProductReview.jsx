import React from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useFormik } from "formik";
import Select from "react-select";
import slugify from "slugify";
import { useAddProductReviewMutation, useGetProductMedicineEquipmentQuery, useGetReviewsDataQuery } from "../../../redux/features/catalogueEndPoints";
import SunEditor from "suneditor-react";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import { useGetUserQuery } from "../../../redux/features/customerDataEndPoints";
import { useNavigate } from "react-router-dom";
import { ReviewValidations } from "../../../commondata/formvalidations";
import toast from "react-hot-toast";
import { TouchAppRounded } from "@mui/icons-material";


export default function ProductReview() {
  const navigate = useNavigate()
  const [addReview, { isLoading }] = useAddProductReviewMutation();
  const { data: products } = useGetProductMedicineEquipmentQuery();
  const { refetch } = useGetReviewsDataQuery()
  const { data: getUsers } = useGetUserQuery()

  const initialValues = {
    modelType: "",
    product: "",
    slug: "",
    customer: "",
    star_rating: "",
    status: "",
    youtube_video_link: "",
    images: "",
    text_content: "",
  };

  const {
    values,
    errors,
    handleBlur,
    handleChange,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
  } = useFormik({
    initialValues: initialValues,
    validationSchema: ReviewValidations,
    onSubmit: async (values) => {
      console.log(values);
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'images') {
          value.forEach(file => {
            formData.append('images', file);
          });
        } else {
          formData.append(key, value);
        }
      });
      try {
        const response = await addReview(formData);
        console.log(response);
        if (response?.data?.http_status_code === 201) {
          toast.success(response?.data?.message);
          refetch();
          navigate('/reviews')

        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleReviewImage = (event) => {
    const files = Array.from(event.target.files);
    setFieldValue("images", files);
  };

  const productData = products?.data || [];
  const Productoptions = productData.map((item) => ({
    value: item.id,
    label: item.product_name,
    type: item.type,
  }));

  const userData = getUsers?.data?.users || [];
  const customerOptions = userData?.filter((user) => user.name).map((user) => ({
    value: user.id,
    label: user.name,
  }));

  const generateSlug = (selectedOption) => {
    if (selectedOption) {
      const slug = slugify(selectedOption.label, { lower: true });
      setFieldValue("slug", slug);
      setFieldValue("name", selectedOption.label);
      setFieldValue("modelType", selectedOption.type);
    }
  };

  return (
    <div>
      <Row className="align-items-center">
        <Col className="text-start">
          <PageHeader
            titles="Product Review"
            active="Add Product Review"
            items={["Home", "Product Review"]}
            links={["/dashboard", "/reviews"]}
          />
        </Col>
      </Row>
      <Row>
        <Col md={12} lg={12}>
          <Card>
            <Card.Body className="add_new_product">
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Product <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        options={Productoptions}
                        name="product"
                        value={Productoptions.find(option => option.value === values.product)}
                        onChange={(selectedOption) => {
                          setFieldValue("product", selectedOption.value);
                          generateSlug(selectedOption);
                        }}
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Search product..."
                      />
                      {errors.product && (
                        <p className="error">{errors.product}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Slug <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="text"
                        name="slug"
                        value={values.slug}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.slug && (
                        <p className="error">{errors.slug}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Customer Name <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        options={customerOptions}
                        name="customer"
                        value={customerOptions.find(option => option.value === values.customer)}
                        onChange={(selectedOption) =>
                          setFieldValue("customer", selectedOption.value)
                        }
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Search Customers..."
                      />
                      {errors.customer && (
                        <p className="error">{errors.customer}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Start Rating <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        name="star_rating"
                        type="text"
                        value={values.star_rating}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.star_rating && (
                        <p className="error">{errors.star_rating}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Status <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Select
                        name="status"
                        value={values.status}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </Form.Select>
                      {errors.status && (
                        <p className="error">{errors.status}</p>
                      )}
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        Images <span className="text-danger">*</span>
                      </Form.Label>
                      <Form.Control
                        type="file"
                        accept=".jpg,.jpeg,.png,.webp"
                        name="images"
                        onChange={handleReviewImage}
                        onBlur={handleBlur}
                        multiple
                      />
                      {
                        errors.images && (
                          <p className="text-danger">{errors.images}</p>
                        )
                      }
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        youtube Video Link
                      </Form.Label>
                      <Form.Control
                        type="url"
                        name="youtube_video_link"
                        value={values.youtube_video_link}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      {errors.youtube_video_link && (
                        <p className="error">{errors.youtube_video_link}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>
                        Text Content <span className="text-danger">*</span>
                      </Form.Label>
                      <SunEditor
                        setOptions={options_for_sunEditor}
                        name="text_content"
                        value={values.text_content}
                        onChange={(text_content) =>
                          setFieldValue("text_content", text_content)
                        }
                        onBlur={() => setFieldTouched("text_content", true)}
                      />
                      {errors.text_content && (
                        <p className="error">{errors.text_content}</p>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="justify-content-center mt-3">
                  <Button type="submit" className="btn btn-primary text-white w-auto">
                    Save
                  </Button>
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
