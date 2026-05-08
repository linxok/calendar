<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AiConversation;
use App\Models\AiMessage;
use App\Models\AiRecommendation;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AiController extends Controller
{
    /**
     * Handle AI chat message
     */
    public function chat(Request $request): JsonResponse
    {
        $request->validate([
            'message' => 'required|string|max:2000',
            'conversation_id' => 'nullable|uuid|exists:ai_conversations,id',
        ]);

        $user = $request->user();
        $message = $request->message;

        // Get or create conversation
        if ($request->conversation_id) {
            $conversation = AiConversation::findOrFail($request->conversation_id);
        } else {
            $conversation = AiConversation::create([
                'user_id' => $user?->id,
                'channel' => 'web',
                'status' => 'active',
                'started_at' => now(),
            ]);
        }

        // Save user message
        AiMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'user',
            'content' => $message,
        ]);

        // Simple rule-based response (AI provider integration can be added later)
        $response = $this->generateResponse($message);

        // Save assistant message
        AiMessage::create([
            'conversation_id' => $conversation->id,
            'role' => 'assistant',
            'content' => $response['text'],
            'intent' => $response['intent'] ?? null,
        ]);

        return response()->json([
            'conversation_id' => $conversation->id,
            'response' => $response['text'],
            'intent' => $response['intent'] ?? null,
            'suggestions' => $response['suggestions'] ?? [],
        ]);
    }

    /**
     * Get user conversations
     */
    public function conversations(Request $request): JsonResponse
    {
        $user = $request->user();

        $conversations = AiConversation::where('user_id', $user->id)
            ->with(['messages' => fn ($q) => $q->latest()->limit(1)])
            ->orderBy('created_at', 'desc')
            ->limit(20)
            ->get()
            ->map(fn ($c) => [
                'id' => $c->id,
                'status' => $c->status,
                'started_at' => $c->started_at?->toISOString(),
                'last_message' => $c->messages->first()?->content,
            ]);

        return response()->json($conversations);
    }

    /**
     * Get AI recommendations for user
     */
    public function recommendations(Request $request): JsonResponse
    {
        $user = $request->user();

        $recommendations = AiRecommendation::where('user_id', $user->id)
            ->where('status', 'pending')
            ->where(fn ($q) => $q->whereNull('expires_at')->orWhere('expires_at', '>', now()))
            ->with(['service', 'master.user'])
            ->orderBy('confidence_score', 'desc')
            ->limit(5)
            ->get()
            ->map(fn ($r) => [
                'id' => $r->id,
                'type' => $r->recommendation_type,
                'service' => $r->service ? ['id' => $r->service->id, 'name' => $r->service->name] : null,
                'master' => $r->master ? ['id' => $r->master->id, 'name' => $r->master->user?->name] : null,
                'suggested_date' => $r->suggested_date,
                'suggested_time_slots' => $r->suggested_time_slots,
                'confidence' => $r->confidence_score,
                'reasoning' => $r->reasoning,
            ]);

        return response()->json(['recommendations' => $recommendations]);
    }

    /**
     * Accept a recommendation
     */
    public function acceptRecommendation(string $id, Request $request): JsonResponse
    {
        $recommendation = AiRecommendation::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $recommendation->update([
            'status' => 'accepted',
            'accepted_at' => now(),
        ]);

        return response()->json(['message' => 'Recommendation accepted']);
    }

    /**
     * Dismiss a recommendation
     */
    public function dismissRecommendation(string $id, Request $request): JsonResponse
    {
        $recommendation = AiRecommendation::where('user_id', $request->user()->id)
            ->findOrFail($id);

        $recommendation->update(['status' => 'dismissed']);

        return response()->json(['message' => 'Recommendation dismissed']);
    }

    /**
     * Simple rule-based response generator
     * Replace with actual AI provider calls when API keys are configured
     */
    private function generateResponse(string $message): array
    {
        $lower = strtolower($message);

        if (str_contains($lower, 'book') || str_contains($lower, 'appointment') || str_contains($lower, 'schedule')) {
            return [
                'text' => 'I can help you book an appointment! Please visit our booking page to choose a service, select a master, and pick a convenient time. Would you like me to guide you through the process?',
                'intent' => 'book_appointment',
                'suggestions' => ['Go to booking page', 'Show available services', 'Show available masters'],
            ];
        }

        if (str_contains($lower, 'cancel') || str_contains($lower, 'reschedule')) {
            return [
                'text' => 'To cancel or reschedule an appointment, please go to your Dashboard where you can manage all your appointments. Would you like help with anything else?',
                'intent' => 'manage_appointment',
                'suggestions' => ['Go to dashboard', 'Contact support'],
            ];
        }

        if (str_contains($lower, 'price') || str_contains($lower, 'cost') || str_contains($lower, 'how much')) {
            return [
                'text' => 'You can view our service prices on the booking page. Each service shows its duration and price. Is there a specific service you\'d like to know about?',
                'intent' => 'pricing_inquiry',
                'suggestions' => ['View services', 'Book now'],
            ];
        }

        if (str_contains($lower, 'hello') || str_contains($lower, 'hi') || str_contains($lower, 'hey')) {
            return [
                'text' => 'Hello! I\'m your AI booking assistant. I can help you book appointments, answer questions about our services, or manage your existing bookings. How can I help you today?',
                'intent' => 'greeting',
                'suggestions' => ['Book an appointment', 'View my appointments', 'Ask about services'],
            ];
        }

        if (str_contains($lower, 'hour') || str_contains($lower, 'open') || str_contains($lower, 'available')) {
            return [
                'text' => 'Our salon is open Monday through Saturday from 9:00 AM to 8:00 PM, and Sunday from 10:00 AM to 6:00 PM. You can check real-time availability on our booking page.',
                'intent' => 'hours_inquiry',
                'suggestions' => ['Book now', 'Check availability'],
            ];
        }

        return [
            'text' => 'Thanks for your message! I\'m here to help with bookings, scheduling, and any questions about our salon services. What would you like to do?',
            'intent' => 'general',
            'suggestions' => ['Book an appointment', 'View services', 'Check my bookings'],
        ];
    }
}
