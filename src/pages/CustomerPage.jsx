import React, { useState, useEffect } from "react";
import { 
  ShoppingCart, Bot, Plus, Minus, Trash2, LogOut, Box 
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import supabase from "../services/supabase";
import Chatbot from "../components/Chatbot";

export default function CustomerPage() {
  const navigate = useNavigate();

  // --- STATE ---
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [selectedCategory, setSelectedCategory] = useState("All");

  // --- FETCH USER SESSION ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await supabase.auth.getSession();
      const currentUser = data.session?.user ?? null;

      if (!currentUser) {
        alert("You must be logged in as a customer.");
        navigate("/login");
        return;
      }

      if (currentUser.user_metadata?.role !== "customer") {
        alert("You must be logged in as a customer.");
        navigate("/login");
        return;
      }

      setUser(currentUser);
    };
    fetchUser();
  }, [navigate]);

  // --- FETCH MENU ITEMS ---
  useEffect(() => {
    const fetchMenu = async () => {
      const { data, error } = await supabase.from("products").select("*");
      if (error) return console.error(error);

      setMenuItems(data);
      const cats = ["All", ...new Set(data.map(item => item.category))];
      setCategories(cats);
    };
    fetchMenu();
  }, []);

  // --- CART FUNCTIONS ---
  const handleAddToCart = (item) => {
    const existing = cart.find(c => c.id === item.id);
    if (existing) {
      setCart(cart.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
      }
      return item;
    }).filter(Boolean));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getFilteredItems = () => {
    if (selectedCategory === "All") return menuItems;
    return menuItems.filter(item => item.category === selectedCategory);
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  // --- CHECKOUT ---
  const handleCheckout = async () => {
    if (!user) return alert("Login required.");
    if (cart.length === 0) return alert("Cart is empty.");

    const { error } = await supabase.from("orders").insert([{
      user_id: user.id,
      items: cart,
      grand_total: cartTotal,
      status: "pending",
      timestamp: new Date().toISOString(),
    }]);

    if (error) return alert("Checkout failed: " + error.message);

    setCart([]);
    setShowReceipt(false);
    alert("Order placed successfully!");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-40 pointer-events-auto">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">🍽️</div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">RestaurantAI</h1>
              <p className="text-xs text-gray-500">Smart Dining Experience</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/orders")} className="px-5 py-2 border-2 border-orange-500 text-orange-600 rounded-lg flex items-center gap-2 font-semibold hover:bg-orange-300 transition pointer-events-auto"><Box size={20} /> Orders</button>
            <button onClick={() => setChatOpen(true)} className="px-5 py-2 border-2 border-orange-500 text-orange-600 rounded-lg flex items-center gap-2 font-semibold hover:bg-orange-300 transition pointer-events-auto"><Bot size={20} /> AI Assistant</button>
            <button onClick={() => setShowReceipt(true)} className="relative px-5 py-2 bg-orange-600 text-white rounded-lg flex items-center gap-2 font-semibold hover:bg-orange-700 transition pointer-events-auto">
              <ShoppingCart size={20} /> Cart
              {cartItemCount > 0 && <span className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center text-xs font-bold rounded-full bg-red-500 text-white">{cartItemCount}</span>}
            </button>
            <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition pointer-events-auto"
          >
          Log out
          </button>
          </div>
        </div>
      </nav>

      {/* MENU SECTION */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* CATEGORY FILTER */}
            <div className="bg-white p-4 rounded-2xl shadow-md flex flex-wrap gap-3">
              {categories.map(category => (
                <button
                  key={`cat-${category}`} // unique key
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-semibold transition ${selectedCategory === category ? "bg-orange-600 text-white shadow-lg" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* MENU ITEMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {getFilteredItems().map(item => (
                <div key={`menu-${item.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.images} alt={item.name} className="w-full h-full object-cover" />
                    <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-sm">₱{item.price}</div>
                  </div>
                  <div className="p-5">
                    <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                    <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
                    >
                      <Plus size={20} /> Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* CART SIDEBAR */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
              <h2 className="text-2xl font-bold mb-4 flex items-center gap-2"><ShoppingCart size={24} /> Your Order</h2>

              <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                {cart.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                    <p className="text-gray-400">Your cart is empty</p>
                    <p className="text-sm text-gray-400">Add items to get started</p>
                  </div>
                ) : (
                  cart.map(item => (
                    <div key={`cart-${item.id}`} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                      <img src={item.images} alt={item.name} className="w-20 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">{item.name}</h4>
                        <p className="text-orange-600 font-bold">₱{item.price}</p>
                        <div className="flex items-center gap-2 mt-2">
                          <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><Minus size={16} /></button>
                          <span className="font-semibold px-3">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-gray-200 rounded hover:bg-gray-300"><Plus size={16} /></button>
                          <button onClick={() => removeFromCart(item.id)} className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-lg font-bold">
                      <span>Total:</span>
                      <span className="text-orange-600">₱{cartTotal}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate("/checkout", { state: { cart } })}
                    className="w-full py-4 bg-orange-600 to-orange-500 text-white font-bold rounded-xl hover:bg-orange-700 transition">
                    Proceed to Checkout
                  </button>
                </>
              )}
            </div>
                     </div>
        </div>
      </section>

      {/* CHAT MODAL */}
     <Chatbot isOpen={chatOpen} onClose={() => setChatOpen(false)} menuItems={menuItems} />

      {/* RECEIPT MODAL */}
      {showReceipt && (
        <div className="fixed inset-0  bg-opacity-50 z-50 flex items-center justify-center pointer-events-auto">
          <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-96 max-h-96 overflow-y-auto p-6 pointer-events-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800">Your Cart</h3>
              <button onClick={() => setShowReceipt(false)} className="text-gray-600 hover:text-gray-800 text-2xl">×</button>
            </div>
            {cart.length === 0 ? (
              <p className="text-gray-600 text-center">Your cart is empty</p>
            ) : (
              <>
                {cart.map(item => (
                  <div key={`modal-cart-${item.id}`} className="flex justify-between py-2 border-b">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₱{item.price}</p>
                    </div>
                    <p className="font-semibold">₱{item.price * item.quantity}</p>
                  </div>
                ))}
                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg font-bold mb-4">
                    <span>Total:</span>
                    <span className="text-orange-600">₱{cartTotal}</span>
                  </div>
                  <button 
                    onClick={() => { handleCheckout(); setShowReceipt(false); }}
                    className="w-full py-3 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 transition">
                    Checkout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
