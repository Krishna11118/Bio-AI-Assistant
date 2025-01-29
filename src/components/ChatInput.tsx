import type React from "react"
import { useState } from "react"
import { Send } from "lucide-react"

interface ChatInputProps {
  onSendMessage: (message: string) => void
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [message, setMessage] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (message.trim()) {
      onSendMessage(message)
      setMessage("")
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type your message..."
        className="flex-grow p-2 rounded-lg bg-gray-800 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="p-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
        aria-label="Send message"
      >
        <Send size={20} />
      </button>
    </form>
  )
}

