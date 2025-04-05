import React, { useEffect, useState } from "react";
import CountUp from "react-countup";
import ReactApexChart from "react-apexcharts";
import { Breadcrumb, Col, Row, Card, Button, Form, Table } from "react-bootstrap";
import { Link } from "react-router-dom";
import PageHeader from "../../layouts/layoutcomponents/pageheader";
import Loader from "../../layouts/layoutcomponents/loader";
import { IoRocketOutline } from "react-icons/io5";
import { GoGraph } from "react-icons/go";
import { FaCartArrowDown, FaMoneyBillWave, FaUserFriends } from "react-icons/fa";
import { GiMedicines } from "react-icons/gi";
import { MdOutlineAttachMoney } from "react-icons/md";
import { useGetCompleteDashBoardDataQuery } from "../../redux/features/dashboardEndPoint";
import toast from "react-hot-toast";

export default function Dashboard() {
  const role = localStorage.getItem("role");
  const permissions = JSON.parse(localStorage.getItem("permissions"));

  const [queryParam, setQueryParam] = useState({
    period: "daily",
    fromDate: "",
    toDate: ""
  });

  const [fromDate, setFromDate] = useState("")
  const [toDate, setToDate] = useState("")

  const { data: comepleteDashboardData, isLoading: loadingCompleteData, isSuccess } = useGetCompleteDashBoardDataQuery(queryParam);

  const dashboardData = comepleteDashboardData?.data?.dashboard;
  const incomeDataTable = comepleteDashboardData?.data?.income?.data;
  const orderDetails = comepleteDashboardData?.data?.orders;


  const totalOrderData = [
    {
      id: 1,
      name: "Total Orders",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.totalOrders ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 2,
      name: "Total Medicine Sales",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.medicineData ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 3,
      name: "Total OTC Sales",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.productData ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 4,
      name: "Total Surgical Sales",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.surgicalEquipmentData ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
  ]


  const totalOrderDataToday = [
    {
      id: 1,
      name: "Total Orders Today",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.totalOrdersToday ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 2,
      name: "Total Medicine Sales Today",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.medicineDataToday ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 3,
      name: "Total OTC Sales Today",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.productDataToday ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 4,
      name: "Total Surgical Sales Today",
      icon: <IoRocketOutline className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.surgicalEquipmentDataToday ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
  ]


  const totalCustomerData = [
    {
      id: 1,
      name: "Total Customers",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.totalCustomers ?? 0,
      link: `/customer`,
      permission: "User"
    },
    {
      id: 2,
      name: "Never Order Customer",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.customersWhoNeverPurchased ?? 0,
      link: `/customer`,
      permission: "User"
    },
    {
      id: 2,
      name: "Order Customer",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.customersWhoPurchased ?? 0,
      link: `/customer`,
      permission: "User"
    },

  ]


  const totalCustomerDataToday = [
    {
      id: 1,
      name: "Total Customers Today Order",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.totalOrdersToday ?? 0,
      link: `/customer`,
      permission: "User"
    },
    {
      id: 2,
      name: "New Customer Order Today",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.todayRegisteredAndPurchased ?? 0,
      link: `/customer`,
      permission: "User"
    },
    {
      id: 3,
      name: "Order Existing Customer Today",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.previouslyRegisteredButPurchasedToday ?? 0,
      link: `/customer`,
      permission: "User"
    },
    {
      id: 4,
      name: "Registered Customer order Today",
      icon: <FaUserFriends className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.todayCustomersWhoNeverPurchased ?? 0,
      link: `/customer`,
      permission: "User"
    },
  ]


  const totalCouponData = [
    {
      id: 1,
      name: "Total Coupon Used",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.totalCouponAmount.toFixed(2) ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
    {
      id: 2,
      name:
        dashboardData?.trendingCoupons?.[0]
          ? `${dashboardData.trendingCoupons[0].coupon_id} (${dashboardData.trendingCoupons[0].count})`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.trendingCoupons?.[0]?.totalAmount ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
    {
      id: 3,
      name:
        dashboardData?.trendingCoupons?.[1]
          ? `${dashboardData.trendingCoupons[1].coupon_id} (${dashboardData.trendingCoupons[1].count})`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.trendingCoupons?.[1]?.totalAmount ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
    {
      id: 4,
      name:
        dashboardData?.trendingCoupons?.[2]
          ? `${dashboardData.trendingCoupons[2].coupon_id} (${dashboardData.trendingCoupons[2].count})`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.trendingCoupons?.[2]?.totalAmount ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
  ];


  const totalCouponDataToday = [
    {
      id: 1,
      name: "Coupon Used Today",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.couponAmountToday ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
    {
      id: 2,
      name:
        dashboardData?.todayTrandingCoupon?.[0]
          ? `${dashboardData.todayTrandingCoupon[0].coupon_id} (${dashboardData.todayTrandingCoupon[0].count})`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.todayTrandingCoupon?.[0]?.totalAmount ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
    {
      id: 3,
      name:
        dashboardData?.todayTrandingCoupon?.[1]
          ? `${dashboardData.todayTrandingCoupon[1].coupon_id} (${dashboardData.todayTrandingCoupon[1].count})`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.todayTrandingCoupon?.[1]?.totalAmount ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
    {
      id: 4,
      name:
        dashboardData?.todayTrandingCoupon?.[2]
          ? `${dashboardData.todayTrandingCoupon[2].coupon_id} (${dashboardData.todayTrandingCoupon[2].count})`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.todayTrandingCoupon?.[2]?.totalAmount ?? 0,
      link: `/coupon-usage`,
      permission: "Coupons"
    },
  ]


  const totalRevenueData = [
    {
      id: 1,
      name: "Total Revenue",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: Number(dashboardData?.totalRevenue) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 2,
      name: "Total Medicine Revenue",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.TotalMedicineRevenue?.toFixed(2) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 3,
      name: "Total OTC Revenue",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.TotalOTCRevenue?.toFixed(2) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 4,
      name: "Total Surgical Revenue",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.TotalEquipmentRevenue?.toFixed(2) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
  ]


  const totalRevenueDataToday = [
    {
      id: 1,
      name: "Total Revenue Today",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.totalRevenueToday ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 2,
      name: "Total Medicine Revenue Today",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.TotalMedicineRevenueToday?.toFixed(2) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 3,
      name: "Total OTC Revenue Today",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.TotalOTCRevenueToday?.toFixed(2) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
    {
      id: 4,
      name: "Total Surgical Revenue Today",
      icon: <MdOutlineAttachMoney className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.TotalEquipmentRevenueToday?.toFixed(2) ?? 0,
      link: `/all-orders`,
      permission: "Order"
    },
  ]


  const dashboardMainData = [
    {
      id: 1,
      name: "Total OTC Product",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-success-gradient",
      value: dashboardData?.totalGeneralProduct ?? 0,
      link: `/catalogue/products`,
      permission: "Product"
    },
    {
      id: 2,
      name: "Total Surgical Equipment",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.totalSurgicalEquipment ?? 0,
      link: `/catalogue/surgical-equipment`,
      permission: "Sergical_Equipment"
    },
    {
      id: 3,
      name: "Total Medicine",
      icon: <GiMedicines className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.totalMedicine ?? 0,
      link: `/catalogue/medicines`,
      permission: "Medicine"
    },
    {
      id: 4,
      name: "Total OTC Product Today",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-success-gradient",
      value: dashboardData?.totalGeneralProductToday ?? 0,
      link: `/catalogue/products`,
      permission: "Product"
    },
    {
      id: 5,
      name: "Total Surgical Equipment Today",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.totalSurgicalEquipmentToday ?? 0,
      link: `/catalogue/surgical-equipment`,
      permission: "Sergical_Equipment"
    },
    {
      id: 6,
      name: "Total Medicine Today",
      icon: <GiMedicines className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.totalMedicineToday ?? 0,
      link: `/catalogue/medicines`,
      permission: "Medicine"
    },
  ];

  //category details
  const categoryMainData = [
    {
      id: 1,
      name: "Total Medicine Category",
      icon: <GiMedicines className="text-light" />,

      class: "bg-success-gradient",
      value: dashboardData?.totalMedicineCategory ?? 0,
      link: `/catalogue/category`,
      permission: "Category"
    },
    {
      id: 2,
      name: "Total OTC Category",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-primary-gradient",
      value: dashboardData?.totalotcCategory ?? 0,
      link: `/catalogue/category`,
      permission: "Category"
    },
    {
      id: 3,
      name: "Total Surgical Equipment Category",
      icon: <FaCartArrowDown className="text-light" />,
      class: "bg-danger-gradient",
      value: dashboardData?.totalEquipmentCategory ?? 0,
      link: `/catalogue/category`,
      permission: "Category"
    },
  ];


  const topSellingCategory = [
    {
      id: 1,
      name:
        dashboardData?.topPurchasedCategories?.[0]
          ? `${dashboardData.topPurchasedCategories[0].name}`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.topPurchasedCategories?.[0]?.count ?? 0,
      link: `/catalogue/category`,
      permission: "Category"
    },
    {
      id: 2,
      name:
        dashboardData?.topPurchasedCategories?.[1]
          ? `${dashboardData.topPurchasedCategories[1].name}`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.topPurchasedCategories?.[1]?.count ?? 0,
      link: `/catalogue/category`,
      permission: "Category"
    },
    {
      id: 3,
      name:
        dashboardData?.topPurchasedCategories?.[2]
          ? `${dashboardData.topPurchasedCategories[2].name}`
          : "No Data",
      icon: <GoGraph className="text-light" />,
      class: "bg-warning-gradient",
      value: dashboardData?.topPurchasedCategories?.[2]?.count ?? 0,
      link: `/catalogue/category`,
      permission: "Category"
    },
  ]

  // chart data
  const chartData = {
    series: [
      {
        name: "Total Income",
        data: incomeDataTable?.map((item) => Number(item.totalIncome).toFixed(2)),
      },
      {
        name: "Order Count",
        data: incomeDataTable?.map((item) => Number(item.orderCount).toFixed(2)),
      },
    ],
    options: {
      chart: {
        type: "bar",
        height: 350,
      },
      xaxis: {
        categories: incomeDataTable?.map((item) =>
          queryParam.period === "yearly"
            ? item._id.toString()
            : `${item._id}`
        ),
        title: {
          text: queryParam.period === "yearly" ? "Years" : queryParam.period === "weekly" ? "Week" : queryParam.period === "daily" ? "Day" : "Month",
        },
      },
      yaxis: {
        title: {
          text: "Income / Orders",
        },
      },
      title: {
        text: `Income and Orders - ${queryParam.period.toUpperCase()}`,
        align: "center",
      },
    },
  };


  const options = {
    chart: {
      type: "donut",
    },
    labels: [
      "Placed",
      "Accepted",
      "Processed",
      "Packed",
      "In Transit",
      "Delivered",
      "Hold",
      "Rejected",
      "Cancelled",
    ],
    legend: {
      position: "bottom",
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
    colors: ["#FF5733", "#FFC300", "#36A2EB", "#4BC0C0", "#9966FF", "#FF6384", "#C9CBCF", "#8A56E2", "#28A745"], // Different colors for clarity
  };

  const series = [
    Number(orderDetails?.pending || 0),
    Number(orderDetails?.accepted || 0),
    Number(orderDetails?.processed || 0),
    Number(orderDetails?.packed || 0),
    Number(orderDetails?.dispatched || 0),
    Number(orderDetails?.delivered || 0),
    Number(orderDetails?.hold || 0),
    Number(orderDetails?.rejected || 0),
    Number(orderDetails?.cancelled || 0),
  ];



  const handleSubmitSearch = (e) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      toast.error("Please select both From Date and To Date.");
      return;
    }
    setQueryParam({ ...queryParam, fromDate, toDate });
  };

  return (
    <>
      {
        loadingCompleteData && <Loader />
      }
      <div>
        <Row>
          <Col as={Col} md={4}>
            <PageHeader titles="Dashboard" active="Dashboard" items={["Home"]} />
          </Col>
          <Col as={Col} md={8}>
            <Form onSubmit={handleSubmitSearch}>
              <Row className="align-items-end">
                <Col as={Col} md={4}>
                  <Form.Group>
                    <Form.Label>From Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={fromDate}
                      onChange={(e) => setFromDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col as={Col} md={4}>
                  <Form.Group>
                    <Form.Label>To Date</Form.Label>
                    <Form.Control
                      type="date"
                      value={toDate}
                      onChange={(e) => setToDate(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col as={Col} md={2} className="m-0">
                  <Row>
                    <Button type="submit" >Search</Button>
                  </Row>
                </Col>
              </Row>

            </Form>
          </Col>
        </Row>

        <Row>
          <Col lg={12} md={12} sm={12} xl={12}>
            <p className="bg-primary text-light rounded-3 text-center fw-bolder fs-4 mb-3 ">Today Data</p>
            <Row>
              <Col as={Col} md={3}>
                {
                  Array.isArray(totalOrderDataToday) && totalOrderDataToday?.length > 0 && totalOrderDataToday?.map((item) => (
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ?
                          (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">
                                      {
                                        item?.id === 3 || item?.id === 7 || item?.id === 10 ?
                                          '' : null
                                      }
                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>

                          ) : (
                            null)
                      }
                    </Link>
                  ))
                }
              </Col>
              <Col as={Col} md={3}>
                {
                  Array.isArray(totalCustomerDataToday) && totalCustomerDataToday?.length > 0 && totalCustomerDataToday?.map((item) => (
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ?
                          (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">
                                      {
                                        item?.id === 3 || item?.id === 7 || item?.id === 10 ?
                                          '' : null
                                      }
                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) : (
                            null
                          )
                      }
                    </Link>
                  ))
                }
              </Col>
              <Col as={Col} md={3}>
                {Array.isArray(totalCouponDataToday) &&
                  totalCouponDataToday
                    ?.filter((item) => item?.name !== "No Data")
                    ?.map((item) => (
                      <Link to={item?.link} key={item?.id}>
                        {
                          role === "Admin" || (role === "Staff" && (permissions?.Coupons ?? []).includes("view")) ? (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">
                                      {
                                        'Rs. '
                                      }
                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) : (
                            null
                          )
                        }
                      </Link>
                    ))}
              </Col>
              <Col as={Col} md={3}>
                {
                  Array.isArray(totalRevenueDataToday) && totalRevenueDataToday?.length > 0 && totalRevenueDataToday?.map((item) => (
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ? (
                          <Card className=" overflow-hidden">
                            <Card.Body className="card-body">
                              <Row>
                                <div className="col">
                                  <h6 className="">{item?.name}</h6>
                                  <h3 className="mb-2 number-font fs-5">
                                    {

                                      'Rs. '
                                    }
                                    <CountUp
                                      end={item?.value}
                                      separator=","
                                      start={0}
                                      duration={2.94}
                                    />
                                  </h3>
                                </div>
                                <div className="col col-auto">
                                  <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                    {item?.icon}
                                  </div>
                                </div>
                              </Row>
                            </Card.Body>
                          </Card>
                        ) : (
                          null
                        )
                      }

                    </Link>
                  ))
                }
              </Col>
            </Row>
          </Col>
        </Row >

        <Row>
          <Col lg={12} md={12} sm={12} xl={12}>
            <p className="bg-primary text-light rounded-3 text-center fw-bolder fs-4 mb-3 ">Total Data</p>
            <Row>
              <Col as={Col} md={3}>
                {
                  Array.isArray(totalOrderData) && totalOrderData?.length > 0 && totalOrderData?.map((item) => (
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view"))
                          ? (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">
                                      {
                                        item?.id === 3 || item?.id === 7 || item?.id === 10 ?
                                          '' : null
                                      }
                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) :
                          null
                      }
                    </Link>
                  ))
                }
              </Col>
              <Col as={Col} md={3}>
                {
                  Array.isArray(totalCustomerData) && totalCustomerData?.length > 0 && totalCustomerData?.map((item) => (
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.User ?? []).includes("view")) ? (
                          <Card className=" overflow-hidden">
                            <Card.Body className="card-body">
                              <Row>
                                <div className="col">
                                  <h6 className="">{item?.name}</h6>
                                  <h3 className="mb-2 number-font fs-5">
                                    {
                                      item?.id === 3 || item?.id === 7 || item?.id === 10 ?
                                        'Rs. ' : null
                                    }
                                    <CountUp
                                      end={item?.value}
                                      separator=","
                                      start={0}
                                      duration={2.94}
                                    />
                                  </h3>
                                </div>
                                <div className="col col-auto">
                                  <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                    {item?.icon}
                                  </div>
                                </div>
                              </Row>
                            </Card.Body>
                          </Card>
                        ) : (
                          null
                        )
                      }
                    </Link>
                  ))
                }
              </Col>
              <Col as={Col} md={3}>
                {Array.isArray(totalCouponData) &&
                  totalCouponData
                    ?.filter((item) => item?.name !== "No Data")
                    ?.map((item) => (
                      <Link to={item?.link} key={item?.id}>
                        {
                          role === "Admin" || (role === "Staff" && (permissions?.Coupons ?? []).includes("view")) ?
                            (
                              <Card className=" overflow-hidden">
                                <Card.Body className="card-body">
                                  <Row>
                                    <div className="col">
                                      <h6 className="">{item?.name}</h6>
                                      <h3 className="mb-2 number-font fs-5">
                                        {
                                          'Rs. '
                                        }
                                        <CountUp
                                          end={item?.value}
                                          separator=","
                                          start={0}
                                          duration={2.94}
                                        />
                                      </h3>
                                    </div>
                                    <div className="col col-auto">
                                      <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                        {item?.icon}
                                      </div>
                                    </div>
                                  </Row>
                                </Card.Body>
                              </Card>
                            ) :
                            (
                              null
                            )
                        }

                      </Link>
                    ))}
              </Col>
              <Col as={Col} md={3}>
                {
                  Array.isArray(totalRevenueData) && totalRevenueData?.length > 0 && totalRevenueData?.map((item) => (
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ?
                          (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">
                                      {
                                        'Rs. '
                                      }
                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) : (
                            null
                          )
                      }
                    </Link>
                  ))
                }
              </Col>
            </Row>
          </Col>
        </Row >

        <Row className="my-3">
          <Col>
            <p className="bg-primary text-light rounded-3 text-center fw-bolder fs-4 mb-3">Product Details</p>
            <Row>
              {
                Array.isArray(dashboardMainData) && dashboardMainData?.length > 0 && dashboardMainData?.map((item) => (
                  <Col as={Col} md={4} key={item.id}>
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.[item.permission] ?? []).includes("view")) ?
                          (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">

                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) : (
                            null
                          )
                      }
                    </Link>
                  </Col>
                ))
              }
            </Row>
          </Col>

        </Row>

        <Row className="my-3">
          <Col>
            <p className="bg-primary text-light rounded-3 text-center fw-bolder fs-4 mb-3">Category Data</p>
            <Row>
              {
                Array.isArray(categoryMainData) && categoryMainData?.length > 0 && categoryMainData?.map((item) => (
                  <Col as={Col} md={4} key={item.id}>
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.[item.permission] ?? []).includes("view")) ?
                          (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">

                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          ) : (
                            null
                          )
                      }
                    </Link>
                  </Col>
                ))
              }
            </Row>
          </Col>

        </Row>
        <Row className="my-3">
          <Col>
            <p className="bg-primary text-light rounded-3 text-center fw-bolder fs-4 mb-3">Top Selling Category</p>
            <Row>
              {
                Array.isArray(topSellingCategory) && topSellingCategory?.length > 0 && topSellingCategory?.map((item) => (
                  <Col as={Col} md={4} key={item.id}>
                    <Link to={item?.link} key={item?.id}>
                      {
                        role === "Admin" || (role === "Staff" && (permissions?.[item.permission] ?? []).includes("view"))
                          ? (
                            <Card className=" overflow-hidden">
                              <Card.Body className="card-body">
                                <Row>
                                  <div className="col">
                                    <h6 className="">{item?.name}</h6>
                                    <h3 className="mb-2 number-font fs-5">

                                      <CountUp
                                        end={item?.value}
                                        separator=","
                                        start={0}
                                        duration={2.94}
                                      />
                                    </h3>
                                  </div>
                                  <div className="col col-auto">
                                    <div className={`${item?.class} counter-icon bg-primary-gradient box-shadow-primary brround ms-auto`}>
                                      {item?.icon}
                                    </div>
                                  </div>
                                </Row>
                              </Card.Body>
                            </Card>
                          )
                          : (
                            null
                          )
                      }
                    </Link>
                  </Col>
                ))
              }
            </Row>
          </Col>

        </Row>

        <Row>
          <Col>
            {
              role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ?
                (
                  <Card>
                    <Card.Header>Order Data</Card.Header>
                    <Card.Body>
                      <Table striped bordered hover size="sm" className="rounded-3">
                        <thead className="bg-primary text-light fw-bold">
                          <tr>
                            <th className="text-light fw-bold">Order Placed</th>
                            <th className="text-light fw-bold">Order Accepted</th>
                            <th className="text-light fw-bold">Order Processed</th>
                            <th className="text-light fw-bold">Order Packed</th>
                            <th className="text-light fw-bold">Order Dispatched</th>
                            <th className="text-light fw-bold">Order Delivered</th>
                            <th className="text-light fw-bold">Hold</th>
                            <th className="text-light fw-bold">Cancelled</th>
                            <th className="text-light fw-bold">Rejected</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td classname="text-center">{orderDetails?.pending}</td>
                            <td classname="text-center">{orderDetails?.accepted}</td>
                            <td classname="text-center">{orderDetails?.processed}</td>
                            <td classname="text-center">{orderDetails?.packed}</td>
                            <td classname="text-center">{orderDetails?.dispatched}</td>
                            <td classname="text-center">{orderDetails?.delivered}</td>
                            <td classname="text-center">{orderDetails?.hold}</td>
                            <td classname="text-center">{orderDetails?.cancelled}</td>
                            <td classname="text-center">{orderDetails?.rejected}</td>
                          </tr>
                        </tbody>
                      </Table>
                    </Card.Body>
                  </Card>
                ) : (
                  null
                )

            }

          </Col>
        </Row>

        <Row>
          <Col as={Col} sm={12} md={12} lg={12} xl={8}>
            {
              role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ? (
                <Card>
                  <Card.Header className="card-header">
                    <h3 className="card-title">Total Transactions</h3>
                  </Card.Header>
                  <Card.Body>
                    <Row className="mb-3">
                      {["daily", "weekly", "monthly", "yearly"].map((period) => (
                        <Col md={3} key={period}>
                          <Button
                            variant={
                              queryParam.period === period ? "success" : "primary"
                            }
                            onClick={() => setQueryParam({ ...queryParam, period })}
                          >
                            {period.charAt(0).toUpperCase() + period.slice(1)}
                          </Button>
                        </Col>
                      ))}
                    </Row>
                    <ReactApexChart
                      options={chartData.options}
                      series={chartData.series}
                      type="area"
                      height={350}
                    />
                  </Card.Body>
                </Card>
              ) : (
                null
              )
            }

          </Col>
          <Col sm={12} md={12} lg={12} xl={4}>
            {
              role === "Admin" || (role === "Staff" && (permissions?.Order ?? []).includes("view")) ?
                (
                  <Card className="card custom-card">
                    <Card.Header className="card-header">
                      <h3 className="card-title">Recent Orders</h3>
                    </Card.Header>
                    <Card.Body className="pt-0 px-3">
                      <div id="recentorders" className="apex-charts apexs">
                        {isSuccess ? <ReactApexChart options={options} series={series} type="donut" height={290} /> : null}
                      </div>
                    </Card.Body>
                  </Card>
                ) : (
                  null
                )
            }
          </Col>
        </Row>

      </div >
    </>
  );
}