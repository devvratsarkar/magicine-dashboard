import React from "react";
import { Button, Modal } from "react-bootstrap";
import productImage from "../../assets/images/dashboard/inventory.png";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";
export default function ViewCart({ show, hide }) {
  const dispatch = useDispatch();
  const { isOpen, data } = useSelector((state) => state.allCommonModal);
  console.log("data", data);

  return (
    <div>
      <Modal show={isOpen} className="cart_modal">
        <Modal.Header className="">
          <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
            Cart Details
          </Modal.Title>
          <Button
            onClick={() => dispatch(closeModal())}
            className="btn-close text-dark"
            variant=""
          >
            <i className="fe fe-x"></i>
          </Button>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center border-bottom border-dark pb-4">
            <p className="text-start">Customer Name - {data?.user?.name}</p>
            <p className="text-start">Email - {data?.user?.email}</p>
            <p className="text-start">Phone No. - {data?.user?.phone_number}</p>
            <p className="text-start">Member Since - {data?.user?.created_at}</p>
          </div>
          <p className="my-5 text-start fs-5 mb-0">Products</p>
          <table className="table text-nowrap text-md-nowrap mg-b-0">
            <thead className="border-bottom border-dark">
              <tr>
                <th className="text-start">Product Name</th>
                <th>Image</th>
                <th>Quantity</th>
                <th></th>
                {/* <th>price</th> */}
                <th>Total</th>
              </tr>
            </thead>
            <tbody className="border-0">
              {data?.cart_items.map((item, index) => {
                return (
                  <tr tr className="border-bottom border-muted" key={index} >
                    <td>{item?.product?.product_name}</td>
                    <td>
                      <img src={item?.product?.featured_image} alt={item?.product?.product_name} />
                    </td>
                    <td>{item?.quantity}</td>
                    <td></td>
                    {/* <td>Rs.{item?.single_mrp}</td> */}
                    <td>Rs. {item?.total}</td>
                  </tr>
                )
              })}

              <tr >
                <td>Sub Total</td>
                <td></td>
                <td></td>
                {/* <td>{data?.total_quantity}</td> */}
                <td></td>
                <td>{data?.currency === "USD" ? `$${data?.total_amount}` : `Rs.${data?.total_amount}`}

                </td>
              </tr>
              <tr className="border-bottom border-muted">
                {/* <td>Shipping Charges</td> */}
                <td></td>
                <td></td>
                <td></td>
                {/* <td>
                  {data?.shipping_charges != null
                    ? data.currency === "USD"
                      ? `$${data.shipping_charges}`
                      : `Rs.${data.shipping_charges}`
                    : 0}
                </td> */}

              </tr>
              <tr className="border-bottom border-muted">
                <td className="text-success">Grand Total</td>
                <td></td>
                <td></td>
                <td></td>
                <td className="text-success">
                  {data?.currency === "USD" ? `$${data?.total_amount}` : `Rs.${data?.total_amount}`}
                </td>
              </tr>
            </tbody>
          </table>
        </Modal.Body>
      </Modal>
    </div >
  );
}
