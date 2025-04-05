import React from 'react'
import { Button, Card, Col, Row } from 'react-bootstrap'
import PageHeader from '../../../../layouts/layoutcomponents/pageheader'
import { generateViewBlogsPage, getBlogTagPage } from '../../../../utils/routes'
import { Link, useParams } from 'react-router-dom'
import { useGetSingleBlogsTagsQuery } from '../../../../redux/features/blogsEndPoints'
import Loader from '../../../../layouts/layoutcomponents/loader'
import Error from '../../../../layouts/layoutcomponents/Error'

export default function ViewBlogTag() {
    const { id } = useParams()
    const { data, isError, error, isLoading, isFetching, isSuccess, refetch } = useGetSingleBlogsTagsQuery(id);
    const tagData = data?.data
    console.log(tagData);
    if (isLoading || isFetching) {
        return <Loader />;
    }
    if (isError) {
        return <Error error_mes={error} />;
    }

    if (isSuccess) {
        return (
            <>
                <Row className='align-items-center'>
                    <Col>
                        <PageHeader titles="View Blog Tags" active="View Blog Tags" items={["Home", "Blog Tags List"]} links={["/dashboard", "/blogs/tags"]} />
                    </Col>
                    <Col className='text-end'>
                        <Link to={`${getBlogTagPage()}`} className='btn btn-success' variant=''>View All Blog Tag </Link>
                    </Col>
                </Row>
                <Card>
                    <Card.Header as={"h2"}>{tagData?.name.charAt(0).toUpperCase() + tagData?.name.slice(1)}</Card.Header>
                    <Card.Body>
                        {tagData?.blog?.map((item, index) => (
                            <div className="example mb-3" key={index}>
                                <Link to={`${generateViewBlogsPage()}/${item?.id}`}>
                                    <div className="media media-lg mt-0">
                                        <img className="avatar avatar-xl brround me-3 mb-4" src={item?.image} alt="Generic placeholder " />
                                        <div className="media-body">
                                            <h4 className="mt-0">{item?.name.charAt(0).toUpperCase() + item?.name.slice(1)}</h4>
                                            <p dangerouslySetInnerHTML={{ __html: item.content }}></p>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        ))}
                    </Card.Body>
                </Card>
            </>
        )
    }
}
