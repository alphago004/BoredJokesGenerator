import React, { useState } from 'react';
import { MdSentimentVeryDissatisfied, MdInsertEmoticon } from 'react-icons/md'; // Importing Icons

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
                setOutput(data.setup + "\n\n" + "=> "+data.delivery);
            } else {
                setOutput(data.joke || "Error fetching joke.");
            }
        } catch (error) {
            setOutput("Hold on!! Take a breath!");
        }
    }

    return (
        <div className="App">
            <textarea value={output} readOnly />
            <div>
                <button onClick={getBoredActivity}>
                    <MdSentimentVeryDissatisfied /> Get Bored Activity
                </button>
                <button onClick={getJoke}>
                    <MdInsertEmoticon /> Get Joke
                </button>
            </div>
        </div>
    );
}

export default App;
