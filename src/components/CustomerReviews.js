import React, { useEffect, useState } from 'react';
import { Card, Carousel, Container, Row, Col, Image } from 'react-bootstrap';
import { FaStar, FaRegStar, FaQuoteRight } from 'react-icons/fa';
import axios from '../utils/axios';

const renderStars = (rating) => {
  return [...Array(5)].map((_, i) =>
    i < rating ? (
      <FaStar key={i} color="#f1c40f" className="me-1" />
    ) : (
      <FaRegStar key={i} color="#ccc" className="me-1" />
    )
  );
};

const CustomerReviews = () => {
  const [reqData, setReqData] = useState([]);

  const fetchReviewsC = async () => {
    try {
      const res = await axios.get('/reviews');
      setReqData(res.data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };


  useEffect(() => {
    fetchReviewsC();
  }, []);

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4 fw-bold">Customer Reviews</h2>
      {reqData.length === 0 ? (
        <p className="text-center">No reviews found.</p>
      ) : (
        <Carousel variant="dark" interval={4000} controls indicators fade>
          {reqData.map((review, index) => (
            <Carousel.Item key={review._id || index}>
              <Card
                className="p-4 rounded shadow-lg"
                style={{
                  maxWidth: '900px',
                  margin: '0 auto',
                  backgroundColor: '#ffffff',
                }}
              >
                <Row className="align-items-center g-4 flex-column flex-md-row">
                  {/* Left Side - Product Image */}
                  <Col xs={12} md={4} className="text-center">
                  <FaQuoteRight
                      size={24}
                      color="red"
                      className="position-absolute top-0 end-0 me-4 mt-2"
                    />
                    <Image
                      src={review.productId?.image || 'https://via.placeholder.com/150'}
                      alt={review.productId?.name}
                      fluid
                      rounded
                      style={{ maxHeight: '200px', objectFit: 'cover' }}
                    />
                  </Col>

                  {/* Right Side - Review Content */}
                  <Col xs={12} md={8} className="position-relative">
                    {/* Top Right Quote Icon */}
                    {/* <FaQuoteRight
                      size={24}
                      color="red"
                      className="position-absolute top-0 end-0"
                    /> */}
                    <p className="fs-5 text-secondary mb-2">"{review.reviewText}"</p>
                    <div className="mb-2">{renderStars(review.rating)}</div>
                    <p className=""><strong> {review.productId?.brand} </strong> {review.productId?.name}</p>

                    {/* Bottom Right - User Name */}
                    <div className="text-end">
                      <h6 className="fw-semibold text-primary m-0">
                        - {review.userId?.name || 'Anonymous'}
                      </h6>
                    </div>
                  </Col>
                </Row>
              </Card>
            </Carousel.Item>
          ))}
        </Carousel>
      )}
    </Container>
  );
};

export default CustomerReviews;
