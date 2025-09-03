
import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios"; // Assuming axios is configured in this file
import { UserContext } from "../context/user.context"; // Import the UserContext


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const { setUser } = useContext(UserContext); // Access setUser from UserContext 
  const navigate = useNavigate();

  const [otpSent, setOtpSent] = useState(false);

const handlePasswordSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("/api/auth/login-password", { email, password });
    setOtpSent(true);
  } catch (err) {
    console.error("Login failed:", err);
  }
};

const [otp, setOtp] = useState("");

const handleOtpSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("/api/auth/verify-otp", { email, otp });
    const { token } = res.data;
    localStorage.setItem("token", token);
    setUser({ email });
    navigate("/h");
  } catch (err) {
    console.error("OTP verification failed:", err);
  }
};

  const handleSubmit =async (e) => {
    
   e.preventDefault();
    await axios.post("/api/auth/login-password", { email, password })

       .then((res) => {
        setOtpSent(true); // Show OTP input
  const { user, token } = res.data;

  if (user && token) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    navigate('/h');
  } else {
    console.error("Login response missing user or token:", res.data);
  }
}).catch((err) => {
  const msg =
    err.response?.data?.message || err.message || "Something went wrong";
  console.error("Registration error:", msg);
  //setError(msg); // if you're showing error to user
});
    
     //  })
       // Add authentication logic here
    // On success: navigate("/dashboard") or wherever
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-white text-center">Login</h2>
        <form onSubmit={otpSent ? handleOtpSubmit : handlePasswordSubmit} className="space-y-5">
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
          {otpSent && (
    <div>
      <label className="block text-gray-300 mb-2" htmlFor="password">OTP</label>
      <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500" required />
    </div>
  )}

  <button type="submit" className="bg-blue-600">
    {otpSent ? "Verify OTP" : "Login"}
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