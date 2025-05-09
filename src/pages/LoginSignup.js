import React, { useState } from 'react';
import { Container, Form, Button, Tab, Tabs, Card, Row, Col } from 'react-bootstrap';
import axios from '../utils/axios';
import { useUser } from "../components/UserContext";
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const LoginSignup = () => {
  const [key, setKey] = useState('login');
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [signupData, setSignupData] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' });

  const [loginValidated, setLoginValidated] = useState(false);
  const [signupValidated, setSignupValidated] = useState(false);

  const { login } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setLoginValidated(true);
      return;
    }

    try {
      const res = await axios.post('/users/login', loginData);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('userType', JSON.stringify(res.data.userType));
      localStorage.setItem('udata', JSON.stringify(res.data.udata));
      localStorage.setItem('name', res.data.name);

      login({ userType: res.data.userType, udata: res.data.udata });
      toast.success("Login Successfully");
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (form.checkValidity() === false || signupData.password !== signupData.confirmPassword) {
      e.stopPropagation();
      setSignupValidated(true);
      return;
    }

    try {
      const res = await axios.post('/users/signup', signupData);
      toast.success(res.data.msg);
      localStorage.setItem('userType', JSON.stringify("user"));
      localStorage.setItem('udata', JSON.stringify(res.data.udata));

      login({ userType: "user", udata: res.data.udata });
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.msg || "Something went wrong");
    }
  };

  return (
    <Container fluid className='bg-pink'>
      <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        <Card className='res-width p-2 p-md-5 p-lg-5' style={{ backgroundColor: "white", backdropFilter: "blur(10px)" }}>
          <Tabs activeKey={key} onSelect={(k) => setKey(k)} className="mb-3 justify-content-center">
            <Tab eventKey="login" title="Login">
              <Form noValidate validated={loginValidated} onSubmit={handleLogin}>
                <Form.Group className="mb-3">
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="example@gmail.com"
                    value={loginData.email}
                    pattern="[a-z0-9._%+-]+@gmail\\.com$"
                    onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">Valid email required</Form.Control.Feedback>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password :</Form.Label>
                  <Form.Control
                    required
                    type="password"
                    placeholder="********"
                    value={loginData.password}
                    minLength={6}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">Password required (min 6 characters)</Form.Control.Feedback>
                </Form.Group>
                <Button variant="primary" type="submit" className="w-100">Login</Button>
              </Form>
            </Tab>

            <Tab eventKey="signup" title="Signup">
              <Form noValidate validated={signupValidated} onSubmit={handleSignup}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Name :</Form.Label>
                      <Form.Control
                        required
                        type="text"
                        placeholder="Your Name"
                        value={signupData.name}
                        minLength={3}
                        onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                      />
                      <Form.Control.Feedback type="invalid">Enter valid name (min 3 letters)</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Phone Number :</Form.Label>
                      <Form.Control
                        required
                        type="tel"
                        placeholder="9876543210"
                        pattern="^[6-9]\d{9}$"
                        maxLength={10}
                        value={signupData.phone}
                        onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                      />
                      <Form.Control.Feedback type="invalid">Enter valid 10-digit phone number</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email :</Form.Label>
                  <Form.Control
                    required
                    type="email"
                    placeholder="example@gmail.com"
                    value={signupData.email}
                    pattern="[a-z0-9._%+-]+@gmail\\.com$"
                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                  />
                  <Form.Control.Feedback type="invalid">Enter valid email</Form.Control.Feedback>
                </Form.Group>

                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Password :</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Password"
                        minLength={6}
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                      />
                      <Form.Control.Feedback type="invalid">Min 6 characters required</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Confirm Password :</Form.Label>
                      <Form.Control
                        required
                        type="password"
                        placeholder="Confirm Password"
                        minLength={6}
                        value={signupData.confirmPassword}
                        isInvalid={signupData.confirmPassword !== signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })}
                      />
                      <Form.Control.Feedback type="invalid">Passwords must match</Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>

                <Button variant="outline-primary" type="submit" className="w-100">Register</Button>
              </Form>
            </Tab>
          </Tabs>
        </Card>
      </Container>
    </Container>
  );
};

export default LoginSignup;
