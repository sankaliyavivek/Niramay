import React, { useState } from 'react'
import axios from  'axios'
import { useNavigate } from 'react-router-dom';

function Login() {
      const [email, setEmail] = useState('');
        const [password, setPassword] = useState('');

            const navigate = useNavigate();

        const handelLogin = async(e) => {
            e.preventDefault();
               const data = await axios.post('http://localhost:9000/user/login',
                {email,password},
                { withCredentials: true}
               )
            //    console.log(data.data.user.name)
               localStorage.setItem('username',data.data.user.name)
               alert('login successfully!')
               navigate('/')
               window.location.reload();

        }
  return (
    <div>
       <div className='register-form'>
                <form onSubmit={handelLogin}>
                    <div className='register-box'>
                        <h2>Login</h2>

                        <div>
                            <p>Email</p>
                            <input type="email" name="" placeholder='enter your email'
                                value={email}
                                onChange={(e) => { setEmail(e.target.value) }}
                            />
                        </div>


                        <div className=''>
                            <p>Password</p>
                            <input type='password' placeholder='Enter your password'
                                value={password}
                                onChange={(e) => { setPassword(e.target.value) }}
                            ></input>

                        </div>
                        <div className='form-button'>
                            <button>Sign Up</button>
                        </div>
                    </div>
                </form>
            </div>
    </div>
  )
}

export default Login
