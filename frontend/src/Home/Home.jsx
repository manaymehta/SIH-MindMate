import React, { useState } from "react";
import "./Home.css";
import useAuthStore from '../../store/useAuthStore';

const Home = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    setInput("");

    // Show typing indicator
    setTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(input);
      setTyping(false);
      setMessages((prev) => [...prev, { sender: "bot", text: botResponse }]);
    }, 1500);
  };

  const getBotResponse = (userInput) => {
    const lower = userInput.toLowerCase();
    if (lower.includes("hello") || lower.includes("hi")) {
      return "Hello there! It's good to hear from you. How can I help you feel better today?";
    } else if (
      lower.includes("sad") ||
      lower.includes("anxious") ||
      lower.includes("stressed")
    ) {
      return "I'm sorry to hear you're feeling that way. It's okay to feel this way. Would you like to try a calming breathing exercise or perhaps write down your thoughts in the journal?";
    } else if (lower.includes("meditation")) {
      return "That's a great idea. I can guide you to a meditation session. Are you looking for something for relaxation, focus, or sleep?";
    } else if (lower.includes("thank")) {
      return "You're most welcome. Remember, I'm here whenever you need to talk. Take care of yourself.";
    } else {
      return "Thank you for sharing that with me. Could you tell me a little more about what's on your mind?";
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg
              className="w-8 h-8 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 
                   01-8.716-6.747M12 21c2.485 0 4.5-4.03 
                   4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 
                   3 12 3m0 0a8.997 8.997 0 
                   017.843 4.582M12 3a8.997 8.997 0 
                   00-7.843 4.582m15.686 0A11.953 
                   11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 
                   0A8.959 8.959 0 0121 12c0 
                   .778-.099 1.533-.284 2.253m0 0A17.919 
                   17.919 0 0112 16.5c-3.162 
                   0-6.133-.815-8.716-2.247m0 0A9.015 
                   9.015 0 013 12c0-1.605.42-3.113 
                   1.157-4.418"
              />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">Mind Mate</h1>
          </div>
          <div className="flex items-center space-x-4">
            <div>
              <button onClick={handleLogout}>Logout</button>
            </div>
            <a
              href="#"
              className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors shadow"
            >
              Sign Up
            </a>
          </div>
        </nav>
      </header>

      {/* Main */}
      <main className="flex-grow">
        {/* Hero */}
        <section className="py-20 md:py-32 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              A safe space for your thoughts.
            </h2>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Whatever's on your mind, you can tell me. I'm here to listen and
              help you find the right tools.
            </p>

            {/* Chatbot Input */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Hi, how are you feeling today?"
                  className="chatbot-input w-full py-4 px-6 text-lg text-gray-700 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-all duration-300"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-transform duration-200 hover:scale-110"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                </button>
              </div>
              <div className="chatbot-container"></div>

              {/* Chat Log */}
              {messages.length > 0 && (
                <div
                  id="chat-log"
                  className="mt-8 max-w-2xl mx-auto bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 h-96 overflow-y-auto flex flex-col space-y-4"
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`chat-bubble ${msg.sender === "user" ? "user-bubble" : "bot-bubble"
                        }`}
                    >
                      {msg.text}
                    </div>
                  ))}
                  {typing && (
                    <div className="chat-bubble bot-bubble" id="typing-indicator">
                      <div className="flex items-center justify-center space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"
                          style={{ animationDelay: "0.4s" }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="pb-20 md:pb-32">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature Cards */}
              {[
                {
                  title: "Guided Meditations",
                  desc: "Find calm and clarity with our library of guided sessions for stress, anxiety, and sleep.",
                  bg: "bg-teal-100",
                  icon: "text-teal-600",
                  path: "M12 18.75a6 6 0 006-6v-1.5a6 6 0 10-12 ...",
                },
                {
                  title: "Digital Journal",
                  desc: "Reflect on your day, process emotions, and track your progress in a private, secure space.",
                  bg: "bg-indigo-100",
                  icon: "text-indigo-600",
                  path: "M16.862 4.487l1.687-1.688a1.875 ...",
                },
                {
                  title: "Mood Tracker",
                  desc: "Log your moods to recognize patterns and understand your emotional landscape over time.",
                  bg: "bg-amber-100",
                  icon: "text-amber-600",
                  path: "M21 8.25c0-2.485-2.099-4.5-4.688 ...",
                },
                {
                  title: "Connect & Share",
                  desc: "Join community groups or connect with licensed therapists for professional support.",
                  bg: "bg-rose-100",
                  icon: "text-rose-600",
                  path: "M12 20.25c4.97 0 9-3.694 9-8.25s-4.03 ...",
                },
              ].map((card, i) => (
                <div
                  key={i}
                  className="feature-card bg-white p-8 rounded-2xl shadow-md flex flex-col items-center text-center"
                >
                  <div className={`${card.bg} p-4 rounded-full mb-4`}>
                    <svg
                      className={`w-8 h-8 ${card.icon}`}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d={card.path}
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-gray-600">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-100 border-t border-gray-200">
        <div className="container mx-auto px-6 py-8 text-center text-gray-600">
          <p>&copy; 2025 SereneMind. All rights reserved.</p>
          <div className="mt-4 flex justify-center space-x-6">
            <a href="#" className="hover:text-teal-600">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-teal-600">
              Terms of Service
            </a>
            <a href="#" className="hover:text-teal-600">
              Contact Us
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;