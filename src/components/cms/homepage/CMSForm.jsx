import React, { useEffect, useState } from "react";
import { Row, Col, Card, Form, Button, Table } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useFormik } from "formik";
import { CMSHomeValidation } from "../../../commondata/formvalidations";
import Select from "react-select";
import SeoForm from "../../seo-page/SeoForm"
import { useGetBrandQuery, useGetCategoryQuery } from "../../../redux/features/catalogueEndPoints";
import { useGetProductInventoryQuery, useGetProductsQuery } from "../../../redux/features/productEndPoints";
import Loader from "../../../layouts/layoutcomponents/loader";
import toast from "react-hot-toast";
import { useAddUpdateHomePageMutation, useGetHomePageQuery } from "../../../redux/features/cmsEndPoints";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions"
import { MEDIA_BASE_URL, USER_BASE_URL } from "../../../utils/config";
import moment from "moment";


function CMSForm() {
  const [dealsList, setDealsList] = useState([{ product: "", time: "", id: "", image: "" }]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [sliderImage, setSliderImage] = useState(null)
  const [imageOne, setImageOne] = useState(null)
  const [imageTwo, setImageTwo] = useState(null)
  const [imageThree, setImageThree] = useState(null)
  const [imageFour, setImageFour] = useState(null)
  const [imageFive, setImageFive] = useState(null)
  const [imageSix, setImageSix] = useState(null)
  const [imageSeven, setImageSeven] = useState(null)
  const [imageEight, setImageEight] = useState(null)
  const [imageNine, setImageNine] = useState(null)
  const [imageTen, setImageTen] = useState(null)
  const [imageEleven, setImageEleven] = useState(null)
  const [imageTwelve, setImageTwelve] = useState(null)
  const [imageThirteen, setImageThirteen] = useState(null)
  const [imageFourteen, setImageFourteen] = useState(null)


  const role = localStorage.getItem("role")
  const permissions = JSON.parse(localStorage.getItem("permissions"))

  const showAdd = role === "Admin" || (role === "Staff" && permissions.Home_Page.includes("add"))

  const [queryBrand, setQuerybrand] = useState({
    type: "",
    status: ""
  })

  const [readOnlyFields, setReadOnlyFields] = useState({
    section_three: true,
    section_four: true,
    section_five: true,
    section_six: true,
    section_eight: true,
    section_nine: true,
    section_eleven: true,
    section_twelve: true,
    section_thirteen: true,
    section_fourteen: true,
    section_fifteen: true,

    section_seventeen: true,
    section_eighteen: true,
    section_nineteen: true,
    section_twenty: true,
    section_twentyone: true,
  })


  const handleEditClick = (field) => {
    setReadOnlyFields((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const [categoryQuery, setCategoryQuery] = useState({
    status: "",
    type: ""
  })

  const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetHomePageQuery()
  const { data: category } = useGetCategoryQuery(categoryQuery)
  const { data: product } = useGetProductInventoryQuery()
  const { data: brand } = useGetBrandQuery(queryBrand)
  const categoryData = category?.data?.activeCategories;
  const productData = product?.data?.filteredProduct;
  const brandData = brand?.data?.allBrand



  const homePageData = data?.data;


  const [addUpdateHomePage, { isLoading: loading }] = useAddUpdateHomePageMutation()

  const initialValues = {
    slider_image: "",
    slider_name: "",
    slider_link: "",
    section_one: {
      status: true,
      main_heading: "",
      sub_heading: "",
      search_bar_placeholder: "",
    },
    section_two: {
      status: true,
      banner_image_name: "",
      banner_image_link: ""
    },
    section_three: {
      name: "Deal Of The Day",
      status: true,
      banner_image_name: "",
      banner_image_link: "",
      deals: []
    },
    section_four: {
      name: " Shop By Category",
      status: true,
      select_category: "",
      banner_image_name: "",
      banner_image_link: ""
    },
    section_five: {
      name: "Shop By Healty Concern",
      status: true,
      select_category: "",
      banner_image_name: "",
      banner_image_link: ""
    },
    section_six: {
      name: "Outr Best Selling Products",
      status: true,
      select_product: "",
      banner_image_name: "",
      banner_image_link: ""
    },
    section_seven: {
      status: true,
      left_banner_name: "",
      left_banner_link: "",
      right_banner_name: "",
      right_banner_link: "",
    },
    section_eight: {
      status: true,
      name: "Our Partner",
      select_brand: "",
    },
    section_nine: {
      status: true,
      name: "Why Choose Us?",
      heading_one: "",
      image_one_name: "",
      image_one_link: "",
      content_one: "",
      heading_two: "",
      image_two_name: "",
      image_two_link: "",
      content_two: "",
      heading_three: "",
      image_three_name: "",
      image_three_link: "",
      content_three: "",
      heading_four: "",
      image_four_name: "",
      image_four_link: "",
      content_four: "",
    },
    section_ten: {
      status: true,
      banner_image_name: "",
      banner_image_link: ""
    },
    section_eleven: {
      status: true,
      name: "Popular Categories",
      select_category: "",
    },
    section_twelve: {
      name: "Popular Combos",
      status: true,
      select_product: "",
    },
    section_thirteen: {
      name: "Top Trending Deals",
      status: true,
      select_product: "",
    },
    section_fourteen: {
      name: "In The Spotlight",
      status: true,
      select_product: "",
    },
    section_fifteen: {
      name: "Winter Care",
      status: true,
      select_product: "",
    },
    section_sixteen: {
      status: true,
      banner_image_name: "",
      banner_image_link: ""
    },
    section_seventeen: {
      name: "Popular Categories",
      status: true,
      select_category: "",
    },
    section_eighteen: {
      name: "Popular Combos",
      status: true,
      select_product: "",
    },
    section_nineteen: {
      name: "Top Trending Deals",
      status: true,
      select_product: "",
    },
    section_twenty: {
      name: "In The Spotlight",
      status: true,
      select_product: "",
    },
    section_twentyone: {
      name: "Winter Care",
      status: true,
      select_product: "",
    },
    section_twentytwo: {
      status: true,
      banner_image_name: "",
      banner_image_link: ""
    },
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
    description: "",

    image_one: "",
    image_two: "",
    image_three: "",
    image_four: "",
    image_five: "",
    image_six: "",
    image_seven: "",
    image_eight: "",
    image_nine: "",
    image_ten: "",
    image_eleven: "",
    image_twelve: "",
    image_thirteen: "",
    image_fourteen: "",
    id: ""
  };


  const flattenObject = (obj, parent = '', res = {}) => {
    for (let key in obj) {
      let propName = parent ? `${parent}.${key}` : key;
      if (typeof obj[key] == 'object' && obj[key] !== null && !(obj[key] instanceof File)) {
        flattenObject(obj[key], propName, res);
      } else {
        res[propName] = obj[key];
      }
    }
    return res;
  };


  const options = productData?.filter(product => product.status === true && product?.deleted_at === null)?.map((productDatas) => {
    return {
      value: productDatas.id,
      label: productDatas.product_name,
      image: productDatas.featured_image
    }
  })

  const category_options = categoryData?.filter(category => category.status === true)?.map((categoryData) => {
    return {
      value: categoryData.id,
      label: categoryData.category_name
    }
  })

  const brand_options = brandData?.filter(brand => brand.status === true).map((brandData) => {
    return {
      value: brandData.id,
      label: brandData.brand_name
    }
  })




  const addDeals = () => {
    setDealsList([...dealsList, { product: "", time: "" }]);
  };

  const deleteDeals = (index) => {
    const updateDealList = [...dealsList];
    updateDealList.splice(index, 1);
    setDealsList(updateDealList);

    const updatedSelectedProducts = selectedProducts.filter((_, i) => i !== index);
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleProductChange = (index, selectedOption) => {
    const updateDealList = [...dealsList];
    updateDealList[index].product = selectedOption.label;
    setDealsList(updateDealList);

    const updatedSelectedProducts = selectedProducts.map((product, i) => i === index ? selectedOption : product);
    setSelectedProducts(updatedSelectedProducts);
  };

  const handleTimeChange = (index, e) => {
    const updateDealList = [...dealsList];
    updateDealList[index].time = e.target.value;
    setDealsList(updateDealList);
  };

  const handleSelectChange = (selectedOptions) => {
    const updatedDealsList = selectedOptions.map((option, index) => ({
      product: option.label,
      time: dealsList[index] ? dealsList[index].time : "",
      image: option.image || dealsList[index]?.image || "",
      id: option.value || dealsList[index]?.id,
    }));
    setDealsList(updatedDealsList);
    setSelectedProducts(selectedOptions);
  };

  const {
    values,
    errors,
    handleBlur,
    touched,
    handleChange,
    handleSubmit,
    resetForm,
    setFieldValue,
    setFieldTouched,
    validateForm
  } = useFormik({
    initialValues,
    validationSchema: CMSHomeValidation,
    onSubmit: async (values) => {

      values.section_three.deals = dealsList.filter(deal => deal.product);
      const formData = new FormData();
      const flattenedValues = flattenObject(values);
      Object.entries(flattenedValues).forEach(([key, value]) => {
        if (key.startsWith('section_')) {
          if (Array.isArray(value)) {
            if (key.endsWith('.select_product') || key.endsWith('.select_category') || key.endsWith('.select_brand')) {
              value.forEach((item, index) => {
                formData.append(`${key}[${index}].value`, item.value);
              });
            }
          } else {
            formData.append(key, value);
          }
        } else {
          formData.append(key, value);
        }
      });

      try {
        const response = await addUpdateHomePage({ formType: formData });
        if (response?.data?.http_status_code === 200 || response?.data?.http_status_code === 201) {
          toast.success(response.data.message);
          refetch()
          // resetForm()
        }
      } catch (error) {
        console.error(error.message);
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


  const generateOgTag = () => {

    const ogTag = `<meta property="og:type" content="website"><meta property="og:title" content='${values.meta_title || "undefined"}'><meta property="og:description" content="${values.meta_description || "undefined"}"><meta property="og:url" content="${USER_BASE_URL}"><meta property="og:site_name" content="Magicine Pharma"><meta property="og:image" content="${MEDIA_BASE_URL}/public/media/images/1727083604842-354890b1-3d75-4ccd-a85a-0eebc8688c16.png">`

    setFieldValue("og_tag", ogTag)
  }


  useEffect(() => {
    if (values.meta_title && values.meta_description && values.slug) {
      generateOgTag();
    }
  }, [values.meta_title, values.meta_description, values.slug]);




  useEffect(() => {
    if (isSuccess && data?.data) {
      const homePageData = data.data;
      const sections = [
        'section_one', 'section_two', 'section_three', 'section_four', 'section_five', 'section_six', 'section_seven',
        'section_eight', 'section_nine', 'section_ten', 'section_eleven', 'section_twelve', 'section_thirteen',
        'section_fourteen', 'section_fifteen', 'section_sixteen', 'section_seventeen', 'section_eighteen',
        'section_nineteen', 'section_twenty', 'section_twentyone', 'section_twentytwo'
      ];

      sections.forEach(section => {
        const sectionData = homePageData[section];
        if (sectionData) {

          Object.keys(sectionData).forEach(key => {
            if (initialValues[section] && initialValues[section][key] !== undefined) {
              if (Array.isArray(sectionData[key])) {
                setFieldValue(`${section}.${key}`, sectionData[key].map(item => ({
                  label: item.product_name || item.category_name || item.brand_name,
                  value: item.id
                })));
              } else {
                setFieldValue(`${section}.${key}`, sectionData[key]);
              }
            }
          });
        }
      });

      const seoFields = ['meta_title', 'meta_description', 'meta_keywords', 'og_tag', 'schema_markup'];
      seoFields.forEach(field => {
        if (initialValues[field] !== undefined) {
          setFieldValue(field, homePageData[field]);
        }
      });

      const sectionThree = homePageData['section_three'];
      if (sectionThree && sectionThree.deals) {
        const selectedProducts = sectionThree.deals.map(deal => ({
          label: deal.product,
          value: deal.product_id?.id
        }));
        const dealsList = sectionThree.deals.map(deal => {
          const timeParts = deal.time.split(" ");
          const days = parseInt(timeParts[0], 10) || 0;  // Get days
          const [hours, minutes, seconds] = timeParts[1]?.split(":").map(part => parseInt(part, 10)) || [0, 0, 0];
          const currentDate = moment();
          const updatedDate = currentDate
            .add(days, 'days')
            .add(hours, 'hours')
            .add(minutes, 'minutes')
            .add(seconds, 'seconds');
          return (
            {
              product: deal.product,
              id: deal.id,
              image: deal.image,
              time: updatedDate.format("YYYY-MM-DDTHH:mm") || ""
            }
          )
        });

        setSelectedProducts(selectedProducts);
        setDealsList(dealsList);
      }
    }


    setFieldValue("image_one", homePageData?.section_two?.banner_image)
    setFieldValue("image_two", homePageData?.section_three?.banner_image)
    setFieldValue("image_three", homePageData?.section_four?.banner_image)
    setFieldValue("image_four", homePageData?.section_five?.banner_image)
    setFieldValue("image_five", homePageData?.section_six?.banner_image)
    setFieldValue("image_six", homePageData?.section_seven?.left_banner)
    setFieldValue("image_seven", homePageData?.section_seven?.right_banner)
    setFieldValue("image_eight", homePageData?.section_nine?.image_one)
    setFieldValue("image_nine", homePageData?.section_nine?.image_two)
    setFieldValue("image_ten", homePageData?.section_nine?.image_three)
    setFieldValue("image_eleven", homePageData?.section_nine?.image_four)
    setFieldValue("image_twelve", homePageData?.section_ten?.banner_image)
    setFieldValue("image_thirteen", homePageData?.section_sixteen?.banner_image)
    setFieldValue("image_fourteen", homePageData?.section_twentytwo?.banner_image)

    setFieldValue("section_five.select_category", homePageData?.section_five?.select_category.map((item) => ({
      value: item?.id,
      label: item?.category_name
    })))
    setFieldValue("section_four.select_category", homePageData?.section_four?.select_category.map((item) => ({
      value: item?.id,
      label: item?.category_name
    })))
    setFieldValue("section_six.select_product", homePageData?.section_six?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_eight.select_brand", homePageData?.section_eight?.select_brand.map((item) => ({
      value: item?.id,
      label: item?.brand_name
    })))
    setFieldValue("section_eleven.select_category", homePageData?.section_eleven?.select_category.map((item) => ({
      value: item?.id,
      label: item?.category_name
    })))
    setFieldValue("section_twelve.select_product", homePageData?.section_twelve?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_thirteen.select_product", homePageData?.section_thirteen?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_fourteen.select_product", homePageData?.section_fourteen?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_fifteen.select_product", homePageData?.section_fifteen?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_seventeen.select_category", homePageData?.section_seventeen?.select_category.map((item) => ({
      value: item?.id,
      label: item?.category_name
    })))
    setFieldValue("section_eighteen.select_product", homePageData?.section_eighteen?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_nineteen.select_product", homePageData?.section_nineteen?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_twenty.select_product", homePageData?.section_twenty?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))
    setFieldValue("section_twentyone.select_product", homePageData?.section_twentyone?.select_product.map((item) => ({
      value: item?.id,
      label: item?.product_name,
      image: item?.featured_image
    })))

    setFieldValue("slider_image", homePageData?.slider_image)
    setFieldValue("slider_link", homePageData?.slider_link)
    setFieldValue("slider_name", homePageData?.slider_name)

    setFieldValue("meta_title", homePageData?.meta_title)
    setFieldValue("meta_description", homePageData?.meta_description)
    setFieldValue("meta_keywords", homePageData?.meta_keywords)
    setFieldValue("og_tag", homePageData?.og_tag)
    setFieldValue("schema_markup", homePageData?.schema_markup)
    setFieldValue("description", homePageData?.description)
    setFieldValue("id", homePageData?.id)

  }, [isSuccess]);

  if (isLoading || isFetching) {
    return <Loader />;
  }

  if (isSuccess) {
    return (
      <>
        {isLoading && <Loader /> || loading && <Loader />}
        <Row>
          <PageHeader titles="CMS" active="Homepage" items={["Home"]} links={["/dashboard"]} />
        </Row>
        <Row>
          <Card>
            <Card.Header>
              <h1 className="fs-5 mb-0 fw-bolder">Homepage</h1>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => {
                e.preventDefault();
                handleSubmit();
                handleScrollToError();
              }}>
                <Row className="mb-5">
                  <Col as={Col} md={6}>
                    <Form.Group>
                      <Form.Label>
                        Slider Image <span className="text-danger">*</span>
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={8}>
                          <Form.Control
                            type="file"
                            accept=".jpg,.jpeg,.png,.webp"
                            name="slider_image"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (file) {
                                const fileURL = URL.createObjectURL(file);
                                setFieldValue("slider_image", file);
                                setSliderImage(fileURL);
                              }
                            }}
                            onBlur={handleBlur}
                          />
                        </Col>
                        {errors.slider_image && touched.slider_image ? (
                          <p className="text-danger">{errors.slider_image}</p>
                        ) : null}
                        <Col as={Col} md={4}>
                          <img
                            src={sliderImage || values?.slider_image}
                            alt={values?.slider_name || "Slider Preview"}
                            width={100}
                            height={100}
                            style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                          />
                        </Col>
                      </Row>
                    </Form.Group>
                  </Col>

                  <Col as={Col} md={6}>
                    <Form.Label>Slider Name <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="slider_name"
                      value={values?.slider_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {
                      errors.slider_name && touched.slider_name ? (
                        <p className="text-danger">{errors.slider_name}</p>
                      ) : null
                    }
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Label>Slider Link <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      name="slider_link"
                      value={values?.slider_link}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    {
                      errors.slider_link && touched.slider_link ? (
                        <p className="text-danger">{errors.slider_link}</p>
                      ) : null
                    }
                  </Col>
                </Row>

                {/* section_one */}
                <Row className="mb-5">
                  <Col as={Col} md={6}>
                    <p className="text-primary fs-6 ">Section 1</p>
                  </Col>
                  <Col as={Col} md={6}>
                    <Form.Label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_one.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_one?.status}
                        value={values.section_one?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </Form.Label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Main Heading</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_one.main_heading"
                          value={values.section_one.main_heading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Sub Heading</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_one.sub_heading"
                          value={values.section_one.sub_heading}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Search Bar Placeholder Text</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_one.search_bar_placeholder"
                          value={values.section_one.search_bar_placeholder}
                          onChange={handleChange}
                          onBlur={handleBlur}

                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_two */}
                <Row className="mt-6 mb-5">
                  <Col as={Col} md={6}>
                    <p className="text-primary fs-6">Section 2</p>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_two.status"
                        className="custom-switch-input"
                        onChange={(e) => setFieldValue("section_two.status", e.target.checked)}
                        onBlur={handleBlur}
                        checked={values.section_two?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Banner Image(JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span>
                        </Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_one"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_one", file);
                                  setImageOne(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_one && touched.image_one && (
                              <p className="text-danger">{errors.image_one}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageOne || values?.image_one} alt={values?.section_two?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Banner Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="section_two.banner_image_name"
                          value={values.section_two?.banner_image_name || ""}
                          onChange={(e) => setFieldValue("section_two.banner_image_name", e.target.value)}
                          onBlur={handleBlur}
                        />
                        {errors.section_two?.banner_image_name && touched.section_two?.banner_image_name && (
                          <p className="text-danger">{errors.section_two?.banner_image_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Banner Link <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="section_two.banner_image_link"
                          value={values.section_two?.banner_image_link || ""}
                          onChange={(e) => setFieldValue("section_two.banner_image_link", e.target.value)}
                          onBlur={handleBlur}
                        />
                        {errors.section_two?.banner_image_link && touched.section_two?.banner_image_link && (
                          <p className="text-danger">{errors.section_two?.banner_image_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_three */}
                <Row className="mt-6 mb-5">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 3 -</p>
                    <Form.Control
                      type="text"
                      name="section_three.name"
                      value={values.section_three.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_three}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_three')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_three.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_three?.status}
                        value={values.section_three?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Banner Image(JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span>
                        </Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_two"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_two", file);
                                  setImageTwo(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_two && touched.image_two && (
                              <p className="text-danger">{errors.image_two}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageTwo || values?.image_two} alt={values?.section_three?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Banner Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="section_three.banner_image_name"
                          value={values.section_three?.banner_image_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_three?.banner_image_name && touched.section_three?.banner_image_name && (
                          <p className="text-danger">{errors.section_three?.banner_image_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>
                          Banner Link <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="section_three.banner_image_link"
                          value={values.section_three?.banner_image_link || ''}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_three?.banner_image_link && touched.section_three?.banner_image_link && (
                          <p className="text-danger">{errors.section_three?.banner_image_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    <Col md={12}>
                      <Form.Label>Select Product</Form.Label>
                      <Select
                        options={options}
                        name="selectProduct"
                        value={selectedProducts}
                        onChange={handleSelectChange}
                        isMulti
                        className="rounded-4"
                        isSearchable
                      />
                    </Col>
                    {dealsList.filter(deal => deal.product).map((deal, index) => (
                      <div className="mb-4 pb-4 border-bottom border-black mt-4" key={index}>
                        <Row>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label className="text-center">Product</Form.Label>
                              <Form.Control
                                type="text"
                                value={deal.product}
                                onChange={(e) => handleProductChange(index, e.target.value)}
                                readOnly
                              />
                            </Form.Group>
                          </Col>
                          <Col md={3} className="text-center">
                            <Form.Group>
                              <Form.Label className="text-center">Image</Form.Label>
                              <img src={deal.image} alt="" width={50} height={50} />
                            </Form.Group>
                          </Col>
                          <Col md={3}>
                            <Form.Group>
                              <Form.Label className="text-center">Time</Form.Label>
                              <Form.Control
                                type="datetime-local"
                                value={deal.time}
                                onChange={(e) => handleTimeChange(index, e)}
                              />
                            </Form.Group>
                          </Col>
                          <Col xl={2} lg={2} md={2} xs={12} className="faq_icon justify-content-center">
                            <Button
                              type="button"
                              className="btn btn-icon btn-danger"
                              variant=""
                              onClick={() => deleteDeals(index)}
                            >
                              <i className="fe fe-trash text-white"></i>
                            </Button>
                          </Col>
                        </Row>
                      </div>
                    ))}
                  </Row>
                </Row>

                {/* section_four */}
                <Row className="mt-6 mb-5">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 4 -</p>
                    <Form.Control
                      type="text"
                      name="section_four.name"
                      value={values.section_four?.name || ''}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_four}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_four')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_four.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_four?.status}
                        value={values.section_four?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Label>Select Categories</Form.Label>
                      <Select
                        options={category_options}
                        name="section_four.select_category"
                        value={values.section_four?.select_category}
                        onChange={(selectedOptions) =>
                          setFieldValue("section_four.select_category", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="rounded-4"
                        isSearchable
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image (JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_three"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_three", file);
                                  setImageThree(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_three && touched.image_three && (
                              <p className="text-danger">{errors.image_three}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageThree || values?.image_three} alt={values?.section_four?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_four.banner_image_name"  // Corrected name path
                          value={values.section_four?.banner_image_name || ''}  // Safe access
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_four?.banner_image_name && touched.section_four?.banner_image_name && (
                          <p className="text-danger">{errors.section_four?.banner_image_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_four.banner_image_link"  // Corrected name path
                          value={values.section_four?.banner_image_link || ''}  // Safe access
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_four?.banner_image_link && touched.section_four?.banner_image_link && (
                          <p className="text-danger">{errors.section_four?.banner_image_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_five */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 5 -</p>
                    <Form.Control
                      type="text"
                      name="section_five.name"
                      value={values.section_five?.name || ''}  // Safe access
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_five}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_five')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_five.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_five?.status}
                        value={values.section_five?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Label>Select Categories</Form.Label>
                      <Select
                        options={category_options}
                        name="section_five.select_category"
                        value={values.section_five?.select_category || []}  // Ensure this is an array for multi-select
                        onChange={(selectedOptions) =>
                          setFieldValue("section_five.select_category", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="rounded-4"
                        isSearchable
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image (JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_four"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_four", file);
                                  setImageFour(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_four && touched.image_four && (
                              <p className="text-danger">{errors.image_four}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageFour || values?.image_four} alt={values?.section_five?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_five.banner_image_name"  // Corrected path
                          value={values.section_five?.banner_image_name || ''}  // Safe access
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_five?.banner_image_name && touched.section_five?.banner_image_name && (
                          <p className="text-danger">{errors.section_five?.banner_image_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_five.banner_image_link"  // Corrected path
                          value={values.section_five?.banner_image_link || ''}  // Safe access
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_five?.banner_image_link && touched.section_five?.banner_image_link && (
                          <p className="text-danger">{errors.section_five?.banner_image_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_six */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 6 -</p>
                    <Form.Control
                      type="text"
                      name="section_six.name"
                      value={values.section_six?.name || ''}  // Safe access
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_six}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_six')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_six.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_six?.status || false}  // Ensure it's a boolean value
                        value={values.section_six?.status || false}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Label>Select Product</Form.Label>
                      <Select
                        options={options}
                        name="section_six.select_product"
                        value={values.section_six?.select_product || []}  // Ensure it's an array for multi-select
                        onChange={(selectedOptions) =>
                          setFieldValue("section_six.select_product", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="rounded-4"
                        isSearchable
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image (JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_five"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_five", file);
                                  setImageFive(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_five && touched.image_file && (
                              <p className="text-danger">{errors.image_five}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageFive || values?.image_five} alt={values?.section_six?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_six.banner_image_name"  // Corrected path
                          value={values.section_six?.banner_image_name || ''}  // Safe access
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_six?.banner_image_name && touched.section_six?.banner_image_name && (
                          <p className="text-danger">{errors.section_six?.banner_image_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_six.banner_image_link"  // Corrected path
                          value={values.section_six?.banner_image_link || ''}  // Safe access
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_six?.banner_image_link && touched.section_six?.banner_image_link && (
                          <p className="text-danger">{errors.section_six?.banner_image_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_seven */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 7</p>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_seven.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_seven?.status || false}
                        value={values.section_seven?.status || false}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    {/* Left Banner */}
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Left Banner (JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_six"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_six", file);
                                  setImageSix(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_six && touched.image_six && (
                              <p className="text-danger">{errors.image_six}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageSix || values?.image_six} alt={values?.section_seven?.left_banner_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Left Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_seven.left_banner_name"
                          value={values?.section_seven?.left_banner_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_seven?.left_banner_name && touched.section_seven?.left_banner_name && (
                          <p className="text-danger">{errors.section_seven?.left_banner_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Left Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_seven.left_banner_link"
                          value={values?.section_seven?.left_banner_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_seven?.left_banner_link && touched.section_seven?.left_banner_link && (
                          <p className="text-danger">{errors.section_seven?.left_banner_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row>
                    {/* Right Banner */}
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Right Banner (JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_seven"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_seven", file);
                                  setImageSeven(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_seven && touched.image_seven && (
                              <p className="text-danger">{errors.image_seven}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageSeven || values?.image_seven} alt={values?.section_seven?.right_banner_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Right Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_seven.right_banner_name"
                          value={values?.section_seven?.right_banner_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_seven?.right_banner_name && touched.section_seven?.right_banner_name && (
                          <p className="text-danger">{errors.section_seven?.right_banner_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Right Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_seven.right_banner_link"
                          value={values?.section_seven?.right_banner_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_seven?.right_banner_link && touched.section_seven?.right_banner_link && (
                          <p className="text-danger">{errors.section_seven?.right_banner_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_eight */}
                <Row className="mt-4">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 8 -</p>
                    <Form.Control
                      type="text"
                      name="section_eight.name"
                      value={values.section_eight?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_eight}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_eight')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_eight.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_eight?.status}
                        value={values.section_eight?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Brand</Form.Label>
                        <Select
                          options={brand_options}
                          name="section_eight.select_brand"
                          value={values.section_eight.select_brand}
                          isMulti
                          isSearchable
                          onChange={(selectedOptions) =>
                            setFieldValue("section_eight.select_brand", selectedOptions)
                          }
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_nine */}
                <Row className="mt-4">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 9 -</p>
                    <Form.Control
                      type="text"
                      name="section_nine.name"
                      value={values.section_nine?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_nine}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_nine')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_nine.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_nine?.status}
                        value={values.section_nine?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Heading 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.heading_one"
                          value={values.section_nine.heading_one}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image 1</Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_eight"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_eight", file);
                                  setImageEight(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_eight && touched.image_eight && (
                              <p className="text-danger">{errors.image_eight}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageEight || values?.image_eight} alt={values?.section_nine?.image_one_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image One Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_one_name"
                          value={values?.section_nine?.image_one_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_one_name && touched.section_nine?.image_one_name && (
                          <p className="text-danger">{errors.section_nine?.image_one_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image One Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_one_link"
                          value={values?.section_nine?.image_one_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_one_link && touched.section_nine?.image_one_link && (
                          <p className="text-danger">{errors.section_nine?.image_one_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Content 1</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.content_one"
                          value={values.section_nine.content_one}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Heading 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.heading_two"
                          value={values.section_nine.heading_two}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image 2</Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_nine"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_nine", file);
                                  setImageNine(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_nine && touched.image_nine && (
                              <p className="text-danger">{errors.image_nine}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageNine || values?.image_nine} alt={values?.section_nine?.image_two_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image Two Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_two_name"
                          value={values?.section_nine?.image_two_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_two_name && touched.section_nine?.image_two_name && (
                          <p className="text-danger">{errors.section_nine?.image_two_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image Two Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_two_link"
                          value={values?.section_nine?.image_two_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_two_link && touched.section_nine?.image_two_link && (
                          <p className="text-danger">{errors.section_nine?.image_two_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Content 2</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.content_two"
                          value={values.section_nine.content_two}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Heading 3</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.heading_three"
                          value={values.section_nine.heading_three}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image 3</Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_ten"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_ten", file);
                                  setImageTen(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_ten && touched.image_ten && (
                              <p className="text-danger">{errors.image_ten}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageTen || values?.image_ten} alt={values?.section_nine?.image_three_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image Three Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_three_name"
                          value={values?.section_nine?.image_three_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_three_name && touched.section_nine?.image_three_name && (
                          <p className="text-danger">{errors.section_nine?.image_three_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image Three Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_three_link"
                          value={values?.section_nine?.image_three_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_three_link && touched.section_nine?.image_three_link && (
                          <p className="text-danger">{errors.section_nine?.image_three_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Content 3</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.content_three"
                          value={values.section_nine.content_three}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Heading 4</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.heading_four"
                          value={values.section_nine.heading_four}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image 4</Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_eleven"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_eleven", file);
                                  setImageEleven(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_eleven && touched.image_eleven && (
                              <p className="text-danger">{errors.image_eleven}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageEleven || values?.image_eleven} alt={values?.section_nine?.image_four_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image Four Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_four_name"
                          value={values?.section_nine?.image_four_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_four_name && touched.section_nine?.image_four_name && (
                          <p className="text-danger">{errors.section_nine?.image_four_name}</p>
                        )}
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Image Four Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.image_four_link"
                          value={values?.section_nine?.image_four_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.section_nine?.image_four_link && touched.section_nine?.image_four_link && (
                          <p className="text-danger">{errors.section_nine?.image_four_link}</p>
                        )}
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col as={Col} md={12}>
                      <Form.Group>
                        <Form.Label>Content 4</Form.Label>
                        <Form.Control
                          type="text"
                          name="section_nine.content_four"
                          value={values.section_nine.content_four}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_ten */}
                <Row className="mt-6">
                  <Col><p className="text-primary fs-6">Section 10</p></Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_ten.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_ten?.status}
                        value={values.section_ten?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image (JPEG, JPG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_twelve"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_twelve", file);
                                  setImageTwelve(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_twelve && touched.image_twelve && (
                              <p className="text-danger">{errors.image_twelve}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageTwelve || values?.image_twelve} alt={values?.section_ten?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_ten.banner_image_name"
                          value={values?.section_ten?.banner_image_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {
                          errors.section_ten?.banner_image_name && touched.section_ten?.banner_image_name ?
                            <p className="text-danger">{errors.section_ten?.banner_image_name}</p> : null
                        }
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_ten.banner_image_link"
                          value={values?.section_ten?.banner_image_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {
                          errors.section_ten?.banner_image_link && touched.section_ten?.banner_image_link ?
                            <p className="text-danger">{errors.section_ten?.banner_image_link}</p> : null
                        }
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/*section_eleven*/}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 11 -</p>
                    <Form.Control
                      type="text"
                      name="section_eleven.name"
                      value={values.section_eleven?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_eleven}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_eleven')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_eleven.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_eleven?.status}
                        value={values.section_eleven?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Category</Form.Label>
                        <Select
                          options={category_options}
                          name="section_eleven.select_category"
                          onChange={(selectedOption) =>
                            setFieldValue("section_eleven.select_category", selectedOption)
                          }
                          value={values.section_eleven.select_category}
                          onBlur={handleBlur}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_twelve */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 12 -</p>
                    <Form.Control
                      type="text"
                      name="section_twelve.name"
                      value={values.section_twelve?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_twelve}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_twelve')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_twelve.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_twelve?.status}
                        value={values.section_twelve?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_twelve.select_product"
                          value={values.section_twelve.select_product}
                          onChange={(selectedOption) =>
                            setFieldValue("section_twelve.select_product", selectedOption)
                          }
                          onBlur={handleBlur}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_thirteen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 13 -</p>
                    <Form.Control
                      type="text"
                      name="section_thirteen.name"
                      value={values.section_thirteen?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_thirteen}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_thirteen')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_thirteen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_thirteen?.status}
                        value={values.section_thirteen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_thirteen.select_product"
                          value={values.section_thirteen.select_product}
                          onChange={(selectedOption) =>
                            setFieldValue("section_thirteen.select_product", selectedOption)
                          }
                          onBlur={handleBlur}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_fourteen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 14 -</p>
                    <Form.Control
                      type="text"
                      name="section_fourteen.name"
                      value={values.section_fourteen?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_fourteen}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_fourteen')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_fourteen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_fourteen?.status}
                        value={values.section_fourteen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_fourteen.select_product"
                          value={values.section_fourteen.select_product}
                          onChange={(selectedOption) =>
                            setFieldValue("section_fourteen.select_product", selectedOption)
                          }
                          onBlur={handleBlur}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_fifteen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 14 -</p>
                    <Form.Control
                      type="text"
                      name="section_fifteen.name"
                      value={values.section_fifteen?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_fifteen}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_fifteen')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_fifteen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_fifteen?.status}
                        value={values.section_fifteen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_fifteen.select_product"
                          value={values.section_fifteen.select_product}
                          onChange={(selectedOption) =>
                            setFieldValue("section_fifteen.select_product", selectedOption)
                          }
                          onBlur={handleBlur}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_sixteen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 16</p>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_sixteen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_sixteen?.status}
                        value={values.section_sixteen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image (JPEG, JPG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_thirteen"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_thirteen", file);
                                  setImageThirteen(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_thirteen && touched.image_thirteen && (
                              <p className="text-danger">{errors.image_thirteen}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageThirteen || values?.image_thirteen} alt={values?.section_sixteen?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_sixteen.banner_image_name"
                          value={values?.section_sixteen?.banner_image_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {
                          errors.section_sixteen?.banner_image_name && touched.section_sixteen?.banner_image_name ?
                            <p className="text-danger">{errors.section_sixteen?.banner_image_name}</p> : null
                        }
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_sixteen.banner_image_link"
                          value={values?.section_sixteen?.banner_image_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {
                          errors.section_sixteen?.banner_image_link && touched.section_sixteen?.banner_image_link ?
                            <p className="text-danger">{errors.section_sixteen?.banner_image_link}</p> : null
                        }
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_seventeen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 17 -</p>
                    <Form.Control
                      type="text"
                      name="section_seventeen.name"
                      value={values.section_seventeen?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_seventeen}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_seventeen')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_seventeen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_seventeen?.status}
                        value={values.section_seventeen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Category</Form.Label>
                        <Select
                          options={category_options}
                          name="section_seventeen.select_category"
                          value={values.section_seventeen.select_category}
                          onChange={(selectCategory) => {
                            setFieldValue("section_seventeen.select_category", selectCategory)
                          }}
                          isSearchable
                          isMulti
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_eighteen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 18 -</p>
                    <Form.Control
                      type="text"
                      name="section_eighteen.name"
                      value={values.section_eighteen?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_eighteen}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_eighteen')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_eighteen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_eighteen?.status}
                        value={values.section_eighteen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_eighteen.select_product"
                          value={values.section_eighteen.select_product}
                          onChange={(selectCategory) => {
                            setFieldValue("section_eighteen.select_product", selectCategory)
                          }}
                          onBlur={handleBlur}
                          isMulti
                          isSearchable
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                {/* section_nineteen */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 19 -</p>
                    <Form.Control
                      type="text"
                      name="section_nineteen.name"
                      value={values.section_nineteen?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_nineteen}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_nineteen')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_nineteen.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_nineteen?.status}
                        value={values.section_nineteen?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_nineteen.select_product"
                          value={values.section_nineteen.select_product}
                          onChange={(selectCategory) => {
                            setFieldValue("section_nineteen.select_product", selectCategory)
                          }}
                          isSearchable
                          isMulti
                          onBlur={handleBlur}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_twenty */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 20 -</p>
                    <Form.Control
                      type="text"
                      name="section_twenty.name"
                      value={values.section_twenty?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_twenty}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_twenty')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_twenty.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_twenty?.status}
                        value={values.section_twenty?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_twenty.select_product"
                          value={values.section_twenty.select_product}
                          onChange={(selectCategory) => {
                            setFieldValue("section_twenty.select_product", selectCategory)
                          }}
                          onBlur={handleBlur}
                          isSearchable
                          isMulti
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_twentyone */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6 ">Section 21 -</p>
                    <Form.Control
                      type="text"
                      name="section_twentyone.name"
                      value={values.section_twentyone?.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      readOnly={readOnlyFields?.section_twentyone}
                    />
                    <i className="fe fe-edit text-warning action_icon" onClick={() => handleEditClick('section_twentyone')}></i>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_twentyone.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_twentyone?.status}
                        value={values.section_twentyone?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Select Product</Form.Label>
                        <Select
                          options={options}
                          name="section_twentyone.select_product"
                          value={values.section_twentyone.select_product}
                          onChange={(selectCategory) => {
                            setFieldValue("section_twentyone.select_product", selectCategory)
                          }}
                          onBlur={handleBlur}
                          isSearchable
                          isMulti
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>

                {/* section_twentytwo */}
                <Row className="mt-6">
                  <Col as={Col} md={6} className="career_editable">
                    <p className="text-primary fs-6">Section 22</p>
                  </Col>
                  <Col as={Col} md={6}>
                    <label className="custom-switch">
                      <input
                        type="checkbox"
                        name="section_twentytwo.status"
                        className="custom-switch-input"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        checked={values.section_twentytwo?.status}
                        value={values.section_twentytwo?.status}
                      />
                      <span className="custom-switch-indicator custum-green-btn home_cms_toggle"></span>
                    </label>
                  </Col>
                  <Row>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Image (JPG, JPEG, PNG, WEBP) <span className="text-danger">*</span></Form.Label>
                        <Row>
                          <Col as={Col} md={8}>
                            <Form.Control
                              type="file"
                              accept=".jpg,.jpeg,.png,.webp"
                              name="image_fourteen"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  const fileURL = URL.createObjectURL(file);
                                  setFieldValue("image_fourteen", file);
                                  setImageFourteen(fileURL);
                                }
                              }}
                              style={{ objectFit: "cover", borderRadius: "5px", border: "1px solid #ddd" }}
                              onBlur={handleBlur}
                            />
                            {errors.image_fourteen && touched.image_fourteen && (
                              <p className="text-danger">{errors.image_fourteen}</p>
                            )}
                          </Col>
                          <Col as={Col} md={4}>
                            <img src={imageFourteen || values?.image_fourteen} alt={values?.section_twentytwo?.banner_image_name} className="w-100 h-100 border border-dark" />
                          </Col>
                        </Row>
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Name <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_twentytwo.banner_image_name"
                          value={values?.section_twentytwo.banner_image_name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {
                          errors.section_twentytwo?.banner_image_name && touched.section_twentytwo?.banner_image_name ?
                            <p className="text-danger">{errors.section_twentytwo?.banner_image_name}</p> : null
                        }
                      </Form.Group>
                    </Col>
                    <Col as={Col} md={6}>
                      <Form.Group>
                        <Form.Label>Banner Link <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          type="text"
                          name="section_twentytwo.banner_image_link"
                          value={values?.section_twentytwo?.banner_image_link}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {
                          errors.section_twentytwo?.banner_image_link && touched.section_twentytwo?.banner_image_link ?
                            <p className="text-danger">{errors.section_twentytwo?.banner_image_link}</p> : null
                        }
                      </Form.Group>
                    </Col>
                  </Row>
                </Row>


                <Row>
                  <Col as={Col} md={12}>
                    <Form.Label>Description</Form.Label>
                    <SunEditor
                      name="description"
                      onChange={(content) => setFieldValue("description", content)}
                      onBlur={() => setFieldTouched("description", true)}
                      setOptions={options_for_sunEditor}
                      setContents={values.description}
                    />
                  </Col>
                </Row>

                <SeoForm
                  setFieldValue={setFieldValue}
                  handleChange={handleChange}
                  values={values}
                  errors={errors}
                  handleBlur={handleBlur}
                  touched={touched}
                // readOnlyStatus={true}
                />
                <Row className="mt-3 justify-content-center">
                  {
                    showAdd && (
                      <Button type="submit" className="w-auto">
                        Submit
                      </Button>
                    )
                  }
                </Row>
              </Form>
            </Card.Body>
          </Card>
        </Row>
      </>
    );
  }
}

export default CMSForm;
