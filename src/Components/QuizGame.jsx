import { useEffect, useState } from "react";
import { FadeLoader } from "react-spinners";

const Quizgame = ({ questions, APIData, userName,setStartQuiz,setUserName}) => {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15 * 60); // 15 minutes in seconds

  useEffect(() => {
    if (timeLeft > 0 && !completed) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCompleted(true);
    }
  }, [timeLeft, completed]);

  // loading spinner while API fetch 
  if (questions.length === 0) {
    return (
      <p className="text-center text-white">
        <FadeLoader />
      </p>
    );
  }
// formatting time from seconds to minutes:seconds
  const formatTime = (seconds) => {
    let minutes = Math.floor(seconds / 60);
    let secs = seconds % 60;
    return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const handleAnswer = (option) => {
    setSelected(option);
    if (option.is_correct) {
      setScore(score + 10);
    }
  };
// handle next question button
  const nextQuestion = () => {
    if (currentQ + 1 < questions.length) {
      setCurrentQ(currentQ + 1);
      setSelected(null);
    } else {
      setCompleted(true);
    }
  };
// handle restart button
  const restartQuiz = () => {
    setStartQuiz(false)
    setCurrentQ(0);
    setSelected(null);
    setScore(0);
    setCompleted(false);
    setUserName("")
    setTimeLeft(15 * 60);
  };

  // handle quiz completion screen
  if (completed) {
    let resultMessage = score < 30 
      ? "You need to improve! 💡 Keep practicing!" 
      : score < 70 
      ? "You are doing better! 🚀 Keep it up!" 
      : "Great job! 🎯 You're a quiz master!";

    return (
      <div className="text-center text-white">
        <h2 className="text-3xl font-bold">Quiz Completed! 🎉</h2>
        <p className="text-xl">Well done, {userName}!</p>
        <p className="text-xl">Your Score: {score} XP🔥</p>
        <p className="text-xl font-semibold">{resultMessage}</p>
        <button
          onClick={restartQuiz}
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
        >
          Restart Quiz
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#222] text-white px-8 py-6 w-[90%] md:w-[600px] rounded-lg shadow-xl relative">
      <div className="absolute right-4 text-lg max-sm:text-base font-semibold bg-red-600 px-3 py-1 rounded">
        ⏳ {formatTime(timeLeft)}
      </div>
      <p className="text-lg w-full capitalize text-white mb-2">
        <span>Welcome {userName}</span>
      </p>
      <div className="text-center flex flex-col gap-2">
        <h2 className="font-bold text-3xl max-sm:text-2xl text-[#00FFC6]">{APIData.title}</h2>
      </div>
      <div className="p-4 max-sm:p-1 max-sm:py-4">
        <h2 className="text-xl max-sm:text-base font-semibold">
          Q. {questions[currentQ].question}
        </h2>
        <div className="mt-4 space-y-2">
          {questions[currentQ].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              disabled={selected !== null}
              className={`block w-full p-3 max-sm:py-2 rounded-lg border transition duration-300 text-lg 
                  ${
                    selected === option
                      ? option.is_correct
                        ? "bg-green-500 text-black"
                        : "bg-red-500 text-white"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
            >
              {option.description}
            </button>
          ))}
        </div>
        <div className="flex justify-between items-center mt-6">
          <span className="text-lg text-gray-400">
            {currentQ + 1}/{questions.length}
          </span>
          <button
            onClick={nextQuestion}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md transition duration-300"
            disabled={selected === null}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default Quizgame;
