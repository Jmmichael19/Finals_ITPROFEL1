import React, { useState, useEffect } from "react";
import { ShoppingCart, Clock, CheckCircle, Menu } from "lucide-react";
import { supabase } from "../services/supabase";
import { useNavigate } from "react-router-dom";

export default function StaffPage() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Load orders from Supabase
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("Failed to fetch orders:", error.message);
      return;
    }

    setOrders(data);
  };

  // Update order status and deduct stock
  const updateOrderStatus = async (orderId, newStatus) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;

    // Only deduct stock if marking as completed
    if (newStatus === "completed" && order.status !== "completed") {
      try {
        // Parse items safely (in case it's stored as JSON string)
        const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");

        for (const item of items) {
          // Fetch current product stock
          const { data: product, error: prodErr } = await supabase
            .from("products")
            .select("stock")
            .eq("id", item.id)
            .single();

          if (prodErr) {
            console.error("Error fetching product:", prodErr);
            continue;
          }

          const newStock = Math.max((product.stock || 0) - item.quantity, 0);

          // Update product stock
          const { error: updateErr } = await supabase
            .from("products")
            .update({ stock: newStock })
            .eq("id", item.id);

          if (updateErr) console.error("Error updating stock:", updateErr);
        }
      } catch (err) {
        console.error("Failed to deduct stock:", err);
        return alert("Failed to update product stock.");
      }
    }

    // Update order status in Supabase
    const { error } = await supabase
      .from("orders")
      .update({ status: newStatus })
      .eq("id", orderId);

    if (error) return alert("Failed to update order status: " + error.message);

    // Update local state
    setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
  };

  // Summary stats
  const totalOrders = orders.length;
  const pending = orders.filter(o => o.status === "pending").length;
  const completed = orders.filter(o => o.status === "completed").length;

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Top Navigation */}
      <nav className="fixed top-0 w-full bg-white shadow-sm z-50">
        <div className="container mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🍽️
            </div>
            <div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500">
                RestaurantAI
              </span>
              <p className="text-xs text-gray-500">Staff Dashboard</p>
            </div>
          </div>
          <button className="md:hidden p-2 rounded-lg hover:bg-gray-100">
            <Menu size={26} />
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-28 container mx-auto px-6">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, <span className="bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-orange-500">Staff</span>
          </h1>
          <button
            onClick={() => navigate("/login")}
            className="mb-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
          >
            ← Log out
          </button>
          <p className="text-gray-600 text-lg mt-2">
            Manage incoming orders • Update order status • View summaries
          </p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg">
            <ShoppingCart size={32} className="mb-2" />
            <p className="text-blue-100 text-sm">Total Orders</p>
            <p className="text-4xl font-bold">{totalOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white p-6 rounded-2xl shadow-lg">
            <Clock size={32} className="mb-2" />
            <p className="text-yellow-100 text-sm">Pending Orders</p>
            <p className="text-4xl font-bold">{pending}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg">
            <CheckCircle size={32} className="mb-2" />
            <p className="text-green-100 text-sm">Completed</p>
            <p className="text-4xl font-bold">{completed}</p>
          </div>
        </div>

        {/* Order List */}
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Incoming Orders</h2>
        {orders.length === 0 ? (
          <p className="text-gray-500">No orders yet.</p>
        ) : (
          <div className="space-y-4">
            {orders.map(order => {
              const items = Array.isArray(order.items) ? order.items : JSON.parse(order.items || "[]");
              return (
                <div key={order.id} className="border-2 border-gray-200 bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-orange-600">
                        Table: #{order.table_number} Order #: {order.order_number}
                      </h3>
                      <p className="text-sm text-gray-500">{new Date(order.timestamp).toLocaleString()}</p>
                    </div>

                    <div className="flex gap-2">
                      {order.status === "pending" && (
                        <button
                          onClick={() => updateOrderStatus(order.id, "completed")}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-semibold"
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
                        {order.status}
                      </span>
                    </div>
                  </div>

                  {/* Items */}
                  <div className="border-t pt-4">
                    <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                    {items.map((item, i) => (
                      <div key={i} className="flex justify-between text-sm mb-1">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-semibold">₱{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-20 bg-gray-900 text-white py-10">
        <div className="text-center text-gray-400 text-sm">
          © 2025 RestaurantAI • Staff Dashboard
        </div>
      </footer>
    </div>
  );
}
