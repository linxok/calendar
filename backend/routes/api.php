<?php

use App\Http\Controllers\Api\AiController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\MasterController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\ScheduleController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);
    
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);
    });
});

Route::get('/masters', [MasterController::class, 'index']);
Route::get('/masters/{id}', [MasterController::class, 'show']);
Route::get('/services', [ServiceController::class, 'index']);
Route::get('/services/{id}', [ServiceController::class, 'show']);
Route::get('/availability', [AvailabilityController::class, 'getSlots']);

Route::middleware('auth:sanctum')->group(function () {
    Route::apiResource('masters', MasterController::class)->except(['index', 'show']);
    Route::apiResource('services', ServiceController::class)->except(['index', 'show']);
    Route::apiResource('appointments', AppointmentController::class);

    Route::get('/my-appointments', [AppointmentController::class, 'myAppointments']);
    Route::get('/master/appointments', [AppointmentController::class, 'masterAppointments']);

    Route::get('/masters/{masterId}/schedules', [ScheduleController::class, 'index']);
    Route::post('/masters/{masterId}/schedules', [ScheduleController::class, 'store']);
    Route::put('/masters/{masterId}/schedules/{scheduleId}', [ScheduleController::class, 'update']);
    Route::delete('/masters/{masterId}/schedules/{scheduleId}', [ScheduleController::class, 'destroy']);
    
    Route::get('/calendar/daily', [CalendarController::class, 'daily']);
    Route::get('/calendar/weekly', [CalendarController::class, 'weekly']);
    Route::get('/calendar/appointments', [CalendarController::class, 'appointments']);

    // Notifications
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/stats', [NotificationController::class, 'stats']);
    Route::get('/notifications/unread-count', [NotificationController::class, 'unreadCount']);
    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    // AI
    Route::get('/ai/conversations', [AiController::class, 'conversations']);
    Route::get('/ai/recommendations', [AiController::class, 'recommendations']);
    Route::post('/ai/recommendations/{id}/accept', [AiController::class, 'acceptRecommendation']);
    Route::post('/ai/recommendations/{id}/dismiss', [AiController::class, 'dismissRecommendation']);
});

// AI chat available to guests and authenticated users
Route::post('/ai/chat', [AiController::class, 'chat']);
