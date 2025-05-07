import React, { useEffect, useState } from 'react';
import { Table, Button, Card, Container, Row, Col,Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const ProductList = () => {

  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(()=>{

    const productGet = async () => {
      try {
        const response = await axios.get('/products')
        const item = response.data;
        setProducts(item.map(item => item));
        setLoading(false);
        // console.log(item.map(item => item._id))  
      } catch (err) {
        console.log(err)
        setLoading(true)
      }
    }
    productGet();

  },[]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    
    try {
      const response = await axios.delete(`/products/${id}`);
      alert(response.data.message); // shows "Product deleted!"
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Error deleting product:", err);
    }
  };



  // Filtered products based on search
  const filteredProducts = products.filter(prod =>
    prod.name.toLowerCase().includes(searchText.toLowerCase()) ||
    prod.category.toLowerCase().includes(searchText.toLowerCase()) ||
    prod.brand.toLowerCase().includes(searchText.toLowerCase()) ||
    prod.stockStatus.toLowerCase().includes(searchText.toLowerCase())
  ); 

  return (
    <Card>
      <Card.Body>
        {/* <h4 className="fw-bold mb-3">Product List</h4> */}
        <Container fluid className='d-flex mb-3 justify-content-between align-items-center'>
          <h4 className="fw-bold ">Product List</h4>
          <Button as={Link} to="/admin/products/addproduct">Add Product</Button>
        </Container>
        {/* 🔍 Search Input */}
        <Row className="mb-3">
          <Col md={12}>
            <Form.Control
              type="text"
              placeholder="Search by name, category, brand or status"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
            />
          </Col>
        </Row>
        <Table striped bordered hover responsive className='text-center align-middle'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Off Price (₹)</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((items, index) => (
              <tr key={items._id}>
                <td> {index + 1} </td>
                <td><img src={items.image} alt={items.name} className='img-fluid' style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }} /> </td>
                <td> <span className='text-dark fw-bold'> {items.brand} </span> {items.name} </td>
                <td> <span className='text-dark fw-bold'> {items.category} </span> </td>
                <td> <span className='text-success fw-bold'> {items.price} </span> ( <span className="text-muted fw-bold" style={{ textDecoration: "line-through" , textDecorationColor: 'red'}}> {items.originalPrice} </span> )  </td>
                <td> <span className='text-dark fw-bold'> {items.stockStatus} </span> {items.stockStatus === "Out of Stock" ? (<span></span>) : (<span className="text-muted fw-bold"> ( {items.pieceQuantity} ) </span>) } </td>
                <td>
                  <Button as={Link} to={`/admin/products/edit/${items._id}`} variant="warning" size="sm" className="me-2">Edit</Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(items._id)}>Delete</Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              {loading ? (<td colSpan="7" className="text-center fw-bold">Product Loading ...</td>) : (<td colSpan="7" className="text-center fw-bold">No products found</td>)}
              {/* <td colSpan="7" className="text-center fw-bold">No products found</td> */}
            </tr>
          )}
          </tbody>
        </Table>
      </Card.Body>
    </Card>
  );
};

export default ProductList;
