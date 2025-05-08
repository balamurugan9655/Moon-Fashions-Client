import React, { useEffect, useState } from "react";
import { Container, Navbar, Nav, NavDropdown, Badge } from "react-bootstrap";
import { FaUser, FaShoppingCart, FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useUser } from "./UserContext";
import axios from '../utils/axios';

const Header = () => {
  // const [isScroll, setIsScroll] = useState(false);
  const { userInfo, logout } = useUser();

  const [cartData, setCartData] = useState(0);

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {

    const CartNumberget = async () => {
      try {
        const res = await axios.get(`/users/${userInfo.udata._id}`);
        const cartitem = res.data.cart;
        setCartData(cartitem.length);
      } catch (err) {
        console.log(err);
      }
    }

    if(userInfo) {
      CartNumberget();
    }
  },[userInfo, cartData])

  /*useEffect(() => {
    const handleScroll = () => {
      setIsScroll(window.scrollY > 160);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);*/

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
        className={`w-100 px-3 px-md-5 border-bottom`}
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
                <Nav.Link as={Link} to="/addtocart" className="text-dark fw-bold mx-2 position-relative z-0 p-1">
                  <FaShoppingCart size={20} /> Cart {cartData !== 0 && <Badge bg="danger" className="position-absolute top-0 start-100 p-1 z-n1 translate-middle rounded-pill"> {cartData} </Badge>}
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
            <Nav.Link as={Link} to="/addtocart" className="text-dark fw-bold mx-2 position-relative z-0 p-1">
              <FaShoppingCart size={20} /> Cart {cartData !== 0 && <Badge bg="danger" className="position-absolute top-0 start-100 p-1 z-n1 translate-middle rounded-pill"> {cartData} </Badge>}
            </Nav.Link>
          </div>
        </Container>
      </Navbar>
    </Container>
  );
};

export default Header;
