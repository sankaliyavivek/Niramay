import React, { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom';

function Register() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:9000/user/register', {
                name,
                email,
                password
            }, {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true
            });

            console.log(response.data);
            alert('Registered successfully! Now you can login.');
            navigate('/login');
        } catch (error) {
            console.error('Error:', error.response.data);
            alert(error.response.data.msg || 'Registration failed');
        }
    }

    return (
        <div className='section'>
            <div className='register-form'>
                <form onSubmit={handleSubmit}>
                    <div className='register-box'>
                        <h2>Register</h2>
                        <div>
                            <p>Name</p>
                            <input type='text' placeholder='Enter your username'
                                value={name}
                                onChange={(e) => { setName(e.target.value) }}
                            />
                        </div>

                        <div>
                            <p>Email</p>
                            <input type="email" placeholder='Enter your email'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>

                        <div>
                            <p>Password</p>
                            <input type='password' placeholder='Enter your password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            />
                        </div>
                        <div className='form-button'>
                            <button type='submit'>Sign Up</button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Register;
