import "./App.css";

import React, { useState } from "react";
import { BrowserRouter as Router, Link, Route, Routes } from "react-router-dom";
import { MdSentimentVeryDissatisfied, MdInsertEmoticon } from "react-icons/md"; // Importing Icons
import Login from "./components/Login"; // Import the Login component
import Register from "./components/Register"; // Import the Register component

function App() {
  const [country, setCountry] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const currentScore = score;
  const highestScore = localStorage.getItem("highestScore")
    ? parseInt(localStorage.getItem("highestScore"))
    : 0;

  if (currentScore > highestScore) {
    localStorage.setItem("highestScore", currentScore.toString());
  }

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

  const loadNewQuestion = () => {
    setSelectedAnswer(null);
    setIsCorrect(null);
    getCountryInfo();
  };

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

  return (
    <Router>
      <div className="App">
        {/* Navigation Bar */}
        <nav>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/">Home</Link>
        </nav>

        {/* Routing Logic */}
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <>
                <div>
                  {country && country.name && country.flag ? (
                    <div>
                      <h3 style={{marginTop:'40px', marginBottom: '30px'}}>What's the capital of {country.name}?</h3>
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
                            The correct answer is:{" "}
                            <strong>{country.capital}</strong>
                          </p>
                        </div>
                      )}

                      {isCorrect !== null && (
                        <div className="feedback-section">
                          {isCorrect ? (
                            <MdInsertEmoticon color="#00C851" size="2em" />
                          ) : (
                            <MdSentimentVeryDissatisfied
                              color="#FF3B30"
                              size="2em"
                            />
                          )}
                          <button onClick={loadNewQuestion}>Next</button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <button style={{marginTop:'30px'}} onClick={getCountryInfo}>Start Quiz</button>
                  )}
                </div>

                {/* Score Container */}
                <div className="score-container">
                  <h3>Score</h3>
                  <p>{score}</p>
                  <div className="score-container">
                    <h3>Highest Score</h3>
                    <p>{highestScore}</p>
                  </div>
                </div>
              </>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
