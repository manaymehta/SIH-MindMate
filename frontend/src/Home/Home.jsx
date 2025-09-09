import React, { useState, useEffect, useRef } from "react";
import "./Home.css";
import useAuthStore from '../../store/useAuthStore';

const Home = () => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  // MODIFIED: State now matches the Gemini API format for conversation history.
  // We'll initialize with a welcome message from the bot.
  const [messages, setMessages] = useState([
    {
      role: 'model', // 'model' is used for the bot's responses
      parts: ["Hello! I'm Mind Mate, your wellness assistant. How are you feeling today?"]
    }
  ]);

  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);

  const chatLogRef = useRef(null);

  useEffect(() => {
    // Scroll to the bottom of the chat log when new messages appear
    if (chatLogRef.current) {
      chatLogRef.current.scrollTop = chatLogRef.current.scrollHeight;
    }
  }, [messages, typing]);

  const handleSendMessage = async () => {
    const trimmedInput = input.trim();
    if (trimmedInput === "") return;

    // 1. Create the new user message in the correct format
    const userMessage = {
      role: 'user',
      parts: [trimmedInput]
    };

    // 2. Create the updated history to send to the API
    const updatedHistory = [...messages, userMessage];
    
    // 3. Update the UI immediately for a responsive feel
    setMessages(updatedHistory);
    setInput("");
    setTyping(true);

    try {
      // 4. Make the API call with the new data structure
      const response = await fetch('http://localhost:8000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // MODIFIED: Send the entire history array wrapped in a "history" key
        body: JSON.stringify({ history: updatedHistory }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Network response was not ok');
      }

      const data = await response.json(); // The backend returns { "reply": "..." }

      // 5. Create the new bot message and add it to the state
      const botMessage = {
        role: 'model',
        parts: [data.reply]
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("Failed to fetch bot reply:", error);
      const errorMessage = {
        role: 'model',
        parts: [`Sorry, an error occurred: ${error.message}`]
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setTyping(false);
    }
  };


  return (
    <div className="min-h-screen flex flex-col text-gray-800">
      {/* Header (No changes here) */}
      <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50">
        <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <svg className="w-8 h-8 text-teal-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
            </svg>
            <h1 className="text-2xl font-bold text-gray-800">MindWell</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button onClick={handleLogout} className="text-gray-600 hover:text-teal-600">Logout</button>
            <a href="#" className="bg-teal-500 text-white px-4 py-2 rounded-full hover:bg-teal-600 transition-colors shadow">Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <section className="py-20 md:py-32 text-center">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">A safe space for your thoughts.</h2>
            <p className="text-lg md:text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
              Whatever's on your mind, you can tell me. I'm here to listen and help you find the right tools.
            </p>

            <div className="max-w-2xl mx-auto relative">
              {/* Chat Log */}
              {/* MODIFIED: The chat log div is now separate and always visible when messages exist */}
              <div
                ref={chatLogRef}
                id="chat-log"
                className="mb-4 bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-4 sm:p-6 h-96 overflow-y-auto flex flex-col space-y-4"
              >
                {messages.map((msg, idx) => (
                  // MODIFIED: Logic now uses 'role' and 'parts'
                  <div
                    key={idx}
                    className={`chat-bubble ${msg.role === "user" ? "user-bubble" : "bot-bubble"}`}
                  >
                    {msg.parts[0]}
                  </div>
                ))}
                {typing && (
                  <div className="chat-bubble bot-bubble" id="typing-indicator">
                    <div className="flex items-center justify-center space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                )}
              </div>

              {/* Chatbot Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tell me what's on your mind..."
                  className="chatbot-input w-full py-4 px-6 text-lg text-gray-700 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 transition-all duration-300"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-teal-500 text-white p-3 rounded-full hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2 transition-transform duration-200 hover:scale-110"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Features & Footer (No changes here) */}
        {/* ... */}
      </main>
    </div>
  );
}

export default Home;