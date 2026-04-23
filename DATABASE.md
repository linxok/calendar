# Database Schema & ER Diagram

## ER Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ name            │
│ email (UNIQUE)  │
│ phone           │
│ password_hash   │
│ role            │──┐
│ status          │  │
│ created_at      │  │
│ updated_at      │  │
└─────────────────┘  │
         │           │
         │ 1         │
         │           │
         │           │
         │ 1..1      │
         ▼           │
┌─────────────────┐  │
│ master_profiles │  │
├─────────────────┤  │
│ id (PK)         │  │
│ user_id (FK)    │──┘
│ specialization  │
│ photo_url       │
│ active_status   │
│ created_at      │
│ updated_at      │
└─────────────────┘
         │
         │ 1
         │
         │
         │ 0..*
         ▼
┌─────────────────┐         ┌─────────────────┐
│working_schedules│         │    services     │
├─────────────────┤         ├─────────────────┤
│ id (PK)         │         │ id (PK)         │
│ master_id (FK)  │         │ name            │
│ day_of_week     │         │ duration_min    │
│ start_time      │         │ price           │
│ end_time        │         │ active_status   │
│ breaks (JSON)   │         │ created_at      │
│ created_at      │         │ updated_at      │
│ updated_at      │         └─────────────────┘
└─────────────────┘                  │
         │                           │
         │                           │
         │ 1                      1  │
         │                           │
         │                           │
         │ 0..*                 0..* │
         ▼                           ▼
┌──────────────────────────────────────┐
│          appointments                │
├──────────────────────────────────────┤
│ id (PK)                              │
│ client_id (FK, nullable)             │───┐
│ client_name                          │   │
│ client_phone                         │   │
│ master_id (FK)                       │───┤
│ service_id (FK)                      │───┤
│ start_at                             │   │
│ end_at                               │   │
│ status                               │   │
│ source                               │   │
│ notes                                │   │
│ created_at                           │   │
│ updated_at                           │   │
└──────────────────────────────────────┘   │
         │                                 │
         │ 1                               │
         │                                 │
         │                                 │
         │ 0..*                            │
         ▼                                 │
┌─────────────────┐                        │
│notification_logs│                        │
├─────────────────┤                        │
│ id (PK)         │                        │
│ appointment_id  │────────────────────────┘
│ channel         │
│ recipient       │
│ status          │
│ sent_at         │
│ error_message   │
│ created_at      │
└─────────────────┘


┌─────────────────┐
│ booking_settings│
├─────────────────┤
│ id (PK)         │
│ key             │
│ value           │
│ created_at      │
│ updated_at      │
└─────────────────┘
```

---

## Table Definitions

### users
Stores all system users: clients, masters, and administrators.

| Column        | Type         | Constraints                  | Description                          |
|---------------|--------------|------------------------------|--------------------------------------|
| id            | UUID         | PRIMARY KEY                  | Unique user identifier               |
| name          | VARCHAR(255) | NOT NULL                     | User full name                       |
| email         | VARCHAR(255) | NOT NULL, UNIQUE             | User email                           |
| phone         | VARCHAR(50)  | NOT NULL                     | User phone number                    |
| password_hash | VARCHAR(255) | NOT NULL                     | Hashed password                      |
| role          | ENUM         | NOT NULL                     | client, master, admin                |
| status        | ENUM         | NOT NULL, DEFAULT 'active'   | active, inactive                     |
| created_at    | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at    | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `email`
- INDEX on `role`

---

### master_profiles
Extended profile for users with master role.

| Column         | Type         | Constraints                  | Description                          |
|----------------|--------------|------------------------------|--------------------------------------|
| id             | UUID         | PRIMARY KEY                  | Unique master profile identifier     |
| user_id        | UUID         | NOT NULL, UNIQUE, FK(users)  | Reference to users table             |
| specialization | VARCHAR(255) | NULL                         | Master specialization                |
| photo_url      | VARCHAR(500) | NULL                         | Master photo URL                     |
| active_status  | ENUM         | NOT NULL, DEFAULT 'active'   | active, inactive                     |
| created_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `user_id`
- INDEX on `active_status`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### services
Available salon services.

| Column         | Type         | Constraints                  | Description                          |
|----------------|--------------|------------------------------|--------------------------------------|
| id             | UUID         | PRIMARY KEY                  | Unique service identifier            |
| name           | VARCHAR(255) | NOT NULL                     | Service name                         |
| duration_min   | INTEGER      | NOT NULL                     | Service duration in minutes          |
| price          | DECIMAL(10,2)| NULL                         | Service price (optional)             |
| active_status  | ENUM         | NOT NULL, DEFAULT 'active'   | active, inactive                     |
| created_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `active_status`

---

### working_schedules
Master working hours and breaks.

| Column      | Type         | Constraints                     | Description                          |
|-------------|--------------|---------------------------------|--------------------------------------|
| id          | UUID         | PRIMARY KEY                     | Unique schedule identifier           |
| master_id   | UUID         | NOT NULL, FK(master_profiles)   | Reference to master_profiles         |
| day_of_week | INTEGER      | NOT NULL, CHECK (0-6)           | 0=Sunday, 6=Saturday                 |
| start_time  | TIME         | NOT NULL                        | Working day start time               |
| end_time    | TIME         | NOT NULL                        | Working day end time                 |
| breaks      | JSON         | NULL                            | Array of break intervals             |
| created_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW()         | Record creation timestamp            |
| updated_at  | TIMESTAMP    | NOT NULL, DEFAULT NOW()         | Record update timestamp              |

**breaks JSON structure:**
```json
[
  {
    "start_time": "12:00",
    "end_time": "13:00"
  }
]
```

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `master_id`
- UNIQUE INDEX on (`master_id`, `day_of_week`)

**Foreign Keys:**
- `master_id` REFERENCES `master_profiles(id)` ON DELETE CASCADE

**Constraints:**
- `end_time` > `start_time`

---

### appointments
Salon appointments.

| Column       | Type         | Constraints                     | Description                          |
|--------------|--------------|---------------------------------|--------------------------------------|
| id           | UUID         | PRIMARY KEY                     | Unique appointment identifier        |
| client_id    | UUID         | NULL, FK(users)                 | Reference to users (nullable)        |
| client_name  | VARCHAR(255) | NOT NULL                        | Client name                          |
| client_phone | VARCHAR(50)  | NOT NULL                        | Client phone                         |
| master_id    | UUID         | NOT NULL, FK(master_profiles)   | Reference to master_profiles         |
| service_id   | UUID         | NOT NULL, FK(services)          | Reference to services                |
| start_at     | TIMESTAMP    | NOT NULL                        | Appointment start time               |
| end_at       | TIMESTAMP    | NOT NULL                        | Appointment end time                 |
| status       | ENUM         | NOT NULL, DEFAULT 'pending'     | pending, confirmed, completed, cancelled |
| source       | ENUM         | NOT NULL                        | public, internal                     |
| notes        | TEXT         | NULL                            | Additional notes                     |
| created_at   | TIMESTAMP    | NOT NULL, DEFAULT NOW()         | Record creation timestamp            |
| updated_at   | TIMESTAMP    | NOT NULL, DEFAULT NOW()         | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `client_id`
- INDEX on `master_id`
- INDEX on `service_id`
- INDEX on `start_at`
- INDEX on `status`
- INDEX on (`master_id`, `start_at`, `end_at`)

**Foreign Keys:**
- `client_id` REFERENCES `users(id)` ON DELETE SET NULL
- `master_id` REFERENCES `master_profiles(id)` ON DELETE RESTRICT
- `service_id` REFERENCES `services(id)` ON DELETE RESTRICT

**Constraints:**
- `end_at` > `start_at`

---

### notification_logs
Notification delivery tracking.

| Column         | Type         | Constraints                     | Description                          |
|----------------|--------------|---------------------------------|--------------------------------------|
| id             | UUID         | PRIMARY KEY                     | Unique notification identifier       |
| appointment_id | UUID         | NOT NULL, FK(appointments)      | Reference to appointments            |
| channel        | ENUM         | NOT NULL                        | sms, email, telegram, push           |
| recipient      | VARCHAR(255) | NOT NULL                        | Recipient address/phone              |
| status         | ENUM         | NOT NULL, DEFAULT 'pending'     | pending, sent, failed                |
| sent_at        | TIMESTAMP    | NULL                            | Actual send timestamp                |
| error_message  | TEXT         | NULL                            | Error description if failed          |
| created_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()         | Record creation timestamp            |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `appointment_id`
- INDEX on `channel`
- INDEX on `status`

**Foreign Keys:**
- `appointment_id` REFERENCES `appointments(id)` ON DELETE CASCADE

---

### booking_settings
System-wide booking configuration.

| Column     | Type         | Constraints                  | Description                          |
|------------|--------------|------------------------------|--------------------------------------|
| id         | UUID         | PRIMARY KEY                  | Unique setting identifier            |
| key        | VARCHAR(100) | NOT NULL, UNIQUE             | Setting key                          |
| value      | TEXT         | NOT NULL                     | Setting value (JSON or scalar)       |
| created_at | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `key`

**Default settings:**
```json
{
  "minimum_notice_hours": 2,
  "cancellation_window_hours": 24,
  "buffer_minutes": 15,
  "max_bookings_per_day": 10
}
```

---

### user_communication_preferences
User preferences for communication channels.

| Column                    | Type         | Constraints                  | Description                          |
|---------------------------|--------------|------------------------------|--------------------------------------|
| id                        | UUID         | PRIMARY KEY                  | Unique preference identifier         |
| user_id                   | UUID         | NOT NULL, UNIQUE, FK(users)  | Reference to users                   |
| telegram_enabled          | BOOLEAN      | DEFAULT false                | Telegram notifications enabled       |
| telegram_chat_id          | VARCHAR(255) | NULL                         | Telegram chat ID                     |
| telegram_username         | VARCHAR(255) | NULL                         | Telegram username                    |
| telegram_confirmations    | BOOLEAN      | DEFAULT true                 | Send confirmations via Telegram      |
| telegram_reminders        | BOOLEAN      | DEFAULT true                 | Send reminders via Telegram          |
| telegram_marketing        | BOOLEAN      | DEFAULT false                | Send marketing via Telegram          |
| viber_enabled             | BOOLEAN      | DEFAULT false                | Viber notifications enabled          |
| viber_id                  | VARCHAR(255) | NULL                         | Viber user ID                        |
| viber_phone               | VARCHAR(20)  | NULL                         | Phone number for Viber               |
| viber_confirmations       | BOOLEAN      | DEFAULT true                 | Send confirmations via Viber         |
| viber_reminders           | BOOLEAN      | DEFAULT true                 | Send reminders via Viber             |
| viber_marketing           | BOOLEAN      | DEFAULT false                | Send marketing via Viber             |
| email_enabled             | BOOLEAN      | DEFAULT true                 | Email notifications enabled          |
| email_address             | VARCHAR(255) | NOT NULL                     | Email address                        |
| email_verified            | BOOLEAN      | DEFAULT false                | Email verified                       |
| email_confirmations       | BOOLEAN      | DEFAULT true                 | Send confirmations via email         |
| email_reminders           | BOOLEAN      | DEFAULT true                 | Send reminders via email             |
| email_marketing           | BOOLEAN      | DEFAULT true                 | Send marketing via email             |
| email_newsletter          | BOOLEAN      | DEFAULT true                 | Subscribe to newsletter              |
| sms_enabled               | BOOLEAN      | DEFAULT false                | SMS notifications enabled            |
| sms_phone                 | VARCHAR(20)  | NULL                         | Phone number for SMS                 |
| sms_confirmations         | BOOLEAN      | DEFAULT false                | Send confirmations via SMS           |
| sms_reminders             | BOOLEAN      | DEFAULT true                 | Send reminders via SMS               |
| sms_otp                   | BOOLEAN      | DEFAULT true                 | Send OTP via SMS                     |
| whatsapp_enabled          | BOOLEAN      | DEFAULT false                | WhatsApp notifications enabled       |
| whatsapp_phone            | VARCHAR(20)  | NULL                         | Phone number for WhatsApp            |
| whatsapp_opt_in           | BOOLEAN      | DEFAULT false                | Explicit opt-in for WhatsApp         |
| whatsapp_opt_in_date      | TIMESTAMP    | NULL                         | When user opted in                   |
| webpush_enabled           | BOOLEAN      | DEFAULT false                | Web push enabled                     |
| webpush_subscription      | JSON         | NULL                         | Push subscription object             |
| calendar_auto_add         | BOOLEAN      | DEFAULT true                 | Auto-add to calendar                 |
| calendar_provider         | VARCHAR(20)  | NULL                         | google, outlook, apple, ics          |
| primary_channel           | VARCHAR(20)  | DEFAULT 'email'              | telegram, viber, email, whatsapp     |
| language                  | VARCHAR(5)   | DEFAULT 'uk'                 | uk, ru, en                           |
| timezone                  | VARCHAR(50)  | DEFAULT 'Europe/Kiev'        | User timezone                        |
| do_not_disturb_start      | TIME         | NULL                         | DND start time                       |
| do_not_disturb_end        | TIME         | NULL                         | DND end time                         |
| created_at                | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at                | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `user_id`
- INDEX on `telegram_chat_id`
- INDEX on `viber_id`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### communication_logs
Log of all sent communications.

| Column          | Type          | Constraints                  | Description                          |
|-----------------|---------------|------------------------------|--------------------------------------|
| id              | UUID          | PRIMARY KEY                  | Unique log identifier                |
| user_id         | UUID          | NULL, FK(users)              | Reference to users                   |
| appointment_id  | UUID          | NULL, FK(appointments)       | Related appointment                  |
| channel         | VARCHAR(20)   | NOT NULL                     | telegram, viber, email, sms, etc.    |
| type            | VARCHAR(50)   | NOT NULL                     | confirmation, reminder, marketing    |
| recipient       | VARCHAR(255)  | NOT NULL                     | Phone, email, chat_id                |
| subject         | VARCHAR(255)  | NULL                         | Message subject/title                |
| content         | TEXT          | NULL                         | Message content                      |
| status          | VARCHAR(20)   | NOT NULL                     | sent, delivered, failed, read        |
| provider        | VARCHAR(50)   | NULL                         | twilio, mailgun, telegram_api        |
| provider_id     | VARCHAR(255)  | NULL                         | External message ID                  |
| cost            | DECIMAL(10,6) | NULL                         | Cost in USD                          |
| error_message   | TEXT          | NULL                         | Error description if failed          |
| sent_at         | TIMESTAMP     | NULL                         | When message was sent                |
| delivered_at    | TIMESTAMP     | NULL                         | When message was delivered           |
| read_at         | TIMESTAMP     | NULL                         | When message was read                |
| created_at      | TIMESTAMP     | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `appointment_id`
- INDEX on `channel`
- INDEX on `status`
- INDEX on `sent_at`
- INDEX on `created_at`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE SET NULL
- `appointment_id` REFERENCES `appointments(id)` ON DELETE SET NULL

---

### telegram_bot_users
Telegram bot users mapping.

| Column          | Type         | Constraints                  | Description                          |
|-----------------|--------------|------------------------------|--------------------------------------|
| id              | UUID         | PRIMARY KEY                  | Unique identifier                    |
| user_id         | UUID         | NULL, FK(users)              | Reference to users (linked account)  |
| chat_id         | BIGINT       | NOT NULL, UNIQUE             | Telegram chat ID                     |
| username        | VARCHAR(255) | NULL                         | Telegram username                    |
| first_name      | VARCHAR(255) | NULL                         | User first name                      |
| last_name       | VARCHAR(255) | NULL                         | User last name                       |
| language_code   | VARCHAR(10)  | NULL                         | User language                        |
| is_bot          | BOOLEAN      | DEFAULT false                | Is bot user                          |
| state           | VARCHAR(50)  | DEFAULT 'idle'               | Conversation state                   |
| state_data      | JSON         | NULL                         | State context data                   |
| last_message_at | TIMESTAMP    | NULL                         | Last message timestamp               |
| created_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `chat_id`
- INDEX on `user_id`
- INDEX on `username`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE SET NULL

---

### viber_bot_users
Viber bot users mapping.

| Column          | Type         | Constraints                  | Description                          |
|-----------------|--------------|------------------------------|--------------------------------------|
| id              | UUID         | PRIMARY KEY                  | Unique identifier                    |
| user_id         | UUID         | NULL, FK(users)              | Reference to users (linked account)  |
| viber_id        | VARCHAR(255) | NOT NULL, UNIQUE             | Viber user ID                        |
| name            | VARCHAR(255) | NULL                         | User name                            |
| phone_number    | VARCHAR(20)  | NULL                         | Phone number                         |
| avatar          | TEXT         | NULL                         | Avatar URL                           |
| language        | VARCHAR(10)  | NULL                         | User language                        |
| state           | VARCHAR(50)  | DEFAULT 'idle'               | Conversation state                   |
| state_data      | JSON         | NULL                         | State context data                   |
| last_message_at | TIMESTAMP    | NULL                         | Last message timestamp               |
| created_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `viber_id`
- INDEX on `user_id`
- INDEX on `phone_number`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE SET NULL

---

### calendar_subscriptions
Calendar feed subscriptions for users.

| Column          | Type         | Constraints                  | Description                          |
|-----------------|--------------|------------------------------|--------------------------------------|
| id              | UUID         | PRIMARY KEY                  | Unique subscription identifier       |
| user_id         | UUID         | NOT NULL, FK(users)          | Reference to users                   |
| token           | VARCHAR(64)  | NOT NULL, UNIQUE             | Subscription token (secure random)   |
| provider        | VARCHAR(20)  | NULL                         | google, outlook, apple               |
| name            | VARCHAR(255) | NULL                         | Subscription name                    |
| is_active       | BOOLEAN      | DEFAULT true                 | Subscription active                  |
| last_accessed_at| TIMESTAMP    | NULL                         | Last feed access                     |
| access_count    | INTEGER      | DEFAULT 0                    | Number of accesses                   |
| created_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `token`
- INDEX on `user_id`
- INDEX on `is_active`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### ai_providers
AI provider configuration (OpenAI, Anthropic, etc.).

| Column           | Type         | Constraints                  | Description                          |
|------------------|--------------|------------------------------|--------------------------------------|
| id               | UUID         | PRIMARY KEY                  | Unique provider identifier           |
| provider_key     | VARCHAR(50)  | NOT NULL, UNIQUE             | Provider key (openai, anthropic)     |
| name             | VARCHAR(100) | NOT NULL                     | Provider display name                |
| enabled          | BOOLEAN      | NOT NULL, DEFAULT true       | Whether provider is active           |
| api_key_encrypted| TEXT         | NULL                         | Encrypted API key                    |
| config           | JSON         | NULL                         | Provider-specific configuration      |
| created_at       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at       | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `provider_key`

---

### ai_models
AI models available from providers.

| Column             | Type          | Constraints                     | Description                          |
|--------------------|---------------|---------------------------------|--------------------------------------|
| id                 | UUID          | PRIMARY KEY                     | Unique model identifier              |
| provider_id        | UUID          | NOT NULL, FK(ai_providers)      | Reference to ai_providers            |
| model_key          | VARCHAR(100)  | NOT NULL                        | Model identifier                     |
| name               | VARCHAR(100)  | NOT NULL                        | Model display name                   |
| context_window     | INTEGER       | NULL                            | Maximum context window size          |
| cost_per_1k_input  | DECIMAL(10,6) | NULL                            | Cost per 1K input tokens             |
| cost_per_1k_output | DECIMAL(10,6) | NULL                            | Cost per 1K output tokens            |
| enabled            | BOOLEAN       | NOT NULL, DEFAULT true          | Whether model is active              |
| capabilities       | JSON          | NULL                            | Model capabilities metadata          |
| created_at         | TIMESTAMP     | NOT NULL, DEFAULT NOW()         | Record creation timestamp            |
| updated_at         | TIMESTAMP     | NOT NULL, DEFAULT NOW()         | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `provider_id`
- UNIQUE INDEX on (`provider_id`, `model_key`)

**Foreign Keys:**
- `provider_id` REFERENCES `ai_providers(id)` ON DELETE CASCADE

---

### user_behavior_analytics
User booking behavior analysis and patterns.

| Column                | Type          | Constraints                  | Description                          |
|-----------------------|---------------|------------------------------|--------------------------------------|
| id                    | UUID          | PRIMARY KEY                  | Unique analytics identifier          |
| user_id               | UUID          | NOT NULL, FK(users)          | Reference to users                   |
| feature_vector        | JSON          | NULL                         | User feature vector for ML           |
| cluster_id            | INTEGER       | NULL                         | User segment/cluster ID              |
| booking_frequency     | VARCHAR(20)   | NULL                         | weekly, monthly, quarterly           |
| preferred_masters     | JSON          | NULL                         | Array of preferred master IDs        |
| preferred_services    | JSON          | NULL                         | Array of preferred service IDs       |
| preferred_time_slots  | JSON          | NULL                         | Preferred booking times              |
| average_interval_days | INTEGER       | NULL                         | Average days between bookings        |
| last_booking_date     | DATE          | NULL                         | Date of last booking                 |
| churn_risk_score      | DECIMAL(5,4)  | NULL                         | 0-1 churn probability                |
| lifetime_value        | DECIMAL(10,2) | NULL                         | Total customer lifetime value        |
| analyzed_at           | TIMESTAMP     | DEFAULT NOW()                | Last analysis timestamp              |
| created_at            | TIMESTAMP     | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| updated_at            | TIMESTAMP     | NOT NULL, DEFAULT NOW()      | Record update timestamp              |

**Indexes:**
- PRIMARY KEY on `id`
- UNIQUE INDEX on `user_id`
- INDEX on `cluster_id`
- INDEX on `churn_risk_score`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE

---

### ai_recommendations
AI-generated recommendations for users.

| Column               | Type         | Constraints                  | Description                          |
|----------------------|--------------|------------------------------|--------------------------------------|
| id                   | UUID         | PRIMARY KEY                  | Unique recommendation identifier     |
| user_id              | UUID         | NOT NULL, FK(users)          | Reference to users                   |
| recommendation_type  | VARCHAR(50)  | NOT NULL                     | next_service, time_slot, etc.        |
| service_id           | UUID         | NULL, FK(services)           | Recommended service                  |
| master_id            | UUID         | NULL, FK(master_profiles)    | Recommended master                   |
| suggested_date       | DATE         | NULL                         | Suggested booking date               |
| suggested_time_slots | JSON         | NULL                         | Array of suggested time slots        |
| confidence_score     | DECIMAL(5,4) | NOT NULL                     | 0-1 confidence in recommendation     |
| reasoning            | TEXT         | NULL                         | AI explanation for recommendation    |
| status               | VARCHAR(20)  | NOT NULL, DEFAULT 'pending'  | pending, accepted, dismissed         |
| accepted_at          | TIMESTAMP    | NULL                         | When recommendation was accepted     |
| created_at           | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| expires_at           | TIMESTAMP    | NULL                         | Recommendation expiration time       |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `status`
- INDEX on `created_at`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE CASCADE
- `service_id` REFERENCES `services(id)` ON DELETE SET NULL
- `master_id` REFERENCES `master_profiles(id)` ON DELETE SET NULL

---

### ai_conversations
AI chat conversations.

| Column     | Type         | Constraints                  | Description                          |
|------------|--------------|------------------------------|--------------------------------------|
| id         | UUID         | PRIMARY KEY                  | Unique conversation identifier       |
| user_id    | UUID         | NULL, FK(users)              | Reference to users (nullable)        |
| channel    | VARCHAR(20)  | NOT NULL                     | web, telegram, whatsapp              |
| started_at | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Conversation start time              |
| ended_at   | TIMESTAMP    | NULL                         | Conversation end time                |
| status     | VARCHAR(20)  | NOT NULL, DEFAULT 'active'   | active, completed, abandoned         |
| metadata   | JSON         | NULL                         | Additional conversation metadata     |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `user_id`
- INDEX on `status`
- INDEX on `started_at`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE SET NULL

---

### ai_messages
Messages within AI conversations.

| Column          | Type         | Constraints                     | Description                          |
|-----------------|--------------|----------------------------------|--------------------------------------|
| id              | UUID         | PRIMARY KEY                      | Unique message identifier            |
| conversation_id | UUID         | NOT NULL, FK(ai_conversations)   | Reference to ai_conversations        |
| role            | VARCHAR(20)  | NOT NULL                         | user, assistant, system              |
| content         | TEXT         | NOT NULL                         | Message content                      |
| model_used      | VARCHAR(100) | NULL                             | AI model used for response           |
| tokens_used     | INTEGER      | NULL                             | Tokens consumed                      |
| intent          | VARCHAR(50)  | NULL                             | Detected user intent                 |
| entities        | JSON         | NULL                             | Extracted entities                   |
| created_at      | TIMESTAMP    | NOT NULL, DEFAULT NOW()          | Record creation timestamp            |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `conversation_id`
- INDEX on `created_at`

**Foreign Keys:**
- `conversation_id` REFERENCES `ai_conversations(id)` ON DELETE CASCADE

---

### ai_insights
AI-generated business insights.

| Column         | Type         | Constraints                  | Description                          |
|----------------|--------------|------------------------------|--------------------------------------|
| id             | UUID         | PRIMARY KEY                  | Unique insight identifier            |
| insight_type   | VARCHAR(50)  | NOT NULL                     | opportunity, warning, trend          |
| category       | VARCHAR(50)  | NOT NULL                     | scheduling, performance, marketing   |
| title          | VARCHAR(255) | NOT NULL                     | Insight title                        |
| description    | TEXT         | NOT NULL                     | Detailed insight description         |
| data           | JSON         | NULL                         | Supporting data for insight          |
| severity       | VARCHAR(20)  | NOT NULL                     | low, medium, high                    |
| actionable     | BOOLEAN      | DEFAULT true                 | Whether insight requires action      |
| status         | VARCHAR(20)  | NOT NULL, DEFAULT 'new'      | new, acknowledged, dismissed         |
| created_at     | TIMESTAMP    | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |
| acknowledged_at| TIMESTAMP    | NULL                         | When insight was acknowledged        |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `category`
- INDEX on `severity`
- INDEX on `status`
- INDEX on `created_at`

---

### ai_usage_logs
AI usage tracking for cost monitoring.

| Column        | Type          | Constraints                  | Description                          |
|---------------|---------------|------------------------------|--------------------------------------|
| id            | UUID          | PRIMARY KEY                  | Unique log identifier                |
| provider      | VARCHAR(50)   | NOT NULL                     | AI provider name                     |
| model         | VARCHAR(100)  | NOT NULL                     | Model used                           |
| feature       | VARCHAR(50)   | NOT NULL                     | chat, recommendations, insights      |
| user_id       | UUID          | NULL, FK(users)              | User who triggered request           |
| tokens_input  | INTEGER       | NULL                         | Input tokens consumed                |
| tokens_output | INTEGER       | NULL                         | Output tokens consumed               |
| cost          | DECIMAL(10,6) | NULL                         | Cost in USD                          |
| latency_ms    | INTEGER       | NULL                         | Response latency in milliseconds     |
| status        | VARCHAR(20)   | NOT NULL                     | success, error                       |
| error_message | TEXT          | NULL                         | Error description if failed          |
| created_at    | TIMESTAMP     | NOT NULL, DEFAULT NOW()      | Record creation timestamp            |

**Indexes:**
- PRIMARY KEY on `id`
- INDEX on `provider`
- INDEX on `feature`
- INDEX on `user_id`
- INDEX on `created_at`

**Foreign Keys:**
- `user_id` REFERENCES `users(id)` ON DELETE SET NULL

---

## Relationships Summary

### Core Booking Relationships
- **users** 1:1 **master_profiles** (one user can have one master profile if role is master)
- **master_profiles** 1:N **working_schedules** (master has multiple schedules for different days)
- **master_profiles** 1:N **appointments** (master has multiple appointments)
- **services** 1:N **appointments** (service can be used in multiple appointments)
- **users** 1:N **appointments** (client can have multiple appointments, optional FK)
- **appointments** 1:N **notification_logs** (appointment can have multiple notifications)

### Communication Relationships
- **users** 1:1 **user_communication_preferences** (each user has communication preferences)
- **users** 1:N **communication_logs** (user has multiple communication logs)
- **appointments** 1:N **communication_logs** (appointment can have multiple notifications)
- **users** 1:1 **telegram_bot_users** (user can link Telegram account)
- **users** 1:1 **viber_bot_users** (user can link Viber account)
- **users** 1:N **calendar_subscriptions** (user can have multiple calendar subscriptions)

### AI Relationships
- **ai_providers** 1:N **ai_models** (provider has multiple models)
- **users** 1:1 **user_behavior_analytics** (each user has one analytics profile)
- **users** 1:N **ai_recommendations** (user can receive multiple recommendations)
- **services** 1:N **ai_recommendations** (service can be recommended multiple times)
- **master_profiles** 1:N **ai_recommendations** (master can be recommended multiple times)
- **users** 1:N **ai_conversations** (user can have multiple conversations, optional FK)
- **ai_conversations** 1:N **ai_messages** (conversation has multiple messages)
- **users** 1:N **ai_usage_logs** (tracks AI usage per user, optional FK)

---

## Constraints and Business Rules

### Appointment Validation
1. `end_at` must be greater than `start_at`
2. Appointment duration must match service duration
3. Appointment must not overlap with another appointment for the same master
4. Appointment must fit within master working hours
5. Appointment must not fall within master break times
6. Appointment must respect minimum notice period
7. Cancellation must respect cancellation window

### Data Integrity
1. Cannot delete master if they have future appointments (RESTRICT)
2. Cannot delete service if it's used in future appointments (RESTRICT)
3. If user is deleted, their appointments remain but client_id is set to NULL
4. If master profile is deleted, their schedules are deleted (CASCADE)
5. If appointment is deleted, notification logs are deleted (CASCADE)

---

## Migration Notes

### Initial Setup
1. Create `users` table
2. Create `master_profiles` table with FK to `users`
3. Create `services` table
4. Create `working_schedules` table with FK to `master_profiles`
5. Create `appointments` table with FKs to `users`, `master_profiles`, `services`
6. Create `notification_logs` table with FK to `appointments`
7. Create `booking_settings` table
8. Insert default booking settings
9. Create admin user

### Sample Data
```sql
-- Admin user
INSERT INTO users (id, name, email, phone, password_hash, role, status)
VALUES (uuid_generate_v4(), 'Admin', 'admin@salon.local', '+380501234567', '$hashed', 'admin', 'active');

-- Default settings
INSERT INTO booking_settings (id, key, value)
VALUES 
  (uuid_generate_v4(), 'minimum_notice_hours', '2'),
  (uuid_generate_v4(), 'cancellation_window_hours', '24'),
  (uuid_generate_v4(), 'buffer_minutes', '15'),
  (uuid_generate_v4(), 'max_bookings_per_day', '10');

-- Services
INSERT INTO services (id, name, duration_min, price, active_status)
VALUES 
  (uuid_generate_v4(), 'Стрижка', 30, 300.00, 'active'),
  (uuid_generate_v4(), 'Фарбування', 120, 1500.00, 'active'),
  (uuid_generate_v4(), 'Манікюр', 60, 400.00, 'active');
```

---

## Query Examples

### Get available time slots for a master on a specific date
```sql
WITH master_schedule AS (
  SELECT start_time, end_time, breaks
  FROM working_schedules
  WHERE master_id = :master_id
    AND day_of_week = EXTRACT(DOW FROM :target_date)
),
existing_appointments AS (
  SELECT start_at, end_at
  FROM appointments
  WHERE master_id = :master_id
    AND DATE(start_at) = :target_date
    AND status NOT IN ('cancelled')
)
SELECT * FROM master_schedule, existing_appointments;
-- Application logic then calculates free slots
```

### Get master appointments for a day
```sql
SELECT 
  a.id,
  a.client_name,
  a.client_phone,
  s.name AS service_name,
  a.start_at,
  a.end_at,
  a.status
FROM appointments a
JOIN services s ON a.service_id = s.id
WHERE a.master_id = :master_id
  AND DATE(a.start_at) = :target_date
ORDER BY a.start_at;
```

### Check for appointment conflicts
```sql
SELECT COUNT(*) > 0 AS has_conflict
FROM appointments
WHERE master_id = :master_id
  AND status NOT IN ('cancelled')
  AND (
    (start_at < :new_end_at AND end_at > :new_start_at)
  );
```
