// src/pages/CartPage.js
import React, { useState, useEffect } from "react";
import { Table, Container, Button, Form } from "react-bootstrap";
import NavBar from './Header';
import axios from '../utils/axios';
import { useUser } from "./UserContext";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
 
  const { userInfo } = useUser();
  const [addToCartProduct, setAddToCartProduct] = useState({});
  //const userId = userInfo.udata._id ;
  const navigate = useNavigate();

  useEffect(() => {
    const getCartData = async () => {
      try {
        // const res = await axios.get('/cart/addtocart', { userId });
        const res = await axios.get(`/cart/addtocart/${userInfo.udata._id}`);
        const item = res.data.cartData;
        setAddToCartProduct(item.cart);
      } catch (err) {
        console.log(err)
      }
    }
    getCartData();
  },[userInfo, addToCartProduct])


  const [qty, setQty] = useState({});
  const handleQtyChange = (id, value) => {
    setQty(prev => ({
      ...prev,
      [id]: parseInt(value) || 1
    }));
  };
  const getQty = (id) => qty[id] || 1;

  const getGrandTotal = () => {
    return addToCartProduct.reduce((acc, sItem) => {
      return acc + sItem.price * getQty(sItem._id);
    }, 0);
  };

  const handleDelete = async (productId) => {
      try {
        const userId = userInfo.udata._id;
        const res = await axios.delete(`/cart/addtocart/${userId}/${productId}`);
        const item = res.data.cartData;
        setAddToCartProduct(item.cart);
        alert(res.data.message)
        // getCartData();
      } catch (err) {
        console.error("Error adding to cart:", err);
        alert("Something went wrong");
      }
  }


  return (
    <Container fluid>
      <NavBar />
      <Container fluid className="mt-4">
        <h2>Your Cart</h2>
        <Table bordered hover responsive className='text-center align-middle'>
          <thead>
            <tr>
              <th>S.No</th>
              <th>Image</th>
              <th>Product Name</th>
              <th>Quantity</th>
              <th>Product Price</th>
              <th>Total Price</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {addToCartProduct.length > 0 ? (
              addToCartProduct.map((sItem, index) => (
                <tr key={sItem._id}>
                  <td> { index + 1 } </td>
                  <td> <img src={sItem.image} alt={sItem.name} className='img-fluid' style={{ width: "80px", height: "60px", objectFit: "cover", borderRadius: "8px" }} /> </td>
                  <td> <span className='text-dark fw-bold'> {sItem.brand} </span> { sItem.name } </td>
                  <td style={{width:'100px'}}> 
                    <Form.Control type="number" name="quantity" min={1} value={getQty(sItem._id)} onChange={(e)=> handleQtyChange(sItem._id, e.target.value)} /> 
                  </td>
                  <td> { sItem.price } { getQty(sItem._id) > 1 ? (<span> * {getQty(sItem._id)} </span>) : (<span></span>) } </td>
                  <td> { sItem.price * getQty(sItem._id)} </td>
                  <td> 
                    <Button variant="danger" size="sm" onClick={() => handleDelete(sItem._id)} className="me-1">Delete</Button>
                    <Button size='sm' variant="primary" onClick={() => navigate(`/product/${sItem._id}`)} className="ms-1">Buy Now</Button>
                  </td>
                </tr>
              ))
            ) : (
               userInfo ? (
                <tr>
                  <td colSpan="7" className="text-center fw-bold">Your cart is empty.</td>
                </tr>
              ) : (
                <tr>
                  <td colSpan="7" className="text-center fw-bold">Data Loading...</td>
                </tr>
              )
              
            )}
          </tbody>
        </Table>

        {/* Grand Total Section */}
        {addToCartProduct.length > 0 && (
          <div className="text-end mt-3">
            <h4>
              Grand Total: ₹{getGrandTotal()}
            </h4>
            <Button variant="success" size="lg" onClick={()=>navigate('/shop')} >Shop Now</Button>
          </div>
        )}
          
      </Container>
    </Container>
  );
};

export default CartPage;
