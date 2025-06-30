import React, { useState, useCallback, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    email: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = Cookies.get("authToken");
    if (token) {
      navigate("/home"); // Redirect to home if token exists
    }
  }, [navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setError("");
      setIsLoading(true);

      // Validate required fields
      const { password, email } = formData;
      if (!password || !email) {
        setError("Please fill in all required fields (Name, Username, Password, Email)");
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:8080/api/auth/register-admin", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        });

        const data = await response.json();

        if (response.ok) {
          // Store token if API returns one
          if (data.token) {
            Cookies.set("authToken", data.token, { expires: 7 });
            navigate("/home");
          } else {
            // Clear form and redirect to login
            setFormData({
              password: "",
              email: ""
            });
            navigate("/");
          }
        } else {
          setError(data.message || "Registration failed. Please try again.");
        }
      } catch (error) {
        console.error("Registration error:", error);
        setError("Something went wrong. Please try again.");
      } finally {
        setIsLoading(false);
      }
    },
    [formData, navigate]
  );

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4 font-sans">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-white rounded-lg shadow-lg p-10 w-full max-w-md border border-gray-200"
      >
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="text-2xl font-semibold text-center text-gray-900 mb-8"
        >
          Create Account
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-gray-100 text-gray-700 p-3 rounded-md mb-6 text-center text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleRegister} className="space-y-6">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email *
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all duration-300"
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.45, duration: 0.5 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleInputChange}
                className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-gray-900 focus:border-gray-900 outline-none transition-all duration-300"
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 text-sm"
                disabled={isLoading}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ delay: 0.65, duration: 0.5 }}
            className="w-full bg-gray-900 text-white py-2 px-4 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <svg
                className="animate-spin h-5 w-5 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8h8a8 8 0 01-8 8 8 8 0 01-8-8z"
                ></path>
              </svg>
            ) : (
              "Sign Up"
            )}
            {isLoading && "Signing up..."}
          </motion.button>
        </form>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Already have an account?{" "}
          <Link
            to="/"
            className="text-gray-900 hover:underline font-medium"
          >
            Sign in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Register; 