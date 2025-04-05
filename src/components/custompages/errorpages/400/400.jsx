import React from "react";
import { Link } from "react-router-dom";
export default function Errorpage400() {
  return (
    <div className="error-bg">
      <div className="page">
        <div className="page-content error-page error2">
          <div className="container text-center">
            <div className="error-template">
              <h1 className="display-1 text-light mb-2">
                400<span className="fs-20">error</span>
              </h1>
              <h5 className="error-details text-light">
                Sorry, an error has occured, Requested page not found!
              </h5>
              <div className="text-center">
                <Link
                  to={`${import.meta.env.BASE_URL}dashboard/`}
                  className="btn btn-primary mt-5 mb-5"
                >
                  <i className="fa fa-long-arrow-left"></i> Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
