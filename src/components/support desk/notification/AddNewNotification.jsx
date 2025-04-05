import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { AddNotificationValidation, AddNotificationValidationWithouSchedule } from "../../../commondata/formvalidations";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Select from "react-select";
import { useAddNewNotificationMutation, useGetAllNotificationQuery } from "../../../redux/features/supportDeskEndPoint";
import { getNotification } from "../../../utils/routes";
import { useGetAllUserAccordingToCategoryMutation, useGetCategoriesTypeMutation, } from "../../../redux/features/customerDataEndPoints";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useGetCategoryQuery } from "../../../redux/features/catalogueEndPoints";

function AddNewNotification() {
  const navigate = useNavigate();
  const [schedule, setSchedule] = useState(false);
  const location = useLocation();
  const orderByUser = location.state;
  const orderData = orderByUser?.order_data;
  const [categoryData, setCategoryData] = useState([])

  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const [SearchcategoryData, { isLoading: loadingCategory }] = useGetCategoriesTypeMutation()


  useEffect(() => {
    if (selectedProductType) {
      const fetchDataCategory = async () => {
        try {
          const response = await SearchcategoryData({ type: selectedProductType });
          if (response?.data?.http_status_code === 200 && Array.isArray(response.data?.data) && response.data?.data?.length > 0) {
            setCategoryData(response.data?.data)
            toast.success("Category Fetched Successfully")
          } else {
            toast.error(response.data?.message)
          }
        } catch (error) {
          console.error(error);
        }
      }
      fetchDataCategory()
    }
  }, [selectedProductType]);



  const categoryOptions = Array.isArray(categoryData) && categoryData?.length > 0 ? categoryData?.map((item) => ({
    value: item.id,
    label: item.category_name
  })) : [];

  // Fetch users only when a category is selected
  const [searchUserData, { isLoading: loadingUsers }] = useGetAllUserAccordingToCategoryMutation();


  useEffect(() => {
    if (Array.isArray(selectedCategory) && selectedCategory?.length > 0) {
      const fetchDataCategory = async () => {
        try {
          const response = await searchUserData({ id: selectedCategory });

          if (response?.data?.http_status_code === 200 && Array.isArray(response.data?.data) && response.data?.data?.length > 0) {
            setAllUsers(response.data?.data)
            toast.success("Users Fetched Successfully")
          } else {
            toast.error(response.data?.message)
          }
        } catch (error) {
          console.error(error);
        }
      }
      fetchDataCategory()
    }
  }, [selectedCategory]);

  const [addNewNotification, { isLoading }] = useAddNewNotificationMutation();

  const initialValues = {
    to: [],
    title: "",
    order_id: "",
    url: "",
    content: "",
    date: "",
    time: "",
    product_type: "",
    category: []
  };

  const handleSave = async () => {
    const { to, title, order_id, url, content, product_type, category } = values;
    // const selectedUsers = to.map((option) => option.value);
    const updatedValues = { to, title, order_id, url, content, product_type, category };
    try {
      const response = await addNewNotification(updatedValues);
      if (response?.data?.http_status_code === 200) {
        toast.success(response.data.message);
        navigate(getNotification());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSchedule = async () => {
    const { to, title, order_id, url, content, date, time, product_type, category } = values;
    // const selectedUsers = to.map((option) => option.value);
    const schedule = `${date} ${time}`;
    const updatedValues = { to, title, order_id, url, content, schedule, product_type, category };
    try {
      const response = await addNewNotification(updatedValues);
      if (response?.data?.http_status_code === 200) {
        toast.success(response.data.message);
        navigate(getNotification());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
    initialValues,
    validationSchema: schedule ? AddNotificationValidation : AddNotificationValidationWithouSchedule,
    onSubmit: schedule ? handleSchedule : handleSave,
  });

  const userOptions = allUsers.length > 0
    ? [{ value: "all_user", label: "Select All Users" }, ...allUsers.map(user => ({
      value: user.id,
      label: user.name
    }))]
    : [];

  useEffect(() => {
    if (orderData && allUsers.length) {
      // const userOption = allUsers.find(user => user.email === orderData?.user?.email);
      if (allUsers) {
        setFieldValue("to", [{ value: allUsers.id, label: allUsers.name }]);
        setFieldValue("order_id", orderData.order_number);
      }
    }
  }, [orderData, allUsers]);

  const productTypeOptions = [
    { label: "General Product", value: "general_product" },
    { label: "Medicine", value: "medicine" },
    { label: "Surgical Equipment", value: "equipment" }
  ];

  return (
    <>
      {loadingCategory && <Loader /> || loadingUsers && <Loader />}
      <Row>
        <Col>
          <PageHeader titles="Support Desk" active="Add Email Notification List" items={["Home", "Email Notification List"]} links={["/dashboard", "/support-desk/notification"]} />
        </Col>
        <Col className="my-5 text-end">
          <Link to="/support-desk/notification" className="btn btn-success border-sucess">View All Notification</Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="py-5 px-4">
            <Form onSubmit={handleSubmit}>
              {isLoading && <Loader />}

              <Row>
                <Col as={Col} md={6}>
                  <Form.Group>
                    <Form.Label>Product Type <span className="text-danger">*</span></Form.Label>
                    <Select
                      options={productTypeOptions}
                      name="product_type"
                      value={productTypeOptions?.find((item) => item.value === values.product_type)}
                      onChange={(selectedOption) => (
                        setFieldValue("product_type", selectedOption.value),
                        setSelectedProductType(selectedOption.value)
                      )}
                      onBlur={handleBlur}
                      isSearchable
                    />
                    {
                      errors.product_type && touched.product_type ? (<p className="text-danger">{errors.product_type}</p>) : null
                    }
                  </Form.Group>
                </Col>
                {selectedProductType && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>Category <span className="text-danger">*</span></Form.Label>
                      <Select
                        name="category"
                        options={categoryOptions}
                        value={categoryOptions.filter((item) => values.category.includes(item.value))}
                        onChange={(selectedOptions) => {
                          const selectedCategoryArray = selectedOptions.map((option) => Number(option.value));
                          setFieldValue("category", selectedCategoryArray);
                          setSelectedCategory(selectedCategoryArray);
                        }}
                        isMulti
                      />
                      {
                        errors.category && touched.category && <p className="text-danger">{errors.category}</p>
                      }
                    </Form.Group>
                  </Col>
                )}
              </Row>

              <Row>

                {selectedCategory?.length > 0 && allUsers?.length > 0 && (
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label>
                        To <span className="text-danger">*</span>
                      </Form.Label>
                      <Select
                        options={userOptions}
                        name="to"
                        value={userOptions.filter((option) => values.to.includes(option.value))}
                        onChange={(selectedOptions) => {
                          const allUsersSelected = selectedOptions.some((option) => option.value === "all_user");
                          let selectedUserIds = [];
                          if (allUsersSelected) {
                            selectedUserIds = allUsers.filter((user) => user.value !== "all_user").map((user) => user.id);
                          } else {
                            selectedUserIds = selectedOptions.map((option) => option.value);
                          }
                          console.log("selectedUserIds", selectedUserIds)
                          setFieldValue("to", selectedUserIds);
                        }}
                        onBlur={handleBlur}
                        isMulti
                        isSearchable
                      />

                      {errors.to && touched.to ? <p className="error">{errors.to}</p> : null}
                    </Form.Group>
                  </Col>
                )}


                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Subject <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.title && touched.title ? (
                      <p className="error">{errors.title}</p>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>

              <Row>
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>
                      Content <span className="text-danger">*</span>
                    </Form.Label>
                    <SunEditor
                      name="content"
                      setContents={values.content}
                      setOptions={options_for_sunEditor}
                      onChange={(content) => setFieldValue("content", content)}
                      onBlur={() => setFieldTouched("content", true)}
                    />
                    {errors.content && touched.content ? (
                      <p className="error">{errors.content}</p>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              {schedule && (
                <Row>
                  <p className="fw-bolder fs-4">Schedule Date And Time</p>
                  <Row>
                    <Col sm={3}>
                      <Form.Group>
                        <Form.Label>
                          Date <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="date"
                          type="date"
                          value={values.date}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          min={new Date().toISOString().split('T')[0]}
                        />
                        {errors.date && touched.date ? (
                          <p className="error">{errors.date}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col sm={3}>
                      <Form.Group>
                        <Form.Label>
                          Time <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          name="time"
                          type="time"
                          value={values.time}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.time && touched.time ? (
                          <p className="error">{errors.time}</p>
                        ) : null}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>
              )}
              <Row className="mt-3 justify-content-center gap-2">
                {schedule ? (
                  <Button type="submit" className="w-auto">Schedule</Button>
                ) : (
                  <p className="btn btn-primary w-auto" onClick={() => setSchedule(true)}>Schedule</p>
                )}
                {schedule ? (
                  <p className="btn btn-primary w-auto" onClick={() => setSchedule(false)}>Cancel</p>
                ) : (
                  <Button type="submit" className="w-auto">Send</Button>
                )}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default AddNewNotification;
