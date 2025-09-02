
import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios"; // Assuming axios is configured in this file
import { UserContext } from "../context/user.context"; // Import the UserContext


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { setUser } = useContext(UserContext); // Access setUser from UserContext 
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    
   e.preventDefault();
    axios.post("/users/login",
       { email, password })
       .then((res) => {
  console.log(res.data);
  localStorage.setItem('token', res.data.token);
  localStorage.setItem('user', JSON.stringify(res.data.user)); // 👈 Add this
  setUser(res.data.user);
  navigate('/h');
}).catch((err) => {
  const msg =
    err.response?.data?.message || err.message || "Something went wrong";
  console.error("Registration error:", msg);
  setError(msg); // if you're showing error to user
});
    
     //  })
       // Add authentication logic here
    // On success: navigate("/dashboard") or wherever
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
            onChange={(e) => setEmail(e.target.value)}
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
             // onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
           // onChange={(e) => setPassword(e.target.value)} 
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>
        <p className="mt-6 text-gray-400 text-center">
          Don't have an account?{" "}
          <Link to="/register" className="text-blue-400 hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;