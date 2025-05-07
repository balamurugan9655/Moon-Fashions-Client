import React, { useEffect, useState } from 'react';
import { Container, Table, Form, Button, Modal, Card } from 'react-bootstrap';
import axios from '../utils/axios';

const UserReviews = () => {
    const [reviews, setReviews] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [selectedReview, setSelectedReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, []);

  const fetchReviews = async () => {
    try {
      const res = await axios.get('/reviews');
      setReviews(res.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredReviews = reviews.filter((review) =>
    review.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.productId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    review.reviewText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const stars = [];
  
    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(<span key={i} style={{ color: '#ffc107' }}>★</span>); // filled star
      } else {
        stars.push(<span key={i} style={{ color: '#ccc' }}>☆</span>); // empty star
      }
    }
  
    return stars;
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/reviews/${selectedReview._id}`);
      setShowModal(false);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  return (
    <Card>
        <Card.Body>
        <Container className="">
            <h4 className="fw-bold mb-3">Product Reviews</h4>
            <Form className="mb-3">
                <Form.Control
                type="text"
                placeholder="Search by username, product, or review text"
                value={searchQuery}
                onChange={handleSearch}
                />
            </Form>
            <div className="table-responsive">
                <Table striped bordered hover responsive>
                <thead>
                    <tr>
                        <th>S.No</th>
                        <th>User Name</th>
                        <th>Product</th>
                        <th>Rating</th>
                        <th>Review</th>
                        <th>Date</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredReviews.length > 0 ? (
                        filteredReviews.map((review, i) => (
                            <tr key={review._id}>
                                <td>{i + 1}</td>
                                <td>{review.userId.name}</td>
                                <td>{review.productId.name}</td>
                                {/* <td>{review.rating}</td> */}
                                <td>{renderStars(review.rating)}</td>
                                <td>{review.reviewText}</td>
                                <td>{new Date(review.reviewDate).toLocaleDateString()}</td>
                                <td>
                                    <Button variant="danger" size="sm" onClick={() => { setSelectedReview(review); setShowModal(true); }}>
                                        Delete
                                    </Button>
                                </td>
                            </tr>
                            ))
                    ) : (
                        <tr>
                            {loading ? (<td colSpan="6" className="text-center fw-bold">Reviews Loading ...</td>) : (<td colSpan="6" className="text-center fw-bold">No Reviews found</td>)}
                        </tr>
                    )}
                </tbody>
                </Table>
            </div>

            {/* Delete Confirmation Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                <Modal.Title>Confirm Deletion</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                Are you sure you want to delete this review by{' '}
                <strong>{selectedReview?.userId.name}</strong>?
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
                </Modal.Footer>
            </Modal>
        </Container>
        </Card.Body>
    </Card>
  );
}

export default UserReviews;