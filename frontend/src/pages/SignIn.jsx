import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../partials/Header";
import Banner from "../partials/Banner";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    console.log("🔹 Sending login request with:", { email, password });

    try {
      const response = await axios.post("http://localhost:5001/api/v1/login", {
        email,
        password,
      });

      console.log("✅ Login response:", response.data);

      if (response.data.token && response.data.user) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userid", response.data.user._id);
        alert("🎉 Login successful!");

        // Kiểm tra xem user đã có profile chưa
        const profileResponse = await axios.get(
          `http://localhost:5001/api/v1/user/profile?id=${response.data.user._id}`,
          {
            headers: { Authorization: `Bearer ${response.data.token}` },
          }
        );
        

        console.log("🔎 Profile Check:", profileResponse.data);

        if (profileResponse.data.hasProfile) {
          navigate("/create-profile"); // Nếu đã có profile, chuyển hướng về tasks
        } else {
          navigate("/create-profile"); // Nếu chưa có profile, điều hướng đến trang tạo hồ sơ
        }
      } else {
        setError("⚠ Unexpected response from server.");
      }
    } catch (error) {
      console.error("❌ Login Error:", error);

      if (error.response && error.response.data && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Invalid email or password. Please try again.");
      }
    }

    setLoading(false);
  };

  // Xử lý đăng nhập với GitHub
  const handleGitHubLogin = () => {
    console.log("🔹 Redirecting to GitHub OAuth...");
    window.location.href = "http://localhost:5001/api/v1/auth/github";
  };

  // Xử lý đăng nhập với Google
  const handleGoogleLogin = () => {
    console.log("🔹 Redirecting to Google OAuth...");
    window.location.href = "http://localhost:5001/api/v1/auth/google";
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      <Header />
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1">Welcome to Zentask.</h1>
              </div>

              <div className="max-w-sm mx-auto">
                <form onSubmit={handleLogin}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-input w-full text-gray-800"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-input w-full text-gray-800"
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}

                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  </div>
                </form>

                <div className="flex items-center my-6">
                  <div className="border-t border-gray-300 flex-grow mr-3"></div>
                  <div className="text-gray-600 italic">Or</div>
                  <div className="border-t border-gray-300 flex-grow ml-3"></div>
                </div>

                {/* Đăng nhập với GitHub */}
                <button
                  className="btn px-0 text-white bg-gray-900 hover:bg-gray-800 w-full flex items-center mb-3"
                  onClick={handleGitHubLogin}
                >
                  <svg className="w-4 h-4 fill-current text-white opacity-75 flex-shrink-0 mx-4" viewBox="0 0 16 16">
                    <path d="M7.95 0C3.578 0 0 3.578 0 7.95c0 3.479 2.286 6.46 5.466 7.553..."/>
                  </svg>
                  <span className="flex-auto pl-16 pr-8 -ml-16">Continue with GitHub</span>
                </button>

                {/* Đăng nhập với Google */}
                <button
                  className="btn px-0 text-white bg-red-600 hover:bg-red-700 w-full flex items-center"
                  onClick={handleGoogleLogin}
                >
                  <svg className="w-4 h-4 fill-current text-white opacity-75 flex-shrink-0 mx-4" viewBox="0 0 16 16">
                    <path d="M7.9 7v2.4H12c-.2 1-1.2 3-4 3-2.4 0-4.3-2-4.3-4.4 0-2.4 2..."/>
                  </svg>
                  <span className="flex-auto pl-16 pr-8 -ml-16">Continue with Google</span>
                </button>

                <div className="text-gray-600 text-center mt-6">
                  Don’t have an account? <Link to="/signup" className="text-blue-600 hover:underline">Sign up</Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Banner />
    </div>
  );
}

export default SignIn;
