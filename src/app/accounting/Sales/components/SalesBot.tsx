import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface SalesBotProps {
  receiptNumber: string;
  receiptStatus: string;
}

export default function SalesBot({ receiptNumber, receiptStatus }: SalesBotProps) {
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [input, setInput] = React.useState("");
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Initialize with a welcome message
  React.useEffect(() => {
    const initialMessage: Message = {
      id: "init-1",
      text: `Hello! I'm your Sales AI assistant. How can I help you with sales report ${receiptNumber}?`,
      sender: "bot",
      timestamp: new Date(),
    };
    setMessages([initialMessage]);
  }, [receiptNumber]);

  // Scroll to bottom when messages change
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (input.trim() === "") return;

    // Add user message
    const userMessage: Message = {
      id: `user-${Date.now()}`,
      text: input,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    // Simulate bot response based on message content
    setTimeout(() => {
      let botResponse = "";
      const lowerCaseInput = input.toLowerCase();

      if (lowerCaseInput.includes("status") || lowerCaseInput.includes("progress")) {
        botResponse = `The current status of sales report ${receiptNumber} is "${receiptStatus}".`;
      } else if (lowerCaseInput.includes("source") || lowerCaseInput.includes("pos")) {
        botResponse = `This sales report comes from a Point of Sale system or delivery platform. It includes sales data that has been automatically processed.`;
      } else if (lowerCaseInput.includes("edit") || lowerCaseInput.includes("change")) {
        botResponse = `To edit this sales report, click the "Edit" button at the top of the sales details panel. You can modify line items, add notes, or update other information.`;
      } else if (lowerCaseInput.includes("tax") || lowerCaseInput.includes("vat")) {
        botResponse = `The VAT for this sales report has been automatically calculated. If you notice any discrepancies, you can edit the line items to correct the values.`;
      } else if (lowerCaseInput.includes("export") || lowerCaseInput.includes("download")) {
        botResponse = `You can export this sales report by clicking on the dropdown menu in the top-right corner of the sales details panel. You can choose between PDF, CSV, or Excel formats.`;
      } else if (lowerCaseInput.includes("journal") || lowerCaseInput.includes("accounting")) {
        botResponse = `The journal entries for this sales report will be automatically created when you process the report. You can review and adjust them before finalizing.`;
      } else {
        botResponse = `I'm sorry, I don't have specific information about that question. Would you like me to help with something else regarding sales report ${receiptNumber}?`;
      }

      const botMessage: Message = {
        id: `bot-${Date.now()}`,
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
    }, 1000);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b">
        <h3 className="font-semibold">Sales AI Assistant</h3>
        <p className="text-xs text-muted-foreground">Ask questions about this sales report</p>
      </div>
      
      <div className="flex-1 overflow-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.sender === "user"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-100 text-gray-900"
              }`}
            >
              <p>{message.text}</p>
              <p className="text-xs mt-1 opacity-70">
                {message.timestamp.toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            placeholder="Ask a question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
} 