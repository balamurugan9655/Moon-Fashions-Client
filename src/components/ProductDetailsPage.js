import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from '../utils/axios';
import { Container, Row, Col, Button, Image, Badge, Form } from 'react-bootstrap';
import Header from './Header';
import { useUser } from "./UserContext";

const ProductDetailsPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProduct(res.data);
        setDeliveryDate(calculateDeliveryDate(Math.floor(Math.random()*6 + 3)));
        setLoading(false);
      } catch (err) {
        console.error('Error fetching product:', err);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  // console.log(Math.floor(Math.random()*6 + 3))


  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');

  // Function to calculate delivery date
  const calculateDeliveryDate = (daysToAdd) => {
    const date = new Date();
    date.setDate(date.getDate() + daysToAdd);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      weekday: 'short'
    });
  };

  const [quantity, setQuantity] = useState(1);


  const handleCheck = () => {
    if (pincode.length === 6) {
      setDeliveryDate(calculateDeliveryDate(2)); // 2 days for valid pincode
    } else {
      alert('Enter valid 6-digit pincode');
    }
  };

     const { userInfo } = useUser();

    const handleAddToCart = async (productId) => {
      try {     
        const userId = await userInfo.udata._id;
        const res = await axios.post('/cart/addtocart', { userId, productId });
        alert(res.data.message);
      } catch (err) {
        console.error("Error adding to cart:", err);
        alert("Something went wrong");
      }
    }

    const handleBuyNow = () => {
      // console.log("handleBuyNow clicked");
      if (userInfo) {
        navigate('/orderpage', {
          state: {
            userId: userInfo.udata._id,
            productData: product,
            quantity: quantity,
            deliveryDate: deliveryDate,
          }
        });
      }
      else {
        alert('if you buy a product please login')
        navigate('/loginpage')
      }
      
    };

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found</p>;

  return (
      <Container fluid>
        <Header />
        <Container fluid className='mt-4'>
          {loading ? (
            <p>Loading...</p>
          ) : (
            <Row>
              <Col md={6} className='text-center border'>
                <Image src={product.image} alt={product.name} fluid style={{ maxHeight: '400px', objectFit: 'contain' }} />
                {/* <Container className="mt-2">
                  <Button as={Link} to='/orderpage' variant="outline-primary">Buy Now</Button>
                </Container> */}
              </Col>

              <Col md={6} className='ps-2 pe-2 p-md-4 pt-2'>
              <h2 className='mb-2'> {product.brand} </h2>
                <h2 className='mb-2 fw-normal'>{product.name}</h2>

                {product.sponsored && (
                  <Badge bg="light" text="primary" className="mb-2">Sponsored</Badge>
                )}

                <h6 className='mb-2'>
                  <Badge bg="success" className="me-2">
                      {product.rating} ★
                  </Badge>
                  <small className="text-muted">({product.reviews}) Ratings </small>
                </h6>

                <h5 className="fw-bold mb-1">
                  ₹{product.price}{' '}
                  <span className="text-muted text-decoration-line-through">
                    ₹{product.originalPrice}
                  </span>
                  <span className="text-success ms-1">{product.discount}% off</span>
                </h5>

                <div className='card-text mb-2'>
                  {product.stockStatus === "Out of Stock" && (
                    <Badge bg="danger" className="me-1">Out of Stock</Badge>
                  )}
                </div>

                <div className="mb-1">
                  <div className="d-flex align-items-center mt-1 mb-2">
                    <Form.Control
                      type="text"
                      placeholder="Enter Pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      style={{ width: '150px' }}
                      maxLength={6}
                    />
                    <Button onClick={handleCheck} variant="outline-primary" className="ms-2">Check</Button>
                  </div>
                  <small className='text-muted mb-1'>
                    Delivery by <strong>{deliveryDate}</strong>{' | '}
                    { product.freeDelivery ? (<span className="text-success small fw-bold"> Free delivery <span className='text-muted text-decoration-line-through fw-bold'>₹45</span></span>) : (<span className=''>Delivery Charge : <span className='fw-bold text-success'> ₹45 </span> </span>) }  
                  </small>
                </div>
                <div className='d-flex flex-column flex-md-row justify-content-around '>
                  <p className='text-muted fw-bold mb-0 '>Description<span>&nbsp;</span>: </p>
                  <p className='mb-0'> {product.description} </p>
                </div>
                {/* Quantity Input Field */}
                <div className="mb-2 d-flex align-items-center p-0 p-md-2 ps-0 mb-0 mb-md-2">
                  <Form.Group controlId="quantityInput" className="d-flex align-items-center">
                    <Form.Label className="me-2 fw-bold mb-0">Quantity : </Form.Label>
                    <Form.Control 
                      type="number" 
                      min="1" 
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      style={{ width: '100px' }} 
                    />
                  </Form.Group>
                  <p className='text-muted fw-bold p-3 mb-auto mt-auto'>₹ {product.price * quantity}</p>
                </div>
                <Container fluid  className='d-flex justify-content-between mb-2 w-100'> 
                  <Button  variant='outline-primary' className='w-50 me-1' onClick={() => handleAddToCart(product._id)}>Add To Cart</Button>
                  <Button variant="primary" className='w-50 ms-1' onClick={()=>handleBuyNow()} disabled={product.stockStatus === 'Out of Stock'}>
                    Buy Now
                  </Button>
                </Container>
              </Col>
            </Row>
          )}
          
        </Container>
      <Container className="mt-4">
      {/* <Row>
        
        <Col md={6} className="text-center">
          <Image
            src={product.image || product.images?.[0]} // supports either single or multiple images
            alt={product.name}
            fluid
            style={{ maxHeight: '400px', objectFit: 'contain' }}
          />
          <div className="mt-3">
            <Button variant="warning" className="me-2">Add to Cart</Button>
            <Button variant="success">Buy Now</Button>
          </div>
        </Col>

        
        <Col md={6}>
          <h3>{product.name}</h3>
          <h4 className="text-success">₹ {product.price}</h4>
          <p><strong>Category:</strong> {product.category}</p>
          <p><strong>Brand:</strong> {product.brand}</p>
          <p><strong>Rating:</strong> {product.rating} ★</p>
          <Card className="p-3 mt-3 shadow-sm">
            <h5>Description</h5>
            <p>{product.description}</p>
          </Card>
        </Col>
      </Row> */}
    </Container>
    </Container>
  );
};

export default ProductDetailsPage;
