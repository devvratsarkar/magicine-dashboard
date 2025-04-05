import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import Loader from "../../../layouts/layoutcomponents/loader";
import { closeModal } from "../../../redux/slices/allModalSlice";
import { useDeleteProductMutation, useGetDeletedProductsQuery, useGetProductsQuery, usePermanentlyDeleteProductMutation } from "../../../redux/features/productEndPoints";

export default function DeleteProduct() {
    const dispatch = useDispatch();
    const [query, setQuery] = useState({
        brand: '',
        marketer: '',
        status: '',
        fromDate: '',
        toDate: '',
        search: "",
        page: 1 || "",
        limit: 10 || ""
    })
    const { refetch } = useGetProductsQuery(query);
    const { refetch: trashFetched } = useGetDeletedProductsQuery();
    const { isOpen, data, softDelete } = useSelector((state) => state.allCommonModal);
    const [deleteProduct, { isLoading }] = useDeleteProductMutation();
    const [permanentlyDeleteProduct, { isLoading: loading }] = usePermanentlyDeleteProductMutation();
    const handleDelte = async () => {
        try {
            const res = softDelete ? await deleteProduct({ productId: data.id }) : await permanentlyDeleteProduct({ productId: data.id });
            if (res?.data?.http_status_code === 200) {
                dispatch(closeModal());
                refetch()
                trashFetched()
                toast.success(res.data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    };
    return (
        <div>
            <Modal show={isOpen}>
                <Modal.Header className="modal_header border-0 border-bottom-0">
                    <Modal.Title as="h4" className="fw-semibold lh-1 my-auto text-center">
                        Delete Confirmation
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    Are Your Sure to delete this data?
                    {isLoading && <Loader /> || loading && <Loader />}
                </Modal.Body>
                <Modal.Footer className="justify-content-center">
                    <Button className="btn btn-outline-default cancel_button" variant="" onClick={() => dispatch(closeModal())} >
                        Cancel
                    </Button>
                    <Button className="btn btn-danger" variant="danger" onClick={() => handleDelte()} >
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
