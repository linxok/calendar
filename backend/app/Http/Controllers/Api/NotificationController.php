<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CommunicationLog;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    /**
     * Get user's notification history
     */
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();

        // Get notifications related to user's appointments
        $notifications = CommunicationLog::whereHas('appointment', function ($query) use ($user) {
            $query->where('client_id', $user->id)
                  ->orWhere('client_phone', $user->phone);
        })
        ->orderBy('sent_at', 'desc')
        ->paginate(20);

        return response()->json([
            'data' => $notifications->items(),
            'pagination' => [
                'total' => $notifications->total(),
                'per_page' => $notifications->perPage(),
                'current_page' => $notifications->currentPage(),
                'last_page' => $notifications->lastPage(),
            ],
        ]);
    }

    /**
     * Mark notification as read
     */
    public function markAsRead(string $id): JsonResponse
    {
        $log = CommunicationLog::findOrFail($id);

        // Verify ownership
        $user = Auth::user();
        if ($log->appointment && $log->appointment->client_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $log->update(['read_at' => now()]);

        return response()->json(['message' => 'Marked as read']);
    }

    /**
     * Get notification statistics
     */
    public function stats(Request $request): JsonResponse
    {
        $user = $request->user();

        $stats = CommunicationLog::whereHas('appointment', function ($query) use ($user) {
            $query->where('client_id', $user->id)
                  ->orWhere('client_phone', $user->phone);
        })
        ->selectRaw('
            channel,
            COUNT(*) as total,
            SUM(CASE WHEN status = \"delivered\" THEN 1 ELSE 0 END) as delivered,
            SUM(CASE WHEN status = \"failed\" THEN 1 ELSE 0 END) as failed,
            SUM(CASE WHEN read_at IS NOT NULL THEN 1 ELSE 0 END) as read
        ')
        ->groupBy('channel')
        ->get();

        return response()->json($stats);
    }

    /**
     * Get unread count
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $user = $request->user();

        $count = CommunicationLog::whereHas('appointment', function ($query) use ($user) {
            $query->where('client_id', $user->id)
                  ->orWhere('client_phone', $user->phone);
        })
        ->whereNull('read_at')
        ->count();

        return response()->json(['count' => $count]);
    }
}
