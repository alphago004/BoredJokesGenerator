import "./App.css";

import React, { useState, useEffect } from "react";
import { MdSentimentVeryDissatisfied, MdInsertEmoticon } from "react-icons/md"; // Importing Icons

function App() {
  /************************ Hooks    ************************/
  const [country, setCountry] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);
  const [highestScore, setHighestScore] = useState(
    localStorage.getItem("highestScore")
      ? parseInt(localStorage.getItem("highestScore"))
      : 0
  );

  // New states for authentication
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [userId, setUserId] = useState(null); // Add this hook to keep track of the logged-in user's ID


  const currentScore = score;
  /********************  Hooks ***************************/
  // This hook fetches the highest score from the database
  useEffect(() => {
    fetchHighestScore();
  }, []);

  // This hook checks and updates the score if needed
  useEffect(() => {
    if (score > highestScore) {
      localStorage.setItem("highestScore", score.toString());
      setHighestScore(score); // Update the state
      updateScore();
    }
  }, [score]);

  // This hook to handle user registration and authentication
  const logout = () => {
    setIsAuthenticated(false);
    setUsername("");
    setPassword("");
  };

  /*********************End of Hooks **********************/

  /************************* Fnctions ***********************/
  // This function to fetch the information about the countries from the backend server.
  const getCountryInfo = async () => {
    try {
      const response = await fetch("http://localhost:3001/country");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setCountry(data);
      setIsCorrect(null); // Reset the answer state
    } catch (error) {
      console.log("Error fetching country info.");
    }
  };

  //Function to update a new country info. It loads a new question from the backend server
  const loadNewQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    getCountryInfo();
  };

  // Function to handle the option and answer logic.
  const handleAnswer = (answer) => {
    if (selectedAnswer) return; // If an answer is already selected, exit the function

    setSelectedAnswer(answer); // Set the selected answer

    const correct = answer === country.capital;
    setIsCorrect(correct);

    if (correct) {
      setScore((prevScore) => prevScore + 2);
    } else {
      setScore((prevScore) => 0);
    }
  };

  //Function to update the highest score in the database if greater than which is on the DB*/
  const updateScore = async () => {
    try {
      if (userId) { // Ensure that a user is logged in
        const response = await fetch(`http://localhost:3001/score/${userId}`, { // Use template string to embed userId
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: "uniqueUserId", // Later implement a user authentication system to make this dynamic
            highestScore: score,
          }),
        });

        const data = await response.json();
        if (data.message) {
          console.log(data.message);
        }
      }
    } catch (error) {
      console.log("Error updating score:", error);
    }
};


  //Function to fetch the highest score from the database */
  const fetchHighestScore = async () => {
    try {
      const response = await fetch("http://localhost:3001/score/score/${userId}"); // Replace 'uniqueUserId' with the user's ID later
      const fetchedScore = await response.json();
      setHighestScore(fetchedScore);
      localStorage.setItem("highestScore", fetchedScore.toString());
    } catch (error) {
      console.log("Error fetching highest score:", error);
    }
  };

  //Fucntion to login the user  -> (Need to replace this with a better method)
  const login = () => {
    if (username && password) {
      setIsAuthenticated(true);
    }
  };

  // Function to register a new user -> (Need to replace this with a better method)
  const register = () => {
    if (username && password) {
      // Register the user (e.g., save to database)
      setIsAuthenticated(true);
    }

    /************************* End of Fuctions ************************/

// Condition to register a new user -> (Need to replace this with a better method)
    if(!isAuthenticated) {
      return (
          <div className="App">
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
              <button onClick={login}>Login</button>
              <button onClick={register}>Register</button>
          </div>
      );
    }

  };

  

  return (
    <div className="App">
      <div>
        {country && country.name && country.flag ? (
          <div>
            <h3>What's the capital of {country.name}?</h3>
            <img
              src={country.flag}
              className="small-flag"
              alt={`${country.name} flag`}
            />
            {country.options && country.options.length > 0 ? (
              country.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(option)}
                  className={`option ${
                    selectedAnswer === option
                      ? option === country.capital
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  style={{
                    backgroundColor:
                      selectedAnswer === option
                        ? option === country.capital
                          ? "green"
                          : "red"
                        : "",
                  }}
                  disabled={!!selectedAnswer}
                >
                  {option}
                </button>
              ))
            ) : (
              <p>No options available.</p>
            )}

            {isCorrect === false && (
              <div className="correct-answer-section">
                <p>
                  The correct answer is: <strong>{country.capital}</strong>
                </p>
              </div>
            )}

            {isCorrect !== null && (
              <div className="feedback-section">
                {isCorrect ? (
                  <MdInsertEmoticon color="#00C851" size="2em" />
                ) : (
                  <MdSentimentVeryDissatisfied color="#FF3B30" size="2em" />
                )}
                <button onClick={loadNewQuestion}>Next</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={getCountryInfo}>Start Quiz</button>
        )}
      </div>
      <div className="score-container">
        <h3>Score</h3>
        <p>{score}</p>
        <div className="score-container">
          <h3>Highest Score</h3>
          <p>{highestScore}</p>
        </div>
      </div>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default App;
