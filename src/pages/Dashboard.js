import React, { useEffect, useState } from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';
import axios from '../utils/axios';
import { useNavigate } from 'react-router-dom';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const Dashboard = () => {

  const navigate = useNavigate();
  
  // Dummy counts - replace with dynamic data later
  const [productCount, setProductCount] = useState(0);
  const [totalUsers, setTotalUser] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0)

  useEffect(() => {
    totalProducts();
    totalUserList();
    totalOrdersList();
    totalReviewsList();
  },[])

  // const totalProducts = 120;
  // const totalOrders = 340;
  // const totalUsers = 90;
  // const totalReviews = 270;

  const totalProducts = async () => {
    const res = await axios.get('/products');
    setProductCount(res.data.length);
  } 

  const totalUserList = async () => {
    try {
      const res = await axios.get('/users/login');
      setTotalUser(res.data.length);
    } catch (err) {
      console.log(err);
    }
  }

  const totalOrdersList = async () => {
    try {
      const res = await axios.get("/orders");
      setTotalOrders(res.data.length);
    } catch (err) {
      console.log(err);
    }
  }

  const totalReviewsList = async () => {
    try {
      const res = await axios.get('/reviews');
      setTotalReviews(res.data.length);
    } catch (err) {
      console.log(err);
    }
  }

  // Dummy chart data
  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
    datasets: [{
      label: 'Monthly Sales',
      data: [50, 75, 60, 90, 100],
      backgroundColor: 'rgba(54, 162, 235, 0.6)',
    }]
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
  };

  return (
    <div>
      <h4 className="mb-4 fw-bold">Dashboard</h4>
      <Row className="mb-4">
        <Col md={3} sm={6} className="mb-3">
          <Button className='bg-primary card text-center text-white p-3 w-100' onClick={()=>navigate('/admin/products')}>
            <Card.Title>Total Products</Card.Title>
            <h2>{productCount}</h2> 
          </Button>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Button className='bg-success card text-center text-white p-3 w-100' onClick={()=>navigate('/admin/users')}>
            <Card.Title>Total Users</Card.Title>
            <h2>{totalUsers}</h2> 
          </Button>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Button className='bg-warning card text-center text-white p-3 w-100' onClick={()=>navigate('/admin/orders')}>
            <Card.Title>Total Orders</Card.Title>
            <h2>{totalOrders}</h2> 
          </Button>
        </Col>
        <Col md={3} sm={6} className="mb-3">
          <Button className='bg-danger card text-center text-white p-3 w-100' onClick={()=>navigate('/admin/ourreview')}>
          <Card.Title>Total Reviews</Card.Title>
          <h2>{totalReviews}</h2>
          </Button>
        </Col>
      </Row>

      <Card>
        <Card.Body>
          <Card.Title className="fw-bold">Sales Overview</Card.Title>
          <Bar data={chartData} options={chartOptions} />
        </Card.Body>
      </Card>
    </div>
  );
};

export default Dashboard;
