import React, { useState } from "react";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleRegister = async () => {
    try {
        const response = await fetch('http://localhost:3001/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username,
                password
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Network response was not ok: ${response.statusText}. Details: ${errorText}`);
        }

        const data = await response.json();
        
        if (data.message) {
            setMessage(data.message);
        } else {
            setMessage('Successful registration!');
        }
        
    } catch (error) {
        setMessage(`Error during registration: ${error.message}`);
    }
};


return (
    <div className="input-container">
      <h2>Register</h2>
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
      <button className="primary-button" onClick={handleRegister}>Register</button>
      {message && <p>{message}</p>}
    </div>
);

}

export default Register;
