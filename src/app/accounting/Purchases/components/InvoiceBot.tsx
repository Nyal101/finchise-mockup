"use client"

import React, { useState, useEffect, useCallback } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Bot, Send } from 'lucide-react'

type InvoiceBotProps = {
  invoiceNumber: string
  invoiceStatus: string
  onSendMessage?: (message: string) => void
}

type Message = {
  id: string
  content: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const InvoiceBot: React.FC<InvoiceBotProps> = ({ 
  invoiceNumber, 
  invoiceStatus,
}) => {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  const generateInitialMessage = useCallback(() => {
    switch (invoiceStatus) {
      case "AI Processed":
        return `This invoice (#${invoiceNumber}) has been automatically processed. All data has been extracted and validated. Feel free to ask me about any details or make changes if needed.`
      case "Pending AI":
        return `Invoice #${invoiceNumber} is currently in the processing queue. I'll extract all the details shortly. You can check back soon or ask me to prioritize this document.`
      case "Needs Human Review":
        return `I've processed invoice #${invoiceNumber} but found some potential issues that need your review. Please check the highlighted fields and let me know if you need any help.`
      case "Duplicate?":
        return `I've flagged invoice #${invoiceNumber} as a potential duplicate. Please review and confirm if this is a unique invoice or if it should be marked as a duplicate.`
      default:
        return `I'm here to help with invoice #${invoiceNumber}. What would you like to know about this document?`
    }
  }, [invoiceNumber, invoiceStatus])

  useEffect(() => {
    // Reset messages when invoice changes
    const initialMessage: Message = {
      id: '1',
      content: generateInitialMessage(),
      sender: 'bot',
      timestamp: new Date()
    }
    setMessages([initialMessage])
  }, [invoiceNumber, invoiceStatus, generateInitialMessage])

  useEffect(() => {
    // Scroll to bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date()
    }
    
    setMessages(prev => [...prev, userMessage])
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm currently processing your question about invoice #${invoiceNumber}. As this is a demo, I'll provide more detailed responses in the production version.`,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b bg-blue-50/50 flex items-center">
        <Bot className="h-4 w-4 text-blue-600 mr-2" />
        <h3 className="font-medium text-sm">Invoice Assistant</h3>
      </div>
      <div className="flex-1 overflow-auto p-4 space-y-3">
        {messages.map(message => (
          <div 
            key={message.id} 
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[85%] px-3 py-2 rounded-lg text-sm ${
                message.sender === 'user' 
                  ? 'bg-blue-500 text-white rounded-br-none' 
                  : 'bg-gray-100 text-gray-800 rounded-bl-none'
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t flex">
        <Input
          placeholder="Ask about this invoice..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="h-9 mr-2 text-sm"
        />
        <Button 
          size="sm"
          onClick={handleSendMessage}
          disabled={!inputValue.trim()}
          className="h-9 px-3"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

export default InvoiceBot
