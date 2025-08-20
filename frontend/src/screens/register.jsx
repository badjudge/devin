import React, { useState,useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../config/axios"; // Assuming axios is configured in this file
import { UserContext } from "../context/user.context"; // Import the UserContext


const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  
  const { setUser } = useContext(UserContext); // Access setUser from UserContext
  const navigate = useNavigate();

 

  const handleSubmit = (e) => {
    if (password !== confirm) {
  alert("Passwords do not match");
  return;
}
   e.preventDefault();
     
   axios.post("/users/register", { email, 
    password,
     confirm 
     
    }).then((res) => {
        console.log(res.data);
        localStorage.setItem('token', res.data.token);
        setUser(res.data.user);
        navigate("/");
      }).catch((err) => {
  console.error("Full error object:", err);
});


    // Registration logic here
    // On success: navigate("/login")
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Animated background blobs */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-72 h-72 bg-purple-600 opacity-30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-600 opacity-20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 w-40 h-40 bg-pink-500 opacity-20 rounded-full blur-2xl animate-pulse"></div>
      </div>
      <div className="relative z-10 bg-gray-800 bg-opacity-90 p-8 rounded-xl shadow-2xl w-full max-w-md backdrop-blur-lg animate-fade-in">
        <h2 className="text-3xl font-extrabold mb-6 text-white text-center tracking-wide animate-slide-down">
          Create Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2" htmlFor="confirm">
              Confirm Password
            </label>
            <input
              id="confirm"
              type="password"
              className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 rounded bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold hover:from-purple-700 hover:to-blue-700 transition shadow-lg animate-bounce"
          >
            Register
          </button>
        </form>
        <p className="mt-6 text-gray-400 text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-purple-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
      {/* Custom animations */}
      <style>
        {`
          .animate-fade-in {
            animation: fadeIn 1s ease;
          }
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.95);}
            to { opacity: 1; transform: scale(1);}
          }
          .animate-slide-down {
            animation: slideDown 0.8s cubic-bezier(.68,-0.55,.27,1.55);
          }
          @keyframes slideDown {
            from { opacity: 0; transform: translateY(-30px);}
            to { opacity: 1; transform: translateY(0);}
          }
        `}
      </style>
    </div>
  );
};
export default Register;