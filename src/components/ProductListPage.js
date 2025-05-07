import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaHeart } from 'react-icons/fa';
import { useUser } from "./UserContext";
import NavBar from '../components/Header';
import FilterSidebar from './FilterSidebar';
import Footer from './Footer';
import axios from '../utils/axios';
import { toast } from 'react-toastify';


const ProductListPage = () => {

  const [likedProducts, setLikedProducts] = useState([]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(100000);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedRatings, setSelectedRatings] = useState([]);

  const [products, setProducts] = useState([]);
  const { userInfo } = useUser();

  const navigate = useNavigate();

  useEffect(() => {
    const cardData = async () => {
      try {
        const response = await axios.get('/products');
        const item = response.data;
        setProducts(item);  
      } catch (err) {
        console.log(err)
      }
    }
    cardData();

    const fetchWishlis = async () => {
      try {
        const res = await axios.get(`/cart/wishlist/${userInfo.udata._id}`);
        setLikedProducts(res.data.wishlist);
      } catch (error) {
        console.log("Error fetching wishlist", error);
      }
    }
    userInfo && fetchWishlis();
    // fetchWishlis();

  },[userInfo, products]);

  // console.log(userInfo? 'success' : 'fail');

  const toggleLike = async (productId) => {
    try {
      const userId = userInfo?.udata?._id;
      console.log(userId);
      if (!userId) {
        alert("Please login to like products.");
        return;
      }
  
      const response = await axios.post('/cart/wishlist', { userId, productId });
  
      setLikedProducts((prev) =>
        prev.includes(productId)
          ? prev.filter((id) => id !== productId)
          : [...prev, productId]
      );
      
      if (response.data.message === 'Added to wishlist') {
        toast.success(response.data.message);
      }
      else {
        toast.warning(response.data.message);
      }
  
    } catch (error) {
      console.error("Wishlist toggle error:", error);
      toast.error("Something went wrong.");
    }
  };
  
  const handlePriceChange = (min, max) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleCheckboxChange = (type, value) => {
    const updater = {
      category: [selectedCategories, setSelectedCategories],
      brand: [selectedBrands, setSelectedBrands],
      rating: [selectedRatings, setSelectedRatings],
    };

    const [current, setter] = updater[type];
    setter((prev) =>
      prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
    );
  };

  const filteredProducts = products.filter((product) => {
    const matchesPrice = product.price >= minPrice && product.price <= maxPrice;
    const matchesCategory =
      selectedCategories.length === 0 || selectedCategories.includes(product.category);
    const matchesBrand =
      selectedBrands.length === 0 || selectedBrands.includes(product.brand);
    const matchesRating =
      selectedRatings.length === 0 ||
      selectedRatings.some((rating) => product.rating >= parseFloat(rating));
    return matchesPrice && matchesCategory && matchesBrand && matchesRating;
  });
  
  const handleAddToCart = async (productId) => {
    try {     
      const userId = await userInfo.udata._id;
      const res = await axios.post('/cart/addtocart', { userId, productId });
      if(res.data.message === 'Product added to cart') {
        toast.success(res.data.message);
      }
      else {
        toast.warning(res.data.message);
      }
      
    } catch (err) {
      console.error("Error adding to cart:", err);
      toast.error("Something went wrong");
    }
  }


 return (
  <Container fluid className="p-0">
    <NavBar />
    <Container fluid className="mt-3 mb-3">
      <Row>
        <Col md={3} className='mb-2'>
          <FilterSidebar
            minPrice={minPrice}
            maxPrice={maxPrice}
            onPriceChange={handlePriceChange}
            selectedCategories={selectedCategories}
            selectedBrands={selectedBrands}
            selectedRatings={selectedRatings}
            onCheckboxChange={handleCheckboxChange}
            products={filteredProducts}
          />
        </Col>

        <Col md={9}>
          <Row>
            {filteredProducts.length === 0 ? (
              <p className="text-center">No products found with selected filters.</p>
            ) : (
              filteredProducts.map((product,index) => (
                <Col key={index} xs={12} sm={6} md={6} lg={3} className="mb-2">
                  <Card className="h-100 shadow-sm position-relative">
                    <Badge
                      bg="light"
                      className="position-absolute top-0 end-0 m-2"
                      onClick={() => toggleLike(product._id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <FaHeart color={likedProducts.includes(product._id) ? 'red' : 'gray'} />
                    </Badge>
                    <Card.Img
                      variant="top"
                      src={product.image}
                      style={{ height: '180px', objectFit: 'contain' }}
                    />
                    <Card.Body className="p-2">
                      {product.sponsored && (
                        <Badge bg="light" text="primary" className="mb-1">Sponsored</Badge>
                      )}
                      <Card.Title  style={{ fontSize: '0.95rem' }}> <span className='fw-bold'> {product.brand} </span> <span> {product.name} </span></Card.Title>
                      <Card.Text className="mb-1">
                        { product.rating<5 ? (<Badge bg="success" className="me-1">{product.rating} ★ </Badge>) : (<Badge bg="success" className="me-1">{product.rating}.0 ★ </Badge>) }
                        <small className="text-muted">({product.reviews})</small>
                      </Card.Text>
                      <Card.Text className="fw-bold mb-1">
                        ₹{product.price}{' '}
                        <span className="text-muted text-decoration-line-through">
                          ₹{product.originalPrice}
                        </span>
                        <span className="text-success ms-1">{product.discount}% off</span>
                      </Card.Text>
                      <div className=' card-text mb-1'>
                      {product.freeDelivery && <div className="text-success small">Free delivery</div>}
                      {product.stockStatus === "Out of Stock" && <Badge bg="danger" className="me-1">Out of Stock</Badge>}
                      </div>
                    </Card.Body>
                    <Container fluid  className='d-flex justify-content-between mb-2'> 
                      <Button  variant='outline-primary' size='sm' onClick={() => handleAddToCart(product._id)}>Add To Cart</Button>
                      <Button size='sm' variant="primary" onClick={() => navigate(`/product/${product._id}`)}>
                        More Details
                      </Button>
                    </Container>
                  </Card>
                </Col>
              ))
            )}
          </Row>
        </Col>
      </Row>
    </Container>
    <Footer />
  </Container>
  );
};

export default ProductListPage;
