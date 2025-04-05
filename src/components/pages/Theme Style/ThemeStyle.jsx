import React, {useEffect} from "react";
import {Card,Row,Col,} from "react-bootstrap";
import * as Switcherdata from "../../../commondata/Switcherdata";
import PageHeader from "../../../layouts/layoutcomponents/pageheader";

function ThemeStyle() {
  useEffect(()=>{
    Switcherdata.localStorageBackUp();
  })

  return (
    <div>
      <div>
      <PageHeader titles="Theme Styles" active="Theme Styles" items={['Pages']} />

        <div className="container">
          <Row className="row row-sm">
            <Col xl={6} className="col-xl-6 m-auto">
              <Card className=" sidebar-right1">
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      Light Theme Style
                    </h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle d-flex">
                      <span className="me-auto">Light Theme</span>
                      <p className="onoffswitch2 my-0">
                        <input
                          type="radio"
                          name="onoffswitch7"
                          onClick={() => Switcherdata.LightTheme()}
                          id="myonoffswitch6"
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
                      <p className="onoffswitch2 my-0">
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
                </Card.Body>
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      Dark Theme Style
                    </h6>
                  </div>
                  <div className="switch-toggle d-flex">
                      <span className="me-auto mt-1">Light Primary</span>
                      <div className="">
                      <Switcherdata.ThemePrimaryColor />
                      </div>
                    </div>
                    <div className="switch-toggle d-flex mt-2">
                      <span className="me-auto mt-1">Background Primary</span>
                      <div className="">
                      <Switcherdata.Backgroundcolor />
                      </div>
                    </div>
                </Card.Body>
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      Navigation Style
                    </h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle d-flex">
                      <span className="me-auto">Vertical Menu</span>
                      <p className="onoffswitch2 my-0">
                        <input
                          type="radio"
                          name="onoffswitch15" 
                          onClick={() => Switcherdata.VerticalMenu()}
                          id="myonoffswitch1"
                          className="onoffswitch2-checkbox"
                          defaultChecked
                        />
                        <label
                          htmlFor="myonoffswitch1"
                          className="onoffswitch2-label"
                        />
                      </p>
                    </div>
                    <div className="switch-toggle d-flex mt-2">
                      <span className="me-auto">Horizontal Click Menu</span>
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                </Card.Body>
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      LTR and RTL VERSIONS
                    </h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle d-flex">
                      <span className="me-auto">LTR Version</span>
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                </Card.Body>
                <div className="card-body menu-style">
                  <div>
                    <h6 className="main-content-label mb-3">Header Styles</h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle lightHeader d-flex">
                      <span className="me-auto">Light Header</span>
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                <div className="card-body menu-style">
                  <div>
                    <h6 className="main-content-label mb-3">Menu Styles</h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle lightMenu d-flex">
                      <span className="me-auto">Light Menu</span>
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
                        <input
                          type="radio"
                          name="onoffswitch2"
                          onClick={() => Switcherdata.DarkMenu()}
                          id="myonoffswitch14"
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
                      <p className="onoffswitch2 my-0">
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
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      Layout Width Styles
                    </h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle d-flex">
                      <span className="me-auto">Full Width</span>
                      <p className="onoffswitch2 my-0">
                        <input
                          type="radio"
                          name="onoffswitch4"
                           onClick={() => Switcherdata.FullWidth()}
                          id="myonoffswitch16"
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
                      <p className="onoffswitch2 my-0">
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
                </Card.Body>
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      Layout Positions
                    </h6>
                  </div>
                  <div className="switch_section">
                    <div className="switch-toggle d-flex">
                      <span className="me-auto">Fixed</span>
                      <p className="onoffswitch2 my-0">
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
                      <p className="onoffswitch2 my-0">
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
                </Card.Body>
                <Card.Body>
                  <div>
                    <h6 className="main-content-label mb-3">
                      Reset All Styles
                    </h6>
                  </div>
                  <div className="switch_section text-center px-0">
                    <div className="btn-list">
                      <button className="btn btn-success w-lg">
                        Save Settings
                      </button>
                      <button
                        className="btn btn-danger"
                         onClick={() => {
                          localStorage.clear();
                          document.querySelector("html").style = "";
                          Switcherdata.name();
                          Switcherdata.resetData();
                        }}
                        type="button"
                      >
                        Reset All
                      </button>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </div>
      </div>
    </div>
  );
}

export default ThemeStyle;
