import React, { useState } from 'react'
import axios from 'axios'
// import { useNavigate } from 'react-router-dom';

const API_URL = process.env.REACT_APP_BACKEND_API_URL || "https://localhost:9000";
function Login({ onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(
                `${API_URL}/user/login`,
                { email, password },
                { withCredentials: true }
            );
            
            localStorage.setItem('username', response.data.user.name);
            localStorage.setItem('token', response.data.token);

            // ✅ Pass data to App.js
            onLoginSuccess(response.data.user.name, response.data.token);

            alert('Login successfully!');
        } catch (error) {
            alert('Invalid email or password');
        }
    }

    return (
        <div>
            <div className='register-form'>
                <form onSubmit={handleLogin}>
                    <div className='register-box'>
                        <h2>Login</h2>

                        <div>
                            <p>Email</p>
                            <input type="email" placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        <div>
                            <p>Password</p>
                            <input type='password' placeholder='Enter your password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>

                        <div className='form-button'>
                            <button type="submit" >Login</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Login;
