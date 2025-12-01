import React, { useState } from "react";
import { ShoppingCart, Bot, Receipt, Menu, X, MessageCircle, Sparkles, Plus, Minus, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";


export default function CustomerPage() {
  const navigate = useNavigate(); 
  const [mobileMenu, setMobileMenu] = useState(false);
  const [cart, setCart] = useState([]);
  const [chatOpen, setChatOpen] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");  

  const menuItems = {
    "Appetizers": [
      { id: 1, name: "Caesar Salad", price: 180, image: "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop", description: "Fresh romaine with parmesan" },
      { id: 2, name: "Spring Rolls", price: 150, image: "https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=400&h=300&fit=crop", description: "Crispy vegetable rolls" },
      { id: 3, name: "Garlic Bread", price: 120, image: "https://spicecravings.com/wp-content/uploads/2021/09/Air-Fryer-Garlic-Bread-Featured.jpg", description: "Toasted with herbs" },
      { id: 4, name: "Fruite and Cheese Platter", price: 300, image: "https://www.tasteofhome.com/wp-content/uploads/2024/12/EXPS_TOHD24_224813_SuzanNajjar_3.jpg?fit=750%2C750", description: "A balanced fruit and cheese platter should feature contrasting colors, textures and flavors." },
      { id: 5, name: "Chicken Parm Sliders", price: 200, image: "https://www.tasteofhome.com/wp-content/uploads/2018/01/Chicken-Parmesan-Slider-Bake_EXPS_FT24_204498_JR_0124_1.jpg?fit=750%2C750", description: "The thing for the big game, or the big party, or regular ol' dinner! Whatever the event, a cheesy, saucy handheld sammy is sure to satisfy." },
      { id: 6, name: "Grilled Tomato-Peach Pizza", price: 150, image: "https://www.tasteofhome.com/wp-content/uploads/2018/01/Grilled-Tomato-Peach-Pizza_EXPS_HC17_142137_D07_29_4b-7-e1722978164165.jpg?fit=750%2C750", description: "The fresh flavors make it a perfect appetizer for a summer party." },
      { id: 7, name: "Ham 'n' Cheese Biscuit Stacks", price: 140, image: "https://www.tasteofhome.com/wp-content/uploads/2017/09/Ham-n-Cheese-Biscuit-Stacks_EXPS_HC17_31947_D10_19_8b.jpg?fit=750%2C750", description: "filling enough to satisfy hearty appetites." },
      { id: 8, name: "Tuscan Sausage and Bean Dip", price: 250, image: "https://www.tasteofhome.com/wp-content/uploads/2025/09/Tuscan-Sausage-Bean-Dip_EXPS_FT25_157522_JR_0820_6.jpg?fit=750%2C750", description: "Hot Italian sausage and two types of melty cheese give this hearty Tuscan sausage and bean dip its bold flavor and an irresistible, scoopable texture. " },
      { id: 9, name: "Artichoke Dip", price: 120, image: "https://www.tasteofhome.com/wp-content/uploads/2018/01/Artichoke-Dip_EXPS_THVP24_9923_MR_01_10_24_ArtichokeDip_2.jpg?fit=750%2C750", description: "Hot and cheesy artichoke dip is a simple yet delicious appetizer recipe to have on hand. Just mix everything together, spread into a dish and bake!" },
      { id: 10, name: "Cheese Fries", price: 220, image: "https://www.tasteofhome.com/wp-content/uploads/2024/11/Cheese-Fries_EXPS_TOHD24_26787_ChristineMa_8.jpg?fit=750%2C750", description: "Quick, easy and a surefire hit at your next gameday potluck or family gathering." },
    ],
    "Main Course": [
      { id: 11, name: "Grilled Steak", price: 450, image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop", description: "Premium beef with sides" },
      { id: 12, name: "Chicken Pasta", price: 280, image: "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop", description: "Creamy alfredo sauce" },
      { id: 13, name: "Seafood Platter", price: 520, image: "https://stemandspoon.com/wp-content/uploads/2022/11/seafood-charcuterie-board-featured.jpg", description: "Fresh catch of the day" },
      { id: 14, name: "Burger Deluxe", price: 220, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop", description: "Angus beef with fries" },
      { id: 15, name: "Margherita Pizza", price: 320, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop", description: "Classic Italian style" },
      { id: 16, name: "​​Fettuccine Alfredo", price: 120, image: "https://www.allrecipes.com/thmb/6t5UtCtBjvl26mcpYq1ZhPTfbcQ=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/AR-23431-to-die-for-fettuccine-alfredo-DDMFS-beauty-3x4-b64d36c7ff314cb39774e261c5b18352.jpg", description: "This rich and creamy fettuccine Alfredo is an easy recipe even for beginner cooks, but it’s impressive enough for company." },
      { id: 17, name: "Braised Chicken Legs With Grapes and Fennel", price: 350, image: "https://assets.epicurious.com/photos/5f737a125a7e264184aab1b4/1:1/w_1920,c_limit/ChickenGrapesFennel_HEROv2_12175.jpg", description: "Think of the grapes in this chicken recipe as something like a rustic way to braise chicken in wine." },
      { id: 18, name: "Habanero BBQ Shrimp", price: 180, image: "https://assets.epicurious.com/photos/5f2333d0841506e1b11da70b/1:1/w_1920,c_limit/ShrimpSkewers_RECIPE_072920_10116.jpg", description: "Blue Diamond Habanero BBQ–flavored almonds." },
      { id: 19, name: "Grilled Pork Spareribs With Soda Bottle Barbecue Sauce", price: 300, image: "https://assets.epicurious.com/photos/60abf60a0e303494c8490c11/1:1/w_1920,c_limit/PorkSpareribs_RECIPE_052021_16270.jpg", description: "Low and slow is more than just grillmaster jargon; it’s also an invaluable currency when it comes to grilling truly tender pork spareribs. " },
      { id: 20, name: "Tamarind-Glazed Black Bass With Coconut-Herb Salad", price: 200, image: "https://assets.epicurious.com/photos/5e67a4473221b000088c1422/1:1/w_1920,c_limit/tamarind-glazed-black-bass-with-coconut-herb-salad-recipe-BA-031020.jpg", description: "This sweet-and-sour glaze will work on other proteins besides fish." },
    ],
    "Desserts": [
      { id: 21, name: "Chocolate Cake", price: 180, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop", description: "Rich and moist" },
      { id: 22, name: "Ice Cream", price: 120, image: "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400&h=300&fit=crop", description: "Three scoops" },
      { id: 23, name: "Cheesecake", price: 200, image: "https://www.inspiredtaste.net/wp-content/uploads/2024/04/New-York-Cheesecake-Recipe-Video.jpg", description: "New York style" },
      { id: 24, name: "Springtime Beignets & Berries", price: 280, image: "https://www.tasteofhome.com/wp-content/uploads/2017/09/Springtime-Beignets-Berries_EXPS_THAM17_199933_C11_10_1b.jpg?fit=750%2C750", description: "Turns out they're easy! Sometimes it even make a quick berry whipped cream and pipe it inside for a fun surprise." },
      { id: 25, name: "Lemon Blueberry Trifle", price: 200, image: "https://www.tasteofhome.com/wp-content/uploads/2025/05/Blueberry-Lemon-Trifle_EXPS_FT25_12386_AC_0509_2.jpg?fit=750%2C750", description: "This easy, colorful and crowd-friendly lemon blueberry trifle recipe requires just five ingredients." },
      { id: 26, name: "Strawberry Cheesecake", price: 220, image: "https://www.tasteofhome.com/wp-content/uploads/2024/11/Strawberry-Cheesecake_EXPS_TOHSpring25_3270_DR_11_06_02b.jpg?fit=750%2C750", description: "A strawberry cheesecake is a dressed-up classic cheesecake with a glossy strawberry glaze and fresh berries." },
      { id: 27, name: "Plum Upside-Down Cake", price: 180, image: "https://www.tasteofhome.com/wp-content/uploads/2017/09/Plum-Upside-Down-Cake_EXPS_UGFBMZ17_2045_B05_04_2b.jpg?fit=750%2C750", description: "Everyone pronounced this cake 'Delicious!' and asked for seconds.—Bobbie Talbott, Veneta, Oregon" },
      { id: 28, name: "Chocolate-Covered Peanut Butter & Pretzel Truffles", price: 80, image: "https://www.tasteofhome.com/wp-content/uploads/2017/09/Chocolate-Covered-Peanut-Butter-Pretzel-Truffles_exps158828_THCA143053D11_15_11bC_RMS.jpg?fit=750%2C750", description: "Sweet chocolate, creamy peanut butter and salty pretzels create a to-die-for truffle. It’s a little bite of decadence and a special indulgence for the holiday season." },
      { id: 29, name: "Cherry Bombs", price: 220, image: "https://www.tasteofhome.com/wp-content/uploads/2017/09/Cherry-Bombs_exps38150_HC143213C08_21_5bC_RMS.jpg?fit=750%2C750", description: "You'll win praise for these clever cherry bombs. Serve them for a special occasion with a knife and dessert spoon. " },
      { id: 30, name: "Macaroni Egg Salad", price: 120, image: "https://www.tasteofhome.com/wp-content/uploads/2024/10/EXPS_TOHD24_15747_JuliaHartbeck_8.jpg?fit=750%2C750", description: "Embrace the joy of quick cooking with our Macaroni Egg Salad—a comforting, classic favorite, ideal for every occasion." },
    ],
    "Beverages": [
      { id: 31, name: "Orange Juice", price: 80, image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=300&fit=crop", description: "Freshly squeezed oranges for a natural sweet-citrus taste." },
      { id: 32, name: "Iced Coffee", price: 95, image: "https://cdn.loveandlemons.com/wp-content/uploads/2025/05/iced-coffee.jpg", description: "Cold brew" },
      { id: 33, name: "Smoothie", price: 110, image: "https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=400&h=300&fit=crop", description: "Mixed berries" },
      { id: 34, name: "Lemonade", price: 80, image: "https://www.cookingclassy.com/wp-content/uploads/2019/06/lemonade-15.jpg", description: "Freshly squeezed lemons, cold water, and sugar blended into a crisp, tangy drink." },
      { id: 35, name: "Cola / Soft Drinks", price: 40, image: "https://img.freepik.com/premium-photo/fresh-cola-drink-glass_974732-47973.jpg", description: "Classic carbonated refreshers served cold." },
      { id: 36, name: "Hot Coffee", price: 50, image: "https://static.vecteezy.com/system/resources/previews/030/564/776/large_2x/ai-generative-delicious-hot-coffee-in-a-white-cup-with-smoke-on-a-dark-wooden-table-free-photo.jpg", description: "Freshly brewed coffee with a bold and aromatic flavor." },
      { id: 37, name: "Herbal Tea", price: 75, image: "https://tse2.mm.bing.net/th/id/OIP.zqoCSw87Exjp9Hw2vzI-TwHaFj?pid=Api&P=0&h=220", description: "A soothing blend of herbs like chamomile, ginger, or mint." },
      { id: 38, name: "Fresh Milk", price: 60, image: "https://img.freepik.com/premium-photo/fresh-milk-glass-cup_908793-142.jpg", description: "Chilled or warm pure milk, smooth and lightly sweet." },    
      { id: 39, name: "Mojito Mocktail", price: 120, image: "https://images.cocktailwave.com/elderflower-mojito.png", description: "Mint, lime, and soda water mixed for a non-alcoholic classic." },
      { id: 40, name: "Salted Caramel Frappe", price: 250, image: "https://img.freepik.com/premium-photo/photo-salted-caramel-frappuccino-blended-coffee-drink-with-salte-front-view-clean-bg_655090-970006.jpg", description: "Sweet caramel blended with ice and topped with a hint of sea salt." },
    ]
  };

  const categories = ["All", ...Object.keys(menuItems)];

  const handleAddToCart = (item) => {
    const existingItem = cart.find(cartItem => cartItem.id === item.id);
    if (existingItem) {
      setCart(cart.map(cartItem => 
        cartItem.id === item.id 
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem
      ));
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + delta;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const getFilteredItems = () => {
    if (selectedCategory === "All") {
      return Object.entries(menuItems).flatMap(([category, items]) => 
        items.map(item => ({ ...item, category }))
      );
    }
    return menuItems[selectedCategory]?.map(item => ({ ...item, category: selectedCategory })) || [];
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white shadow-md z-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between h-20">

            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-linear-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center text-2xl shadow-lg">
                🍽️
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  RestaurantAI
                </h1>
                <p className="text-xs text-gray-500">Smart Dining Experience</p>
              </div>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-4">
              <button
                className="px-5 py-2 bg-white border-2 border-orange-500 text-orange-600 font-semibold rounded-lg hover:bg-orange-50 transition flex items-center gap-2"
                onClick={() => setChatOpen(true)}
              >
                <Bot size={20} />
                AI Assistant
              </button>

              <button
                className="relative px-5 py-2 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition flex items-center gap-2"
                onClick={() => setShowReceipt(true)}
              >
                <ShoppingCart size={20} />
                Cart
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                    {cartItemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile */}
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100"
            >
              {mobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenu && (
            <div className="md:hidden pb-4 space-y-3">
              <button
                onClick={() => setChatOpen(true)}
                className="block w-full py-2 border-2 text-orange-600 border-orange-600 rounded-lg font-semibold"
              >
                <Bot className="inline mr-2" size={20} />
                AI Assistant
              </button>

              <button
                onClick={() => setShowReceipt(true)}
                className="block w-full py-2 bg-orange-600 text-white rounded-lg font-semibold relative"
              >
                <ShoppingCart className="inline mr-2" size={20} />
                View Cart ({cartItemCount})
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* BODY CONTENT */}
      <section className="pt-28 pb-16 px-4">
        <div className="container mx-auto max-w-7xl">

          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full text-sm font-semibold mb-4">
              <Sparkles size={16} />
              <span>Welcome to RestaurantAI</span>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              What would you like to eat today?
            </h1>
            <p className="text-lg text-gray-600">
              Browse our menu and order your favorite dishes
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LEFT: MENU SECTION */}
            <div className="lg:col-span-2">
              
              {/* Category Filter */}
              <div className="bg-white rounded-2xl shadow-md p-4 mb-6">
                <div className="flex flex-wrap gap-3">
                  {categories.map(category => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`px-6 py-2 rounded-lg font-semibold transition ${
                        selectedCategory === category
                          ? "bg-orange-600 text-white shadow-lg"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>

              {/* Menu Items Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {getFilteredItems().map(item => (
                  <div key={item.id} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition transform hover:-translate-y-1">
                    <div className="relative h-48 overflow-hidden">
                      <img 
                        src={item.image} 
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-sm">
                        ₱{item.price}
                      </div>
                    </div>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                      </div>
                      <p className="text-gray-600 text-sm mb-4">{item.description}</p>
                      <button
                        onClick={() => handleAddToCart(item)}
                        className="w-full py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition flex items-center justify-center gap-2"
                      >
                        <Plus size={20} />
                        Add to Cart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT: CART SECTION */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-md p-6 sticky top-24">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  <ShoppingCart size={24} />
                  Your Order
                </h2>

                <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                  {cart.length === 0 ? (
                    <div className="text-center py-8">
                      <ShoppingCart size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-400">Your cart is empty</p>
                      <p className="text-sm text-gray-400">Add items to get started</p>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="flex gap-3 p-3 bg-gray-50 rounded-lg">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800">{item.name}</h4>
                          <p className="text-orange-600 font-bold">₱{item.price}</p>
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="font-semibold px-3">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                            >
                              <Plus size={16} />
                            </button>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                            >
                              <Trash2 size={16} />
                            </button>
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
                      onClick={() => navigate("/checkout", { state: { cart } })}  // ✅ FIXED ROUTING
                      className="w-full py-4 bg-linear-to-r from-orange-600 to-orange-500 text-white font-bold rounded-xl hover:shadow-xl transition">
                      Proceed to Checkout
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* AI Chat Modal */}
      {chatOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-999">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <Bot size={26} className="text-blue-600" /> AI Assistant
            </h2>
            <p className="text-gray-600 mb-6">
              Hi! I'm your AI assistant. I can help you with menu recommendations, 
              dietary information, allergens, and answer any questions about our dishes.
            </p>

            <div className="bg-gray-50 p-4 rounded-lg mb-4 h-64 overflow-y-auto">
              <p className="text-sm text-gray-500 text-center py-20">
                Chat functionality coming soon...
              </p>
            </div>

            <button
              onClick={() => setChatOpen(false)}
              className="w-full py-3 mt-4 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {showReceipt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-999">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
              <ShoppingCart size={26} className="text-purple-600" /> Your cart
            </h2>

            {cart.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No items in cart yet. Add items to generate a receipt.
              </p>
            ) : (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <p className="text-sm text-gray-500">RestaurantAI</p>
                  <p className="text-sm text-gray-500">{new Date().toLocaleString()}</p>
                </div>

                {cart.map(item => (
                  <div key={item.id} className="flex justify-between py-2">
                    <div>
                      <p className="font-semibold">{item.name}</p>
                      <p className="text-sm text-gray-500">Qty: {item.quantity} × ₱{item.price}</p>
                    </div>
                    <p className="font-semibold">₱{item.price * item.quantity}</p>
                  </div>
                ))}

                <div className="border-t pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span className="text-orange-600">₱{cartTotal}</span>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={() => setShowReceipt(false)}
              className="w-full py-3 mt-4 bg-gray-200 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
}