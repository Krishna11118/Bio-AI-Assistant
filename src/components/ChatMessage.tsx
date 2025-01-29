import type React from "react"
import type { Message } from "../types"

export const ChatMessage: React.FC<{ message: Message }> = ({ message }) => {
  const isUser = message.role === "user"

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div className={`max-w-[75%] ${isUser ? "bg-blue-600" : "bg-gray-800"} rounded-lg p-3`}>
        <p className="text-sm">{message.content}</p>
        <p className="text-xs text-gray-400 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  )
}

