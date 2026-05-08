'use client';

import { useState, useRef, useEffect } from 'react';
import { ChatMessage as ChatMessageType, AIRecommendation } from '@/types/ai';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { AIRecommendations } from './AIRecommendations';
import { SuggestedSlots } from './SuggestedSlots';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Bot, Sparkles } from 'lucide-react';

interface AIChatProps {
  initialRecommendations?: AIRecommendation[];
}

export function AIChat({ initialRecommendations = [] }: AIChatProps) {
  const [messages, setMessages] = useState<ChatMessageType[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: 'Hello! I\'m your AI booking assistant. I can help you:\n\n• Book a new appointment\n• Check available slots\n• Reschedule or cancel\n• Answer questions about our services\n\nWhat would you like to do?',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>(initialRecommendations);
  const [suggestedSlots, setSuggestedSlots] = useState<string[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (content: string) => {
    const userMessage: ChatMessageType = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setSuggestedSlots([]);

    try {
      // TODO: Replace with actual API call
      // const response = await fetch('/api/ai/chat', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ message: content }),
      // });
      // const data = await response.json();

      // Simulate AI response
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const aiResponse = simulateAIResponse(content);

      const assistantMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      if (aiResponse.suggestedSlots) {
        setSuggestedSlots(aiResponse.suggestedSlots);
      }
    } catch {
      const errorMessage: ChatMessageType = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSlotSelect = (slot: string) => {
    handleSendMessage(`I'd like to book the ${slot} slot`);
    setSuggestedSlots([]);
  };

  const handleAcceptRecommendation = (rec: AIRecommendation) => {
    handleSendMessage(`I'd like to book ${rec.service?.name} with ${rec.master?.name || 'any available master'}`);
    setRecommendations((prev) => prev.filter((r) => r.id !== rec.id));
  };

  const handleDismissRecommendation = (id: string) => {
    setRecommendations((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <Card className="h-[600px] flex flex-col">
      <CardHeader className="border-b">
        <CardTitle className="flex items-center gap-2 text-lg">
          <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
            <Bot size={18} className="text-purple-600" />
          </div>
          <span>AI Booking Assistant</span>
          <Sparkles size={16} className="text-purple-500" />
        </CardTitle>
      </CardHeader>

      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {recommendations.length > 0 && (
            <AIRecommendations
              recommendations={recommendations}
              onAccept={handleAcceptRecommendation}
              onDismiss={handleDismissRecommendation}
            />
          )}

          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {isLoading && (
            <ChatMessage
              message={{
                id: 'loading',
                role: 'assistant',
                content: '',
                timestamp: new Date(),
                isLoading: true,
              }}
            />
          )}

          {suggestedSlots.length > 0 && (
            <div className="flex justify-start">
              <SuggestedSlots slots={suggestedSlots} onSelect={handleSlotSelect} />
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="border-t p-4">
          <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        </div>
      </CardContent>
    </Card>
  );
}

// Temporary simulation function - replace with actual AI API
function simulateAIResponse(input: string): { content: string; suggestedSlots?: string[] } {
  const lowerInput = input.toLowerCase();

  if (lowerInput.includes('haircut') || lowerInput.includes('book')) {
    return {
      content: 'I can help you book a haircut! Here are some available time slots for tomorrow:',
      suggestedSlots: ['10:00 AM', '2:00 PM', '4:30 PM'],
    };
  }

  if (lowerInput.includes('manicure')) {
    return {
      content: 'Great choice! Manicure takes about 45 minutes. Here are available slots:',
      suggestedSlots: ['11:00 AM', '3:00 PM', '5:00 PM'],
    };
  }

  if (lowerInput.includes('cancel')) {
    return {
      content: 'I can help you cancel your appointment. Please provide your phone number or appointment ID so I can find your booking.',
    };
  }

  if (lowerInput.includes('reschedule')) {
    return {
      content: 'I can help you reschedule. What date and time would work better for you?',
    };
  }

  if (lowerInput.includes('available') || lowerInput.includes('slots')) {
    return {
      content: 'I can show you available slots. Which service are you interested in and for what date?',
    };
  }

  return {
    content: 'I understand. Let me help you with that. Could you provide more details about what service you need and your preferred time?',
  };
}
