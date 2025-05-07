import React, { useState } from 'react';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button } from 'react-bootstrap';
import { useUser } from "../components/UserContext";

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  const navigate = useNavigate();
  const { userInfo, login, logout } = useUser();

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    if (userInfo) {
      logout();
    }

    try {
      const res = await axios.post('/users/admin-login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userType', 'admin');
      localStorage.setItem('name', res.data.name);
      alert('Admin Login Successful');
      login({ userType: "admin", userName: res.data.udata });
      navigate('/admin');
    } catch (err) {
      if (err.response && err.response.status === 400) {
        alert(err.response.data.msg);
      } else {
        alert("Something went wrong");
      }
    }
  };

  return (
    <Container fluid className="d-flex justify-content-center align-items-center bg-light" style={{ minHeight: '100vh' }}>
      <Row className="w-100 justify-content-center px-2">
        <Col xs={12} sm={10} md={8} lg={6} xl={4}>
          <Card className="shadow-lg rounded-4 border-0">
            <div
              className="text-white text-center p-3 rounded-top"
              style={{
                background: 'linear-gradient(135deg, #3f5efb, #fc466b)',
              }}
            >
              <h4 className="mb-0">Admin Login</h4>
            </div>
            <Card.Body className="p-4">
              <Form noValidate validated={validated} onSubmit={handleAdminLogin}>
                <Form.Group className="mb-3" controlId="adminEmail">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter your admin email"
                    className="rounded-pill"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please enter a valid email address.
                  </Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4" controlId="adminPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter your password"
                    className="rounded-pill"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    maxLength={20}
                  />
                  <Form.Control.Feedback type="invalid">
                    Password must be at least 6 characters, include letters and numbers.
                  </Form.Control.Feedback>
                </Form.Group>

                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    className="rounded-pill fw-semibold"
                    style={{ background: '#3f5efb', border: 'none' }}
                  >
                    Login as Admin
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLogin;
