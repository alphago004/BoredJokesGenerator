import React, { useState } from 'react';
import { useNavigate  } from 'react-router-dom';
import { useUser } from './UserContext'; // Import the context

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();
    const { login } = useUser(); // Use the login function from UserContext.js

    const handleLogin = async () => {
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username,
                    password
                })
            });
            
            console.log('Response:', response);

            const data = await response.json();
            console.log('Received data:', data);
            
            if (data.message === "Logged in successfully!") {
                login();
                // Redirect to home page
                console.log('Navigating to home...');  // Debugging statement
                navigate("/")
            } else {
                setMessage(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (error) {
            setMessage(`Wrong Username or Password`);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            {message && <p>{message}</p>}
        </div>
    );
}

export default Login;
