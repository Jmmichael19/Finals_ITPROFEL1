import React, { useState } from "react";
import { ArrowLeft, CreditCard, CheckCircle, Clock, Utensils, Tag, Home, ShoppingBag } from "lucide-react";

export default function CheckoutPage({ cart = [], onBack }) {
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [tableNumber, setTableNumber] = useState("");
  const [orderType, setOrderType] = useState("dine-in");
  const [orderNumber, setOrderNumber] = useState("");

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const serviceFee = 20;
  const grandTotal = cartTotal + serviceFee;

  // Helper function to get payment method display name
  const getPaymentMethodDisplay = (method) => {
    const methods = {
      cash: "Cash",
      card: "Credit/Debit Card",
      gcash: "GCash",
      paymaya: "PayMaya",
    };
    return methods[method] || method;
  };

  const saveOrderToStorage = async (orderData) => {
    try {
      // Get existing orders
      let existingOrders = [];
      try {
        const result = await window.storage.get('restaurant-orders');
        if (result && result.value) {
          existingOrders = JSON.parse(result.value);
        }
      } catch (error) {
        console.log('No existing orders, starting fresh');
      }

      // Add new order
      existingOrders.push(orderData);

      // Save back to storage
      await window.storage.set('restaurant-orders', JSON.stringify(existingOrders));
      console.log('Order saved successfully');
    } catch (error) {
      console.error('Error saving order:', error);
    }
  };

  const handlePlaceOrder = async () => {
    // Validate table number only for dine-in orders
    if (orderType === "dine-in" && !tableNumber) {
      alert("Please enter your table number");
      return;
    }

    // Generate order number
    const newOrderNumber = `#ORD-${Math.floor(Math.random() * 10000)}`;
    setOrderNumber(newOrderNumber);

    // Create order data
    const orderData = {
      orderNumber: newOrderNumber,
      orderType: orderType,
      tableNumber: orderType === "dine-in" ? tableNumber : null,
      paymentMethod: getPaymentMethodDisplay(paymentMethod),
      items: cart.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        description: item.description
      })),
      subtotal: cartTotal,
      serviceFee: serviceFee,
      grandTotal: grandTotal,
      timestamp: new Date().toLocaleString(),
      status: 'pending'
    };

    // Save order to storage
    await saveOrderToStorage(orderData);

    // Show success message
    setOrderPlaced(true);
  };

  // SUCCESS MESSAGE
  if (orderPlaced) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-3">
            Order Placed Successfully!
          </h1>

          <p className="text-gray-600 mb-6">
            {orderType === "dine-in" 
              ? `Your order has been sent to the kitchen. Please wait at Table ${tableNumber}.`
              : "Your order has been sent to the kitchen. Please proceed to the counter when ready."}
          </p>

          <div className="bg-orange-50 rounded-xl p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-semibold">Order Number:</span>
              <span className="text-orange-600 font-bold">
                {orderNumber}
              </span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-semibold">Order Type:</span>
              <span className="text-orange-600 font-bold">
                {orderType === "dine-in" ? "Dine-In" : "Take-Out"}
              </span>
            </div>

            {orderType === "dine-in" && (
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-700 font-semibold">Table Number:</span>
                <span className="text-orange-600 font-bold">Table {tableNumber}</span>
              </div>
            )}

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-semibold">Payment Method:</span>
              <span className="text-orange-600 font-bold">{getPaymentMethodDisplay(paymentMethod)}</span>
            </div>

            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 font-semibold">Total Amount:</span>
              <span className="text-2xl font-bold text-orange-600">₱{grandTotal}</span>
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock size={16} />
              <span>Estimated preparation: 15–25 minutes</span>
            </div>
          </div>

          <button
            onClick={onBack}
            className="w-full py-4 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 transition shadow-lg"
          >
            Back to Menu
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={onBack}
              className="flex items-center gap-2 text-gray-700 hover:text-orange-600 transition"
            >
              <ArrowLeft size={24} />
              <span className="font-semibold">Back to Menu</span>
            </button>

            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🍽️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">RestaurantAI</h1>
                <p className="text-xs text-gray-500">Checkout</p>
              </div>
            </div>

            <div className="w-24"></div>
          </div>
        </div>
      </nav>

      {/* BODY CONTENT */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Complete Your Order
            </h1>
            <p className="text-gray-600">Review your order and proceed to payment</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* LEFT: ORDER DETAILS */}
            <div className="lg:col-span-2">
              <div className="space-y-6">
                {/* Order Type Selection */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Utensils size={24} className="text-orange-600" />
                    Order Type
                  </h2>

                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setOrderType("dine-in")}
                      className={`py-6 px-4 rounded-xl font-semibold transition border-2 flex flex-col items-center gap-2 ${
                        orderType === "dine-in"
                          ? "bg-orange-50 border-orange-600 text-orange-700"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <Home size={32} />
                      <span>Dine-In</span>
                      <span className="text-xs text-gray-500">Eat at the restaurant</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setOrderType("take-out")}
                      className={`py-6 px-4 rounded-xl font-semibold transition border-2 flex flex-col items-center gap-2 ${
                        orderType === "take-out"
                          ? "bg-orange-50 border-orange-600 text-orange-700"
                          : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                      }`}
                    >
                      <ShoppingBag size={32} />
                      <span>Take-Out</span>
                      <span className="text-xs text-gray-500">Take your order to go</span>
                    </button>
                  </div>
                </div>

                {/* Table Number - Only show for dine-in */}
                {orderType === "dine-in" && (
                  <div className="bg-white rounded-2xl shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Tag size={24} className="text-orange-600" />
                      Table Information
                    </h2>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Table Number *
                      </label>
                      <input
                        type="text"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-orange-500 focus:outline-none text-lg font-semibold"
                        placeholder="Enter your table number (e.g., 5)"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Please check your table number before confirming
                      </p>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Utensils size={24} className="text-orange-600" />
                    Your Order Items
                  </h2>

                  <div className="space-y-4">
                    {cart.map((item) => (
                      <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800">{item.name}</h3>
                          <p className="text-sm text-gray-600 mb-2">
                            {item.description}
                          </p>
                          <div className="flex items-center justify-between">
                            <span className="text-gray-600">
                              Quantity:{" "}
                              <span className="font-semibold">{item.quantity}</span>
                            </span>
                            <span className="text-orange-600 font-bold text-lg">
                              ₱{item.price * item.quantity}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-2xl shadow-md p-6">
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <CreditCard size={24} className="text-orange-600" />
                    Payment Method
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { key: "cash", label: "Cash" },
                      { key: "card", label: "Credit/Debit Card" },
                      { key: "gcash", label: "GCash" },
                      { key: "paymaya", label: "PayMaya" },
                    ].map((method) => (
                      <button
                        key={method.key}
                        type="button"
                        onClick={() => setPaymentMethod(method.key)}
                        className={`py-4 px-4 rounded-lg font-semibold transition border-2 ${
                          paymentMethod === method.key
                            ? "bg-orange-50 border-orange-600 text-orange-700"
                            : "bg-white border-gray-200 text-gray-700 hover:border-gray-300"
                        }`}
                      >
                        {method.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT: ORDER SUMMARY */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <Utensils size={24} />
                  Order Summary
                </h2>

                <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 border-b">
                      <div className="flex-1">
                        <p className="font-semibold text-gray-800">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          Qty: {item.quantity} × ₱{item.price}
                        </p>
                      </div>
                      <p className="font-semibold text-orange-600">
                        ₱{item.price * item.quantity}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 py-4 border-t">
                  <div className="flex justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">₱{cartTotal}</span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Service Fee:</span>
                    <span className="font-semibold">₱{serviceFee}</span>
                  </div>
                </div>

                <div className="border-t pt-4 mb-6">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">₱{grandTotal}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  className="w-full py-4 bg-gradient-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105"
                >
                  Confirm Order
                </button>
                <div className="mt-4 bg-blue-50 p-4 rounded-lg">
                  <p className="text-xs text-blue-800">
                    {orderType === "dine-in" 
                      ? "🍽️ Dine-in service • Your order will be served at your table"
                      : "🛍️ Take-out service • Pick up your order at the counter"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}