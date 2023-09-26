import React, { useState } from 'react';

function App() {
    const [output, setOutput] = useState("");

    const getBoredActivity = async () => {
        try {
            let response = await fetch('http://localhost:3001/bored');
            let data = await response.json();
            setOutput(data.activity);
        } catch (error) {
            setOutput("Error fetching activity.");
        }
    }

    const getJoke = async () => {
        try {
            let response = await fetch('http://localhost:3001/joke');
            let data = await response.json();
            if (data.setup && data.delivery) {
                setOutput(data.setup + " " + data.delivery);
            } else {
                setOutput(data.joke || "Error fetching joke.");
            }
        } catch (error) {
            setOutput("Error fetching joke.");
        }
    }

    return (
        <div className="App">
            <button onClick={getBoredActivity}>Get Bored Activity</button>
            <button onClick={getJoke}>Get Joke</button>
            <textarea value={output} readOnly />
        </div>
    );
}

export default App;
