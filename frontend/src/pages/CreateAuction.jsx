import React, { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import usePageTitle from "../hooks/usePageTitle";
import api from "../services/api";

const InputField = ({
  label,
  type = "text",
  name,
  value,
  placeholder,
  onChange,
}) => (
  <div style={{ marginBottom: "20px" }}>
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
    {type !== "textarea" ? (
      <input
        id={name}
        type={type}
        name={name}
        value={value}
        placeholder={placeholder || label}
        onChange={onChange}
        required={label.includes("*")}
        style={{
          width: "100%",
          padding: "14px 16px",
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
    ) : (
      <textarea
        id={name}
        name={name}
        value={value}
        placeholder={placeholder || label}
        onChange={onChange}
        style={{
          width: "100%",
          padding: "14px 16px",
          fontSize: "15px",
          border: "2px solid #e0e0e0",
          borderRadius: "12px",
          outline: "none",
          transition: "all 0.3s ease",
          boxSizing: "border-box",
          resize: "vertical",
          minHeight: "100px",
        }}
        onFocus={(e) => (e.target.style.borderColor = "#667eea")}
        onBlur={(e) => (e.target.style.borderColor = "#e0e0e0")}
      />
    )}
  </div>
);

const CreateAuction = () => {

  usePageTitle('Create Auction');
  const { token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startingBid: "",
    endDate: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage("");
  };

  const handleFileChange = (e) => {
    setImageFile(e.target.files[0]);
    setMessage("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.startingBid || !formData.endDate) {
      setMessage("Please fill in all required fields.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);

      data.append("starting_bid", formData.startingBid);
      data.append("end_time", formData.endDate);
      if (imageFile) data.append("image", imageFile);

      const response = await api.post("/auctions", data, {
  headers: {
    "Content-Type": "multipart/form-data",
  },
});

if (response.status !== 200 && response.status !== 201) {
  throw new Error(response.data.message || "Failed to create auction.");
}

      setMessageType("success");
      setMessage("Auction created successfully!");
      setLoading(false);
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessageType("error");
      setMessage(err.message || "Something went wrong.");
      setLoading(false);
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
          maxWidth: "900px",
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
              Create a new auction and start bidding!
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
            Create Auction
          </h2>

          <form onSubmit={handleSubmit}>
            <InputField
              label="Title *"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />
            <InputField
              label="Description"
              type="textarea"
              name="description"
              value={formData.description}
              placeholder="Enter description (optional)"
              onChange={handleChange}
            />
            <InputField
              label="Starting Bid *"
              type="number"
              name="startingBid"
              value={formData.startingBid}
              onChange={handleChange}
            />
            <InputField
              label="End Date *"
              type="datetime-local"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
            />
            <div style={{ marginBottom: "20px" }}>
              <label
                htmlFor="image"
                style={{
                  display: "block",
                  fontSize: "14px",
                  fontWeight: "600",
                  color: "#333",
                  marginBottom: "8px",
                }}
              >
                Auction Image
              </label>
              <input
                type="file"
                id="image"
                name="image"
                accept="image/*"
                onChange={(e) => {
                  setImageFile(e.target.files[0]);
                  setMessage("");
                }}
                style={{ width: "100%" }}
              />
            </div>
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
              disabled={loading}
              style={{
                width: "100%",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                color: "white",
                border: "none",
                padding: "16px",
                borderRadius: "12px",
                fontSize: "16px",
                fontWeight: "600",
                cursor: loading ? "not-allowed" : "pointer",
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
              {loading ? "Creating..." : "Create Auction"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateAuction;
