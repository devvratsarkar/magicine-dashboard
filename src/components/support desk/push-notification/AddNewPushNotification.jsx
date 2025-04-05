import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { AddPushNotificationValidation, AddPushNotificationValidationWithouSchedule } from "../../../commondata/formvalidations";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import Select from "react-select"
import { useAddPushNotificationMutation, useGetAllPushNotificationQuery } from "../../../redux/features/supportDeskEndPoint";
import { useGetAllUserAccordingToCategoryMutation, useGetCategoriesTypeMutation, useGetUserQuery } from "../../../redux/features/customerDataEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import { getPushNotification } from "../../../utils/routes";
import toast from "react-hot-toast";

function AddNewPushNotification() {
  const [schedule, setSchedule] = useState(false)
  const navigate = useNavigate()
  const [categoryData, setCategoryData] = useState([])

  const [selectedProductType, setSelectedProductType] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState([]);
  const [allUsers, setAllUsers] = useState([]);

  const { refetch } = useGetAllPushNotificationQuery()
  // const { data } = useGetUserQuery()
  // const allUsers = data?.data

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


  const [addPushNotification, { isLoading }] = useAddPushNotificationMutation()
  const initialValues = {
    to: [],
    type: [],
    title: "",
    content: "",
    date: "",
    time: "",
    product_type: "",
    category: []
  };
  const handleSave = async () => {
    const { to, type, title, content, product_type, category } = values;
    const updatedValues = { to, title, type, content, product_type, category };
    try {
      const response = await addPushNotification(updatedValues);
      if (response?.data?.http_status_code === 200) {
        toast.success(response.data.message)
        refetch()
        navigate(`${getPushNotification()}`)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleSchedule = async () => {
    const { to, type, title, content, date, time, product_type, category } = values;
    const schedule = date + ' ' + time
    const updatedValues = { to, type, title, content, schedule, product_type, category };
    try {
      const response = await addPushNotification(updatedValues);
      if (response?.data?.http_status_code === 200) {
        toast.success(response.data.message)
        refetch()
        navigate(`${getPushNotification()}`)
      }
    } catch (error) {
      console.error(error);
    }
  };

  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: schedule ? AddPushNotificationValidation : AddPushNotificationValidationWithouSchedule,
    onSubmit: schedule ? handleSchedule : handleSave
  });

  const userOptions = allUsers.length > 0
    ? [{ value: "all_user", label: "Select All Users" }, ...allUsers.map(user => ({
      value: user.id,
      label: user.name
    }))]
    : [];

  useEffect(() => {
    if (allUsers.length) {
      if (allUsers) {
        setFieldValue("to", [{ value: allUsers.id, label: allUsers.name }]);
      }
    }
  }, [allUsers]);

  const productTypeOptions = [
    { label: "General Product", value: "general_product" },
    { label: "Medicine", value: "medicine" },
    { label: "Surgical Equipment", value: "equipment" }
  ];


  const notificationType = [
    { label: "Welcome Notification", value: "Welcome Notification" },
    { label: "Category Notification", value: "Category Notification - ON THE ADDITION OF NEW CATEGORY" },
    { label: "Product Notification", value: "Product Notification" },
    { label: "Cart Abandonment Notification", value: "Cart Abandonment Notification" },
    { label: "Post Purchase Notification", value: "Post Purchase Notification" },
    { label: "Cross Sell Notification", value: "Cross Sell Notification" },
    { label: "Back TO Stock Notification", value: "Back TO Stock Notification" },
    { label: "Price Drop Notification", value: "Price Drop Notification" },
    { label: "Manual Web Push Notification", value: "Manual Web Push Notification" },
    { label: "Offer And Promotion", value: "Offer And Promotion" },
  ];

  const typeOptions = [
    { value: "All Type", label: "Select All Type" },
    ...notificationType.map(type => ({ value: type.value, label: type.label })),
  ];

  return (
    <>
      <Row>
        <Col>
          <PageHeader titles="Support Desk" active="Add" items={["Home", "Push Notification List"]} links={["/dashboard", "/push-notification"]} />
        </Col>
        <Col className="my-5 text-end">
          <Link to="/push-notification" className="btn btn-success border-sucess" > View All Notification </Link>
        </Col>
      </Row>
      <Row>
        <Col>
          <Card className="py-5 px-4">
            {isLoading && <Loader />}
            <Form onSubmit={handleSubmit}>

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
                      errors.product_type && touched.product_type && <p className="text-danger">{errors.product_type}</p>
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
                <Col as={Col} md={6}>
                  <Form.Group>
                    <Form.Label>
                      Type <span className="text-danger">*</span>
                    </Form.Label>
                    <Select
                      options={typeOptions}
                      name="type"
                      value={values.type.map(type => typeOptions.find(option => option.value === type))}
                      onChange={(selectedOptions) => {
                        const allTypeSelected = selectedOptions.some(
                          (option) => option.value === "All Type"
                        );

                        if (allTypeSelected) {
                          setFieldValue("type", notificationType.map(type => type.label));
                        } else {
                          setFieldValue("type", selectedOptions.map(option => option.label));
                        }
                      }}
                      onBlur={handleBlur}
                      isMulti
                      isSearchable
                    />
                    {errors.type && touched.type ? (
                      <p className="text-danger">{errors.type}</p>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>
              <Row>
                <Col as={Col} md={6}>
                  <Form.Label>Title <span className="text-danger">*</span></Form.Label>
                  <Form.Control
                    type="text"
                    name="title"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.title}
                  />
                  {
                    errors.title && touched.title && <p className="text-danger">{errors.title}</p>
                  }
                </Col>
                {/* <Col as={Col} md={6}>
                  <Form.Group>
                    <Form.Label>
                      Enter URL <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      name="url"
                      type="url"
                      value={values.url}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.url && touched.url ? (
                      <p className="error">{errors.url}</p>
                    ) : null}
                  </Form.Group>
                </Col> */}
              </Row>
              <Row>
                <Col as={Col} md={12}>
                  <Form.Group>
                    <Form.Label>
                      Content <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as={"textarea"}
                      rows={5}
                      name="content"
                      value={values.content}
                      setOptions={options_for_sunEditor}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {errors.content && touched.content ? (
                      <p className="error">{errors.content}</p>
                    ) : null}
                  </Form.Group>
                </Col>
              </Row>   {
                schedule && (<Row>
                  <p className="fw-bolder fs-4">Schedule Date And Time</p>
                  <Row>
                    <Col as={Col} sm={3}>
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
                    <Col as={Col} sm={3}>
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
                </Row>)
              }

              <Row className="mt-3 justify-content-center gap-2">
                {schedule ? (<Button type="submit" className="w-auto" onClick={() => setSchedule(true)}>Schedule</Button>) : (<p type="submit" className="btn btn-primary w-auto" onClick={() => setSchedule(true)}>Schedule</p>)}
                {schedule ? (<p className="btn btn-primary w-auto" onClick={() => setSchedule(false)}>Cancel</p>) : <Button type="submit" className="w-auto">Send</Button>}
              </Row>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default AddNewPushNotification;