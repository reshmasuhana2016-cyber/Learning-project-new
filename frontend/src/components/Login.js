import { useState } from "react";
import { useNavigate } from "react-router-dom";


const Login = () => {
      const [formData, setFormData] = useState({
        email: "",
        password: "",
      });
       const [error, setError] = useState("");
        const [success, setSuccess] = useState("");
      
     const navigate = useNavigate();
      const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const validate = () => {
    const { email, password } = formData;
    if ( !email || !password) return "All fields are required";
    if (password.length < 5) return "Password must contain at least 5 characters";
    return null;
  };

  const handleOnSubmit = async(e) => {
    e.preventDefault();
    const validationError = validate();
    if(validationError) {
        setError(validationError)
    }

    try{
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/login`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        })
        const json = await response.json();
        if(!response.ok) {
            setError(json.error || "Please try to login with correct credentials")
        }

        if(json.success){
            localStorage.setItem('authToken', json.token);
            console.log("Login Successful");
        }

        setSuccess("Login Successful");
        setFormData({email: "", password: ""})
        navigate("/")
    }catch (error) {
      setError("Something went wrong. Please try again.");
    }
  }

  return (
   <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow-lg" style={{ width: "350px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4 text-primary">Login</h3>

        {success && <div className="alert alert-success">{success}</div>}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleOnSubmit}>
         

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
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
