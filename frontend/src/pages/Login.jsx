// Login.jsx
import React, { useState, useContext } from "react";
import { loginUser } from "../services/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import usePageTitle from "../hooks/usePageTitle";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
  showToggle,
  showValue,
  toggleSetter,
}) => (
  <div
    style={{
      marginBottom: "20px",
      position: showToggle ? "relative" : "static",
    }}
  >
    <label
      htmlFor={name}
      style={{
        display: "block",
        fontSize: "14px",
        fontWeight: "600",
        color: "#333",
        marginBottom: "8px",
      }}
    >
      {label}
    </label>
    <input
      id={name}
      type={showToggle ? (showValue ? "text" : "password") : type}
      name={name}
      value={value}
      placeholder={placeholder || label}
      onChange={onChange}
      required
      style={{
        width: "100%",
        padding: "14px 16px",
        paddingRight: showToggle ? "50px" : "16px",
        fontSize: "15px",
        border: "2px solid #e0e0e0",
        borderRadius: "12px",
        outline: "none",
        transition: "all 0.3s ease",
        boxSizing: "border-box",
      }}
      onFocus={(e) => (e.target.style.borderColor = "#667eea")}
      onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
    />
    {showToggle && (
      <button
        type="button"
        onClick={() => toggleSetter((v) => !v)}
        style={{
          position: "absolute",
          right: "12px",
          top: "42px",
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "20px",
          padding: "4px",
        }}
        aria-label={showValue ? `Hide ${name}` : `Show ${name}`}
      >
        {showValue ? "👁️" : "👁️‍🗨️"}
      </button>
    )}
  </div>
);

const Login = () => {
  usePageTitle("Login - AuctionWar");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const { email, password } = formData;
    const res = await loginUser({ email, password });
    // Use points (not coins)
    const { username, token, points = 0, id } = res.data.data;
    login(username, token, points, id); // ID added here!
    setMessageType("success");
    setMessage(res.data.message || "Login successful! Redirecting...");
    setTimeout(() => navigate("/dashboard"), 1500);
  } catch (error) {
    setMessageType("error");
    setMessage(
      error.response?.data?.message || "Login failed. Please try again."
    );
  }
};


  return (
    <div
      style={{
        minHeight: "100vh",
        background: "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          background: "white",
          borderRadius: "24px",
          boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          overflow: "hidden",
          maxWidth: "1000px",
          width: "100%",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          minHeight: "600px",
        }}
      >
        <div
          style={{
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
            padding: "60px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            color: "white",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background:
                "radial-gradient(circle at 30% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              pointerEvents: "none",
            }}
          ></div>
          <div style={{ position: "relative", zIndex: 1 }}>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "700",
                margin: "0 0 20px 0",
                textShadow: "0 4px 12px rgba(0,0,0,0.2)",
                fontFamily: "'Poppins', 'Segoe UI', sans-serif",
              }}
            >
              AuctionWar
            </h1>
            <p
              style={{
                fontSize: "18px",
                lineHeight: "1.6",
                opacity: 0.95,
                margin: "0 0 40px 0",
                fontWeight: "300",
              }}
            >
              Welcome back! Please login to continue.
            </p>
          </div>
        </div>
        <div
          style={{
            padding: "60px 40px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "700",
              margin: "0 0 10px 0",
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Sign In
          </h2>
          <p style={{ fontSize: "14px", color: "#666", margin: "0 0 32px 0" }}>
            Don't have an account?{" "}
            <span
              style={{ color: "#667eea", cursor: "pointer", fontWeight: "600" }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
          <form onSubmit={handleSubmit}>
            <InputField
              label="📧 Email Address"
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email"
              onChange={handleChange}
            />
            <InputField
              label="🔒 Password"
              type="password"
              name="password"
              value={formData.password}
              placeholder="Enter your password"
              onChange={handleChange}
              showToggle
              showValue={showPassword}
              toggleSetter={setShowPassword}
            />
            {message && (
              <div
                style={{
                  padding: "12px 16px",
                  borderRadius: "10px",
                  marginBottom: "20px",
                  fontSize: "14px",
                  fontWeight: "500",
                  background: messageType === "success" ? "#d4edda" : "#f8d7da",
                  color: messageType === "success" ? "#155724" : "#721c24",
                  border: `1px solid ${
                    messageType === "success" ? "#c3e6cb" : "#f5c6cb"
                  }`,
                }}
              >
                {messageType === "success" ? "✅ " : "❌ "}
                {message}
              </div>
            )}
            <button
              type="submit"
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.3s ease",
                boxShadow: "0 4px 16px rgba(102, 126, 234, 0.4)",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow =
                  "0 6px 24px rgba(102, 126, 234, 0.5)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow =
                  "0 4px 16px rgba(102, 126, 234, 0.4)";
              }}
            >
              Sign In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
