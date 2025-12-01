import React, { useState, useEffect } from "react";
import { Users, BarChart3, MessageCircle, ClipboardList, Settings, Menu, ShoppingCart, Clock, CheckCircle, X } from "lucide-react";

export default function AdminPage() {
  const [orders, setOrders] = useState([]);
  const [showOrdersModal, setShowOrdersModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Load orders from storage on component mount
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      const result = await window.storage.get('restaurant-orders');
      if (result && result.value) {
        const ordersData = JSON.parse(result.value);
        setOrders(ordersData);
      }
    } catch (error) {
      console.log('No orders found yet');
    }
  };

  // Calculate order statistics
  const totalOrders = orders.length;
  const completedOrders = orders.filter(o => o.status === 'completed').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.grandTotal, 0);

  const updateOrderStatus = async (orderId, newStatus) => {
    const updatedOrders = orders.map(order => 
      order.orderNumber === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    
    try {
      await window.storage.set('restaurant-orders', JSON.stringify(updatedOrders));
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  const OrdersModal = () => {
    if (!showOrdersModal) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
          <div className="p-6 border-b flex items-center justify-between bg-orange-50">
            <h2 className="text-2xl font-bold text-gray-900">All Orders</h2>
            <button
              onClick={() => setShowOrdersModal(false)}
              className="p-2 hover:bg-orange-100 rounded-lg transition"
            >
              <X size={24} />
            </button>
          </div>

          <div className="p-6 overflow-y-auto max-h-[calc(90vh-80px)]">
            {orders.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingCart size={64} className="mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 text-lg">No orders yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div
                    key={order.orderNumber}
                    className="border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-orange-600">
                          {order.orderNumber}
                        </h3>
                        <p className="text-sm text-gray-500">{order.timestamp}</p>
                      </div>
                      <div className="flex gap-2">
                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateOrderStatus(order.orderNumber, 'completed')}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-semibold"
                          >
                            Mark Complete
                          </button>
                        )}
                        <span
                          className={`px-4 py-2 rounded-lg text-sm font-semibold ${
                            order.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {order.status === 'pending' ? 'Pending' : 'Completed'}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-sm text-gray-500">Order Type</p>
                        <p className="font-semibold">
                          {order.orderType === 'dine-in' ? '🍽️ Dine-In' : '🛍️ Take-Out'}
                        </p>
                      </div>
                      {order.orderType === 'dine-in' && (
                        <div>
                          <p className="text-sm text-gray-500">Table Number</p>
                          <p className="font-semibold">Table {order.tableNumber}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm text-gray-500">Payment</p>
                        <p className="font-semibold">{order.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Total</p>
                        <p className="font-bold text-orange-600">₱{order.grandTotal}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">Items:</p>
                      <div className="space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                              {item.quantity}x {item.name}
                            </span>
                            <span className="font-semibold">₱{item.price * item.quantity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
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
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Welcome, <span className="bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">Admin</span>
          </h1>
          <p className="text-gray-600 text-lg mt-2">
            Full Access • Manage Users • View Analytics • Configure Menu • Monitor Chatbot Logs • Generate Reports
          </p>
        </div>

        {/* Order Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
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
            <p className="text-4xl font-bold">₱{totalRevenue}</p>
          </div>
        </div>

        {/* View All Orders Button */}
        <div className="mb-10">
          <button
            onClick={() => {
              loadOrders();
              setShowOrdersModal(true);
            }}
            className="w-full md:w-auto px-8 py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition transform hover:scale-105 flex items-center gap-2 justify-center"
          >
            <ShoppingCart size={24} />
            View All Orders
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