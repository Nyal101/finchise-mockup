"use client"

import * as React from "react"
import { Send } from "lucide-react"
import { DateRangePicker } from "@/components/date-range-picker"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"

interface Message {
  role: "user" | "assistant"
  content: string
  timestamp: Date
}

export default function ChatbotPage() {
  const [input, setInput] = React.useState("")
  const [messages, setMessages] = React.useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! I'm your AI assistant for franchise insights. How can I help you today?",
      timestamp: new Date()
    }
  ])
  
  const messagesEndRef = React.useRef<HTMLDivElement>(null)
  
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return
    
    // Add user message
    const newMessages: Message[] = [
      ...messages,
      {
        role: "user",
        content: input,
        timestamp: new Date()
      }
    ]
    
    setMessages(newMessages)
    setInput("")
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      const aiResponse = getAIResponse(input)
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content: aiResponse,
          timestamp: new Date()
        }
      ])
    }, 1000)
  }
  
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <main className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">AI Chatbot</h1>
        <DateRangePicker />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>FranchiseAI Assistant</CardTitle>
            <CardDescription>
              Ask questions about your franchise data and get AI-powered insights
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col space-y-4 h-[500px]">
              <div className="flex-1 overflow-y-auto p-4 space-y-4 border rounded-md">
                {messages.map((message, index) => (
                  <div 
                    key={index} 
                    className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div 
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        message.role === "user" 
                          ? "bg-primary text-primary-foreground" 
                          : "bg-muted"
                      }`}
                    >
                      <p>{message.content}</p>
                      <p className="text-xs opacity-50 mt-1">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>
              
              <div className="flex items-center space-x-2">
                <Input
                  placeholder="Type your message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  className="flex-1"
                />
                <Button size="icon" onClick={handleSendMessage}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Suggested Queries</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {suggestedQueries.map((query, index) => (
                <Button 
                  key={index} 
                  variant="outline" 
                  className="w-full justify-start text-left h-auto py-2 px-4"
                  onClick={() => {
                    setInput(query)
                  }}
                >
                  {query}
                </Button>
              ))}
            </div>
            
            <Separator className="my-6" />
            
            <div>
              <h3 className="text-sm font-medium mb-2">Recent Conversations</h3>
              <div className="space-y-2">
                {recentTopics.map((topic, index) => (
                  <div key={index} className="text-sm">
                    <p className="font-medium">{topic.title}</p>
                    <p className="text-muted-foreground text-xs">{topic.date}</p>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

// Sample AI responses based on input patterns
function getAIResponse(input: string): string {
  const lowerInput = input.toLowerCase()
  
  if (lowerInput.includes("sales") && lowerInput.includes("increase")) {
    return "Based on your current sales data, I recommend focusing on your top 3 performing menu items and creating a promotion bundle. This has shown to increase sales by approximately 15% across similar franchise locations."
  }
  
  if (lowerInput.includes("customer") && lowerInput.includes("retention")) {
    return "Your customer retention rate is currently at 68%. Implementing a loyalty program could potentially increase this to 75-80% based on industry benchmarks. Would you like me to suggest some loyalty program structures?"
  }
  
  if (lowerInput.includes("compare") || lowerInput.includes("performance")) {
    return "Store 2 is currently outperforming other locations with a 23% higher revenue and 12% better profit margin. The key differences appear to be in operational efficiency and staff training. Would you like a detailed breakdown?"
  }
  
  if (lowerInput.includes("cost") || lowerInput.includes("expense")) {
    return "Your highest expenses currently are inventory (34%), labor (28%), and rent (18%). There's an opportunity to optimize inventory management which could reduce costs by approximately 5-7% based on my analysis."
  }
  
  return "That's an interesting question. Based on the data available, I would need to perform a more detailed analysis. Would you like me to prepare a report on this topic?"
}

const suggestedQueries = [
  "How can I increase sales in Store 3?",
  "Compare performance across all stores",
  "What's the current customer retention rate?",
  "How can I reduce operational costs?",
  "Which menu items are most profitable?"
]

const recentTopics = [
  { title: "Staff Scheduling Optimization", date: "Today" },
  { title: "Inventory Waste Reduction", date: "Yesterday" },
  { title: "Marketing Campaign ROI", date: "3 days ago" }
] 