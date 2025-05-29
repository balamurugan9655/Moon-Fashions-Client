// src/pages/AdminLayout.js
import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Navbar, Nav, ListGroup, Dropdown } from 'react-bootstrap';
import { BsPersonCircle } from 'react-icons/bs';
import { IoLogOutOutline } from "react-icons/io5";
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';
import axios from '../utils/axios';

import { useUser } from "../components/UserContext";

const AdminLayout = () => {
  
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState("");
  const [loading, setLoading] = useState(true); // true by default to block rendering

  const { logout } = useUser()

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/admin-login');
          return;
        }

        const res = await axios.get('/users/admin', {
          headers: { Authorization: `${token}` },
        });

        setUserName(res.data.adminUser.name);

        // Only show Welcome screen if current path is exactly "/admin"
        if (location.pathname === "/admin") {
          setTimeout(() => {
            navigate('/admin/dashboard');
            setLoading(false);
          }, 2000); // Show welcome for 2s
        } else {
          setLoading(false); // go directly if not on /admin
        }

      } catch (error) {
        console.error('Auth error:', error);
        navigate('/admin-login');
      }
    };

    fetchUser();
  }, [navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    logout();
    navigate('/');
  };

  return (
    <Container fluid className="p-0 admin-layout">
      {/* Header */}
      <Navbar bg="light" className="shadow-sm px-3 justify-content-between fixed-top">
        <Navbar.Brand as={Link} to='/admin/dashboard' className="fw-bold text-primary">Moon Fashion</Navbar.Brand>
        <Nav>
          <Dropdown align="end">
            <Dropdown.Toggle variant="light" className="d-flex align-items-center border-0 bg-transparent">
              <span className='fw-bold me-2'>{userName}</span>
              <BsPersonCircle size={28} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={handleLogout}>
                <IoLogOutOutline size={28} className='me-1' />
                Logout
              </Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Nav>
      </Navbar>

      {/* Layout */}
      <Row className="g-0">
        {/* Sidebar */}
        <Col md={2} className="sidebar bg-light d-none d-md-block d-lg-block position-fixed pt-0" style={{ height: '100vh' }}>
          <ListGroup variant="flush" className="mt-5">
            <ListGroup.Item as={Link} to="/admin/dashboard" active={location.pathname === "/admin/dashboard"}>Dashboard</ListGroup.Item>
            <ListGroup.Item as={Link} to="/admin/products" active={location.pathname === "/admin/products"}>Product List</ListGroup.Item>
            <ListGroup.Item as={Link} to="/admin/users" active={location.pathname === "/admin/users"}>User List</ListGroup.Item>
            <ListGroup.Item as={Link} to="/admin/orders" active={location.pathname === "/admin/orders"}>Order List</ListGroup.Item>
            <ListGroup.Item as={Link} to="/admin/ourreview" active={location.pathname === "/admin/ourreview"}>Costomer Review</ListGroup.Item>
            <ListGroup.Item></ListGroup.Item>
          </ListGroup>
        </Col>

        {/* Main Content */}
        <Col md={{ span: 10, offset: 2 }} xs={12} className="pt-5 mt-4 p-4">
          {userName.length <= 0 ? (
              <h1>Loading Data...</h1>
          ): (
            location.pathname === "/admin" && loading ? (
              <h1 className="text-center">Welcome Back {userName.toUpperCase()} 👋</h1>
            ) : (
              <Outlet />
            )
          )
          }
        </Col>
      </Row>
    </Container>
  );
};

export default AdminLayout;
