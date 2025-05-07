import React, { useEffect, useState } from 'react';
import { Container, Table, Card, Button, Form } from 'react-bootstrap';
import axios from "../utils/axios";
import { toast } from 'react-toastify';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [editRow, setEditRow] = useState(null);
  const [updatedStatus, setUpdatedStatus] = useState({});

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("/orders");
        setOrders(res.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);


  const filteredOrders = orders.filter((order) =>
    order.userId.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.paymentStatus.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.items.some(item =>
      item.productId.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const handleEdit = (id, currentStatus) => {
    setEditRow(id);
    setUpdatedStatus({ ...updatedStatus, [id]: currentStatus });
  };

  const handleStatusChange = (id, status) => {
    setUpdatedStatus({ ...updatedStatus, [id]: status });
  };

  const handleUpdate = async (id) => {
    const newStatus = updatedStatus[id];
    try {
      await axios.put(`/orders/${id}/status`, {
        paymentStatus: newStatus,
      });

      const updated = orders.map((order) =>
        order._id === id ? { ...order, paymentStatus: newStatus } : order
      );
      setOrders(updated);
      setEditRow(null);
      toast.success("Status updated successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to update status");
    }
  };

  return (
    <Card>
        <Card.Body>
        <Container fluid className="">
          <h4 className="fw-bold mb-3">Order List</h4>
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
                    <th>Order ID</th>
                    <th>User</th>
                    <th>Product(s)</th>
                    <th>Total (₹)</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order, i) => (
                      <tr key={order._id}>
                        <td>{i + 1}</td>
                        <td>{order.paymentDetails?.orderId}</td>
                        <td>{order.userId?.name}</td>
                        <td>
                          {order.items.map(p => (
                            <div key={p._id}>{p.productId?.name} / {p.quantity} item</div>
                          ))}
                        </td>
                        <td>{order.totalAmount}</td>
                        <td>
                          {editRow === order._id ? (
                            <Form.Select size="sm" value={updatedStatus[order._id]} onChange={(e) => handleStatusChange(order._id, e.target.value)}>
                              <option value="Pending">Pending</option>
                              <option value="Shipped">Shipped</option>
                              <option value="Delivered">Delivered</option>
                            </Form.Select>
                          ) : (
                            order.paymentStatus
                          )}
                        </td>
                        <td>
                          {editRow === order._id ? (
                            <Button variant="success" size="sm" onClick={() => handleUpdate(order._id)}>
                              Update
                            </Button>
                          ) : (
                            <Button variant="warning" size="sm" onClick={() => handleEdit(order._id, order.paymentStatus)}>
                              Edit
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      {loading ? (<td colSpan="7" className="text-center fw-bold">Orders Loading ...</td>) : (<td colSpan="7" className="text-center fw-bold">No Orders found</td>)}
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

export default OrderList;
