import React, { useState, useEffect } from 'react';
import { Col, Container, Row, Card, Form, Button } from 'react-bootstrap';
import axios from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

const EditProductForm = () => {
  const [imageInputType, setImageInputType] = useState("url");
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [description, setDescription] = useState();
  const [productData, setProductData] = useState({
    name: "",
    category: "",
    brand: "",
    rating: "",
    reviews: "",
    description: "",
    price: "",
    originalPrice: "",
    discount: 0,
    freeDelivery: false,
    sponsored: false,
    image: "",
    stockStatus: "",
    pieceQuantity: ""
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const API_KEY = process.env.REACT_APP_IMGBB_KEY ;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/products/${id}`);
        setProductData(res.data);
      } catch (err) {
        console.error("Error fetching product:", err);
        toast.error("Failed to load product.");
      }
    };

    fetchProduct();
  }, [id]);


  const uploadToImgBB = async (file) => {
    setUploading(true);
    const data = new FormData();
    data.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${API_KEY}`, {
        method: "POST",
        body: data,
      });

      const result = await res.json();
      if (result.success) {
        return result.data.url;
      } else {
        toast.warning("Image upload failed!");
        return null;
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Something went wrong during upload.");
      return null;
    } finally {
      setUploading(false);
    }
  };

  const discount = (offerPrice, originalPrice) => {
    const result = ((originalPrice - offerPrice) / originalPrice) * 100;
    return Math.round(result);
  };

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    let val;
    if (type === "text") {
      if (name !== "image") {
        val = value.replace(/\b\w/g, (char) => char.toUpperCase());
      } else {
        val = value;
      }
    } else if (type === "checkbox") {
      val = checked;
    } else if (type === "file") {
      setImageFile(files[0]);
      return;
    } else if (name === "rating") {
      val = Number(value);
    } else {
      val = value;
    }

    setProductData((prev) => {
      const updatedData = { ...prev, [name]: val };

      if (
        (name === "price" || name === "originalPrice") &&
        updatedData.price &&
        updatedData.originalPrice
      ) {
        const offerPrice = parseFloat(updatedData.price);
        const original = parseFloat(updatedData.originalPrice);
        if (original > 0 && offerPrice < original) {
          updatedData.discount = discount(offerPrice, original);
        } else {
          updatedData.discount = 0;
        }
      }

      return updatedData;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let finalImageURL = productData.image;

    if (imageInputType === "upload" && imageFile) {
      const uploaded = await uploadToImgBB(imageFile);
      if (!uploaded) return;
      finalImageURL = uploaded;
    }

    const updatedProduct = {
      ...productData,
      description: description,
      image: finalImageURL
    };

    try {
      const res = await axios.put(`/products/${id}`, updatedProduct, {
        headers: {
          "Content-Type": "application/json"
        }
      });

      console.log("Product updated:", res.data);
      toast.success("Product updated successfully!");
      navigate('/admin/products');
    } catch (err) {
      console.error("Error updating product:", err);
      toast.error("Failed to update product.");
    }
  };

  return (
    <Container fluid className='border'>
      <Row className="justify-content-center">
        <Col md={10} lg={8}>
          <Card className="shadow rounded-4 m-4">
            <Card.Body>
              <h3 className="text-center mb-4 text-warning fw-bold">Edit Product</h3>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="name">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control type="text" name="name" value={productData.name} onChange={handleChange} required />
                </Form.Group>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="category">
                      <Form.Label>Category</Form.Label>
                      <Form.Control type="text" name="category" value={productData.category} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="brand">
                      <Form.Label>Brand</Form.Label>
                      <Form.Control type="text" name="brand" value={productData.brand} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                  <Form.Group className="mb-3" controlId="formDescription">
                    <Form.Label>Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      placeholder="Enter product description"
                      value={productData.description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="price">
                      <Form.Label>Price</Form.Label>
                      <Form.Control type="number" name="price" value={productData.price} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="originalPrice">
                      <Form.Label>Original Price</Form.Label>
                      <Form.Control type="number" name="originalPrice" value={productData.originalPrice} onChange={handleChange} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="discount">
                      <Form.Label>Discount %</Form.Label>
                      <Form.Control type="number" value={productData.discount} disabled />
                    </Form.Group>
                  </Col>
                </Row>

                <Row>
                  <Col>
                    <Form.Group className="mb-3" controlId="stockStatus">
                      <Form.Label>Stock Status</Form.Label>
                      <Form.Select name="stockStatus" value={productData.stockStatus} onChange={handleChange} required>
                        <option disabled value="">Select Stock Status</option>
                        <option value="In Stock">In Stock</option>
                        <option value="Out of Stock">Out of Stock</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group className="mb-3" controlId="pieceQuantity">
                      <Form.Label>Quantity</Form.Label>
                      <Form.Control type="number" name="pieceQuantity" value={productData.stockStatus === "In Stock" ? productData.pieceQuantity : 0} onChange={handleChange} disabled={productData.stockStatus !== "In Stock"} required={productData.stockStatus === "In Stock"} />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Check type="checkbox" label="Free Delivery" name="freeDelivery" checked={productData.freeDelivery} onChange={handleChange} />
                <Form.Check type="checkbox" label="Sponsored" name="sponsored" checked={productData.sponsored} onChange={handleChange} />

                <hr />
                <div className="d-flex gap-3 mb-3">
                  <Form.Check inline type="radio" label="Image URL" checked={imageInputType === "url"} onChange={() => setImageInputType("url")} />
                  <Form.Check inline type="radio" label="Upload Image" checked={imageInputType === "upload"} onChange={() => setImageInputType("upload")} />
                </div>

                {imageInputType === "url" ? (
                  <Form.Control type="text" placeholder="Paste image URL" name="image" value={productData.image} onChange={handleChange} />
                ) : (
                  <Form.Control type="file" name="image" accept="image/*" onChange={handleChange} />
                )}

                {uploading && <p className="text-info fw-bold">Uploading image...</p>}
                {!uploading && productData.image && (
                  <div className="mt-3">
                    <img src={productData.image} alt="Preview" style={{ width: "150px", borderRadius: "10px" }} />
                  </div>
                )}

                <div className="d-grid mt-4">
                  <Button type="submit" variant="warning" className="fw-bold rounded-pill">
                    Update Product
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default EditProductForm;
