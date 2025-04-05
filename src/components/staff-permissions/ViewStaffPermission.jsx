import React, { useEffect } from 'react';
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AddStaffValidation } from '../../commondata/formvalidations';
import { useFormik } from 'formik';
import Select from 'react-select';
import { useAddStaffMutation, useGetAllModulesQuery, useGetSingleStaffQuery } from '../../redux/features/staffEndPoint';
import Loader from '../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';

export default function ViewStaffPermissions() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { data: modulesData, isLoading: modulesLoading } = useGetAllModulesQuery();
    const { data: userData, isLoading, isSuccess } = useGetSingleStaffQuery(id);
    // const [addStaff, { isLoading: addLoading }] = useAddStaffMutation(id);

    const singleUserData = userData?.data || null;
    const modelNameList = modulesData?.data || [];

    const initialValues = {
        name: "",
        // password: "",
        // password_confirmation: "",
        phone_number: "",
        dob: "",
        profile_pic: "",
        email: "",
        user_permission: [],
        about: "",
        designation: "",
        qualification: ""
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues,
        validationSchema: AddStaffValidation,
        // onSubmit: async (values) => {
        //     const formData = new FormData();
        //     Object.entries(values).forEach(([key, value]) => {
        //         if (key === 'user_permission') {
        //             formData.append(key, JSON.stringify(value));
        //         } else {
        //             formData.append(key, value);
        //         }
        //     });

        //     try {
        //         const response = await addStaff(formData);
        //         if (response?.data?.http_status_code === 201) {
        //             toast.success(response?.data?.message);
        //             navigate('/staff-permissions');
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
        // },
    });

    useEffect(() => {
        if (isSuccess && singleUserData) {
            setFieldValue("name", singleUserData.name);
            setFieldValue("email", singleUserData.email);
            setFieldValue("phone_number", singleUserData.phone_number);
            setFieldValue("dob", singleUserData.dob.split('T')[0]);
            setFieldValue("profile_pic", singleUserData.profile_pic);
            setFieldValue('designation', singleUserData?.designation);
            setFieldValue('about', singleUserData?.about);
            setFieldValue('qualification', singleUserData?.qualification);

            const userPermissions = modelNameList.map((model) => {
                const userPermission = singleUserData.user_permissions.find(permission => permission.model === model) || {};
                return {
                    name: model,
                    permissions: userPermission.Permission || []
                };
            });

            setFieldValue('user_permission', userPermissions);
        }
    }, [isSuccess, singleUserData, modelNameList, setFieldValue]);

    const permissionOptions = [
        { value: "view", label: "view" },
        { value: "add", label: "add" },
        { value: "edit", label: "edit" },
        { value: "delete", label: "delete" },
        { value: "add-trash", label: "add-trash" },
        { value: "view-trash", label: "view-trash" },
        { value: "restore-trash", label: "restore-trash" },
        { value: "import", label: "import" },
        { value: "export", label: "export" },
    ];

    const handlePermissionChange = (selectedOptions, modelIndex) => {
        const updatedPermissions = selectedOptions ? selectedOptions.map(option => option.value) : [];
        const updatedUserPermissions = [...values.user_permission];
        updatedUserPermissions[modelIndex].permissions = updatedPermissions;
        setFieldValue('user_permission', updatedUserPermissions);
    };

    return (
        <>
            {modulesLoading && <Loader />}
            <Row>
                <Col>
                    <PageHeader titles="Staff Permissions" active="View Staff" items={["Home", "Staff List"]} links={["/dashboard", "/staff-permissions"]} />
                </Col>
            </Row>
            <Row>
                <Col>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Card.Header className='bg-primary text-white fs-4 rounded-3'>Staff Data</Card.Header>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Name <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='name'
                                                value={values.name}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly
                                            />
                                            {errors.name && touched.name && <p className='text-danger'>{errors.name}</p>}
                                        </Form.Group>
                                    </Col>

                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Phone Number <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='phone_number'
                                                value={values.phone_number}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly
                                            />
                                            {errors.phone_number && touched.phone_number && <p className='text-danger'>{errors.phone_number}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>DOB <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type='date'
                                                name='dob'
                                                value={values.dob}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly
                                            />
                                            {errors.dob && touched.dob && <p className='text-danger'>{errors.dob}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Email <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type='text'
                                                name='email'
                                                value={values.email}
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                readOnly
                                            />
                                            {errors.email && touched.email && <p className='text-danger'>{errors.email}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Profile Picture <span className='text-danger'>*</span></Form.Label>
                                            <Form.Control
                                                type='file'
                                                name='profile_pic'
                                                onChange={(e) => setFieldValue("profile_pic", e.target.files[0])}
                                                onBlur={handleBlur}
                                                readOnly
                                            />
                                            {errors.profile_pic && touched.profile_pic && <p className='text-danger'>{errors.profile_pic}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={4}>
                                        <Form.Group>
                                            <Form.Label>Designation</Form.Label>
                                            <Form.Control name='designation' value={values.designation} onChange={handleChange} onBlur={handleBlur} disabled />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={8}>
                                        <Form.Group>
                                            <Form.Label>About</Form.Label>
                                            <textarea className='border border-black rounded-3 w-100 ' name='about' value={values.about} onChange={handleChange} onBlur={handleBlur} disabled />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={12}>
                                        <Form.Label>Qualification</Form.Label>
                                        <textarea className='border border-black rounded-3 w-100 ' name='qualification' value={values.qualification} onChange={handleChange} onBlur={handleBlur} disabled />
                                    </Col>
                                </Row>
                                <Card.Header className='bg-primary text-white fs-4 rounded-3 my-5'>User Permissions</Card.Header>
                                <Row>
                                    {modelNameList.length > 0 && values.user_permission.length > 0 && modelNameList.map((model, index) => (
                                        <Col md={4} key={index}>
                                            <Form.Group>
                                                <Form.Label>{model}</Form.Label>
                                                <Select
                                                    name={`permissions_${model}`}
                                                    options={permissionOptions}
                                                    value={permissionOptions.filter(option =>
                                                        values.user_permission[index].permissions.includes(option.value)
                                                    )}
                                                    onChange={(selectedOptions) => handlePermissionChange(selectedOptions, index)}
                                                    onBlur={handleBlur}
                                                    isMulti
                                                    isSearchable
                                                    isDisabled
                                                    menuPlacement='auto'
                                                />
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                                {/* <Row className="mt-4">
                                    <Col className='text-center'>
                                        <Button type="submit" className="">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row> */}
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
