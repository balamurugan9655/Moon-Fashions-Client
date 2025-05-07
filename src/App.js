import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// Toastify
import { ToastContainer } from 'react-toastify';
// useContext()
import { UserProvider } from "./components/UserContext";
// Router Pages
import Home from "./pages/Home";
import ProductListPage from "./components/ProductListPage";
import LoginSignup from "./pages/LoginSignup";
import ProfilePage from "./pages/ProfilePage";
import BecomeSellerPage from "./pages/BecomeSellerPage";
import MyOrderPage from "./pages/MyOrderPage";
import AddToCart from './components/AddToCart';
import OrderPage from "./components/OrderPage";
import ProductDetailsPage from "./components/ProductDetailsPage";
// Admin Router Pages
import AdminLogin from "./pages/AdminLogin";
import AdminLayout from './pages/AdminLayout';
import Dashboard from './pages/Dashboard';
import ProductList from './pages/ProductList';
import UserList from './pages/UserList';
import OrderList from './pages/OrderList';
import AddProductForm from "./components/AddProductForm";
import EditProduct from "./components/EditProduct";
import UserReviews from "./pages/UserReviews";

function App() {

  
  return (
        <UserProvider>
          <ToastContainer position="top-right" autoClose={3000} />
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
                    {/* Other Routes */}
              <Route path="/shop" element={<ProductListPage />} />
              <Route path="/addtocart" element={<AddToCart />} />
              <Route path="/product/:id" element={<ProductDetailsPage />}/>
              <Route path="/category/:navName" element={<ProductListPage />} />
              <Route path="/loginpage" element={<LoginSignup />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/orders" element={<MyOrderPage />} />
              <Route path="/orderpage" element={<OrderPage />} />
              <Route path="/seller" element={<BecomeSellerPage />} />
                    {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminLayout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="products" element={<ProductList />} />
                <Route path="products/addproduct" element={<AddProductForm />} />
                <Route path="/admin/products/edit/:id" element={<EditProduct />} />
                <Route path="users" element={<UserList />} />
                <Route path="orders" element={<OrderList />} />
                <Route path="ourreview" element={<UserReviews />} />
              </Route>
            </Routes>
          </Router>
        </UserProvider>
  );
}

export default App;
