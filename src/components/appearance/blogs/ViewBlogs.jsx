import React, { useEffect, useState } from "react";
import { Card, Row, Col, Form, Button } from "react-bootstrap";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";
import { useFormik } from "formik";
import { Link, useLocation, useParams } from "react-router-dom";
import { AddBlogsValidation } from "../../../commondata/formvalidations";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import slugify from "slugify";
import TagInput from "rsuite/TagInput";
import "rsuite/TagInput/styles/index.css";
import SeoForm from "../../seo-page/SeoForm";
import Loader from "../../../layouts/layoutcomponents/loader";
import { useEditBlogMutation, useGetAllBlogsCategoryQuery, useGetAllBlogsQuery, useGetAllBlogsTagsQuery, useGetSingleBlogsQuery } from "../../../redux/features/blogsEndPoints";
import Select from "react-select";
import { options_for_sunEditor } from "../../../commondata/formEditorOptions";
import { useNavigate } from "react-router-dom";
import { getBlogsPage } from "../../../utils/routes";
import CreatableSelect from 'react-select/creatable';
import toast from "react-hot-toast";
import { openModal } from "../../../redux/slices/allModalSlice";
import { useDispatch } from "react-redux";


export default function EditBlogs() {
  const { id } = useParams()
  const dispatch = useDispatch();
  const [editBlog, { isLoading: loading }] = useEditBlogMutation()
  const { data, isError, error, isLoading, isFetching, isSuccess, refetch: refetchSingleblog } = useGetSingleBlogsQuery(id, { refetchOnMountOrArgChange: true })
  const { refetch } = useGetAllBlogsQuery()
  const singleBlog = data?.data
  const { data: tags } = useGetAllBlogsTagsQuery()
  const { data: category } = useGetAllBlogsCategoryQuery()
  const tagData = tags?.data
  const categoryData = category?.data?.GetBlogCategory;
  const navigate = useNavigate()
  const [viewThubnail, setViewThubnail] = useState(true);
  const [selectedThubnail, setSelectedThubnail] = useState(null);
  const initialValues = {
    title: "",
    banner_image: "",
    status: "",
    slug: "",
    tags: [],
    excerpt: "",
    category: null,
    content: "",
    meta_title: "",
    meta_description: "",
    meta_keywords: "",
    og_tag: "",
    schema_markup: "",
  };
  const { values, errors, handleBlur, touched, handleChange, handleSubmit, resetForm, setFieldValue, setFieldTouched, } = useFormik({
    initialValues: initialValues,
    validationSchema: AddBlogsValidation,
    onSubmit: async (values) => {
      const formData = new FormData();
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'tags') {
          value.forEach(tag => {
            formData.append('tags', tag.label);
          })
        } else if (key === 'category') {
          value.forEach(cate => {
            formData.append('category', cate.value);
          })
        }
        else {
          formData.append(key, value);
        }
      });
      try {
        const response = await editBlog({ blogData: formData, blogId: id });
        if (response?.data?.http_status_code === 200) {
          toast.success(response.data.message)
          refetch()
          // refetchSingleblog()
          navigate(`${getBlogsPage()}`)
        }
      } catch (error) {
        console.error(error);
      }
    },
  });

  const generateSlug = (values) => {
    const slug = slugify(values, { lower: true });
    setFieldValue("slug", slug);
  };

  const handleBlogSlug = (event) => {
    handleChange(event);
    generateSlug(event.target.value);
  };

  const tagOptions = tagData ? tagData.map(tag => ({
    value: tag?.id,
    label: tag?.name,
  })) : [];

  const options = categoryData ? categoryData.map(category => ({
    value: category?.id,
    label: category?.name
  })) : [];

  const handleThumbnailChange = (event) => {
    const file = event.target.files[0];
    setFieldValue('banner_image', file)
    if (file) {
      setViewThubnail(false)
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedThubnail(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    setFieldValue('title', singleBlog?.title)
    setFieldValue('status', singleBlog?.status)
    setFieldValue('slug', singleBlog?.slug)
    setFieldValue('banner_image', singleBlog?.banner_image)
    setFieldValue('excerpt', singleBlog?.excerpt)
    setFieldValue(
      'category',
      singleBlog && singleBlog?.category
        .filter(item => item !== null)
        .map(cate => ({
          value: cate?.id,
          label: cate?.name,
        }))
    );
    setFieldValue('tags', singleBlog && singleBlog?.tags?.map(tag => ({
      value: tag?.id,
      label: tag?.name,
    })));
    setFieldValue('content', singleBlog?.content)
    setFieldValue('content', singleBlog?.content)
    setFieldValue('meta_title', singleBlog?.meta_title);
    setFieldValue('meta_description', singleBlog?.meta_description);
    setFieldValue('meta_keywords', singleBlog?.meta_keywords);
    setFieldValue('og_tag', singleBlog?.og_tag);
    setFieldValue('schema_markup', singleBlog?.schema_markup);
  }, [singleBlog])

  if (isLoading || isFetching) {
    return <Loader />;
  }
  if (isError) {
    return <Error error_mes={error} />;
  }
  if (isSuccess) {
    return (
      <div>
        <Row className="align-items-center">
          <Col className="text-start">
            <PageHeader titles="Blogs" active={["View Blog"]} items={["Home", "Blog List"]} links={["/dashboard", "/blogs"]} />
          </Col>
          <Col className="text-end">
            <Link to="/blogs" className="btn btn-success text-white me-3" >View All Blogs</Link>
          </Col>
        </Row>
        <Row>
          <Col md={12} lg={12}>
            <Card>
              <Card.Header>Edit Blog</Card.Header>
              <Card.Body className="add_new_product">
                <Form onSubmit={handleSubmit} className="add_category_form">
                  {loading && <Loader />}
                  <Row className="mb-4">
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Title <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        title="text"
                        name="title"
                        onChange={handleBlogSlug}
                        onBlur={handleBlur}
                        value={values.title}
                        readOnly
                      />
                      {errors.title && touched.title ? (
                        <p className={`error`}>{errors.title}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Banner Image (JPG,JPEG,PNG,2MB Size)
                        <span className="required_icon">*</span>
                      </Form.Label>
                      <Row>
                        <Col as={Col} md={3} className="d-flex justify-content-center" >
                          <div className="position-relative">
                            <span onClick={() => { dispatch(openModal({ componentName: 'FeaturedImgModal', data: singleBlog?.banner_image })) }} className="cursor-pointer"><img src={singleBlog?.banner_image} alt="error" width={50} height={50} /></span>
                          </div>
                        </Col>
                        <Col as={Col} md={9}>
                          <Form.Control
                            type="file"
                            name="banner_image"
                            accept=".jpg,.jpeg,.png,.webp"
                            onChange={handleThumbnailChange}
                            onBlur={handleBlur}
                            // value={values.banner_image}
                            disabled
                          />
                        </Col>
                      </Row>
                      {errors.banner_image && touched.banner_image ? (
                        <p className={`error`}>{errors.banner_image}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Status <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Select
                        name="status"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.status}
                        disabled
                      >
                        <option value="false">Inactive</option>
                        <option value="true">Active</option>
                      </Form.Select>
                      {errors.status && touched.status ? (
                        <p className={`error`}>{errors.status}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row className="mb-6">
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Slug <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        title="text"
                        name="slug"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.slug}
                        readOnly
                      />
                      {errors.slug && touched.slug ? (
                        <p className={`error`}>{errors.slug}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>
                        Excerpt <span className="required_icon">*</span>
                      </Form.Label>
                      <Form.Control
                        title="text"
                        name="excerpt"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.excerpt}
                        readOnly
                      />
                      {errors.excerpt && touched.excerpt ? (
                        <p className={`error`}>{errors.excerpt}</p>
                      ) : null}
                    </Form.Group>
                    <Form.Group as={Col} md="4">
                      <Form.Label>Category <span className="required_icon">*</span></Form.Label>
                      <Select
                        options={options}
                        name="category"
                        value={values.category}
                        onChange={(selectedOptions) =>
                          setFieldValue("category", selectedOptions)
                        }
                        onBlur={handleBlur}
                        isMulti
                        className="select_box rounded-4"
                        isSearchable
                        // closeMenuOnSelect={false}
                        isDisabled
                      />
                      {errors.category && touched.category ? (
                        <p className={`error`}>{errors.category}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row className="mb-6">
                    <Form.Group as={Col} md="12">
                      <Form.Label>Tags</Form.Label>
                      <CreatableSelect
                        options={tagOptions}
                        name="tags"
                        value={values.tags}
                        onChange={(selectedOptions) => setFieldValue("tags", selectedOptions)}
                        onBlur={handleBlur}
                        className="rounded-4"
                        isSearchable
                        placeholder="Add Tags..."
                        isMulti
                        isDisabled
                      />
                    </Form.Group>
                  </Row>


                  <Row className="mb-6">
                    <Form.Group as={Col} md="12">
                      <Form.Label>
                        Content <span className="required_icon">*</span>
                      </Form.Label>
                      <SunEditor
                        name="content"
                        onChange={(content) => setFieldValue("content", content)}
                        onBlur={() => setFieldTouched("content", true)}
                        setContents={values.content}
                        setOptions={options_for_sunEditor}
                        readOnly
                      />
                      {errors.content && touched.content ? (
                        <p className={`error`}>{errors.content}</p>
                      ) : null}
                    </Form.Group>
                  </Row>
                  <Row>
                    <SeoForm
                      handleChange={handleChange}
                      values={values}
                      errors={errors}
                      handleBlur={handleBlur}
                      touched={touched}
                      readOnlyStatus={true}
                    />
                  </Row>
                  {/* <Row className="mt-4">
                    <Button
                      title="submit"
                      type="submit"
                      className="btn-primary mx-auto w-auto"
                    >
                      Submit
                    </Button>
                  </Row> */}
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}
