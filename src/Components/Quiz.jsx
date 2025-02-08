import React, { useEffect, useState } from "react";
import Quizgame from "./Quizgame";

const Quiz = () => {
  const [questions, setQuestions] = useState([]);
  const [APIData, setAPIData] = useState({});
  const [userName, setUserName] = useState("");
  const [startQuiz, setStartQuiz] = useState(false);

  async function fetchData() {
    const apiUrl = "https://api.jsonserve.com/Uw5CrX";
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(apiUrl);

    try {
      const response = await fetch(proxyUrl);
      const data = await response.json();
      setAPIData(data);

      // Extracting questions and optons from data
      const formattedQuestions = data.questions.map((q) => ({
        question: q.description,
        options: q.options,
        correct: q.options.find((opt) => opt.is_correct).description,
      }));
      // assigning formattedquestions to questions useState
      setQuestions(formattedQuestions);
    } catch (error) {
      console.log(error);
    }
  }
  
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#168E8C] to-[#1FA2FF] flex flex-col">
      <div className="bg-white py-3 px-6 shadow-md fixed top-0 left-0 w-full flex justify-center items-center">
        <img src="logo.png" className="w-[180px]" alt="Quiz Logo" />
      </div>

      <div className="flex flex-1 justify-center items-center pt-24"> 
        {!startQuiz ? (
          <div className="bg-white p-8 rounded-lg shadow-xl w-[90%] md:w-[400px] text-center">
            <h2 className="text-2xl font-bold text-gray-800">Enter Your Name</h2>
            <input
              type="text"
              className="mt-4 p-3 border rounded-lg w-full text-center text-gray-700 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Your Name..."
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
            <button
              className={`mt-4 w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md transition duration-300 ${
                userName.trim() ? "hover:bg-blue-700" : "opacity-50 cursor-not-allowed"
              }`}
              disabled={!userName.trim()}
              onClick={() => setStartQuiz(true)}
            >
              Start Quiz 🚀
            </button>
          </div>
        ) : (
          <Quizgame questions={questions} APIData={APIData} userName={userName} setUserName={setUserName} setStartQuiz={setStartQuiz} />
        )}
      </div>
    </div>
  );
};

export default Quiz;
