import React, { useEffect, useState } from "react";
import { Container, Row, Col, Card, Button, Modal, Form } from "react-bootstrap";
import axios from "../utils/axios";
import { useUser } from "../components/UserContext";
import Header from "../components/Header";

const MyOrderPage = () => {
  const { userInfo } = useUser();
  const [userId, setUserId] = useState(userInfo.udata._id);
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState([]);
  const [show, setShow] = useState(false);
  const [rating, setRating] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if(!userId) {
          setUserId(userInfo.udata._id)
        }
        const orderRes = await axios.get(`/orders/myorders/${userId}`);
        setOrder(orderRes.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching data", err);
      }
    };

    fetchData();
  }, [userId, userInfo]);

  const handleClose = () => {
    setShow(false);
    setRating("");
    setReviewText("");
    setSelectedProductId(null);
  };

  const handleShow = (productId) => {
    setSelectedProductId(productId);
    setShow(true);
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/reviews", {
        userId: userId,
        productId: selectedProductId,
        rating,
        reviewText,
      });
      alert("Review submitted successfully!");
      handleClose();
    } catch (err) {
      console.error("Error submitting review", err);
      alert("Failed to submit review");
    }
  };

  return (
    <Container fluid className="p-0">
      <Header />
      <Container fluid className="py-4">
        <Row className="justify-content-center">
          <Col xs={12} lg={10}>
            {loading ? (
              <p className="text-center">Loading Orders...</p>
            ) : order.length === 0 ? (
              <p className="text-center">No orders found.</p>
            ) : (
              order.map((ord) => (
                <Card key={ord._id} className="p-3 shadow rounded-4 mb-3">
                  <Row className="gy-2 align-items-center">
                    {/* Product Image */}
                    <Col xs={12} md={2} className="text-center">
                      <img
                        src={ord.items[0].productId.image}
                        alt="product"
                        className="img-fluid rounded-3"
                        style={{ maxHeight: "150px", objectFit: "contain" }}
                      />
                    </Col>

                    {/* Product Info */}
                    <Col xs={12} md={4}>
                      <h5 className="fw-bold text-center text-md-start">
                        <strong className="text-muted">
                          {ord.items[0].productId.brand}
                        </strong>{" "}
                        {ord.items[0].productId.name}
                      </h5>
                      {/* <p>{ord.items[0].productId.description}</p> */}
                    </Col>

                    {/* Order Details */}
                    <Col xs={12} md={3}>
                      <p className="mb-1"><strong>Total Amount : </strong> ₹{ord.totalAmount}</p>
                      <p className="mb-1"><strong>Quantity : </strong> {ord.items[0].quantity}</p>
                      <p className="mb-1">
                        <strong>Payment Method : </strong>{" "}
                        {ord.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}
                      </p>
                      <p className="mb-1">
                        <strong>Order Date:</strong>{" "}
                        {new Date(ord.orderDate).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        })}
                      </p>
                    </Col>

                    {/* Delivery Info & Review Button */}
                    <Col xs={12} md={3}>
                      <p className="mb-2">
                        <strong>Delivery Date:</strong>{" "}
                        {new Date(ord.deliveryDate).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </p> 
                      <p className="mb-2"><strong>Delivery Status:</strong> {ord.paymentStatus}</p>
                      <Button
                        className="w-100"
                        variant="primary"
                        onClick={() => handleShow(ord.items[0].productId._id)}
                      >
                        Rate & Review
                      </Button>
                    </Col>
                  </Row>
                </Card>
              ))
            )}
          </Col>
        </Row>

        {/* Review Modal */}
        <Modal show={show} onHide={handleClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>Rate and Review</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleReviewSubmit}>
            <Modal.Body>
              <Form.Group>
                <Form.Label>Rating (1 to 5)</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="5"
                  required
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                />
              </Form.Group>
              <Form.Group className="mt-3">
                <Form.Label>Your Review</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={4}
                  required
                  value={reviewText}
                  onChange={(e) => setReviewText(e.target.value)}
                />
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button type="submit" variant="success">
                Submit Review
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Container>
    </Container>
  );
};

export default MyOrderPage;
