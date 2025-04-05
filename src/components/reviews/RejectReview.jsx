import React from 'react'
import { Button, Modal } from 'react-bootstrap'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { closeModal } from '../../redux/slices/allModalSlice'
import Loader from '../../layouts/layoutcomponents/loader'
import { useGetReviewsDataQuery, useGetSelectedReviewsQuery, useReviewStatusFalseMutation } from '../../redux/features/catalogueEndPoints'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function RejectReview() {
    const navigate = useNavigate()
    const { isOpen, data } = useSelector((state) => state.allCommonModal)
    const dispatch = useDispatch()
    const [reviewStatusFalse, { isLoading }] = useReviewStatusFalseMutation()
    const { refetch: refetchSingleReviewPage } = useGetSelectedReviewsQuery({ modelType: data?.modelType, productId: data?.product });
    const { refetch } = useGetReviewsDataQuery()

    const statusChange = async () => {
        try {
            const response = await reviewStatusFalse(data?.id);

            if (response?.data?.http_status_code === 200) {
                refetch()
                refetchSingleReviewPage()
                navigate("/reviews")
                dispatch(closeModal())
                toast.success(response.data.message);
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <>
            {isLoading && <Loader />}
            <Modal show={isOpen}>
                <Modal.Header className="modal_header-cancellation border-0 border-bottom-0 bg-danger pb-0">
                    <Modal.Title>Reject</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-center'>Are you sure you want to reject this review?</p>
                </Modal.Body>
                <Modal.Footer className='p-1'>
                    <Button className="btn-light border border-dark" variant="" onClick={() => dispatch(closeModal())}>Cancel</Button>
                    <Button className="btn-danger" variant="" onClick={() => statusChange()}>Reject</Button>
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default RejectReview