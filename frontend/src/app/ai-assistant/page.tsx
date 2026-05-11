'use client';

import { Header } from '@/components/Header';
import { AIChat } from '@/components/ai/AIChat';
import { AIRecommendation } from '@/types/ai';

// Sample recommendations - in real app, fetch from API
const sampleRecommendations: AIRecommendation[] = [
  {
    id: '1',
    type: 'next_service',
    service: { id: '1', name: 'Haircut & Styling' },
    master: { id: '1', name: 'Anna' },
    confidence: 0.87,
    reasoning: 'Based on your booking pattern, you typically get a haircut every 4-5 weeks. Your last appointment was 4 weeks ago.',
    suggestedTimeSlots: ['Tuesday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 4:30 PM'],
  },
];

export default function AIAssistantPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            AI Booking Assistant
          </h1>
          <p className="text-gray-600">
            Chat with our AI to book appointments, check availability, or get recommendations
          </p>
        </div>

        <AIChat initialRecommendations={sampleRecommendations} />

        <div className="mt-8 grid md:grid-cols-3 gap-4 text-center text-sm text-gray-500">
          <div className="p-4 bg-white rounded-lg border">
            <strong className="block text-gray-900 mb-1">Natural Language</strong>
            Just type what you need like &quot;I want a haircut tomorrow at 3pm&quot;
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <strong className="block text-gray-900 mb-1">Smart Suggestions</strong>
            AI recommends best times based on your history
          </div>
          <div className="p-4 bg-white rounded-lg border">
            <strong className="block text-gray-900 mb-1">Instant Booking</strong>
            Book appointments directly through chat
          </div>
        </div>
      </main>
    </div>
  );
}
