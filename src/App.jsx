import { BrowserRouter, Route, Routes } from "react-router-dom"
import LandingArea from "./pages/LandingArea"
import LoginPage from "./pages/LoginPage"
import SignupPage from "./pages/SignupPage"
import CustomerPage from "./pages/CustomerPage"
import AdminPage from "./pages/AdminPage"
import CheckoutWrapper from "./pages/CheckoutWrapper"
import OrdersPage from "./components/OrdersPage"
import StaffPage from "./pages/StaffPage"
import AdminProduct from "./pages/AdminProduct"
import AdminMenu from "./pages/AdminMenu"


function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingArea />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/addproduct" element={<AdminProduct />} />
        <Route path="/allproducts" element={<AdminMenu />} />
        <Route path="/customer" element={<CustomerPage /> } />
        <Route path="/checkout" element={<CheckoutWrapper /> } />
        <Route path="/orders" element={<OrdersPage /> } />
        <Route path="/staff" element={<StaffPage />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App
