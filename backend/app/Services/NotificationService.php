<?php

namespace App\Services;

use App\Models\Appointment;
use App\Models\CommunicationLog;
use App\Models\User;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class NotificationService
{
    /**
     * Send booking confirmation notification
     */
    public function sendBookingConfirmation(Appointment $appointment): void
    {
        $this->sendEmail($appointment, 'booking_confirmation');
        $this->sendTelegram($appointment, 'booking_confirmation');
    }

    /**
     * Send booking reminder (24 hours before)
     */
    public function sendBookingReminder(Appointment $appointment): void
    {
        $this->sendEmail($appointment, 'reminder');
        $this->sendTelegram($appointment, 'reminder');
    }

    /**
     * Send booking cancellation notification
     */
    public function sendCancellation(Appointment $appointment): void
    {
        $this->sendEmail($appointment, 'cancellation');
        $this->sendTelegram($appointment, 'cancellation');
    }

    /**
     * Send rescheduling notification
     */
    public function sendReschedule(Appointment $appointment, string $oldTime): void
    {
        $this->sendEmail($appointment, 'reschedule', ['old_time' => $oldTime]);
        $this->sendTelegram($appointment, 'reschedule', ['old_time' => $oldTime]);
    }

    /**
     * Send email notification
     */
    private function sendEmail(Appointment $appointment, string $type, array $extraData = []): void
    {
        try {
            $subject = $this->getEmailSubject($type);
            $content = $this->getEmailContent($appointment, $type, $extraData);

            // Log the communication
            $log = CommunicationLog::create([
                'appointment_id' => $appointment->id,
                'channel' => 'email',
                'type' => $type,
                'recipient' => $appointment->client_email ?? $appointment->client_phone,
                'subject' => $subject,
                'content' => $content,
                'status' => 'pending',
                'sent_at' => now(),
            ]);

            // In production, use Laravel Mail facade
            // Mail::raw($content, function ($message) use ($appointment, $subject) {
            //     $message->to($appointment->client_email)
            //             ->subject($subject);
            // });

            // For now, just mark as sent for demo
            $log->update([
                'status' => 'sent',
                'delivered_at' => now(),
            ]);

            Log::info("Email {$type} sent for appointment {$appointment->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send email {$type}: " . $e->getMessage());
            $this->logError($appointment, 'email', $type, $e->getMessage());
        }
    }

    /**
     * Send Telegram notification
     */
    private function sendTelegram(Appointment $appointment, string $type, array $extraData = []): void
    {
        try {
            $botToken = config('services.telegram.bot_token');
            if (!$botToken) {
                Log::warning('Telegram bot token not configured');
                return;
            }

            $message = $this->getTelegramMessage($appointment, $type, $extraData);

            // Log the communication
            $log = CommunicationLog::create([
                'appointment_id' => $appointment->id,
                'channel' => 'telegram',
                'type' => $type,
                'recipient' => $appointment->client_phone,
                'content' => $message,
                'status' => 'pending',
                'sent_at' => now(),
            ]);

            // Try to find user by phone and get their telegram_chat_id
            $user = User::where('phone', $appointment->client_phone)->first();
            $chatId = $user?->telegram_chat_id;

            if ($chatId) {
                $response = Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                    'chat_id' => $chatId,
                    'text' => $message,
                    'parse_mode' => 'HTML',
                ]);

                if ($response->successful()) {
                    $log->update([
                        'status' => 'delivered',
                        'delivered_at' => now(),
                        'provider_id' => $response->json('result.message_id'),
                    ]);
                } else {
                    $log->update([
                        'status' => 'failed',
                        'error_message' => $response->body(),
                    ]);
                }
            } else {
                // No telegram chat ID, mark as queued for later
                $log->update(['status' => 'queued']);
            }

            Log::info("Telegram {$type} sent for appointment {$appointment->id}");
        } catch (\Exception $e) {
            Log::error("Failed to send Telegram {$type}: " . $e->getMessage());
            $this->logError($appointment, 'telegram', $type, $e->getMessage());
        }
    }

    /**
     * Get email subject based on type
     */
    private function getEmailSubject(string $type): string
    {
        return match ($type) {
            'booking_confirmation' => 'Your Appointment is Confirmed!',
            'reminder' => 'Reminder: Your Appointment is Tomorrow',
            'cancellation' => 'Your Appointment Has Been Cancelled',
            'reschedule' => 'Your Appointment Has Been Rescheduled',
            default => 'Beauty Salon Notification',
        };
    }

    /**
     * Get email content based on type
     */
    private function getEmailContent(Appointment $appointment, string $type, array $extraData = []): string
    {
        $date = $appointment->start_at->format('l, F j, Y');
        $time = $appointment->start_at->format('g:i A');
        $service = $appointment->service->name;
        $master = $appointment->master->user->name;

        return match ($type) {
            'booking_confirmation' => <<<HTML
                <h2>Hi {$appointment->client_name},</h2>
                <p>Your appointment has been confirmed!</p>
                <ul>
                    <li><strong>Service:</strong> {$service}</li>
                    <li><strong>Date:</strong> {$date}</li>
                    <li><strong>Time:</strong> {$time}</li>
                    <li><strong>Master:</strong> {$master}</li>
                </ul>
                <p>We look forward to seeing you!</p>
                HTML,

            'reminder' => <<<HTML
                <h2>Hi {$appointment->client_name},</h2>
                <p>This is a friendly reminder about your appointment tomorrow:</p>
                <ul>
                    <li><strong>Service:</strong> {$service}</li>
                    <li><strong>Date:</strong> {$date}</li>
                    <li><strong>Time:</strong> {$time}</li>
                    <li><strong>Master:</strong> {$master}</li>
                </ul>
                <p>See you soon!</p>
                HTML,

            'cancellation' => <<<HTML
                <h2>Hi {$appointment->client_name},</h2>
                <p>Your appointment has been cancelled.</p>
                <ul>
                    <li><strong>Service:</strong> {$service}</li>
                    <li><strong>Was scheduled for:</strong> {$date} at {$time}</li>
                </ul>
                <p>If you have any questions, please contact us.</p>
                HTML,

            'reschedule' => <<<HTML
                <h2>Hi {$appointment->client_name},</h2>
                <p>Your appointment has been rescheduled.</p>
                <ul>
                    <li><strong>Service:</strong> {$service}</li>
                    <li><strong>New Date:</strong> {$date}</li>
                    <li><strong>New Time:</strong> {$time}</li>
                    <li><strong>Master:</strong> {$master}</li>
                </ul>
                <p>Please let us know if this doesn't work for you.</p>
                HTML,

            default => 'Notification from Beauty Salon',
        };
    }

    /**
     * Get Telegram message based on type
     */
    private function getTelegramMessage(Appointment $appointment, string $type, array $extraData = []): string
    {
        $date = $appointment->start_at->format('l, F j');
        $time = $appointment->start_at->format('g:i A');
        $service = $appointment->service->name;
        $master = $appointment->master->user->name;

        return match ($type) {
            'booking_confirmation' => <<<MSG
✅ <b>Appointment Confirmed!</b>

Hi {$appointment->client_name},
Your appointment is confirmed:

📋 {$service}
📅 {$date}
🕐 {$time}
👤 {$master}

See you soon!
MSG,

            'reminder' => <<<MSG
⏰ <b>Appointment Reminder</b>

Hi {$appointment->client_name},
Just a reminder about your appointment tomorrow:

📋 {$service}
📅 {$date}
🕐 {$time}
👤 {$master}

See you tomorrow!
MSG,

            'cancellation' => <<<MSG
❌ <b>Appointment Cancelled</b>

Hi {$appointment->client_name},
Your appointment has been cancelled:

📋 {$service}
📅 Was scheduled for: {$date} at {$time}

If you have questions, contact us.
MSG,

            'reschedule' => <<<MSG
📅 <b>Appointment Rescheduled</b>

Hi {$appointment->client_name},
Your appointment has been moved:

📋 {$service}
📅 New date: {$date}
🕐 New time: {$time}
👤 {$master}

Let us know if this doesn't work for you.
MSG,

            default => 'Notification from Beauty Salon',
        };
    }

    /**
     * Log notification error
     */
    private function logError(Appointment $appointment, string $channel, string $type, string $error): void
    {
        CommunicationLog::create([
            'appointment_id' => $appointment->id,
            'channel' => $channel,
            'type' => $type,
            'recipient' => $appointment->client_phone,
            'status' => 'failed',
            'error_message' => $error,
            'sent_at' => now(),
        ]);
    }

    /**
     * Send notification to master about new booking
     */
    public function notifyMasterNewBooking(Appointment $appointment): void
    {
        try {
            $master = $appointment->master->user;
            if (!$master->telegram_chat_id) {
                return;
            }

            $botToken = config('services.telegram.bot_token');
            if (!$botToken) {
                return;
            }

            $date = $appointment->start_at->format('l, F j');
            $time = $appointment->start_at->format('g:i A');
            $service = $appointment->service->name;

            $message = <<<MSG
🔔 <b>New Booking!</b>

📋 {$service}
📅 {$date}
🕐 {$time}
👤 {$appointment->client_name}
📞 {$appointment->client_phone}
MSG;

            Http::post("https://api.telegram.org/bot{$botToken}/sendMessage", [
                'chat_id' => $master->telegram_chat_id,
                'text' => $message,
                'parse_mode' => 'HTML',
            ]);
        } catch (\Exception $e) {
            Log::error("Failed to notify master: " . $e->getMessage());
        }
    }
}
