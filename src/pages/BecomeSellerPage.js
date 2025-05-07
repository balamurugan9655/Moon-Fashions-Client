import React from 'react';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import Header from '../components/Header';
import Footer from '../components/Footer';
import emailjs from 'emailjs-com';

const BecomeSellerPage = () => {
  const handleSubmit = (e) => {
    e.preventDefault();

    const form = e.target;

    // Send to Admin
    emailjs.sendForm(
      'service_j9f9fne',
      'template_oo87amw', // to admin (you)
      form,
      'zI_XCS4Itfd_YJcel'
    ).then(() => {
      console.log('Mail sent to admin');
    }).catch((err) => {
      console.error('Failed to send to admin:', err);
    });

    // Send to Client (user who filled the form)
    emailjs.sendForm(
      'service_j9f9fne',
      'template_ab70b5h', // to client
      form,
      'zI_XCS4Itfd_YJcel'
    ).then(() => {
      alert('Thank you! Form submitted successfully.');
      form.reset();
    }).catch((err) => {
      console.error('Failed to send to client:', err);
    });
  };

  return (
    <Container fluid className='p-0'>
      <Header />
      <div className="become-seller">

        {/* Hero Section */}
        <div className="seller-hero d-flex align-items-center justify-content-center text-start">
          <Container>
            <h1 className="display-4 fw-bold">Sell Online with Moon Fashion</h1>
            <p className="lead">Reach millions of customers and grow your business easily</p>
          </Container>
        </div>

        {/* Info Boxes */}
        <Container className="py-5">
          <Row className="text-center g-4">
            {[
              "45K+ Moon Fashion customers",
              "7-day secure & regular payments",
              "Low cost of doing business",
              "One-click Seller Support",
              "Access to Mega Sale Events"
            ].map((item, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>{item}</Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* How It Works */}
        <Container className="text-center py-5 bg-light">
          <h2 className="mb-4">How it works</h2>
          <Row className="g-4">
            {[
              { step: "1", title: "Create Account", desc: "Use your GSTIN or UIN & Bank Account" },
              { step: "2", title: "List Products", desc: "Add your products to Moon Fashion seller panel" },
              { step: "3", title: "Get Orders", desc: "Receive orders from customers across India" },
              { step: "4", title: "Shipping", desc: "We’ll handle the delivery at the lowest cost" },
              { step: "5", title: "Payments", desc: "Receive payments directly to your bank" },
            ].map(({ step, title, desc }, i) => (
              <Col key={i} md={4}>
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body>
                    <div className="circle mb-3">{step}</div>
                    <h5>{title}</h5>
                    <p>{desc}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>

        {/* Form */}
        <Container className="py-5">
          <h2 className="text-center mb-4">Become a Seller</h2>
          <Row className="justify-content-center">
            <Col md={10} lg={8}>
              <Card className="shadow">
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Full Name</Form.Label>
                      <Form.Control type="text" name="name" placeholder="Enter your name" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control type="email" name="email" placeholder="Enter your email" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number</Form.Label>
                      <Form.Control type="tel" name="phone" placeholder="Enter phone number" required />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>GSTIN (Optional)</Form.Label>
                      <Form.Control type="text" name="gstin" placeholder="Enter GSTIN or leave blank" />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Bank Account Number</Form.Label>
                      <Form.Control type="text" name="bank" placeholder="Enter bank account no." required />
                    </Form.Group>

                    <Button type="submit" className="w-100 btn-primary">Submit</Button>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
      <Footer />
    </Container>
  );
};

export default BecomeSellerPage;
