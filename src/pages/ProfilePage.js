import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { FaUserCircle } from 'react-icons/fa';
import Header from '../components/Header';
import { useUser } from '../components/UserContext';
import { Link } from 'react-router-dom';
import axios from '../utils/axios';

const ProfilePage = () => {
  
  const { userInfo } = useUser();

  const [myProfile, setMyProfile] = useState( null );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const myProfileDtl = async () => {
      try {
        const res = await axios.get(`/users/${userInfo.udata._id}`);
        setMyProfile(res.data);
        setLoading(false);
      } catch (err) {
        console.log(err);
      }
    }
    myProfileDtl();
  },[userInfo])

  return (
    <Container fluid className='p-0'>
      <Header />
      <Container className='d-flex justify-content-center'>
        <Card className="mb-4 mt-4 shadow" style={{ width: '100%', maxWidth: '700px' }}>
          {!loading && myProfile ? (
            <Row className="g-0 p-2 align-items-center">

              {/* Profile Icon Centered */}
              <Col xs={12} md={4} className="d-flex justify-content-center mb-3 mb-md-0">
                <div style={{ backgroundColor: '#f0f0f0', borderRadius: '50%', width: '120px', height: '120px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                  <FaUserCircle size={100} color="#333" />
                </div>
              </Col>

              {/* User Details */}
              <Col xs={12} md={8}>
                <Card.Body className='p-auto'>
                  <p> <strong> Name : </strong> {myProfile.name} </p>
                  <p> <strong> Email Id : </strong> {myProfile.email} </p>
                  <p> <strong> Phone Number : </strong> {myProfile.phone} </p>
                  <p> <strong> User Type : </strong> {myProfile.userType} </p>
                </Card.Body>
              </Col>
            </Row>
          ) : (
            <p> Data Loading...</p>
          )}
          <Button as={Link} to='/orders' variant='outline-primary' className='m-2'>My Orders</Button>
        </Card>
      </Container>
    </Container>
  );
};

export default ProfilePage;
