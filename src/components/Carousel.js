import { useState } from 'react';
import Carousel from 'react-bootstrap/Carousel';
import CaroselImg1 from "../assets/img/c1.jpg";
import CaroselImg2 from "../assets/img/c2 D.jpg";
import CaroselImg3 from "../assets/img/c3.jpg";
import { useNavigate } from 'react-router-dom';
import { useUser } from "./UserContext";

function MyCarousel() {
  const [index, setIndex] = useState(0);
  const navigate= useNavigate();

  const { userInfo } = useUser();

  const handleSelect = (selectedIndex) => {
    setIndex(selectedIndex);
  };

  const myOrders = () => {
    if(userInfo) {
      navigate('/orders');
    }
    else {
      alert('Please Login After View Your Orders');
      navigate('/loginpage');
    }
  }

  return (
    <Carousel activeIndex={index} onSelect={handleSelect} fade>
      <Carousel.Item>
        <img
          className="d-block w-100 img-fluid"
          src={CaroselImg1}
          alt="First slide"
        />
        <Carousel.Caption className=" ">
          <h1>Welcome to Trendy Dress Shop</h1>
          <p className='d-none d-md-block d-lg-block'>Discover the latest collections with affordable pricing and stylish designs for all occasions.</p>
          <button className="btn btn-primary" onClick={() => navigate('/shop')} >Shop Now</button>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 img-fluid"
          src={CaroselImg2}
          alt="Second slide"
        />
        <Carousel.Caption className="">
          <h1>Fast & Reliable Delivery</h1>
          <p className='d-none d-md-block d-lg-block'>We deliver your favorite styles to your doorstep quickly and safely, wherever you are!</p>
          <button className="btn btn-success" onClick={myOrders}>My Orders</button>
        </Carousel.Caption>
      </Carousel.Item>

      <Carousel.Item>
        <img
          className="d-block w-100 img-fluid"
          src={CaroselImg3}
          alt="Third slide"
        />
        <Carousel.Caption className="">
          <h1>Join as a Supplier</h1>
          <p className='d-none d-md-block d-lg-block'>Collaborate with us and grow your business by reaching thousands of fashion lovers.</p>
          <button className="btn btn-warning">Become a Partner</button>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default MyCarousel;
