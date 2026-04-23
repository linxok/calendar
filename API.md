# API Endpoints Specification

## Authentication
All endpoints except public booking require authentication.
- **Bearer token** authentication for clients and masters
- **Admin token** for administrators

---

## 1. Authentication & Users

### POST /api/auth/register
Register a new client.
```json
Request:
{
  "name": "string",
  "phone": "string",
  "email": "string",
  "password": "string"
}

Response: 201
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "client",
  "token": "string"
}
```

### POST /api/auth/login
Login for all user types.
```json
Request:
{
  "email": "string",
  "password": "string"
}

Response: 200
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "role": "client|master|admin",
  "token": "string"
}
```

### POST /api/auth/logout
Invalidate current session.
```json
Response: 204
```

### GET /api/users/me
Get current user profile.
```json
Response: 200
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string",
  "role": "string",
  "status": "active|inactive"
}
```

### PUT /api/users/me
Update current user profile.
```json
Request:
{
  "name": "string",
  "phone": "string",
  "email": "string"
}

Response: 200
{
  "id": "uuid",
  "name": "string",
  "phone": "string",
  "email": "string"
}
```

---

## 2. Masters

### GET /api/masters
Get list of active masters.
```json
Query params:
- serviceId (optional): filter by service

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "specialization": "string",
      "photo": "url|null"
    }
  ]
}
```

### GET /api/masters/:id
Get master details.
```json
Response: 200
{
  "id": "uuid",
  "name": "string",
  "specialization": "string",
  "photo": "url|null",
  "services": ["uuid"]
}
```

### POST /api/admin/masters
Create a new master (admin only).
```json
Request:
{
  "name": "string",
  "email": "string",
  "phone": "string",
  "specialization": "string",
  "password": "string"
}

Response: 201
{
  "id": "uuid",
  "name": "string",
  "email": "string",
  "specialization": "string"
}
```

### PUT /api/admin/masters/:id
Update master (admin only).
```json
Request:
{
  "name": "string",
  "specialization": "string",
  "activeStatus": "active|inactive"
}

Response: 200
{
  "id": "uuid",
  "name": "string",
  "specialization": "string",
  "activeStatus": "string"
}
```

### DELETE /api/admin/masters/:id
Deactivate master (admin only).
```json
Response: 204
```

---

## 3. Services

### GET /api/services
Get list of active services.
```json
Response: 200
{
  "data": [
    {
      "id": "uuid",
      "name": "string",
      "durationMinutes": "number",
      "price": "number|null"
    }
  ]
}
```

### GET /api/services/:id
Get service details.
```json
Response: 200
{
  "id": "uuid",
  "name": "string",
  "durationMinutes": "number",
  "price": "number|null",
  "activeStatus": "active|inactive"
}
```

### POST /api/admin/services
Create a new service (admin only).
```json
Request:
{
  "name": "string",
  "durationMinutes": "number",
  "price": "number|null"
}

Response: 201
{
  "id": "uuid",
  "name": "string",
  "durationMinutes": "number",
  "price": "number|null"
}
```

### PUT /api/admin/services/:id
Update service (admin only).
```json
Request:
{
  "name": "string",
  "durationMinutes": "number",
  "price": "number|null",
  "activeStatus": "active|inactive"
}

Response: 200
{
  "id": "uuid",
  "name": "string",
  "durationMinutes": "number",
  "price": "number|null",
  "activeStatus": "string"
}
```

### DELETE /api/admin/services/:id
Deactivate service (admin only).
```json
Response: 204
```

---

## 4. Working Schedules

### GET /api/masters/:masterId/schedule
Get master working schedule.
```json
Query params:
- date (optional): specific date

Response: 200
{
  "masterId": "uuid",
  "schedule": [
    {
      "id": "uuid",
      "dayOfWeek": "number (0-6)",
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "breaks": [
        {
          "startTime": "HH:mm",
          "endTime": "HH:mm"
        }
      ]
    }
  ]
}
```

### POST /api/admin/masters/:masterId/schedule
Create or update master schedule (admin only).
```json
Request:
{
  "dayOfWeek": "number (0-6)",
  "startTime": "HH:mm",
  "endTime": "HH:mm",
  "breaks": [
    {
      "startTime": "HH:mm",
      "endTime": "HH:mm"
    }
  ]
}

Response: 201
{
  "id": "uuid",
  "masterId": "uuid",
  "dayOfWeek": "number",
  "startTime": "HH:mm",
  "endTime": "HH:mm",
  "breaks": []
}
```

### DELETE /api/admin/masters/:masterId/schedule/:scheduleId
Remove schedule entry (admin only).
```json
Response: 204
```

---

## 5. Availability

### GET /api/availability
Get available time slots.
```json
Query params (required):
- masterId: uuid
- serviceId: uuid
- date: YYYY-MM-DD

Response: 200
{
  "masterId": "uuid",
  "serviceId": "uuid",
  "date": "YYYY-MM-DD",
  "slots": [
    {
      "startTime": "HH:mm",
      "endTime": "HH:mm",
      "available": true
    }
  ]
}
```

---

## 6. Appointments

### GET /api/appointments
Get appointments list.
```json
Query params:
- masterId (optional): filter by master
- clientId (optional): filter by client
- dateFrom (optional): YYYY-MM-DD
- dateTo (optional): YYYY-MM-DD
- status (optional): pending|confirmed|completed|cancelled

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "clientName": "string",
      "masterName": "string",
      "serviceName": "string",
      "startAt": "ISO datetime",
      "endAt": "ISO datetime",
      "status": "string",
      "source": "public|internal"
    }
  ],
  "pagination": {
    "page": 1,
    "perPage": 20,
    "total": 100
  }
}
```

### GET /api/appointments/:id
Get appointment details.
```json
Response: 200
{
  "id": "uuid",
  "clientId": "uuid",
  "clientName": "string",
  "clientPhone": "string",
  "masterId": "uuid",
  "masterName": "string",
  "serviceId": "uuid",
  "serviceName": "string",
  "startAt": "ISO datetime",
  "endAt": "ISO datetime",
  "status": "pending|confirmed|completed|cancelled",
  "source": "public|internal",
  "notes": "string|null",
  "createdAt": "ISO datetime"
}
```

### POST /api/appointments
Create a new appointment (client or admin).
```json
Request:
{
  "masterId": "uuid",
  "serviceId": "uuid",
  "startAt": "ISO datetime",
  "clientId": "uuid (optional, only for admin)",
  "clientName": "string (optional, for public booking)",
  "clientPhone": "string (optional, for public booking)",
  "notes": "string|null"
}

Response: 201
{
  "id": "uuid",
  "masterId": "uuid",
  "serviceId": "uuid",
  "startAt": "ISO datetime",
  "endAt": "ISO datetime",
  "status": "pending"
}
```

### PUT /api/appointments/:id
Update appointment (reschedule).
```json
Request:
{
  "startAt": "ISO datetime",
  "notes": "string|null"
}

Response: 200
{
  "id": "uuid",
  "startAt": "ISO datetime",
  "endAt": "ISO datetime",
  "status": "string"
}
```

### PATCH /api/appointments/:id/status
Change appointment status.
```json
Request:
{
  "status": "confirmed|completed|cancelled"
}

Response: 200
{
  "id": "uuid",
  "status": "string"
}
```

### DELETE /api/appointments/:id
Cancel appointment.
```json
Response: 204
```

---

## 7. Calendar Views

### GET /api/calendar/day
Get day view.
```json
Query params:
- date: YYYY-MM-DD
- masterId (optional): filter by master

Response: 200
{
  "date": "YYYY-MM-DD",
  "appointments": [
    {
      "id": "uuid",
      "masterId": "uuid",
      "masterName": "string",
      "clientName": "string",
      "serviceName": "string",
      "startAt": "ISO datetime",
      "endAt": "ISO datetime",
      "status": "string"
    }
  ]
}
```

### GET /api/calendar/week
Get week view.
```json
Query params:
- weekStart: YYYY-MM-DD
- masterId (optional): filter by master

Response: 200
{
  "weekStart": "YYYY-MM-DD",
  "weekEnd": "YYYY-MM-DD",
  "days": [
    {
      "date": "YYYY-MM-DD",
      "appointments": []
    }
  ]
}
```

### GET /api/calendar/month
Get month view.
```json
Query params:
- year: number
- month: number (1-12)
- masterId (optional): filter by master

Response: 200
{
  "year": 2026,
  "month": 4,
  "appointments": [
    {
      "date": "YYYY-MM-DD",
      "count": 5
    }
  ]
}
```

---

## 8. Notifications

### GET /api/admin/notifications
Get notification logs (admin only).
```json
Query params:
- appointmentId (optional)
- channel (optional): sms|email|telegram|push

Response: 200
{
  "data": [
    {
      "id": "uuid",
      "appointmentId": "uuid",
      "channel": "string",
      "status": "sent|failed",
      "sentAt": "ISO datetime"
    }
  ]
}
```

### POST /api/admin/notifications/send
Send notification manually (admin only).
```json
Request:
{
  "appointmentId": "uuid",
  "channel": "sms|email|telegram|push"
}

Response: 201
{
  "id": "uuid",
  "status": "sent|failed"
}
```

---

## 9. Settings

### GET /api/admin/settings
Get booking settings (admin only).
```json
Response: 200
{
  "minimumNoticeHours": 2,
  "cancellationWindowHours": 24,
  "bufferMinutes": 15,
  "maxBookingsPerDay": 10
}
```

### PUT /api/admin/settings
Update booking settings (admin only).
```json
Request:
{
  "minimumNoticeHours": 2,
  "cancellationWindowHours": 24,
  "bufferMinutes": 15,
  "maxBookingsPerDay": 10
}

Response: 200
{
  "minimumNoticeHours": 2,
  "cancellationWindowHours": 24,
  "bufferMinutes": 15,
  "maxBookingsPerDay": 10
}
```

---

## 10. AI Provider Management (Admin Only)

### GET /api/admin/ai/providers
Get list of configured AI providers.
```json
Response: 200
{
  "providers": [
    {
      "id": "uuid",
      "providerKey": "openai",
      "name": "OpenAI",
      "enabled": true,
      "models": [
        {
          "id": "uuid",
          "modelKey": "gpt-4-turbo",
          "name": "GPT-4 Turbo",
          "enabled": true,
          "contextWindow": 128000,
          "costPer1kInput": 0.01,
          "costPer1kOutput": 0.03
        }
      ]
    }
  ]
}
```

### POST /api/admin/ai/providers
Add or configure AI provider.
```json
Request:
{
  "providerKey": "openai",
  "name": "OpenAI",
  "apiKey": "sk-...",
  "enabled": true,
  "config": {}
}

Response: 201
{
  "id": "uuid",
  "providerKey": "openai",
  "name": "OpenAI",
  "enabled": true
}
```

### PUT /api/admin/ai/providers/:id
Update provider configuration.
```json
Request:
{
  "enabled": true,
  "apiKey": "sk-...",
  "config": {}
}

Response: 200
{
  "id": "uuid",
  "enabled": true
}
```

### GET /api/admin/ai/models
List all available AI models.
```json
Response: 200
{
  "models": [
    {
      "id": "uuid",
      "providerId": "uuid",
      "providerName": "OpenAI",
      "modelKey": "gpt-4-turbo",
      "name": "GPT-4 Turbo",
      "enabled": true,
      "contextWindow": 128000,
      "costPer1kInput": 0.01,
      "costPer1kOutput": 0.03
    }
  ]
}
```

### PUT /api/admin/ai/models/:id
Enable/disable model or update cost settings.
```json
Request:
{
  "enabled": false,
  "costPer1kInput": 0.01,
  "costPer1kOutput": 0.03
}

Response: 200
{
  "id": "uuid",
  "enabled": false
}
```

---

## 11. AI Recommendations

### GET /api/ai/recommendations
Get personalized recommendations for current user.
```json
Response: 200
{
  "recommendations": [
    {
      "id": "uuid",
      "type": "next_service",
      "service": {
        "id": "uuid",
        "name": "Haircut",
        "durationMinutes": 30
      },
      "master": {
        "id": "uuid",
        "name": "Anna"
      },
      "suggestedDate": "2026-04-15",
      "suggestedTimeSlots": ["10:00", "14:00", "16:00"],
      "confidence": 0.87,
      "reasoning": "Based on your booking pattern, you typically get a haircut every 4-5 weeks. Your last appointment was 4 weeks ago.",
      "createdAt": "ISO datetime",
      "expiresAt": "ISO datetime"
    }
  ]
}
```

### POST /api/ai/recommendations/:id/accept
Accept recommendation and create booking.
```json
Request:
{
  "selectedTimeSlot": "10:00"
}

Response: 201
{
  "appointmentId": "uuid",
  "masterId": "uuid",
  "serviceId": "uuid",
  "startAt": "ISO datetime",
  "endAt": "ISO datetime"
}
```

### POST /api/ai/recommendations/:id/dismiss
Dismiss a recommendation.
```json
Response: 204
```

---

## 12. AI Conversational Assistant

### POST /api/ai/chat
Send message to AI assistant.
```json
Request:
{
  "message": "I need a haircut next Friday",
  "conversationId": "uuid (optional)"
}

Response: 200
{
  "conversationId": "uuid",
  "response": "I found 3 available slots for haircut on Friday, April 12: 10:00 AM, 2:00 PM, and 4:30 PM. Which time works best for you?",
  "intent": "book_appointment",
  "entities": {
    "service": "haircut",
    "date": "2026-04-12"
  },
  "suggestedSlots": [
    {
      "masterId": "uuid",
      "masterName": "Anna",
      "time": "10:00"
    },
    {
      "masterId": "uuid",
      "masterName": "Anna",
      "time": "14:00"
    },
    {
      "masterId": "uuid",
      "masterName": "Anna",
      "time": "16:30"
    }
  ],
  "actions": [
    {
      "type": "book_slot",
      "label": "Book 10:00 AM",
      "data": {
        "masterId": "uuid",
        "serviceId": "uuid",
        "startAt": "2026-04-12T10:00:00Z"
      }
    }
  ]
}
```

### POST /api/ai/chat/action
Execute action from chat conversation.
```json
Request:
{
  "conversationId": "uuid",
  "action": {
    "type": "book_slot",
    "data": {
      "masterId": "uuid",
      "serviceId": "uuid",
      "startAt": "2026-04-12T10:00:00Z"
    }
  }
}

Response: 201
{
  "appointmentId": "uuid",
  "confirmation": "Your haircut with Anna is booked for Friday, April 12 at 10:00 AM."
}
```

### GET /api/ai/conversations
Get user conversation history.
```json
Query params:
- limit (optional): default 10
- offset (optional): default 0

Response: 200
{
  "conversations": [
    {
      "id": "uuid",
      "channel": "web",
      "startedAt": "ISO datetime",
      "endedAt": "ISO datetime",
      "status": "completed",
      "messageCount": 5
    }
  ],
  "pagination": {
    "total": 20,
    "limit": 10,
    "offset": 0
  }
}
```

### GET /api/ai/conversations/:id
Get conversation details with messages.
```json
Response: 200
{
  "id": "uuid",
  "channel": "web",
  "startedAt": "ISO datetime",
  "status": "active",
  "messages": [
    {
      "id": "uuid",
      "role": "user",
      "content": "I need a haircut",
      "createdAt": "ISO datetime"
    },
    {
      "id": "uuid",
      "role": "assistant",
      "content": "I can help you book a haircut. When would you like to come?",
      "intent": "book_appointment",
      "createdAt": "ISO datetime"
    }
  ]
}
```

### DELETE /api/ai/conversations/:id
End conversation.
```json
Response: 204
```

---

## 13. AI Business Intelligence (Admin Only)

### GET /api/admin/ai/insights
Get AI-generated business insights.
```json
Query params:
- category (optional): scheduling|performance|marketing|quality
- severity (optional): low|medium|high
- status (optional): new|acknowledged|dismissed

Response: 200
{
  "insights": [
    {
      "id": "uuid",
      "type": "opportunity",
      "category": "scheduling",
      "title": "Low occupancy on Monday mornings",
      "description": "Your salon has 40% occupancy on Monday 9 AM - 12 PM. Consider offering a weekday morning discount.",
      "severity": "medium",
      "actionable": true,
      "data": {
        "timeSlot": "Monday 09:00-12:00",
        "currentOccupancy": 0.4,
        "potentialRevenue": 1500
      },
      "status": "new",
      "createdAt": "ISO datetime"
    }
  ]
}
```

### POST /api/admin/ai/insights/generate
Trigger manual insight generation.
```json
Request:
{
  "categories": ["scheduling", "performance"]
}

Response: 202
{
  "jobId": "uuid",
  "status": "processing"
}
```

### PATCH /api/admin/ai/insights/:id
Acknowledge or dismiss insight.
```json
Request:
{
  "status": "acknowledged|dismissed"
}

Response: 200
{
  "id": "uuid",
  "status": "acknowledged"
}
```

---

## 14. AI Analytics

### GET /api/admin/ai/analytics/users/:userId
Get AI analysis for specific user.
```json
Response: 200
{
  "userId": "uuid",
  "analytics": {
    "bookingFrequency": "monthly",
    "averageIntervalDays": 28,
    "preferredMasters": [
      {
        "masterId": "uuid",
        "masterName": "Anna",
        "bookingCount": 12
      }
    ],
    "preferredServices": [
      {
        "serviceId": "uuid",
        "serviceName": "Haircut",
        "bookingCount": 10
      }
    ],
    "preferredTimeSlots": [
      {"day": "Friday", "time": "14:00", "count": 8}
    ],
    "churnRiskScore": 0.15,
    "lifetimeValue": 3600.00,
    "lastBooking": "2026-03-15",
    "nextPredictedBooking": "2026-04-12",
    "analyzedAt": "ISO datetime"
  }
}
```

### GET /api/admin/ai/analytics/cohorts
Get customer segmentation and cohort analysis.
```json
Response: 200
{
  "cohorts": [
    {
      "clusterId": 1,
      "name": "Frequent Clients",
      "userCount": 45,
      "characteristics": {
        "averageFrequency": "weekly",
        "averageLifetimeValue": 5000,
        "churnRate": 0.05
      }
    },
    {
      "clusterId": 2,
      "name": "Seasonal Clients",
      "userCount": 120,
      "characteristics": {
        "averageFrequency": "quarterly",
        "averageLifetimeValue": 1200,
        "churnRate": 0.25
      }
    }
  ]
}
```

### GET /api/admin/ai/analytics/predictions
Get demand forecasts and predictions.
```json
Query params:
- dateFrom: YYYY-MM-DD
- dateTo: YYYY-MM-DD

Response: 200
{
  "predictions": [
    {
      "date": "2026-04-15",
      "predictedBookings": 25,
      "confidence": 0.82,
      "peakHours": ["10:00-12:00", "14:00-16:00"]
    }
  ]
}
```

### GET /api/admin/ai/usage
Get AI usage statistics and costs.
```json
Query params:
- dateFrom (optional): YYYY-MM-DD
- dateTo (optional): YYYY-MM-DD

Response: 200
{
  "period": {
    "from": "2026-04-01",
    "to": "2026-04-07"
  },
  "totalCost": 45.67,
  "totalRequests": 1234,
  "byProvider": [
    {
      "provider": "openai",
      "requests": 800,
      "tokensInput": 150000,
      "tokensOutput": 75000,
      "cost": 35.25
    },
    {
      "provider": "anthropic",
      "requests": 400,
      "tokensInput": 80000,
      "tokensOutput": 40000,
      "cost": 10.42
    }
  ],
  "byFeature": [
    {
      "feature": "chat",
      "requests": 600,
      "cost": 15.30
    },
    {
      "feature": "recommendations",
      "requests": 400,
      "cost": 20.50
    },
    {
      "feature": "insights",
      "requests": 234,
      "cost": 9.87
    }
  ]
}
```

---

## 15. AI Configuration (Admin Only)

### GET /api/admin/ai/config
Get AI feature configuration.
```json
Response: 200
{
  "features": {
    "recommendations": {
      "enabled": true,
      "minConfidence": 0.7,
      "maxRecommendations": 3
    },
    "conversationalAI": {
      "enabled": true,
      "defaultModel": "gpt-3.5-turbo",
      "maxConversationTurns": 10
    },
    "businessIntelligence": {
      "enabled": true,
      "insightFrequency": "daily",
      "minSeverity": "medium"
    },
    "userAnalytics": {
      "enabled": true,
      "batchFrequency": "daily",
      "clusteringEnabled": true
    }
  },
  "routingRules": [
    {
      "feature": "chat",
      "condition": "messageLength < 100",
      "model": "gpt-3.5-turbo"
    }
  ]
}
```

### PUT /api/admin/ai/config
Update AI configuration.
```json
Request:
{
  "features": {
    "recommendations": {
      "enabled": true,
      "minConfidence": 0.75
    }
  }
}

Response: 200
{
  "features": {
    "recommendations": {
      "enabled": true,
      "minConfidence": 0.75,
      "maxRecommendations": 3
    }
  }
}
```

---

## 16. Calendar Integration

### GET /api/appointments/:id/calendar/ics
Download appointment as iCalendar (.ics) file.
```json
Response: 200
Content-Type: text/calendar
Content-Disposition: attachment; filename="appointment.ics"

BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Beauty Salon Calendar//EN
BEGIN:VEVENT
UID:appointment-uuid@beautysalon.com
DTSTAMP:20260407T120000Z
DTSTART:20260415T110000Z
DTEND:20260415T120000Z
SUMMARY:Стрижка + укладка - Beauty Place
DESCRIPTION:Запис до майстра Анна Петренко
LOCATION:м. Київ, вул. Хрещатик, 25
ORGANIZER:mailto:salon@beautysalon.com
ATTENDEE:mailto:client@example.com
STATUS:CONFIRMED
BEGIN:VALARM
TRIGGER:-PT24H
DESCRIPTION:Нагадування про запис
ACTION:DISPLAY
END:VALARM
END:VEVENT
END:VCALENDAR
```

### GET /api/appointments/:id/calendar/google
Get Google Calendar add link.
```json
Response: 200
{
  "url": "https://calendar.google.com/calendar/render?action=TEMPLATE&text=Стрижка%20%2B%20укладка&dates=20260415T110000Z/20260415T120000Z&details=Запис%20до%20майстра%20Анна&location=Хрещатик%2025",
  "qrCode": "data:image/png;base64,..."
}
```

### POST /api/appointments/:id/calendar/outlook
Add to Microsoft Outlook calendar (requires auth).
```json
Request:
{
  "accessToken": "oauth_access_token"
}

Response: 201
{
  "eventId": "outlook_event_id",
  "webLink": "https://outlook.live.com/calendar/..."
}
```

### GET /api/calendar/subscribe
Get webcal:// subscription URL for all user appointments.
```json
Response: 200
{
  "webcalUrl": "webcal://api.beautysalon.com/calendar/feed/user-token",
  "instructions": {
    "google": "Open Google Calendar → Settings → Add Calendar → From URL",
    "apple": "Settings → Calendar → Accounts → Add Account → Other → Add Subscribed Calendar",
    "outlook": "Open Outlook → Add Calendar → Subscribe from web"
  }
}
```

### GET /calendar/feed/:token
Calendar feed for subscription (public endpoint).
```
Response: 200
Content-Type: text/calendar

BEGIN:VCALENDAR
VERSION:2.0
X-WR-CALNAME:Beauty Salon Appointments
REFRESH-INTERVAL;VALUE=DURATION:PT2H
...multiple VEVENT entries...
END:VCALENDAR
```

---

## 17. Communication Channels

### POST /api/appointments/:id/notify
Send notification via specific channel.
```json
Request:
{
  "channel": "telegram|viber|email|sms|whatsapp|all",
  "type": "confirmation|reminder|cancellation",
  "customMessage": "Optional custom message"
}

Response: 200
{
  "sent": [
    {
      "channel": "telegram",
      "status": "delivered",
      "messageId": "msg_123",
      "deliveredAt": "ISO datetime"
    },
    {
      "channel": "email",
      "status": "sent",
      "messageId": "email_456"
    }
  ],
  "failed": []
}
```

### GET /api/users/me/communication-preferences
Get user's communication preferences.
```json
Response: 200
{
  "telegram": {
    "enabled": true,
    "chatId": "123456789",
    "username": "@username",
    "notifications": {
      "confirmations": true,
      "reminders": true,
      "marketing": false
    }
  },
  "viber": {
    "enabled": true,
    "phoneNumber": "+380991234567",
    "notifications": {
      "confirmations": true,
      "reminders": true,
      "marketing": true
    }
  },
  "email": {
    "enabled": true,
    "address": "user@example.com",
    "verified": true,
    "notifications": {
      "confirmations": true,
      "reminders": true,
      "marketing": true,
      "newsletter": true
    }
  },
  "sms": {
    "enabled": true,
    "phoneNumber": "+380991234567",
    "notifications": {
      "confirmations": false,
      "reminders": true,
      "otp": true
    }
  },
  "whatsapp": {
    "enabled": false,
    "phoneNumber": null,
    "optIn": false
  },
  "webPush": {
    "enabled": true,
    "subscription": { /* PushSubscription object */ }
  },
  "calendar": {
    "autoAdd": true,
    "preferredProvider": "google"
  },
  "primaryChannel": "telegram",
  "language": "uk",
  "timezone": "Europe/Kiev"
}
```

### PUT /api/users/me/communication-preferences
Update communication preferences.
```json
Request:
{
  "telegram": {
    "enabled": true,
    "notifications": {
      "marketing": false
    }
  },
  "email": {
    "notifications": {
      "newsletter": false
    }
  },
  "primaryChannel": "viber"
}

Response: 200
{
  "message": "Preferences updated successfully",
  "preferences": { /* updated preferences */ }
}
```

### POST /api/webhooks/telegram
Telegram bot webhook (internal).
```json
Request:
{
  "update_id": 123456789,
  "message": {
    "message_id": 1,
    "from": {
      "id": 123456789,
      "first_name": "Іван",
      "username": "ivan_user"
    },
    "chat": {
      "id": 123456789,
      "type": "private"
    },
    "date": 1234567890,
    "text": "/start"
  }
}

Response: 200
{
  "ok": true
}
```

### POST /api/webhooks/viber
Viber bot webhook (internal).
```json
Request:
{
  "event": "message",
  "timestamp": 1234567890,
  "message_token": 123456,
  "sender": {
    "id": "user_viber_id",
    "name": "Іван"
  },
  "message": {
    "text": "Хочу записатись",
    "type": "text"
  }
}

Response: 200
{
  "ok": true
}
```

### POST /api/webpush/subscribe
Subscribe to web push notifications.
```json
Request:
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/fcm/send/...",
    "keys": {
      "p256dh": "BN...",
      "auth": "A..."
    }
  }
}

Response: 201
{
  "id": "uuid",
  "message": "Successfully subscribed to push notifications"
}
```

### DELETE /api/webpush/unsubscribe
Unsubscribe from web push.
```json
Response: 204
```

### POST /api/admin/notifications/broadcast
Send broadcast message to all users (Admin only).
```json
Request:
{
  "channels": ["telegram", "viber", "email"],
  "subject": "Спеціальна пропозиція",
  "message": "Знижка 20% на всі послуги цього тижня!",
  "filters": {
    "hasUpcomingAppointment": false,
    "lastVisit": {
      "operator": "gt",
      "days": 30
    }
  },
  "schedule": "2026-04-10T09:00:00Z"
}

Response: 202
{
  "broadcastId": "uuid",
  "status": "scheduled",
  "estimatedRecipients": 150,
  "scheduledFor": "2026-04-10T09:00:00Z"
}
```

### GET /api/admin/notifications/broadcast/:id
Get broadcast status.
```json
Response: 200
{
  "id": "uuid",
  "status": "completed",
  "channels": ["telegram", "viber", "email"],
  "stats": {
    "totalRecipients": 150,
    "sent": {
      "telegram": 120,
      "viber": 100,
      "email": 145
    },
    "delivered": {
      "telegram": 118,
      "viber": 95,
      "email": 140
    },
    "failed": {
      "telegram": 2,
      "viber": 5,
      "email": 5
    },
    "cost": {
      "telegram": 0,
      "viber": 1.5,
      "email": 0.07,
      "total": 1.57
    }
  },
  "completedAt": "2026-04-10T09:15:23Z"
}
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Bad Request",
  "message": "Validation error description",
  "details": {}
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 409 Conflict
```json
{
  "error": "Conflict",
  "message": "Time slot is already booked"
}
```

### 422 Unprocessable Entity
```json
{
  "error": "Unprocessable Entity",
  "message": "Business rule violation",
  "details": {
    "rule": "minimum_notice",
    "required": "2 hours"
  }
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```
