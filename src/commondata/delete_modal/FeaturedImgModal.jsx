import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { closeModal } from "../../redux/slices/allModalSlice";

export default function FeaturedImgModal() {
    const dispatch = useDispatch();
    const { isOpen, data } = useSelector((state) => state.allCommonModal);
    console.log(data);

    return (
        <div>
            <Modal show={isOpen}>
                <Modal.Body className="text-center">
                    <img src={data} alt="" />
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
