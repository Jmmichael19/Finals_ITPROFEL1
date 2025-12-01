import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { UserPlus, Eye, EyeOff, User, Briefcase, Shield, CheckCircle } from "lucide-react";
import { supabase } from "../services/supabase";

export default function SignupPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedRole, setSelectedRole] = useState("customer");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);

  const roles = [
    { id: "customer", label: "Customer", icon: User, route: "/customer", desc: "Order food & dine" },
    { id: "staff", label: "Staff", icon: Briefcase, route: "/staff", desc: "Manage orders" },
    { id: "admin", label: "Admin", icon: Shield, route: "/admin", desc: "Full control" }
  ];

  const calculatePasswordStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) strength++;
    if (/\d/.test(pwd)) strength++;
    if (/[^a-zA-Z\d]/.test(pwd)) strength++;
    return strength;
  };

  const handlePasswordChange = (pwd) => {
    setPassword(pwd);
    setPasswordStrength(calculatePasswordStrength(pwd));
  };

  const getPasswordStrengthText = () => {
    const texts = ["Weak", "Fair", "Good", "Strong"];
    const colors = ["text-red-600", "text-orange-600", "text-yellow-600", "text-green-600"];
    return { text: texts[passwordStrength - 1] || "", color: colors[passwordStrength - 1] || "" };
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    if (!fullName || !email || !password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      // 1️⃣ Create user in Supabase Auth
      const { data, error: signupError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { role: selectedRole, full_name: fullName } },
      });

      if (signupError) throw signupError;

      const userId = data.user?.id;

      // 2️⃣ Save user profile in 'users' table (optional if you want extra info)
      const { error: profileError } = await supabase.from("users").insert([
        {
          id: userId,
          full_name: fullName,
          role: selectedRole,
          email: email,
        },
      ]);

      if (profileError) throw profileError;

      // 3️⃣ Redirect based on role
      const selectedRoleData = roles.find((r) => r.id === selectedRole);
      navigate(selectedRoleData.route);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-orange-50 to-white flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 border border-orange-200/40">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-3 bg-linear-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center text-3xl shadow-lg animate-pulse">
            🍽️
          </div>
          <h1 className="text-3xl font-bold bg-linear-to-r from-orange-600 to-orange-500 bg-clip-text text-transparent">
            Create Account
          </h1>
          <p className="text-gray-500 text-sm mt-1">Start your smart dining journey today</p>
        </div>

        <form onSubmit={handleSignup} className="space-y-5">
          {/* ROLE SELECTION */}
          <div>
            <label className="text-sm font-semibold text-gray-700 block mb-3">I want to register as:</label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`p-3 rounded-xl border-2 transition transform hover:scale-105 flex flex-col items-center gap-1 ${
                    selectedRole === role.id
                      ? "border-orange-500 bg-orange-50 shadow-md"
                      : "border-gray-200 hover:border-orange-300"
                  }`}
                >
                  <role.icon 
                    size={24} 
                    className={selectedRole === role.id ? "text-orange-600" : "text-gray-400"}
                  />
                  <span className={`text-xs font-semibold ${selectedRole === role.id ? "text-orange-600" : "text-gray-600"}`}>
                    {role.label}
                  </span>
                  <span className="text-[10px] text-gray-400">{role.desc}</span>
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">{error}</div>
          )}

          {/* FULL NAME */}
          <div>
            <label className="text-sm font-semibold text-gray-700">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="John Doe"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition"
              required
            />
          </div>

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
              onChange={(e) => handlePasswordChange(e.target.value)}
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

            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((level) => (
                    <div
                      key={level}
                      className={`h-1 flex-1 rounded-full transition ${
                        level <= passwordStrength
                          ? passwordStrength === 1
                            ? "bg-red-500"
                            : passwordStrength === 2
                            ? "bg-orange-500"
                            : passwordStrength === 3
                            ? "bg-yellow-500"
                            : "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className={`text-xs mt-1 font-semibold ${getPasswordStrengthText().color}`}>
                  {getPasswordStrengthText().text}
                </p>
              </div>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="relative">
            <label className="text-sm font-semibold text-gray-700">Confirm Password</label>
            <input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter your password"
              className="mt-1 w-full px-4 py-3 rounded-xl border border-gray-300 focus:border-orange-500 focus:ring-2 focus:ring-orange-200 outline-none transition pr-12"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-4 bottom-3 text-gray-500 hover:text-gray-700 transition"
            >
              {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

            {confirmPassword && password === confirmPassword && (
              <div className="flex items-center gap-1 mt-2 text-green-600 text-sm">
                <CheckCircle size={16} />
                <span className="font-semibold">Passwords match</span>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-linear-to-r from-orange-600 to-orange-500 text-white font-semibold rounded-xl flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition transform hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus size={20} /> Sign Up as {roles.find(r => r.id === selectedRole)?.label}
              </>
            )}
          </button>

          <div className="text-center text-sm text-gray-500">Already have an account?</div>

          <Link
            to="/login"
            className="block w-full py-3 border-2 border-orange-500 text-orange-600 rounded-xl text-center font-semibold hover:bg-orange-50 transition transform hover:scale-105"
          >
            Login Instead
          </Link>
        </form>
      </div>
    </div>
  );
}
