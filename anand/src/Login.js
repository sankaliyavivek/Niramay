import React, { useState } from 'react';
import axios from 'axios';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const API_URL = process.env.REACT_APP_BACKEND_API_URL;

function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${API_URL}/user/login`, { email, password }, { withCredentials: true });

            localStorage.setItem('username', response.data.user.name);
            localStorage.setItem('token', response.data.token);

            // ✅ Avoid duplicate success toast
            toast.success("Login successful!");
        
            setTimeout(() => {
                onLoginSuccess(response.data.user.name, response.data.token);
            }, 1000);
        } catch (error) {
            toast.error("Invalid email or password");
        }
    };

    return (
        <div className="login">
            <div className='register-form'>
                <form onSubmit={handleLogin}>
                    <div className='register-box'>
                        <h2>Login</h2>

                        <div>
                            <p>Email</p>
                            <input
                                type="email"
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <p>Password</p>
                            <input
                                type='password'
                                placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='form-button'>
                            <button type="submit">Login</button>
                        </div>
                    </div>
                </form>
            </div>

          
        </div>
    );
}

export default Login;
