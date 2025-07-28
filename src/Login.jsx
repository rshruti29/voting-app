import React, { useState } from 'react'
import { Link, useNavigate } from "react-router-dom"
import axios from "axios"

const Login = () => {
    const navigate = useNavigate()
    
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [error, setError] = useState("")
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await axios.post(
                "http://localhost:5000/api/auth/login",
                {
                    username,
                    email,
                    password
                },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log('Registration Response:', response.data);

            if (response.data.token) {
                // Store token in localStorage
                localStorage.setItem('token', response.data.token);
                alert("Registration Successful!");
                navigate("/login");
            } else {
                setError("Registration successful but no token received");
            }
        } catch (err) {
            console.error("Registration Error:", err.response?.data || err);
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <form className="register-form" onSubmit={handleSubmit}>
                <h2>Register</h2>
                

                <div className="input-group">
                    <label>Email</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="input-group">
                    <label>Password</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength={6}
                    />
                </div>
                
                <button 
                    type="submit" 
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? "Loging in..." : "Login"}
                </button>

                {error && <p className="error-message">{error}</p>}
                
                
            </form>
        </div>
    )
}

export default Login
