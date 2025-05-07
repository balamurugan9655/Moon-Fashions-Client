import React from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import ProdectImg1 from "../assets/img/p1.webp";
import ProdectImg2 from "../assets/img/p2.png";
import ProdectImg3 from "../assets/img/p3.avif";
import ProdectImg4 from "../assets/img/p4.avif";
import ProdectImg5 from "../assets/img/p5.avif";
import ProdectImg6 from "../assets/img/p6.avif";
import ProdectImg7 from "../assets/img/p7.avif";
import ProdectImg8 from "../assets/img/p8.png";
import ProdectImg9 from "../assets/img/p9.avif";
import ProdectImg10 from "../assets/img/p10.avif";
import ProdectImg11 from "../assets/img/p11.avif";
import ProdectImg12 from "../assets/img/p12.avif";


const categories = [
  {
    title: 'Washing Machine',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/ww70r22ek0x-tl/gallery/in-front-loading-ww66r22ek0stl-322208-ww70r22ek0x-tl-539194816?$684_547_PNG$',
    img_Org: ProdectImg1
  },
  {
    title: 'Mobile',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/2401/gallery/in-galaxy-s24-s928-sm-s928bzycins-539573502?imbypass=true',
    img_Org: ProdectImg2
  },
  {
    title: 'TV',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/qa98qn990ckxxl/gallery/in-qled-98qn990c-qa98qn990ckxxl-538370616?$684_547_JPG$',
    img_Org: ProdectImg3
  },
  {
    title: 'Refrigerator',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/rt34dg5a2bbxhl/gallery/in-top-mount-freezer-twin-cooling-plus-529471-rt34dg5a2bbxhl-544358006?$684_547_JPG$',
    img_Org: ProdectImg4
  },
  {
    title: 'Microwave Oven',
    img_URL: 'https://images.samsung.com/is/image/samsung/in-28-litre-convection-microwave-oven-mc28m6036cc-mc28m6036cc-tl-rperspectiveopenblack-184429855?$684_547_JPG$',
    img_Org: ProdectImg5
  },
  {
    title: 'Dishwasher',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/dw60m6043fs-tl/gallery/in-dw5500mm--dw60m5042fs-404707-dw60m6043fs-tl-515032939?$2052_1641_JPG$',
    img_Org: ProdectImg6
  },
  {
    title: 'Vacuum Cleaner',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/vr30t85513w-tl/gallery/in-jetbot-vr8500-vr30t85513w-tl-534968625?$684_547_JPG$',
    img_Org: ProdectImg7
  },
  {
    title: 'Laptop',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/np750qha-lg4in/gallery/in-galaxy-book5-360-15-inch-np750-538824-np750qha-lg4in-545171721?imbypass=true',
    img_Org: ProdectImg8
  },
  {
    title: 'Soundbar',
    img_URL: 'https://images.samsung.com/is/image/samsung/p6pim/in/hw-q990d-xl/gallery/in-q-series-soundbar-hw-q990d-hw-q990d-xl-541818768?$2052_1641_JPG$',
    img_Org: ProdectImg9
  },
  {
    title: 'Air Conditioner',
    img_URL: 'https://www.lg.com/content/dam/channel/wcms/in/images/split-ac/us-q24enxe_anlg_eail_in_c/gallery/US-Q24ENXE-Air-Conditioners-DZ-4.jpeg/_jcr_content/renditions/thum-1600x1062.jpeg',
    img_Org: ProdectImg10
  },
  { 
    title: 'Water Purifier',
    img_URL: 'https://www.lg.com/content/dam/channel/wcms/in/images/water-purifiers/ww176gpbw/WW176GPBW-DZ-4.jpg/_jcr_content/renditions/thum-1600x1062.jpeg',
    img_Org: ProdectImg11
  },
  {
    title: 'Projector',
    img_URL: 'https://www.lg.com/content/dam/channel/wcms/in/images/cinebeam/ph30n_atrq_eail_in_c/gallery/PH30N-DZ-05.jpg',
    img_Org: ProdectImg12
  },
];

function CategorySection() {

  const navigate = useNavigate();

  return (
    <Container fluid className="text-center my-5">
      <h2 className="fw-bold mb-4">EXPLORE BY CATEGORY</h2>
      <Row>
        {categories.map((cat, index) => {
          const navName = cat.title.toLowerCase();
          const randomOffer = Math.floor(Math.random() * 50) + 30; // 30–80%
          return (
            <Col key={index} xs={6} sm={4} md={4} lg={2} className="mb-4">
              <Card className="h-100 custom-card shadow-hover clickable-card" onClick={()=>navigate(`/category/${navName}`)}>
                <div className="position-relative h-100">
                  <Card.Img
                    variant="top"
                    className="h-100"
                    src={cat.img_URL}
                    alt={cat.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = cat.img_Org;
                    }}
                  />
                  <Badge bg="danger" className="position-absolute top-0 end-0 m-2">
                     {randomOffer}% OFF
                  </Badge>
                </div>
                <Card.Body className="mt-auto" style={{ background: "linear-gradient(to top, white, #ade8f4)" }}>
                  <Card.Title className="fs-6 mb-2 mb-md-4 mb-lg-4">{cat.title}</Card.Title>
                  {/* <Card.Text className="text-primary fw-bold">
                  <span className="badge bg-light text-success border border-success mb-2 px-2 py-1" style={{ fontSize: "0.75rem" }}>
                    Free Delivery
                  </span>
                  </Card.Text> */}
                  <Card.Text className="d-flex align-items-center justify-content-between f-col">
                    <span className="bg-success text-white fw-bold px-2 py-1 rounded small">
                      {((Math.random() * 2 + 3).toFixed(1))} ★
                    </span>
                    <span className="text-muted small">{Math.floor(Math.random() * 10000 + 100)} Reviews</span>
                  </Card.Text>
                  {/* <Button variant="link" className="p-0 text-decoration-none">
                    Shop Now
                  </Button> */}
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default CategorySection;
