import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { Link } from "react-router-dom";
import logo from "../../assets/images/logos/logo-icon.png";
import Button from "../../components/shared/button";
import Input from "../../components/shared/input";
import Typography from "../../components/shared/typography";

function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // Handler for form submission
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Send login request to backend API
      const res = await api.post("/api/v1/admin/login", { username, password }, {
        skipAuth: true
      });

      const { token, deletionAllowed } = res.data.data;
      localStorage.setItem("x-admin-key", token);
      localStorage.setItem("deletionAllowed", deletionAllowed);
      toast.success("Admin logged in");
      navigate("/admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen bg-offWhite font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-2xl font-bold text-gray-900 hover:opacity-90 transition-opacity"
        >
          <span 
            className="text-black p-2 rounded-lg"
          >
                <img
                  src={logo}
                  alt="weblinqo Logo"
                  className="h-16 object-contain"
                />
          </span>
        </Link>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <Typography variant="h2" className="text-3xl font-black text-gray-900 mb-6 text-center">Admin Login</Typography>
          
          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            <Input
              id="username"
              label="Username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />

            <Input
              id="password"
              label="Password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              type="submit"
              size="full"
              className="text-lg py-3 px-6 hover:scale-[1.02] active:scale-95"
            >
              Login
            </Button>
          </form>

          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              <Typography variant="span">← Back to homepage</Typography>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
