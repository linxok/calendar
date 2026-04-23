<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CalendarService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CalendarController extends Controller
{
    private CalendarService $calendarService;

    public function __construct(CalendarService $calendarService)
    {
        $this->calendarService = $calendarService;
    }

    public function daily(Request $request): JsonResponse
    {
        $date = $request->validate([
            'date' => 'required|date_format:Y-m-d',
        ])['date'];

        $view = $this->calendarService->getDailyView($date);

        return response()->json($view);
    }

    public function weekly(Request $request): JsonResponse
    {
        $startDate = $request->validate([
            'start_date' => 'required|date_format:Y-m-d',
        ])['start_date'];

        $view = $this->calendarService->getWeeklyView($startDate);

        return response()->json($view);
    }

    public function appointments(Request $request): JsonResponse
    {
        $filters = $request->only(['master_id', 'start_date', 'end_date', 'status']);
        $appointments = $this->calendarService->getAppointments($filters);

        return response()->json($appointments);
    }
}
