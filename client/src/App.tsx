"use client"

import React, { useState, useCallback, useRef, useEffect } from "react"
import type { Message } from "./types"
import { ChatMessage } from "./components/ChatMessage"
import { ChatInput } from "./components/ChatInput"
import { MessageSquare } from "lucide-react"
import axios from "axios"
import config from "./config"

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm the Krishna's assistant. How can I help you today?",
      role: "assistant",
      timestamp: new Date(),
    },
  ])
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = (behavior: ScrollBehavior = "auto") => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }

  useEffect(() => {
    if (isLoading) {
      scrollToBottom("smooth")
    } else {
      scrollToBottom()
    }
  }, [messages, isLoading, scrollToBottom]) // Added scrollToBottom to dependencies

  const handleSendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      content,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const response = await axios.post(`${config.endpoint}`, {
        message: content,
      })

      const botMessage: Message = {
        ...response.data,
        timestamp: new Date(response.data.timestamp),
      }
      setMessages((prev) => [...prev, botMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
        role: "assistant",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <div className="flex flex-col h-screen md:px-[25%] sm:px-[0] bg-gray-950 text-gray-100">
      {/* Header */}
      <div className="flex items-center justify-center gap-4 p-4 bg-gray-900 shadow-lg">
        <MessageSquare className="text-blue-400" size={32} />
        <h1 className="text-xl sm:text-2xl font-bold text-blue-400">Krishna's Gen AI Assistant</h1>
      </div>

      {/* Chat Container */}
      <div className="flex-grow overflow-hidden flex flex-col bg-gray-900">
        {/* Messages */}
        <div ref={chatContainerRef} className="flex-grow overflow-y-auto p-4 space-y-4 custom-scrollbar">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="flex justify-center">
              <div className="animate-pulse text-blue-400">Thinking...</div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="border-t border-gray-800 p-4 bg-gray-900">
          <ChatInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  )
}

