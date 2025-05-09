import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Badge } from 'react-bootstrap';
import axios from '../utils/axios';
import { useLocation, useNavigate } from 'react-router-dom';
import { loadRazorpayScript } from "../utils/razorpay";
import { useUser } from "./UserContext";
import { toast } from 'react-toastify';

const OrderPage = () => {

  const location = useLocation();
  const { userId, productData, quantity, deliveryDate } = location.state || {};
  const [product, setProduct] = useState({});
  
  const { userInfo} = useUser();

  const navigate = useNavigate();

  const [addresses, setAddresses] = useState([]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editMode, setEditMode] = useState(null);

  const [newAddress, setNewAddress] = useState({
    id: '', name: '', phone: '', doorStreet: '', pincode: '',
    district: '', state: '', country: '', landmark: '', tag: ''
  });

  const [selectedAddressId, setSelectedAddressId] = useState(null);

  const [paymentMethod, setPaymentMethod] = useState('COD');

  const totalAmount = quantity * product.price + (product.freeDelivery ? 0 : 45) + 5;
  
  const [orderAddress, setOrderAddress] = useState('');

  const productId = product._id;

  useEffect(() => { 
    const orderAddressGet = async () => {
      const res = await axios.get(`/orders/${userId}`)
      const data = res.data;
      // const output = data.map(d => ({
      //   _id:d._id, ...d.shippingAddress
      // }))
      const output = data.map(d => d.shippingAddress)
      setAddresses(output) 
    }
    orderAddressGet(); 
    setProduct(productData); 
  }, [productData,userId]);

  // console.log(addresses)

  const handleAddOrUpdateAddress = () => {
    if (editMode !== null) {
      setAddresses(addresses.map(addr => addr.id === editMode ? { ...newAddress, id: editMode } : addr));
      setEditMode(null);
    } else {
      const newId = Math.random().toString(36).substring(2, 18); // 16 chars
      setAddresses([{ ...newAddress, id: newId }, ...addresses]);
    }
    console.log(addresses);
    setNewAddress({ id: '', name: '', phone: '', doorStreet: '', pincode: '', district: '', state: '', country: '', landmark: '', tag: '' });
    setShowAddForm(false);
  };

  const handlePincodeChange = async (e) => {
    const pincode = e.target.value;
    setNewAddress({ ...newAddress, pincode });
    if (pincode.length === 6) {
      try {
        const apiKey = '6f440f4efd8e49fd8f55c2ad26bb7b78';
        const url = `https://api.opencagedata.com/geocode/v1/json?q=${pincode}&key=${apiKey}`;
        const response = await axios.get(url);
        const result = response.data.results[0];
        if (result) {
          setNewAddress(prev => ({
            ...prev,
            district: result.components.state_district || '',
            state: result.components.state || '',
            country: result.components.country || ''
          }));
        }
      } catch (error) {
        console.error('Failed to fetch pincode details:', error);
      }
    }
  };

  /* const handleEdit = (id) => {
    const editAddr = addresses.find(addr => addr.id === id);
    const [doorStreet, landmark, rest] = editAddr.address.split(',');
    const [district, pin] = rest.trim().split(',');
    setNewAddress({ ...editAddr, doorStreet: doorStreet.trim(), landmark: landmark.trim(), district: district.trim(), pincode: pin.trim() });
    setEditMode(id);
    setShowAddForm(true);
  }; */

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter(addr => addr.id !== id));
    }
  };

  const handlePlaceOrder = () => {
    const selectedAddress = addresses.find(addr => addr.id === selectedAddressId);
    console.log(selectedAddress); 
    setOrderAddress(selectedAddress);
    if (!selectedAddress) return toast.warning("Please select a delivery address.");
    if (paymentMethod === 'OnlinePayment') {
      toast.success('Redirecting to payment gateway...');
      // Integrate Razorpay/Stripe here later
      handlePayment(totalAmount, selectedAddress);
    } else {
      toast.success('Order placed successfully (COD)');

      handleCoD(totalAmount, selectedAddress);
    }
  };

  const handleCoD = async (totalAmount, selectedAddress) => {

    const paymentDtls = {
      orderId: Math.random().toString(36).substring(2, 18),
      paymentId: Math.random().toString(36).substring(2, 18),
      signature: Math.random().toString(36).substring(2, 18),
    };

    const items = { productId, quantity };

    const orderData = { userId: userId, shippingAddress: selectedAddress, items: items, totalAmount: totalAmount, paymentMethod: paymentMethod, paymentDetails: paymentDtls, deliveryDate: deliveryDate };

    console.log(orderData);

    const res = await axios.post("/orders", orderData);
    alert(res.data);
    navigate("/"); 

  }

  const handlePayment = async (amount, selectedAddress) => {
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK load failed. Check your internet.");
      return;
    }
    try {
      const order = await axios.post("/payment/create-order", {
        amount: amount, // in rupees
      });
      const options = {
        key: "rzp_test_q3hhsmddPPwaKa", // 🔑 Razorpay test key (only public key)
        amount: order.data.amount,
        currency: "INR",
        name: "Moon Fashion",
        description: "Thank you for shopping with us!",
        order_id: order.data.id,
        handler: async function (response) {
          const paymentDtls = {
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature
          };
          const items = { productId, quantity };
          const orderData = { userId: userId, shippingAddress: selectedAddress, items: items, totalAmount: totalAmount, paymentMethod: paymentMethod, paymentDetails: paymentDtls, deliveryDate: deliveryDate };
          console.log(orderData);
          // ✅ Store order, navigate to success page, etc.
          const res = await axios.post("/orders", orderData);
          alert(res.data);
          navigate("/");
        },
        prefill: {
          name: userInfo.udata.name,
          email: userInfo.udata.email,
          contact: userInfo.udata.phone,
        },
        notes: {
          address: orderAddress
        },
        theme: {
          color: "#fca311",
        },
      };
      const razor = new window.Razorpay(options);
      razor.open();
    } catch (err) {
      console.log("Payment Error:", err);
    }
  }

  return(
    <Container fluid className="py-4">
      <Row>
        <Col md={8}>
          <Card className="mb-2">
            <Card.Header as="h5">DELIVERY ADDRESS</Card.Header>
            <Card.Body>
              { !showAddForm ? (
                <Button variant="outline-primary" onClick={() => setShowAddForm(true)} className='mt-1 mb-2'>+ Add a new address</Button>
              ) : (
                <Card className="p-3 bg-light mb-3">
                  <h6>{editMode !== null ? 'Edit Address' : 'Add New Address'}</h6>
                  <Form>
                    <Row>
                      <Col md={6}><Form.Group className="mb-2"><Form.Label>Name</Form.Label><Form.Control value={newAddress.name} onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })} /></Form.Group></Col>
                      <Col md={6}><Form.Group className="mb-2"><Form.Label>Phone</Form.Label><Form.Control value={newAddress.phone} pattern="^[6-9]\d{9}$" maxLength={10} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} /></Form.Group></Col>
                    </Row>
                    <Form.Group className="mb-2"><Form.Label>Door No & Street</Form.Label><Form.Control value={newAddress.doorStreet} onChange={(e) => setNewAddress({ ...newAddress, doorStreet: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-2"><Form.Label>Pincode</Form.Label><Form.Control value={newAddress.pincode} maxLength={6} onChange={handlePincodeChange} /></Form.Group>
                    <Row>
                      <Col md={4}><Form.Group className="mb-2"><Form.Label>District</Form.Label><Form.Control value={newAddress.district} readOnly /></Form.Group></Col>
                      <Col md={4}><Form.Group className="mb-2"><Form.Label>State</Form.Label><Form.Control value={newAddress.state} readOnly /></Form.Group></Col>
                      <Col md={4}><Form.Group className="mb-2"><Form.Label>Country</Form.Label><Form.Control value={newAddress.country} readOnly /></Form.Group></Col>
                    </Row>
                    <Form.Group className="mb-2"><Form.Label>Landmark</Form.Label><Form.Control value={newAddress.landmark} onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })} /></Form.Group>
                    <Form.Group className="mb-3"><Form.Label>Tag (optional)</Form.Label><Form.Control value={newAddress.tag} onChange={(e) => setNewAddress({ ...newAddress, tag: e.target.value })} placeholder="Home / Office" /></Form.Group>
                    <Button variant="success" onClick={handleAddOrUpdateAddress}>Save Address</Button>{' '}
                    <Button variant="outline-secondary" onClick={() => { setShowAddForm(false); setEditMode(null); }}>Cancel</Button>
                  </Form>
                </Card>
              )}

              <Form>
                {[...new Map(addresses.map(addr => [addr.id, addr])).values()].map((addr) => (
                  <div key={addr.id} className="mb-2">
                    <Form.Check
                      type="radio"
                      name="address"
                      id={`address-${addr.id}`}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      label={
                        <>
                          <strong>{addr.name.toUpperCase()}</strong>
                          {addr.tag && (
                            <Badge bg="secondary" className="ms-2">
                              {addr.tag.toUpperCase()}
                            </Badge>
                          )}
                          <br />
                          {addr.phone}
                          <br />
                          {addr.doorStreet}, {addr.landmark}, {addr.district},
                          <br />
                          {addr.state}, {addr.country} - {addr.pincode}
                        </>
                      }
                    />
                    <div className="d-flex gap-2 mt-2">
                      {/* <Button variant="primary" size="sm" onClick={() => handleEdit(addr.id)}>
                        Edit
                      </Button> */}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(addr.id)}>
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </Form>

            </Card.Body>
          </Card>

          <Card className="mb-2">
            <Card.Header as="h5">PAYMENT METHOD</Card.Header>
            <Card.Body>
              <Form.Check id='1' type="radio" label="Cash On Delivery (COD)" name="paymentMethod" value="COD" checked={paymentMethod === "COD"} onChange={(e) => setPaymentMethod(e.target.value)} />
              <Form.Check id='2' type="radio" label="Online Payment" name="paymentMethod" value="OnlinePayment" checked={paymentMethod === "OnlinePayment"} onChange={(e) => setPaymentMethod(e.target.value)} />
            </Card.Body>
          </Card>

          <Container fluid className='mb-4'>
            {/* <h3>Order Summary</h3> */}
            <Button variant="success" onClick={handlePlaceOrder} className="w-100">Place Order</Button>
          </Container>

        </Col>

        <Col md={4}>
          <Card>
            <Card.Header as="h5">PRICE DETAILS</Card.Header>
            <Card.Body>
              <Row className="mb-2"><Col>Price</Col><Col className="text-end">₹ {product.price} / <span className="text-muted text-decoration-line-through">{product.originalPrice}</span></Col></Row>
              <Row className="mb-2" style={quantity>1 ? {display:'flex'} : {display:'none'}} ><Col>Total Items </Col><Col className="text-end"> {quantity} Nos / {quantity * product.price} </Col></Row>
              <Row className="mb-2"><Col>Delivery Charges</Col><Col className="text-end text-success">{product.freeDelivery ? 'FREE' : '₹ 45'}</Col></Row>
              <Row className="mb-2"><Col>Protect Promise Fee</Col><Col className="text-end">₹ 5</Col></Row>
              <hr />
              <Row className="fw-bold"><Col>Total Amount</Col><Col className="text-end text-primary">₹ { totalAmount }</Col></Row>
            </Card.Body>
          </Card>
        </Col>

      </Row>
    </Container>
  )
};

export default OrderPage;
