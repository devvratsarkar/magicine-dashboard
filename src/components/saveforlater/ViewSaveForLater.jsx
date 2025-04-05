import React from "react";
import { Button, Modal } from "react-bootstrap";
import productImage from "../../assets/images/dashboard/inventory.png";
export default function ViewSaveForLater({ show, hide }) {
  return (
    <div>
      <Modal show={show}>
        <Modal.Header className="">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Saved For Later Details
          </Modal.Title>
          <Button
            onClick={() => hide(false)}
            className="btn-close text-dark"
            variant=""
          >
            <i className="fe fe-x"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center border-bottom pb-4">
            <p className="text-start">Customer Name - Rahul Sharma</p>
            <p className="text-start">Email - rahulsharma123@gmail.com</p>
            <p className="text-start">Member Since - jan 2023</p>
          </div>
          <p className="my-5 text-start">Products</p>
          <table className="table text-nowrap text-md-nowrap mg-b-0">
            <thead className="border-bottom">
              <tr>
                <th className="text-start">Product Name</th>
                <th>Image</th>
                <th>Quantity</th>
                <th>price</th>
              </tr>
            </thead>
            <tbody className="border-0">
              <tr>
                <td>Dabur ChawanPrash</td>
                <td>
                  <img src={productImage} alt="product image" />
                </td>
                <td>01</td>
                <td>Rs. 300.00</td>
              </tr>
              <tr>
                <td>Dabur ChawanPrash</td>
                <td>
                  <img src={productImage} alt="product image" />
                </td>
                <td>01</td>
                <td>Rs. 300.00</td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </div >
  );
}
