import React, { useState, useEffect } from "react";
import {
  ShoppingCart,
  MessageCircle,
  BarChart3,
  Sparkles,
  ArrowRight,
  CheckCircle,
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Benefits", href: "#benefits" },
];

const features = [
  {
    icon: <ShoppingCart size={32} />,
    title: "Self-Ordering",
    desc: "Browse menu, customize dishes, and place orders directly without waiting.",
    bg: "from-orange-50 to-orange-100",
    iconBg: "from-orange-600 to-orange-500",
  },
  {
    icon: <Sparkles size={32} />,
    title: "AI Receipts",
    desc: "Get personalized receipts with recommendations powered by AI.",
    bg: "from-blue-50 to-blue-100",
    iconBg: "from-blue-600 to-blue-500",
  },
  {
    icon: <MessageCircle size={32} />,
    title: "AI Chatbot",
    desc: "Ask menu questions and get instant recommendations 24/7.",
    bg: "from-green-50 to-green-100",
    iconBg: "from-green-600 to-green-500",
  },
  {
    icon: <BarChart3 size={32} />,
    title: "Analytics",
    desc: "Real-time insights on orders, revenue, and customer habits.",
    bg: "from-purple-50 to-purple-100",
    iconBg: "from-purple-600 to-purple-500",
  },
];

const howItWorks = [
  { step: "1", emoji: "📱", title: "Browse Menu", desc: "Explore our digital menu." },
  { step: "2", emoji: "🛒", title: "Order & Customize", desc: "Add items and chat with AI assistant." },
  { step: "3", emoji: "🍽️", title: "Enjoy Meal", desc: "Get updates and AI receipts." },
];

const benefits = [
  { icon: "👥", title: "For Customers", desc: "Fast ordering, no waiting." },
  { icon: "👨‍🍳", title: "For Staff", desc: "Less workload, smoother service." },
  { icon: "📊", title: "For Managers", desc: "Analytics & insights." },
  { icon: "📈", title: "For Business", desc: "Higher efficiency & satisfaction." },
];

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const go = (path) => (window.location.href = path);

  return (
    <div className="min-h-screen bg-white">

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm shadow-sm z-50">
        <div className="container mx-auto px-4 lg:px-8 flex items-center justify-between h-20">

          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg">
              🍽️
            </div>
            <div>
              <span className="text-2xl font-bold text-orange-600">Restaurant Self-Ordering System</span>
              <p className="text-xs text-gray-500">AI powered</p>
            </div>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="text-gray-700 hover:text-orange-600 font-medium">
                {l.label}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden px-4 pb-4 space-y-3">
            {navLinks.map((l) => (
              <a key={l.href} href={l.href} className="block py-2 text-gray-700 hover:text-orange-600 font-medium">
                {l.label}
              </a>
            ))}
            <button onClick={() => go("/login")} className="w-full py-2 border border-orange-600 text-orange-600 rounded-lg">
              Log In
            </button>
            <button onClick={() => go("/signup")} className="w-full py-2 bg-orange-600 text-white rounded-lg">
              Get Started
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-32 pb-20 px-4 bg-orange-50">
        <div className="container mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-100 text-orange-700 rounded-full mb-6">
            <Sparkles size={16} /> AI-Powered Restaurant Experience
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Order Smart,
            <span className="text-orange-600"> Eat Happy</span>
          </h1>

          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Experience the future of dining with AI-powered self-ordering.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => go("/login")}
              className="px-8 py-4 bg-orange-600 text-white font-bold rounded-xl flex items-center gap-2"
            >
            Log in to proceed <ArrowRight size={20} />
            </button>

            <button
              onClick={() => go("/signup")}
              className="px-8 py-4 border-2 border-orange-600 text-orange-600 font-bold rounded-xl"
            >
              Sign up
            </button>
          </div>

          <div className="mt-6 flex justify-center gap-6 text-sm text-gray-600">
            <p className="flex items-center gap-1"><CheckCircle size={16} className="text-green-600" /> Hassle free</p>
            <p className="flex items-center gap-1"><CheckCircle size={16} className="text-green-600" />Fast and reliable</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto">
          <h2 className="text-center text-4xl font-bold mb-12">Powerful Features</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className={`group p-8 rounded-2xl bg-linear-to-br ${f.bg} hover:-translate-y-2 hover:shadow-xl transition`}
              >
                <div className={`w-16 h-16 rounded-2xl bg-linear-to-br ${f.iconBg} flex items-center justify-center text-white mb-6`}>
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-2">{f.title}</h3>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-20 px-4 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-center text-4xl font-bold mb-12">How It Works</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {howItWorks.map((s, i) => (
              <div key={i} className="relative bg-white p-8 text-center rounded-2xl shadow-lg">
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-orange-600 text-white w-12 h-12 flex items-center justify-center rounded-full">
                  {s.step}
                </div>
                <div className="text-6xl mt-4 mb-4">{s.emoji}</div>
                <h3 className="text-2xl font-bold mb-2">{s.title}</h3>
                <p className="text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BENEFITS */}
      <section id="benefits" className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-center text-4xl font-bold mb-12">Benefits for Everyone</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((b, i) => (
              <div key={i} className="flex gap-4 p-6 bg-gray-50 rounded-xl hover:shadow-lg transition">
                <div className="text-4xl">{b.icon}</div>
                <div>
                  <h4 className="text-xl font-bold">{b.title}</h4>
                  <p className="text-gray-600">{b.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-gray-900 text-white py-10 text-center">
        <p className="text-gray-400 text-sm">
          © 2024 John Michael N. Pugales. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
