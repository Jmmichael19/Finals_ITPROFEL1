import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, Eye, EyeOff, User, Briefcase, Shield } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { id: "customer", label: "Customer", icon: User, route: "/customer" },
    { id: "staff", label: "Staff", icon: Briefcase, route: "/staff" },
    { id: "admin", label: "Admin", icon: Shield, route: "/admin" }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Simulate API call (replace with actual authentication)
    setTimeout(() => {
      // Mock authentication - Replace with Supabase auth
      console.log("Login:", { email, role: selectedRole });

      // Route based on selected role
      const selectedRoleData = roles.find(r => r.id === selectedRole);
      if (selectedRoleData) {
        navigate(selectedRoleData.route);
      }

      setLoading(false);
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-white flex items-center justify-center p-6">
      {/* CARD */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-orange-200/40">
        {/* HEADER */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-pulse">
            🍽️
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Welcome Back
          </h1>
          <p className="text-gray-500 text-sm mt-1">Login to continue your smart dining experience</p>
        </div>

        {/* FORM */}
        <form onSubmit={handleLogin} className="space-y-5">
          {/* ROLE SELECTION */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">Select Your Role</label>
            <div className="grid grid-cols-3 gap-3">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-4 rounded-xl border-2 transition transform hover:scale-105 flex flex-col items-center gap-2 ${
                    selectedRole === role.id
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <role.icon 
                    size={24} 
                    className={selectedRole === role.id ? "text-orange-600" : "text-gray-400"}
                  />
                  <span className={`text-xs font-semibold ${
                    selectedRole === role.id ? "text-orange-600" : "text-gray-600"
                  }`}>
                    {role.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* ERROR MESSAGE */}
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              required
            />
          </div>

          {/* PASSWORD */}
          <div className="relative">
            <label className="text-sm font-semibold text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 bottom-3 text-gray-500 hover:text-gray-700 transition"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          {/* LOGIN BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Logging in...
              </>
            ) : (
              <>
                <LogIn size={20} /> Login as {roles.find(r => r.id === selectedRole)?.label}
              </>
            )}
          </button>

          {/* DIVIDER */}
          <div className="text-center text-sm text-gray-500">or</div>

          {/* REGISTER */}
          <Link
            to="/signup"
            className="block w-full py-3 border-2 border-orange-500 text-orange-600 rounded-xl text-center font-semibold hover:bg-orange-50 transition transform hover:scale-105"
          >
            Create an Account
          </Link>
        </form>

        {/* DEMO CREDENTIALS */}
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-xs text-gray-500 text-center font-semibold mb-2">Demo Credentials</p>
          <div className="text-xs text-gray-600 space-y-1">
            <p><span className="font-semibold">Email:</span> demo@restaurant.com</p>
            <p><span className="font-semibold">Password:</span> demo123</p>
            <p className="text-orange-600 font-semibold mt-2">Select any role above</p>
          </div>
        </div>
      </div>
    </div>
  );
}