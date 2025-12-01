import React from 'react'
import { BrowserRouter, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import AdminPage from './pages/AdminPage'
import CustomerPage from './pages/CustomerPage'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import StaffPage from './pages/StaffPage'
import SignupPage from './pages/SignupPage'
import CheckoutPage from './components/CheckoutPage'

// Wrapper component for CheckoutPage to handle navigation and cart data
function CheckoutWrapper() {
	const navigate = useNavigate();
	const location = useLocation();
	const cart = location.state?.cart || [];

	return (
		<CheckoutPage 
			cart={cart}
			onBack={() => navigate('/customer')}
		/>
	);
}

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<LandingPage />} />
				<Route path="/login" element={<LoginPage />} />
				<Route path="/signup" element={<SignupPage />} />
				<Route path="/admin" element={<AdminPage />} />
				<Route path="/customer" element={<CustomerPage />} />
				<Route path="/checkout" element={<CheckoutWrapper />} />
				<Route path="/staff" element={<StaffPage />} />
			</Routes>
		</BrowserRouter>
	)
}

export default App