'use client';

import { AIRecommendation } from '@/types/ai';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Sparkles, Calendar, User, ThumbsUp } from 'lucide-react';

interface AIRecommendationsProps {
  recommendations: AIRecommendation[];
  onAccept: (recommendation: AIRecommendation) => void;
  onDismiss: (id: string) => void;
}

export function AIRecommendations({ recommendations, onAccept, onDismiss }: AIRecommendationsProps) {
  if (recommendations.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2 text-purple-600">
        <Sparkles size={20} />
        <h3 className="font-semibold">AI Recommendations</h3>
      </div>

      {recommendations.map((rec) => (
        <Card key={rec.id} className="border-purple-200 bg-purple-50/50">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                {rec.type === 'next_service' && <Calendar size={16} />}
                {rec.type === 'master' && <User size={16} />}
                {rec.type === 'optimal_time' && <Sparkles size={16} />}
                {rec.service?.name || 'Recommended for you'}
              </CardTitle>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded-full">
                {Math.round(rec.confidence * 100)}% match
              </span>
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-3">{rec.reasoning}</p>

            {rec.suggestedTimeSlots && rec.suggestedTimeSlots.length > 0 && (
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-1">Suggested times:</p>
                <div className="flex flex-wrap gap-1">
                  {rec.suggestedTimeSlots.map((slot) => (
                    <span
                      key={slot}
                      className="text-xs bg-white border px-2 py-1 rounded"
                    >
                      {slot}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button size="sm" onClick={() => onAccept(rec)} className="flex-1">
                <ThumbsUp size={14} className="mr-1" />
                Book This
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => onDismiss(rec.id)}
              >
                Dismiss
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
