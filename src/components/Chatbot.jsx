import React, { useState, useRef, useEffect } from "react";
import { Send, Loader, MessageCircle, X } from "lucide-react";
import { respondToUser } from "../services/geminiAI";

export default function Chatbot({ isOpen, onClose, menuItems = [] }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      setMessages([
        {
          id: 1,
          text: "Hi! 👋 I'm your AI Assistant from RestaurantAI. What can I help you with today?",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isOpen]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = {
      id: Date.now(),
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

        try {
      const inputLower = input.toLowerCase();

      // If the user asks for the menu or a specific category, use the local responder
      const categoryKeywords = ["menu", "appetizers", "main", "main course", "desserts", "dessert", "beverages", "drinks", "drink"];
      const isMenuQuery = categoryKeywords.some(k => inputLower.includes(k));

      if (isMenuQuery) {
        const reply = respondToUser(input, menuItems);
        const botMessage = {
          id: Date.now() + 1,
          text: reply,
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
        return;
      }

      // Fallback simulated AI response (keeps existing behavior until remote API wired)
      setTimeout(() => {
        const botMessage = {
          id: Date.now() + 1,
          text: generateBotResponse(input),
          sender: "bot",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, botMessage]);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "Sorry, I encountered an error. Please try again.",
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 z-50 flex items-end sm:items-center justify-center pointer-events-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full sm:w-96 h-screen sm:h-[600px] flex flex-col pointer-events-auto overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-linear-to-r from-orange-600 to-orange-500 text-white">
          <div className="flex items-center gap-3">
            <MessageCircle size={24} />
            <div>
              <h3 className="font-bold text-lg">AI Assistant</h3>
              <p className="text-xs text-orange-100">Always here to help</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-orange-700 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-y-auto p-4 bg-linear-to-b from-gray-50 to-white space-y-4">
          {messages.map(msg => (
            <div
              key={msg.id}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-3 rounded-lg whitespace-pre-wrap text-sm leading-relaxed ${
                  msg.sender === "user"
                    ? "bg-orange-600 text-white rounded-br-none shadow-md"
                    : "bg-white text-gray-800 border-2 border-gray-200 rounded-bl-none shadow-sm"
                }`}
              >
                <p>{msg.text}</p>
                <p className={`text-xs mt-2 ${msg.sender === "user" ? "text-orange-100" : "text-gray-500"}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="bg-white border-2 border-gray-200 px-4 py-3 rounded-lg rounded-bl-none flex items-center gap-2 shadow-sm">
                <Loader size={16} className="animate-spin text-orange-600" />
                <p className="text-sm text-gray-600">AI is thinking...</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t-2 border-gray-200 bg-white p-4">
          <form onSubmit={sendMessage} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-orange-600 text-sm"
              disabled={loading}
              autoFocus
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-md"
            >
              <Send size={18} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
