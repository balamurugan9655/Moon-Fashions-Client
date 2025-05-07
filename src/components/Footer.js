import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaFacebookF, FaInstagram, FaYoutube, FaTwitter, FaWhatsapp } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-3">
      <Container>
        <Row className="gy-2">
          <Col md={4}>
            <h4 className="fw-bold mb-3">Moon Fashions</h4>
            <p className="text-light small">
              Discover your perfect look with our AI-powered virtual dressing room. Style that fits you, virtually!
            </p>
            {/* <div className="d-flex gap-3 mt-3">
              <Link to="#" className="text-white fs-5"><FaFacebookF /></Link>
              <Link to="#" className="text-white fs-5"><FaInstagram /></Link>
              <Link to="#" className="text-white fs-5"><FaTwitter /></Link>
              <Link to="#" className="text-white fs-5"><FaYoutube /></Link>
            </div> */}
          </Col>

          <Col md={2}>
            <h6 className="fw-bold">Categories</h6>
            <ul className="list-unstyled small">
              <li><Link to="/shop" className="text-white text-decoration-none">Men</Link></li>
              <li><Link to="/shop" className="text-white text-decoration-none">Women</Link></li>
              <li><Link to="/shop" className="text-white text-decoration-none">Kids</Link></li>
              <li><Link to="/shop" className="text-white text-decoration-none">Accessories</Link></li>
            </ul>
          </Col>

          <Col md={3}>
            <h6 className="fw-bold">Support</h6>
            <ul className="list-unstyled small">
              <li><Link to="#" className="text-white text-decoration-none">Contact Us</Link></li>
              <li><Link to="#" className="text-white text-decoration-none">Shipping Info</Link></li>
              <li><Link to="#" className="text-white text-decoration-none">Returns & Exchanges</Link></li>
              <li><Link to="#" className="text-white text-decoration-none">FAQs</Link></li>
            </ul>
          </Col>

          <Col md={3}>
            {/* <h6 className="fw-bold">Join Our Newsletter</h6>
            <Form className="d-flex mt-2">
              <Form.Control
                type="email"
                placeholder="Enter email"
                className="me-2"
              />
              <Button variant="light" className="text-dark fw-semibold">Join</Button>
            </Form> */}
            <h6 className='fw-bold'>Reach out to us</h6>
            <div className="d-flex gap-3 mb-2">
              <Link to="#" className="text-white fs-5"><FaFacebookF /></Link>
              <Link to="#" className="text-white fs-5"><FaInstagram /></Link>
              <Link to="#" className="text-white fs-5"><FaTwitter /></Link>
              <Link to="#" className="text-white fs-5"><FaYoutube /></Link>
              <Link to="#" className="text-white fs-5"><FaWhatsapp /></Link>
            </div>
            {/* <p className="small mt-2 text-white">Stay updated on new styles, features & AI fitting room tech!</p> */}
          </Col>
        </Row>

        <hr className="border-light mt-2" />
        <p className="text-center small text-secondary mb-0">
          © {new Date().getFullYear()} Moon Fashions
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
