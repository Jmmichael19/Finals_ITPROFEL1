import { useEffect, useState } from "react";
import { supabase } from "../services/supabase";
import { Clock, Receipt, Utensils, CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const statusColor = {
    pending: "bg-yellow-100 text-yellow-700",
    preparing: "bg-blue-100 text-blue-700",
    completed: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
  };

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const { data } = await supabase.auth.getUser();
        const currentUser = data.user;
        setUser(currentUser);

        let query = supabase.from("orders").select("*").order("created_at", { ascending: false });

        if (currentUser) {
          query = query.eq("user_id", currentUser.id);
        } else {
          query = query.is("user_id", null);
        }

        const { data: ordersData, error } = await query;
        if (error) throw error;

        const parsedOrders = ordersData.map(order => ({
          ...order,
          items: typeof order.items === "string" ? JSON.parse(order.items) : order.items,
        }));

        setOrders(parsedOrders);
      } catch (err) {
        console.error("Error fetching orders:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen text-gray-600 text-lg">
        <Loader2 className="animate-spin mr-3" /> Loading your orders...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Receipt size={36} className="text-orange-600" />
          Order History
        </h1>

        <button
            onClick={() => navigate("/customer")}
            className="mb-6 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition"
            >
            ← Back to Customer Page
        </button>

        {orders.length === 0 ? (
          <p className="text-gray-600 bg-white p-6 rounded-lg shadow text-center">
            You haven't placed any orders yet.
          </p>
        ) : (
          <div className="space-y-6">
            {orders.map(order => (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold text-gray-800">
                    {order.order_number}
                  </h2>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold capitalize ${statusColor[order.status]}`}
                  >
                    {order.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 text-sm text-gray-600 gap-3 mb-4">
                  <p className="flex items-center gap-2">
                    <Utensils size={18} /> {order.order_type.toUpperCase()}
                  </p>
                  <p className="flex items-center gap-2">
                    <Clock size={18} /> {new Date(order.created_at).toLocaleString()}
                  </p>

                  {order.order_type === "dine-in" && (
                    <p className="flex items-center gap-2">
                      🍽️ Table: <span className="font-semibold">{order.table_number}</span>
                    </p>
                  )}
                </div>

                {/* order items */}
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <p className="font-semibold text-gray-700 mb-3">Items Ordered:</p>
                  <div className="space-y-2">
                    {order.items.map(item => (
                      <div
                        key={item.id}
                        className="flex justify-between text-sm"
                      >
                        <span>
                          {item.quantity} × {item.name}
                        </span>
                        <span className="font-semibold text-orange-600">
                          ₱{item.price * item.quantity}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <p className="text-lg font-bold text-orange-600">
                    Total: ₱{order.grand_total}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
