import "./App.css";

import React, { useState } from "react";
import { MdSentimentVeryDissatisfied, MdInsertEmoticon } from "react-icons/md"; // Importing Icons

function App() {
  const [country, setCountry] = useState(null);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [score, setScore] = useState(0);

  const getCountryInfo = async () => {
    try {
      const response = await fetch("http://localhost:3001/country");
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
      setScore((prevScore) => prevScore - 1);
    }
  };

  return (
    <div className="App">
      <div>
        {" "}
        {/* This div will contain your quiz content */}
        {country ? (
          <div>
            <h3>What's the capital of {country.name}?</h3>
            <img
              src={country.flag}
              className="small-flag"
              alt={`${country.name} flag`}
            />
            {country.options.map((option, index) => (
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
                disabled={!!selectedAnswer} // disable the button if an answer has been selected
              >
                {option}
              </button>
            ))}

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
        {" "}
        {/* This div will display the score */}
        <h3>Score</h3>
        <p>{score}</p>
      </div>
    </div>
  );
}

export default App;
