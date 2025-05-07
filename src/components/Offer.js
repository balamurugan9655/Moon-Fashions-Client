import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import OfferBaner from "../assets/img/offer1.png";
import MenShirts from "../assets/img/men short.webp";
import MenPants from "../assets/img/men fant.webp";
import MenWatches from "../assets/img/men watch.webp";
import MenBags from "../assets/img/men bags.webp";
import WomenDress from "../assets/img/women Sarees.webp";
import WomenJewellery from "../assets/img/women nekles.webp";
import WomenHandbag from "../assets/img/women bags.webp";
import WomenFootwear from "../assets/img/women footwear.webp";
import KidsDress from "../assets/img/kids dress.webp";
import KidsStationery from "../assets/img/kids stationery.webp";
import KidsToys from "../assets/img/kids toys.webp";
import KidsFootwear from "../assets/img/kids footwear.webp";

const categories = {
  Women: [
    { title: "Sarees", img: WomenDress },
    { title: "Handbag", img: WomenHandbag },
    { title: "Jewellery", img: WomenJewellery },
    { title: "Footwear", img: WomenFootwear },
  ],
  Men: [
    { title: "Shirts", img: MenShirts },
    { title: "Pants", img: MenPants },
    { title: "Bags", img: MenBags },
    { title: "Watches", img: MenWatches },
  ],
  Kids: [
    { title: "Dress", img: KidsDress },
    { title: "Stationery", img: KidsStationery },
    { title: "Toys", img: KidsToys },
    { title: "Footwear", img: KidsFootwear },
  ],
};

const CategoryBox = ({ title, items, navigate }) => (
  <div className="p-3 bg-white rounded shadow-sm m-2">
    <h5 className="text-center mb-4">{title}'s Store</h5>
    <Row>
      {items.map((item, index) => (
        <Col xs={6} md={6} key={index} className="text-center mb-3">
          <Card className="border-0 clickable-card" onClick={()=>navigate("/shop")}>
            <Card.Img variant="top" src={item.img} className="mx-auto" style={{ width: "80%", height: "80%" }} />
            <Card.Body className="p-2">
              <Card.Text className="m-0 fw-bold">{item.title}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  </div>
);

const FashionCategories = () => {
  const navigate = useNavigate();
  return (
    <div style={{ background: "linear-gradient(to right, #ffe5b4, #a349a4)", padding: "2rem 0" }}>
        <Container className="m-2 ms-auto me-auto">
            <img src={OfferBaner} alt="Offer" className="img-fluid" />
        </Container>
      <Container>
        <Row>
          <Col sm={12} md={6} lg={6}><CategoryBox title="Men" items={categories.Men} navigate={navigate} /></Col>
          <Col sm={12} md={6} lg={6}><CategoryBox title="Women" items={categories.Women} navigate={navigate} /></Col>
          <Col sm={12} md={6} lg={6} className="d-block d-md-none"><CategoryBox title="Kids" items={categories.Kids} navigate={navigate} /></Col>
        </Row>
      </Container>
    </div>
  );
};

export default FashionCategories;
