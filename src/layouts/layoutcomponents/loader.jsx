import React, { Fragment } from "react";
import { Imagesdata } from "../../commondata/commonimages";

const Loader = () => {
  return (
    <>
      <div id="global-loader">
        <img
          src={Imagesdata("loader")}
          className="loader-img"
          alt="Loading...."
        />
      </div>
    </>
  );
};

export default Loader;
