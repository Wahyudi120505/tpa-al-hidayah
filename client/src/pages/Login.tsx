
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import { School, XCircle, Eye, EyeOff } from "lucide-react";

interface User {
  role: "ADMIN" | "PARENT" | string;
  [key: string]: any;
}

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Check if user is already logged in
  useEffect(() => {
    const token = Cookies.get("authToken");
    const userData = localStorage.getItem("user");
    if (token && userData) {
      const user: User = JSON.parse(userData);
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "PARENT") {
        navigate("/parent");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    if (!email || !password) {
      setError("Silakan isi semua kolom");
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const result: { data: { token: string; [key: string]: any }; responseMessage?: string } = await response.json();

      if (response.ok) {
        const token = result.data.token;
        Cookies.set("authToken", token, { expires: 1 });
        const user = result.data;
        localStorage.setItem("user", JSON.stringify(user));

        if (user.role === "ADMIN") {
          navigate("/admin");
        } else if (user.role === "PARENT") {
          navigate("/parent/home-parent");
        } else {
          navigate("/");
        }
      } else {
        setError(result.responseMessage || "Email atau kata sandi salah");
      }
    } catch (error) {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: "easeOut" as any} },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: (i: number) => ({
      opacity: 1,
      x: 0,
      transition: { delay: i * 0.2, duration: 0.5 },
    }),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4 sm:p-6 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl shadow-2xl p-8 sm:p-10 w-full max-w-md border border-blue-100"
      >
        <div className="flex justify-center mb-6">
          <School className="h-12 w-12 text-blue-600" />
        </div>
        <motion.h2
          custom={0}
          variants={itemVariants}
          className="text-3xl font-bold text-center text-blue-800 mb-8"
        >
          Masuk ke TPA Al-Hidayah
        </motion.h2>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mb-6 text-center text-sm text-red-700 flex items-center justify-center gap-2"
            >
              <XCircle className="h-5 w-5" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleLogin} className="space-y-6">
          <motion.div custom={1} variants={itemVariants}>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300 shadow-sm"
              placeholder="Masukkan email Anda"
              disabled={isLoading}
            />
          </motion.div>

          <motion.div custom={2} variants={itemVariants}>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-blue-600 outline-none transition-all duration-300 shadow-sm"
                placeholder="Masukkan kata sandi Anda"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </motion.div>

          <motion.button
            type="submit"
            custom={3}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:ring-offset-2 transition-all duration-300 flex items-center justify-center ${
              isLoading ? "opacity-70 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
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
                Memproses...
              </>
            ) : (
              "Masuk"
            )}
          </motion.button>
        </form>

        <motion.p
          custom={4}
          variants={itemVariants}
          className="mt-6 text-center text-sm text-gray-600"
        >
          Belum punya akun?{" "}
          <a
            href="/register"
            className="text-blue-600 hover:text-blue-800 font-medium hover:underline"
          >
            Daftar
          </a>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default Login;