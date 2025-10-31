import { useState } from "react";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Validation
  const validate = () => {
    const { name, email, password } = formData;
    if (!name || !email || !password) return "All fields are required";
    if (name.length < 3) return "Name must be at least 3 characters";
    if (password.length < 5) return "Password must contain at least 5 characters";
    return null;
  };

  // Handle submit
  const handleOnSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      setSuccess("");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/createuser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const json = await response.json();

      if (!response.ok) {
        setError(json.message || "Email already exists");
        setSuccess("");
        return;
      }

      setSuccess("User created successfully!");
      setError("");
      setFormData({ name: "", email: "", password: "" });

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4 text-primary">Sign Up</h3>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleOnSubmit}>
          <div className="mb-3">
            <label htmlFor="name" className="form-label fw-semibold">
              Name
            </label>
            <input
              type="text"
              name="name"
              className="form-control"
              id="name"
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label fw-semibold">
              Email
            </label>
            <input
              type="email"
              name="email"
              className="form-control"
              id="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label fw-semibold">
              Password
            </label>
            <input
              type="password"
              name="password"
              className="form-control"
              id="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Create Account
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
