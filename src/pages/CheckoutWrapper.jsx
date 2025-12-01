import { useLocation, useNavigate } from "react-router-dom";
import CheckoutPage from "../components/CheckoutPage"; // make sure path is correct

function CheckoutWrapper() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get cart from location.state safely
  const cart = Array.isArray(location.state?.cart) ? location.state.cart : [];

  // Redirect if cart is empty (optional)
  if (cart.length === 0) {
    navigate("/customer");
    return null; // Prevent rendering CheckoutPage without cart
  }

  return (
    <CheckoutPage 
      cart={cart}
      onBack={() => navigate('/customer')}
    />
  );
}

export default CheckoutWrapper;
