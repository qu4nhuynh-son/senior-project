import React, { useState } from "react";
import axios from "axios";
import Header from "../partials/Header";
import Banner from "../partials/Banner";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:1000/api/v2/reset-password", {
        email,
      });

      setMessage("A password reset link has been sent to your email.");
    } catch (error) {
      setError("Failed to send reset link. Please check your email and try again.");
      console.error("Error resetting password:", error);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden">
      {/*  Site header */}
      <Header />

      {/*  Page content */}
      <main className="flex-grow">
        <section className="bg-gradient-to-b from-gray-100 to-white">
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            <div className="pt-32 pb-12 md:pt-40 md:pb-20">

              {/* Page header */}
              <div className="max-w-3xl mx-auto text-center pb-12 md:pb-20">
                <h1 className="h1 mb-4">Let’s get you back up on your feet</h1>
                <p className="text-xl text-gray-600">
                  Enter the email address you used when you signed up for your account, and we’ll email you a link to reset your password.
                </p>
              </div>

              {/* Form */}
              <div className="max-w-sm mx-auto">
                <form onSubmit={handleResetPassword}>
                  <div className="flex flex-wrap -mx-3 mb-4">
                    <div className="w-full px-3">
                      <label className="block text-gray-800 text-sm font-medium mb-1" htmlFor="email">
                        Email <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="form-input w-full text-gray-800"
                        placeholder="Enter your email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                    </div>
                  </div>

                  {/* Hiển thị thông báo lỗi nếu có */}
                  {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                  {message && <p className="text-green-500 text-center mb-4">{message}</p>}

                  <div className="flex flex-wrap -mx-3 mt-6">
                    <div className="w-full px-3">
                      <button
                        className="btn text-white bg-blue-600 hover:bg-blue-700 w-full"
                        type="submit"
                        disabled={loading}
                      >
                        {loading ? "Sending..." : "Send reset link"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>

            </div>
          </div>
        </section>
      </main>

      <Banner />
    </div>
  );
}

export default ResetPassword;
