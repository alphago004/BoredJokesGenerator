import './App.css';

import React, { useState } from 'react';
import { MdSentimentVeryDissatisfied, MdInsertEmoticon } from 'react-icons/md'; // Importing Icons

function App() {
    const [output, setOutput] = useState("");
const [countries, setCountries] = useState([]);  // Ensure this is declared
const [displayMode, setDisplayMode] = useState('');  // Ensure this is declared as well


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
                setOutput("Category: " +  data.category + "\n\n" + data.setup + "\n\n" + "=> "+data.delivery + "\n\n" );
            } else {
                setOutput(data.joke || "Error fetching joke.");
            }
        } catch (error) {
            setOutput("Hold on!! Take a breath!");
        }
    }

    const getCountryInfo = async () => {
        try {
            const response = await fetch('http://localhost:3001/country');
            const data = await response.json();
            setCountries(data);
            setDisplayMode('country');
        } catch (error) {
            setOutput("Error fetching country info.");
        }
    }

    return (
        <div className="App">
            {displayMode === 'country' ? (
                <div>
                    {countries.map((country, index) => (
                        <div key={index}>
                            <h3>{country.name}</h3>
                            <p>Capital: {country.capital}</p>
                            <p>Language: {country.language}</p>
                            <img src={country.flag} className='small-flag' alt={`${country.name} flag`} />
                        </div>
                    ))}
                </div>
            ) : (
                <textarea value={output} readOnly />
            )}
            <div>
                <button onClick={getBoredActivity}>
                    <MdSentimentVeryDissatisfied /> Get Bored Activity
                </button>
                <button onClick={getJoke}>
                    <MdInsertEmoticon /> Get Joke
                </button>
                <button onClick={getCountryInfo}>
                    <MdInsertEmoticon /> Get Country Info
                </button>
            </div>
        </div>
    );
}

export default App;
