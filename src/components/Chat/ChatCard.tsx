"use client";
import { useState } from "react";

const ChatCard = () => {
  // Preload dummy messages
  const [messages, setMessages] = useState([
    { sender: "User", text: "Hello, I need help with my account." },
    { sender: "Admin", text: "Sure, how can I assist you today?" },
    { sender: "User", text: "I’m unable to reset my password." },
    { sender: "Admin", text: "Let me guide you through the process." },
  ]);
  const [input, setInput] = useState("");
  const [selectedUser, setSelectedUser] = useState("John Doe");

  const users = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Emily Davis" },
    { id: 4, name: "Michael Brown" },
  ];

  const handleSendMessage = () => {
    if (input.trim() !== "") {
      setMessages([...messages, { sender: "Admin", text: input }]);
      setInput("");
    }
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <div className="w-1/4 border-r border-gray-300 bg-gray-100">
        <div className="p-4 text-lg font-bold">Users</div>
        <ul className="h-[calc(100%-4rem)] divide-y divide-gray-300 overflow-y-auto">
          {users.map((user) => (
            <li
              key={user.id}
              onClick={() => setSelectedUser(user.name)}
              className={`cursor-pointer p-4 ${
                selectedUser === user.name
                  ? "bg-blue-100 font-bold"
                  : "hover:bg-gray-200"
              }`}
            >
              {user.name}
            </li>
          ))}
        </ul>
      </div>

      {/* Chat Card */}
      <div className="flex flex-1 flex-col p-4">
        <div className="chat-container flex h-full flex-col rounded-lg border border-gray-300 shadow-md">
          {/* Header */}
          <div className="chat-header border-b bg-gray-100 px-4 py-3 font-bold">
            Chat with {selectedUser}
          </div>

          {/* Messages Section */}
          <div className="chat-messages flex-1 overflow-y-auto px-4 py-3">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.sender === "Admin" ? "justify-end" : "justify-start"
                } mb-2`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    message.sender === "Admin"
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
          </div>

          {/* Input Section */}
          <div className="chat-input border-t px-4 py-3">
            <div className="flex items-center">
              <input
                type="text"
                placeholder="Type a message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 rounded-lg bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatCard;
