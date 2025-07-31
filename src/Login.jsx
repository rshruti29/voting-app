import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "./Authcontext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      console.log("Logging in with:", { email, password }); 

      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      console.log("Login response:", response.data); 

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        login(response.data.user);
        alert("Login Successful!");
        navigate("/dash");
      } else {
        setError("Login successful but no token received");
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err);
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12" style={{ backgroundColor: '#764ba2' }}>
  <div className="w-full max-w-md rounded-2xl bg-white shadow-lg p-8 border border-slate-200" >
    <h2 className="text-3xl font-bold text-center text-indigo-700 mb-6">Login</h2>

    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={6}
          className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-400 outline-none transition"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className={`w-full py-2 rounded-lg font-semibold text-white transition-all duration-200 
          ${loading ? 'bg-indigo-300' : 'bg-indigo-600 hover:bg-indigo-700'}`}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      {error && <p className="text-red-600 text-sm text-center mt-2">{error}</p>}
    </form>

    <p className="mt-6 text-sm text-center text-gray-600">
      Don't have an account?{" "}
      <Link to="/" className="text-indigo-500 font-semibold hover:underline">
        Register
      </Link>
    </p>
  </div>
</div>

    
  );
};

export default Login;

