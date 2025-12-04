import React, { useState, useEffect } from "react";
import { Users, BarChart3, MessageCircle, ClipboardList, Settings, Menu, ShoppingCart, Clock, CheckCircle, X, LogOut, Box } from "lucide-react";
import supabase  from "../services/supabase";
import { NavLink, useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const navigate = useNavigate();

  // Load orders and products
  useEffect(() => {
    loadOrders();
    loadProducts();
  }, []);

  const loadOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("timestamp", { ascending: false });
      if (error) throw error;
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err.message);
    }
  };

  const loadProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*");
      if (error) throw error;
      setProducts(data);
    } catch (err) {
      console.error("Error fetching products:", err.message);
    }
  };

  // Statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === "completed").length;
  const totalRevenue = orders.reduce((sum, o) => sum + o.grand_total, 0).toFixed(2);
  const totalStocks = products.reduce((sum, p) => sum + p.stock, 0);

  // Update order status & decrease stock
  const updateOrderStatus = async (orderNumber, newStatus) => {
    try {
      const order = orders.find(o => o.order_number === orderNumber);
      if (!order) return;

      // Deduct stock if marking as completed
      if (newStatus === "completed" && order.status !== "completed") {
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");

        for (const item of items) {
          const product = products.find(p => p.id === item.id);
          if (!product) continue;

          const newStock = Math.max(product.stock - item.quantity, 0);

          const { error } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.id);

          if (error) console.error("Error updating stock for", item.name, error);
          else setProducts(prev => prev.map(p => p.id === item.id ? { ...p, stock: newStock } : p));
        }
      }

      // Update order status
      const { error } = await supabase
        .from("orders")
        .update({ status: newStatus })
        .eq("order_number", orderNumber);

      if (error) throw error;

      // Update local state
      setOrders(prev => prev.map(o => o.order_number === orderNumber ? { ...o, status: newStatus } : o));
    } catch (err) {
      console.error("Failed to update order:", err.message);
      alert("Failed to update order status.");
    }
  };

  // Orders modal
  const OrdersModal = () => {
    if (!showOrdersModal) return null;

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-40 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-3xl sm:max-w-4xl w-full max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b flex items-center justify-between bg-orange-600 rounded-t-2xl">
            <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
            <button
              onClick={() => setShowOrdersModal(false)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map(order => {
                  const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");
                  return (
                    <div key={order.order_number} className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <h3 className="text-xl font-bold text-orange-600">Order #: {order.order_number}</h3>
                          <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
                        </div>
                        <div className="flex gap-2">
                          {order.status === "pending" && (
                            <button
                              onClick={() => updateOrderStatus(order.order_number, "completed")}
                              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                            >
                              Mark Complete
                            </button>
                          )}
                          <span
                            className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                              order.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {order.status === "pending" ? "Pending" : "Completed"}
                          </span>
                        </div>
                      </div>

                      {/* Details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-sm text-gray-500">Order Type</p>
                          <p className="font-semibold">{order.order_type === "dine-in" ? "🍽️ Dine-In" : "🛍️ Take-Out"}</p>
                        </div>
                        {order.order_type === "dine-in" && (
                          <div>
                            <p className="text-sm text-gray-500">Table Number</p>
                            <p className="font-semibold">Table {order.table_number}</p>
                          </div>
                        )}
                        <div>
                          <p className="text-sm text-gray-500">Payment</p>
                          <p className="font-semibold">{order.payment_method}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Total</p>
                          <p className="font-bold text-orange-600">₱{order.grand_total}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="border-t pt-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                        <div className="space-y-2">
                          {items.map((item, idx) => (
                            <div key={idx} className="flex justify-between text-sm">
                              <span className="text-gray-600">{item.quantity}x {item.name}</span>
                              <span className="font-semibold">₱{item.price * item.quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <OrdersModal />

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🍽️
            </div>
            <div>
              <span className="text-2xl font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
                RestaurantAI
              </span>
              <p className="text-xs text-gray-500">Admin Dashboard</p>
            </div>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28 container mx-auto px-6">
        <div className="mb-10 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">
              Welcome, <span className="bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Admin</span>
            </h1>
            <p className="text-gray-600 text-lg mt-2">
              Full Access • Manage Users • View Analytics • Configure Menu • Monitor Chatbot Logs • Generate Reports
            </p>
          </div>
          <button
            onClick={() => navigate("/login")}
            className="mb-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
          Log out
          </button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <div className="bg-linear-to-br from-orange-500 to-orange-600 text-white p-6 rounded-2xl shadow-lg">
            <ShoppingCart size={32} className="mb-2" />
            <p className="text-orange-100 text-sm">Total Orders</p>
            <p className="text-4xl font-bold">{totalOrders}</p>
          </div>
          <div className="bg-linear-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <CheckCircle size={32} className="mb-2" />
            <p className="text-green-100 text-sm">Completed Orders</p>
            <p className="text-4xl font-bold">{completedOrders}</p>
          </div>
          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <BarChart3 size={32} className="mb-2" />
            <p className="text-blue-100 text-sm">Total Revenue</p>
            <p className="text-4xl font-bold">₱{parseFloat(totalRevenue).toLocaleString()}</p>
          </div>
          <div className="bg-linear-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <Box size={32} className="mb-2" />
            <p className="text-blue-100 text-sm">Total Stocks</p>
            <p className="text-4xl font-bold">{totalStocks}</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="mb-10 gap-2 flex flex-col md:flex-row">
          <button
            onClick={() => setShowOrdersModal(true)}
            className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            <ShoppingCart size={24} /> View All Orders
          </button>
          <button
            onClick={() => navigate("/addproduct")}
            className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            Add Product
          </button>
          <button
            onClick={() => navigate("/allproducts")}
            className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            All Products
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white py-10">
        <div className="text-center text-gray-400 text-sm">
          © 2024 RestaurantAI • Admin Dashboard | All rights reserved.
        </div>
      </footer>
    </div>
  );
}
