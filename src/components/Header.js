import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, NavDropdown } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";

const Header = () => {
  const [isScroll, setIsScroll] = useState(false);
  const { userInfo, logout } = useUser();

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 160);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <Container fluid className="p-0">
      {/* Top Header */}
      <Container fluid className="border-bottom tab-view">
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-3 ph-vw">
          Moon Fashions
        </Navbar.Brand>
        <Nav>
          <Nav.Link as={Link} to="/seller" className="sm-p">Become a Supplier</Nav.Link>
          <Nav.Link as={Link} to="/admin-login" className="sm-p">Admin Login</Nav.Link>
        </Nav>
      </Container>

      {/* Main Navbar */}
      <Navbar
        bg="white"
        expand="lg"
        className={`w-100 px-3 px-md-5 border-bottom ${isScroll ? "sticky-navbar" : "relative-navbar"}`}
      >
        <Container fluid>
          <Navbar.Brand as={Link} to="/" className="fw-bold d-lg-none">
            Moon Fashions
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            <Nav className="mx-auto text-center">
              {["Men", "Women", "Kids", "Jewellery", "Footwear", "Kitchen Appliances", "Electronics"].map((item, index) => (
                <Nav.Link key={index} as={Link} to="/shop" className="fw-bold text-start px-3">
                  {item}
                </Nav.Link>
              ))}

              {/* Mobile View: Cart & User */}
              <div className="d-lg-none d-flex justify-content-between mt-1 w-100">
                {!userInfo ? (
                  <Nav.Link as={Link} to="/loginpage" className="text-dark fw-bold mx-2">
                    <FaUser size={20} /> Login
                  </Nav.Link>
                ) : (
                  <NavDropdown
                    title={<span className="text-dark fw-bold"><FaUserCircle size={22} /> {userInfo.udata.name}</span>}
                    className="text-dark fw-bold mx-2"
                  >
                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/orders">Orders</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
                  </NavDropdown>
                )}
                <Nav.Link as={Link} to="/addtocart" className="text-dark fw-bold mx-2">
                  <FaShoppingCart size={20} /> Cart
                </Nav.Link>
              </div>
            </Nav>
          </Navbar.Collapse>

          {/* Desktop View: Cart & User */}
          <div className="d-none d-lg-flex align-items-center">
            {!userInfo ? (
              <Nav.Link as={Link} to="/loginpage" className="text-dark fw-bold mx-2">
                <FaUser size={20} /> Login
              </Nav.Link>
            ) : (
              <NavDropdown
                title={<span className="text-dark fw-bold"><FaUserCircle size={22} /> {userInfo.udata.name}</span>}
                className="text-dark fw-bold mx-2"
              >
                <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                <NavDropdown.Item as={Link} to="/orders">Orders</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={handleLogout}>Logout</NavDropdown.Item>
              </NavDropdown>
            )}
            <Nav.Link as={Link} to="/addtocart" className="text-dark fw-bold mx-2">
              <FaShoppingCart size={20} /> Cart
            </Nav.Link>
          </div>
        </Container>
      </Navbar>
    </Container>
  );
};

export default Header;
