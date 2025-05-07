import React, { useEffect, useState } from 'react';
import { Container, Table, Button, Card, Form } from 'react-bootstrap';
import axios from '../utils/axios';
import { toast } from 'react-toastify';

const UserList = () => {
  const [user, setUser] = useState([]);
  const [editUserId, setEditUserId] = useState(null);
  const [editedType, setEditedType] = useState('');
  // const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUsers();
  }, []);

  const getUsers = async () => {
    try {
      const res = await axios.get('/users/login');
      setUser(res.data);
      setLoading(false);
    } catch (err) {
      console.log(err);
      setLoading(false);
    }
  };

  const handleEditClick = (id, currentType) => {
    setEditUserId(id);
    setEditedType(currentType);
  };

  const filteredUsers = user.filter((u) =>
    u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    u.phone?.toString().includes(searchQuery.toLowerCase()) ||
    u.userType?.toString().includes(searchQuery.toLowerCase()) 
  );

  const handleSaveClick = async (id) => {
    try {
      await axios.put(`/users/updateType/${id}`, { userType: editedType });
      toast.success("User type updated successfully");
      setEditUserId(null);
      getUsers(); // Refresh data
    } catch (err) {
      console.error("Update failed", err);
      toast.error("Failed to update user type");
    }
  };

  const handleDeleteClick = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`/users/delete/${id}`);
      alert("User deleted successfully");
      getUsers(); // Refresh data
    } catch (err) {
      console.error("Delete failed", err);
      alert("Failed to delete user");
    }
  };

  return (
    <Card>
      <Card.Body>
        <Container fluid>
          <h4 className="fw-bold mb-3">User List</h4>
          <Form className="d-flex gap-2 mb-3 flex-column flex-md-row">
            <Form.Control
              type="text"
              placeholder="Search by user, product or status"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </Form>
          <div className="table-responsive">
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Liked Products</th>
                  <th>Cart Items</th>
                  <th>Account Type</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u, i) => (
                    <tr key={u._id}>
                      <td>{i + 1}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.phone}</td>
                      <td>{u.wishlist?.length || 0}</td>
                      <td>{u.cart?.length || 0}</td>
                      <td>
                        {editUserId === u._id ? (
                          <Form.Select size="sm" value={editedType} onChange={(e) => setEditedType(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                          </Form.Select>
                        ) : (
                          u.userType
                        )}
                      </td>
                      <td>
                        {editUserId === u._id ? (
                          <Button variant="success" size="sm" onClick={() => handleSaveClick(u._id)} className="me-2">
                            Save
                          </Button>
                        ) : (
                          <Button variant="warning" size="sm" onClick={() => handleEditClick(u._id, u.userType)} className="me-2">
                            Edit
                          </Button>
                        )}
                        <Button variant="danger" size="sm" onClick={() => handleDeleteClick(u._id)}>
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    {loading ? (<td colSpan="8" className="text-center fw-bold">User Data Loading ...</td>) : (<td colSpan="8" className="text-center fw-bold">No User Data found</td>)}
                  </tr>
                )}
              </tbody>
            </Table>
          </div>
        </Container>
      </Card.Body>
    </Card>
  );
};

export default UserList;
