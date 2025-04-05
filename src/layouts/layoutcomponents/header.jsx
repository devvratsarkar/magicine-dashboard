import React, { useEffect, useState } from "react";
import {
  Dropdown,
  Navbar,
  Container,
  Button,
  Form,
  ListGroup,
} from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { Imagesdata } from "../../commondata/commonimages";
import { MENUITEMS } from "../../commondata/sidemenu";
import { useDispatch } from "react-redux";
import { logoutSuccess } from "../../redux/slices/authSlice";
import toast from "react-hot-toast";
import { useGetUserProfileQuery } from "../../redux/features/commonApiCall";
import { openModal } from "../../redux/slices/allModalSlice";
import { jwtDecode } from 'jwt-decode';
import moment from "moment/moment";

export default function Header() {
  const navigate = useNavigate();
  const { data, isSuccess, refetch } = useGetUserProfileQuery()
  const adminData = data?.data


  const [currentTime, setCurrentTime] = useState(moment().format("DD-MM-YYYY hh:mm:ss A"));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(moment().format("DD-MM-YYYY hh:mm:ss A"));
    }, 1000);
    return () => clearInterval(timer);
  }, [])


  const token = localStorage.getItem("token")
  if (!token) {
    navigate("/");
  } else {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp < currentTime) {

        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      localStorage.removeItem("token");
      navigate("/");
    }
  }




  //full screen
  function Fullscreen() {
    if (
      (document.fullScreenElement && document.fullScreenElement === null) ||
      (!document.mozFullScreen && !document.webkitIsFullScreen)
    ) {
      if (document.documentElement.requestFullScreen) {
        document.documentElement.requestFullScreen();
      } else if (document.documentElement.mozRequestFullScreen) {
        document.documentElement.mozRequestFullScreen();
      } else if (document.documentElement.webkitRequestFullScreen) {
        document.documentElement.webkitRequestFullScreen(
          Element.ALLOW_KEYBOARD_INPUT
        );
      }
    } else {
      if (document.cancelFullScreen) {
        document.cancelFullScreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.webkitCancelFullScreen) {
        document.webkitCancelFullScreen();
      }
    }
  }

  // Darkmode
  const DarkMode = () => {
    const body = document.querySelector("body");

    if (body?.classList.contains("dark-mode")) {
      body.classList.remove("dark-mode");
      localStorage.setItem("zanexlightmode", "true");
      localStorage.setItem("zanexdarkmode", "false");
    } else {
      body.classList.add("dark-mode");
      localStorage.setItem("zanexdarkmode", "true");
      localStorage.setItem("zanexlightmode", "false");
    }
  };

  //leftsidemenu
  const openCloseSidebar = () => {
    document.querySelector(".app")?.classList.toggle("sidenav-toggled");
  };
  //rightsidebar
  const openCloseSidebarright = () => {
    document.querySelector(".sidebar-right")?.classList.toggle("sidebar-open");
  };

  // responsivesearch
  const responsivesearch = () => {
    document.querySelector(".header-search")?.classList.toggle("show");
  };
  //swichermainright
  const swichermainright = () => {
    document.querySelector(".demo_changer")?.classList.toggle("active");
    document.querySelector(".demo_changer").style.right = "0px";
  };
  //Search functionality
  const [show1, setShow1] = useState(false);
  const [InputValue, setInputValue] = useState("");
  const [show2, setShow2] = useState(false);
  const [searchcolor, setsearchcolor] = useState("text-dark");
  const [searchval, setsearchval] = useState("Type something");
  const [NavData, setNavData] = useState([]);

  document.addEventListener("click", function () {
    document.querySelector(".search-result")?.classList.add("d-none");
  });
  let myfunction = (inputvalue) => {
    document.querySelector(".search-result")?.classList.remove("d-none");

    let i = [];
    let allElement2 = [];

    MENUITEMS.map((mainlevel) => {
      if (mainlevel.Items) {
        setShow1(true);
        mainlevel.Items.map((sublevel) => {
          if (sublevel.children) {
            sublevel.children.map((sublevel1) => {
              i.push(sublevel1);
              if (sublevel1.children) {
                sublevel1.children.map((sublevel2) => {
                  i.push(sublevel2);
                  return sublevel2;
                });
              }
              return sublevel1;
            });
          }
          return sublevel;
        });
      }
      return mainlevel;
    });
    for (let allElement of i) {
      if (allElement.title.toLowerCase().includes(inputvalue.toLowerCase())) {
        if (
          allElement.title.toLowerCase().startsWith(inputvalue.toLowerCase())
        ) {
          setShow2(true);
          allElement2.push(allElement);
        }
      }
    }
    if (!allElement2.length || inputvalue === "") {
      if (inputvalue === "") {
        setShow2(false);
        setsearchval("Type something");
        setsearchcolor("text-dark");
      }
      if (!allElement2.length) {
        setShow2(false);
        setsearchcolor("text-danger");
        setsearchval("There is no component with this name");
      }
    }
    setNavData(allElement2);
  };
  const dispatch = useDispatch();
  const handleLogout = () => {
    dispatch(logoutSuccess())
    toast.success('Logged out successfully!');
    navigate('/')
  }
  return (
    <Navbar expand="md" className="app-header header sticky">
      <Container fluid className="main-container">
        <div className="d-flex align-items-center">
          <Link
            aria-label="Hide Sidebar"
            className="app-sidebar__toggle"
            to="#"
            onClick={() => openCloseSidebar()}
          ></Link>
          <div className="responsive-logo">
            <Link
              to={`${import.meta.env.BASE_URL}dashboard/`}
              className="header-logo"
            >
              <img
                src={Imagesdata("logo3")}
                className="mobile-logo logo-1"
                alt="logo"
              />
              <img
                src={Imagesdata("logo")}
                className="mobile-logo dark-logo-1"
                alt="logo"
              />
            </Link>
          </div>
          <Link
            className="logo-horizontal "
            to={`${import.meta.env.BASE_URL}dashboard/`}
          >
            <img
              src={Imagesdata("logo3")}
              className="header-brand-img desktop-logo"
              alt="logo"
            />
            <img
              src={Imagesdata("logo3")}
              className="header-brand-img light-logo1"
              alt="logo"
            />
          </Link>


          <div className="d-flex order-lg-2 ms-auto header-right-icons gap-2">
            <div className="live-clock text-dark fw-bold px-3 py-2 border rounded-3 bg-light">
              {currentTime}
            </div>
            <Navbar.Toggle
              aria-controls="navbarScroll"
              className="navresponsive-toggler d-lg-none ms-auto"
              type="button"
            >
              <span className="navbar-toggler-icon fe fe-more-vertical text-dark"></span>
            </Navbar.Toggle>

            <div className="navbar navbar-collapse responsive-navbar p-0">
              <Navbar.Collapse
                className="navbar-collapse"
                id="navbarSupportedContent-4"
              >
                <div className="d-flex order-lg-2">
                  <div className="dropdown d-block d-lg-none">
                    <Link
                      to="#"
                      className="nav-link icon"
                      onClick={() => responsivesearch()}
                    >
                      <i className="fe fe-search"></i>
                    </Link>
                    <div className="dropdown-menu header-search dropdown-menu-start">
                      <div className="input-group w-100 p-2 border">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search...."
                        />
                        <div className="input-group-text btn btn-primary">
                          <i className="fa fa-search" aria-hidden="true"></i>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="dropdown d-md-flex">
                    <Link
                      to="#"
                      className="nav-link icon theme-layout nav-link-bg layout-setting"
                      onClick={() => DarkMode()}
                    >
                      <span className="dark-layout">
                        <i className={`fe ${"fe-moon"}`}></i>
                      </span>
                      <span className="light-layout">
                        <i className={`fe ${"fe-sun"}`}></i>
                      </span>
                    </Link>
                  </div>
                  <div className="dropdown d-md-flex">
                    <Link
                      to="#"
                      className="nav-link icon full-screen-link nav-link-bg"
                      onClick={Fullscreen}
                    >
                      <i className="fe fe-minimize fullscreen-button"></i>
                    </Link>
                  </div>
                  <Dropdown className="d-md-flex notifications">
                    <div className="" style={{ width: "50px" }}>
                    </div>
                    <Dropdown.Menu
                      className=" dropdown-menu-end dropdown-menu-arrow "
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading border-bottom">
                        <div className="d-flex">
                          <h6 className="mt-1 mb-0 fs-16 fw-semibold">
                            You have Notification
                          </h6>
                          <div className="ms-auto">
                            <span className="badge bg-success rounded-pill">
                              3
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="notifications-menu">
                        <Link
                          className="dropdown-item d-flex"
                          to={`${import.meta.env.BASE_URL
                            }components/defaultchat/`}
                        >
                          <div className="me-3 notifyimg  bg-primary-gradient brround box-shadow-primary">
                            <i className="fe fe-message-square"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              New review received
                            </h5>
                            <span className="notification-subtext">
                              2 hours ago
                            </span>
                          </div>
                        </Link>
                        <Link
                          className="dropdown-item  d-flex"
                          to={`${import.meta.env.BASE_URL
                            }components/defaultchat/`}
                        >
                          <div className="me-3 notifyimg  bg-secondary-gradient brround box-shadow-primary">
                            <i className="fe fe-mail"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              New Mails Received
                            </h5>
                            <span className="notification-subtext">
                              1 week ago
                            </span>
                          </div>
                        </Link>
                        <Link
                          className="dropdown-item  d-flex"
                          to={`${import.meta.env.BASE_URL
                            }pages/e-commerce/shoppingcart/`}
                        >
                          <div className="me-3 notifyimg  bg-success-gradient brround box-shadow-primary">
                            <i className="fe fe-shopping-cart"></i>
                          </div>
                          <div className="mt-1">
                            <h5 className="notification-label mb-1">
                              New Order Received
                            </h5>
                            <span className="notification-subtext">
                              1 day ago
                            </span>
                          </div>
                        </Link>
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      <Link
                        to="#"
                        className=" dropdown-item text-center p-3 text-muted"
                      >
                        View all Notification
                      </Link>
                    </Dropdown.Menu>
                  </Dropdown>

                  <Dropdown className=" d-md-flex profile-1">
                    <Dropdown.Toggle
                      className="nav-link profile leading-none d-flex px-1"
                      variant=""
                    >
                      <span>
                        <img
                          src={adminData?.profile_pic}
                          alt="profile-user"
                          className="avatar  profile-user brround cover-image"
                        />
                      </span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu
                      className="dropdown-menu-end dropdown-menu-arrow"
                      style={{ margin: 0 }}
                    >
                      <div className="drop-heading">
                        <div className="text-center">
                          <h5 className="text-dark mb-0">{adminData?.name}</h5>
                          <small className="text-muted">Admin</small>
                        </div>
                      </div>
                      <div className="dropdown-divider m-0"></div>
                      <Link
                        className="dropdown-item"
                        to={`/profile`}
                      >
                        <i className="dropdown-icon fe fe-user"></i> Profile
                      </Link>
                      <button
                        className="dropdown-item"
                        onClick={() => { dispatch(openModal({ componentName: "ChangePassword" })) }}
                      >
                        <i className="dropdown-icon fe fe-lock"></i> Change Password
                      </button>
                      <div className="dropdown-item cursor-pointer" onClick={() => handleLogout()} >
                        <i className="dropdown-icon fe fe-alert-circle"></i>
                        Sign out
                      </div>
                    </Dropdown.Menu>
                  </Dropdown>

                </div>
              </Navbar.Collapse>
            </div>
            <div
              className="demo-icon nav-link icon border-0"
              onClick={() => swichermainright()}
            >
              <i className="fe fe-settings fa-spin"></i>
            </div>
          </div>
        </div>
      </Container>
    </Navbar>
  );
}