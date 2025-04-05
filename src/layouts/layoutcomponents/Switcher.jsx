import React, { Fragment, useEffect } from "react";
import { Row } from "react-bootstrap";
import { Link } from "react-router-dom";
import * as Switcherdata from "../../commondata/Switcherdata";
import PerfectScrollbar from 'react-perfect-scrollbar';

function Switcher() {

  const SwictherClose = () => {
    document.querySelector(".switcher-backdrop").classList.add("d-block");

  }

  useEffect(() => {
    Switcherdata.localStorageBackUp();
  }, []);

  function changePrimaryColor() {
    var userColor = document.getElementById("colorID").value;
    localStorage.setItem("primaryColor", userColor);
    // to store value as opacity 0.95 we use 95
    localStorage.setItem("primaryHoverColor", userColor + 95);
    localStorage.setItem("primaryBorderColor", userColor);
    localStorage.setItem("primaryTransparent", userColor + 20);

    const dynamicPrimaryLight = document.querySelectorAll(
      "input.color-primary-light"
    );

    Switcherdata.dynamicLightPrimaryColor(dynamicPrimaryLight, userColor);

    document.getElementById("myonoffswitch6").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("light-mode");

    // Removing
    document.querySelector("body")?.classList.remove("dark-mode");
    document.querySelector("body")?.classList.remove("transparent-mode");
    document.querySelector("body")?.classList.remove("bg-img1");
    document.querySelector("body")?.classList.remove("bg-img2");
    document.querySelector("body")?.classList.remove("bg-img3");
    document.querySelector("body")?.classList.remove("bg-img4");

    localStorage.removeItem("darkPrimaryColor");
    localStorage.removeItem("transparentPrimaryColor");
    localStorage.removeItem("transparentBgColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    Switcherdata.name();
  }
  function darkPrimaryColor() {
    var userColor = document.getElementById("darkPrimaryColorID").value;

    localStorage.setItem("darkPrimaryColor", userColor);

    const dynamicPrimaryDark = document.querySelectorAll(
      "input.color-primary-dark"
    );

    Switcherdata.dynamicDarkPrimaryColor(dynamicPrimaryDark, userColor);

    document.getElementById("myonoffswitch7").checked = true;

    // Adding
    document.querySelector("body")?.classList.add("dark-mode");
    document.querySelector("body")?.classList.add("dark-mode");

    // Removing
    document.querySelector("body")?.classList.remove("light-mode");
    document.querySelector("body")?.classList.remove("transparent-mode");
    document.querySelector("body")?.classList.remove("bg-img1");
    document.querySelector("body")?.classList.remove("bg-img2");
    document.querySelector("body")?.classList.remove("bg-img3");
    document.querySelector("body")?.classList.remove("bg-img4");

    localStorage.removeItem("primaryColor");
    localStorage.removeItem("primaryHoverColor");
    localStorage.removeItem("primaryBorderColor");
    localStorage.removeItem("primaryTransparent");
    localStorage.removeItem("transparentPrimaryColor");
    localStorage.removeItem("transparentBgColor");
    localStorage.removeItem("transparent-bgImgPrimaryColor");
    localStorage.removeItem("BgImage");

    Switcherdata.name();
  }

  return (
    <Fragment>
      <div className="switcher-backdrop d-none" onClick={() => SwictherClose()}></div>
      <div className="switcher-wrapper">
        <div className="demo_changer">
          <div className="form_holder sidebar-right1">
            <PerfectScrollbar options={{ suppressScrollX: true, useBothWheelAxes: false }}>
              <Row className="row">
                <div className="predefined_styles">
                  <div className="swichermainleft text-center">
                  </div>
                  <div className="swichermainleft">
                    <h4>Reset All Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section my-4">
                        <button
                          className="btn btn-danger btn-block"
                          onClick={() => {
                            const keysToKeep = ["token", "role", "permissions"];

                            const preservedData = {};
                            keysToKeep.forEach((key) => {
                              const value = localStorage.getItem(key);
                              if (value !== null) preservedData[key] = value;
                            });

                            localStorage.clear();

                            Object.keys(preservedData).forEach((key) => {
                              localStorage.setItem(key, preservedData[key]);
                            });

                            document.querySelector("html").style = "";
                            Switcherdata.resetData();
                          }}
                          type="button"
                        >
                          Reset All
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft">
                    <h4>Light Theme Style</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Light Theme</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch7"
                              id="myonoffswitch6"
                              onClick={() => Switcherdata.LightTheme()}
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch6"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Dark Theme</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch7"
                              id="myonoffswitch7"
                              onClick={() => Switcherdata.dark()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch7"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft">
                    <h4>Dark Theme Style</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto mt-1">Primary Color</span>
                          <div className="">
                            <Switcherdata.ThemePrimaryColor />
                          </div>
                        </div>
                        {/* <div className="switch-toggle d-flex mt-2">
                        <span className="me-auto mt-1">Background Color</span>
                        <div className="">
                          <Switcherdata.Backgroundcolor />
                        </div>
                      </div> */}
                      </div>
                    </div>
                  </div>
                  <div className="swichermainleft">
                    <h4>Navigation Style</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Vertical Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch15"
                              id="myonoffswitch1"
                              className="onoffswitch2-checkbox"
                              defaultChecked
                              onClick={() => Switcherdata.VerticalMenu()}
                            />
                            <label
                              htmlFor="myonoffswitch1"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Horizontal Click Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch15"
                              id="myonoffswitch2"
                              onClick={() => Switcherdata.horizontal()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch2"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Horizontal Hover Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch15"
                              id="myonoffswitch111"
                              onClick={() => Switcherdata.HorizontalHoverMenu()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch111"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="swichermainleft">
                  <h4>LTR and RTL VERSIONS</h4>
                  <div className="skin-body">
                    <div className="switch_section">
                      <div className="switch-toggle d-flex">
                        <span className="me-auto">LTR Version</span>
                        <p className="onoffswitch2">
                          <input
                            type="radio"
                            name="onoffswitch8"
                            id="myonoffswitch4"
                            onClick={() => Switcherdata.Ltr()}
                            className="onoffswitch2-checkbox"
                            defaultChecked
                          />
                          <label
                            htmlFor="myonoffswitch4"
                            className="onoffswitch2-label"
                          />
                        </p>
                      </div>
                      <div className="switch-toggle d-flex mt-2">
                        <span className="me-auto">RTL Version</span>
                        <p className="onoffswitch2">
                          <input
                            type="radio"
                            name="onoffswitch8"
                            id="myonoffswitch5"
                            onClick={() => Switcherdata.Rtl()}
                            className="onoffswitch2-checkbox"
                          />
                          <label
                            htmlFor="myonoffswitch5"
                            className="onoffswitch2-label"
                          />
                        </p>
                      </div>
                    </div>
                  </div>
                </div> */}
                  {/* <div className="swichermainleft menu-style">
                    <h4>Header Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle lightHeader d-flex">
                          <span className="me-auto">Light Header</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              id="myonoffswitch8"
                              onClick={() => Switcherdata.Lightheader()}
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch8"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle  colorHeader d-flex mt-2">
                          <span className="me-auto">Color Header</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              id="myonoffswitch9"
                              onClick={() => Switcherdata.Colorheader()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch9"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle darkHeader d-flex mt-2">
                          <span className="me-auto">Dark Header</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              id="myonoffswitch10"
                              onClick={() => Switcherdata.Darkheader()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch10"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle darkHeader d-flex mt-2">
                          <span className="me-auto">Gradient Header</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch3"
                              id="myonoffswitch11"
                              onClick={() => Switcherdata.gradientheader()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch11"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="swichermainleft menu-style">
                    <h4>Menu Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle lightMenu d-flex">
                          <span className="me-auto">Light Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              id="myonoffswitch12"
                              onClick={() => Switcherdata.LightMenu()}
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch12"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle colorMenu d-flex mt-2">
                          <span className="me-auto">Color Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              onClick={() => Switcherdata.ColorMenu()}
                              id="myonoffswitch13"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch13"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle darkMenu d-flex mt-2">
                          <span className="me-auto">Dark Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              id="myonoffswitch14"
                              onClick={() => Switcherdata.DarkMenu()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch14"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle gradientMenu d-flex mt-2">
                          <span className="me-auto">Gradient Menu</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch2"
                              onClick={() => Switcherdata.GradientMenu()}
                              id="myonoffswitch15"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch15"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* <div className="swichermainleft">
                    <h4>Layout Width Styles</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Full Width</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch4"
                              id="myonoffswitch16"
                              onClick={() => Switcherdata.FullWidth()}
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch16"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Boxed</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch4"
                              onClick={() => Switcherdata.Boxed()}
                              id="myonoffswitch17"
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch17"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div> */}
                  <div className="swichermainleft">
                    <h4>Layout Positions</h4>
                    <div className="skin-body">
                      <div className="switch_section">
                        <div className="switch-toggle d-flex">
                          <span className="me-auto">Fixed</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch5"
                              id="myonoffswitch18"
                              onClick={() => Switcherdata.Fixed()}
                              className="onoffswitch2-checkbox"
                              defaultChecked
                            />
                            <label
                              htmlFor="myonoffswitch18"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                        <div className="switch-toggle d-flex mt-2">
                          <span className="me-auto">Scrollable</span>
                          <p className="onoffswitch2">
                            <input
                              type="radio"
                              name="onoffswitch5"
                              id="myonoffswitch19"
                              onClick={() => Switcherdata.Scrollable()}
                              className="onoffswitch2-checkbox"
                            />
                            <label
                              htmlFor="myonoffswitch19"
                              className="onoffswitch2-label"
                            />
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </Row>
            </PerfectScrollbar>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
export default Switcher;
