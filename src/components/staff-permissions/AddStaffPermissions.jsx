import React, { useEffect, useState } from 'react';
import PageHeader from '../../layouts/layoutcomponents/pageheader';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { AddStaffValidation } from '../../commondata/formvalidations';
import { useFormik } from 'formik';
import Select from 'react-select';
import { useAddStaffMutation, useGetAllModulesQuery, useGetAllStaffQuery } from '../../redux/features/staffEndPoint';
import Loader from '../../layouts/layoutcomponents/loader';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { FiEye, FiEyeOff } from 'react-icons/fi';

export default function AddStaffPermissions() {
    const navigate = useNavigate();
    const { data, isLoading: modulesLoading } = useGetAllModulesQuery();
    const [addStaff, { isLoading: addLoading }] = useAddStaffMutation();
    const { refetch } = useGetAllStaffQuery();
    const [showPassword, setShowPassword] = useState(false)
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false)

    const modelNameList = data?.data || [];

    const initialValues = {
        name: "",
        password: "",
        password_confirmation: "",
        phone_number: "",
        dob: "",
        profile_pic: "",
        email: "",
        user_permission: [],
        designation: "",
        about: "",
        qualification: ""
    };

    const { values, errors, handleBlur, touched, handleChange, handleSubmit, setFieldValue } = useFormik({
        initialValues,
        validationSchema: AddStaffValidation,
        onSubmit: async (values) => {
            const formData = new FormData();
            Object.entries(values).forEach(([key, value]) => {
                if (key === 'user_permission') {
                    formData.append(key, JSON.stringify(value));
                } else {
                    formData.append(key, value);
                }
            });

            try {
                const response = await addStaff(formData);
                console.log("response", response?.data);
                if (response?.data?.http_status_code === 201) {
                    toast.success(response?.data?.message);
                    refetch();
                    navigate('/staff-permissions');
                }
            } catch (error) {
                console.error(error);
            }
        },
    });

    useEffect(() => {
        if (modelNameList.length > 0) {
            const userPermissions = modelNameList.map((model) => ({
                name: model,
                permissions: []
            }));
            setFieldValue('user_permission', userPermissions);
        }
    }, [modelNameList, setFieldValue]);

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
        { value: "reviewer", label: "reviewer" },
    ];

    const handlePermissionChange = (selectedOptions, modelIndex) => {
        const updatedPermissions = selectedOptions ? selectedOptions.map(option => option.value) : [];

        // Ensure "view" permission is selected if any other permission is selected
        if (updatedPermissions.length > 0 && !updatedPermissions.includes("view")) {
            updatedPermissions.push("view");
        }

        const updatedUserPermissions = [...values.user_permission];
        updatedUserPermissions[modelIndex].permissions = updatedPermissions;
        setFieldValue('user_permission', updatedUserPermissions);
    };


    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };
    const togglePasswordConfirmationVisibility = () => {
        setShowPasswordConfirmation(!showPasswordConfirmation);
    };

    return (
        <>
            {(modulesLoading || addLoading) && <Loader />}
            <Row>
                <Col>
                    <PageHeader titles="Staff Permissions" active="Add Staff" items={["Home", "Staff List"]} links={["/dashboard", "/staff-permissions"]} />
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
                                            />
                                            {errors.profile_pic && touched.profile_pic && <p className='text-danger'>{errors.profile_pic}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Password <span className='text-danger'>*</span></Form.Label>
                                            <div className="input-icon">
                                                <span
                                                    className="input-icon-addon pe-auto"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={togglePasswordVisibility}
                                                >
                                                    {showPassword ? (
                                                        <FiEyeOff size={20} />
                                                    ) : (
                                                        <FiEye size={20} />
                                                    )}
                                                </span>
                                                <Form.Control
                                                    type={showPassword ? "text" : "password"}
                                                    name='password'
                                                    value={values.password}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            {errors.password && touched.password && <p className='text-danger'>{errors.password}</p>}
                                        </Form.Group>
                                    </Col>
                                    <Col md={4}>
                                        <Form.Group>
                                            <Form.Label>Confirm Password <span className='text-danger'>*</span></Form.Label>
                                            <div className="input-icon">
                                                <span
                                                    className="input-icon-addon pe-auto"
                                                    style={{ cursor: "pointer" }}
                                                    onClick={togglePasswordConfirmationVisibility}
                                                >
                                                    {showPasswordConfirmation ? (
                                                        <FiEyeOff size={20} />
                                                    ) : (
                                                        <FiEye size={20} />
                                                    )}
                                                </span>
                                                <Form.Control
                                                    type={showPasswordConfirmation ? "text" : "password"}
                                                    name='password_confirmation'
                                                    value={values.password_confirmation}
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            </div>
                                            {errors.password_confirmation && touched.password_confirmation && <p className='text-danger'>{errors.password_confirmation}</p>}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={4}>
                                        <Form.Group>
                                            <Form.Label>Designation</Form.Label>
                                            <Form.Control name='designation' value={values.designation} onChange={handleChange} onBlur={handleBlur} />
                                        </Form.Group>
                                    </Col>
                                    <Col as={Col} md={8}>
                                        <Form.Group>
                                            <Form.Label>About</Form.Label>
                                            <textarea className='border border-black rounded-3 w-100 ' name='about' value={values.about} onChange={handleChange} onBlur={handleBlur} />
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col as={Col} md={12}>
                                        <Form.Label>Qualification</Form.Label>
                                        <textarea className='border border-black rounded-3 w-100 ' name='qualification' value={values.qualification} onChange={handleChange} onBlur={handleBlur} />
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
                                                    menuPlacement='auto'
                                                />
                                            </Form.Group>
                                        </Col>
                                    ))}
                                </Row>
                                <Row className="mt-4">
                                    <Col className='text-center'>
                                        <Button type="submit" className="">
                                            Submit
                                        </Button>
                                    </Col>
                                </Row>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </>
    );
}
