# Communication Channels Specification

## Overview

Система підтримує багатоканальну комунікацію з клієнтами для нагадувань, підтверджень та маркетингових повідомлень.

---

## 1. Telegram Bot

### Functionality
- Підтвердження та нагадування про записи
- Бронювання через чат-бота (AI-powered)
- Двостороння комунікація
- Rich media (фото послуг, локація салону)
- Inline keyboards для швидких дій

### Implementation
- **Library**: Laravel Telegram Bot SDK або `telegram-bot/api`
- **Setup**: 
  - Create bot via [@BotFather](https://t.me/botfather)
  - Get bot token
  - Set webhook: `POST https://api.telegram.org/bot{token}/setWebhook`
  
### Message Types
1. **Appointment Confirmation**
   ```
   ✅ Ваш запис підтверджено!
   
   📅 Дата: 15 квітня 2026, 14:00
   💇 Послуга: Стрижка + укладка
   👤 Майстер: Анна Петренко
   📍 Адреса: вул. Хрещатик, 25
   
   [Переглянути деталі] [Скасувати запис]
   ```

2. **Appointment Reminder** (24h before)
   ```
   ⏰ Нагадування про запис
   
   Завтра о 14:00 у вас запис до майстра Анна.
   Послуга: Стрижка + укладка
   
   [Підтвердити] [Перенести] [Скасувати]
   ```

3. **AI Chat Booking**
   ```
   Клієнт: Хочу записатись на стрижку
   Бот: З ким би ви хотіли записатися? 
        - Анна (найближчий вільний час: завтра 14:00)
        - Марія (найближчий вільний час: післязавтра 11:00)
   ```

### Bot Commands
- `/start` - Початок роботи
- `/book` - Створити новий запис
- `/myappointments` - Мої записи
- `/cancel` - Скасувати запис
- `/help` - Допомога

### Webhook Endpoint
```
POST /api/webhooks/telegram
```

---

## 2. Viber Bot

### Functionality
- Підтвердження та нагадування про записи
- Rich Cards з зображеннями
- Quick Reply buttons
- Carousel для вибору послуг
- Location sharing

### Implementation
- **Library**: Viber REST API
- **Setup**:
  - Create bot via [Viber Admin Panel](https://partners.viber.com/)
  - Get authentication token
  - Set webhook

### Message Types
1. **Rich Card Confirmation**
   ```json
   {
     "type": "rich_media",
     "ButtonsGroupColumns": 6,
     "ButtonsGroupRows": 2,
     "Buttons": [
       {
         "Text": "Ваш запис підтверджено ✅\n15.04.2026, 14:00\nСтрижка + укладка\nМайстер: Анна",
         "ActionType": "reply",
         "ActionBody": "view_details"
       }
     ]
   }
   ```

2. **Carousel for Services**
   - Відображення доступних послуг з фото
   - Кнопки для швидкого вибору

### Webhook Endpoint
```
POST /api/webhooks/viber
```

---

## 3. Email Notifications

### Functionality
- Підтвердження запису (HTML template)
- Нагадування (з календарною подією в attach)
- Маркетингові розсилки
- Персоналізовані рекомендації від AI

### Implementation
- **Service**: Laravel Mail (SMTP/API)
- **Providers**: Mailgun, SendGrid, AWS SES
- **Templates**: Blade templates + MJML for responsive

### Email Types

#### 3.1 Appointment Confirmation
**Subject**: Підтвердження запису до салону "Beauty Place"

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>/* Responsive styles */</style>
</head>
<body>
  <div class="container">
    <h1>Дякуємо за запис! ✨</h1>
    
    <div class="appointment-card">
      <h2>Деталі запису:</h2>
      <p><strong>Дата:</strong> 15 квітня 2026</p>
      <p><strong>Час:</strong> 14:00</p>
      <p><strong>Послуга:</strong> Стрижка + укладка (60 хв)</p>
      <p><strong>Майстер:</strong> Анна Петренко</p>
      <p><strong>Вартість:</strong> 450 грн</p>
    </div>
    
    <div class="actions">
      <a href="{{ reschedule_url }}" class="btn">Перенести запис</a>
      <a href="{{ cancel_url }}" class="btn btn-secondary">Скасувати</a>
    </div>
    
    <div class="calendar-attachment">
      📅 <a href="{{ ics_download_url }}">Додати до календаря</a>
    </div>
    
    <div class="location">
      📍 м. Київ, вул. Хрещатик, 25
      <a href="{{ maps_url }}">Відкрити на карті</a>
    </div>
  </div>
</body>
</html>
```

#### 3.2 Reminder Email (24h before)
**Subject**: ⏰ Завтра у вас запис о 14:00

**Content**:
- Деталі запису
- Кнопка підтвердження
- Інструкції як знайти салон
- Календарний файл (.ics)

#### 3.3 Marketing Newsletter
**Subject**: Спеціальна пропозиція для вас від AI 🎁

**Content**:
- Персоналізовані рекомендації
- Акції та знижки
- Новини салону
- Підписка/відписка

#### 3.4 Feedback Request (after appointment)
**Subject**: Як пройшов ваш візит? Залиште відгук

---

## 4. Calendar Integration

### Supported Platforms
1. **Google Calendar**
2. **Apple Calendar (iCal)**
3. **Microsoft Outlook / Office 365**
4. **Any calendar app (via .ics file)**

### Implementation Methods

#### 4.1 iCalendar (.ics) File Generation
**Standard**: RFC 5545

```php
// Laravel implementation
use Spatie\IcalendarGenerator\Components\Calendar;
use Spatie\IcalendarGenerator\Components\Event;

$event = Event::create()
    ->name('Стрижка + укладка')
    ->description('Запис до майстра Анна Петренко')
    ->startsAt($appointment->start_at)
    ->endsAt($appointment->end_at)
    ->address('м. Київ, вул. Хрещатик, 25')
    ->organizer('salon@example.com', 'Beauty Place')
    ->attendee('client@example.com', $client->name)
    ->alertMinutesBefore(1440); // 24h reminder

$calendar = Calendar::create()
    ->event($event)
    ->get();

// Return as downloadable .ics file
```

**Email Attachment**:
```php
Mail::send(new AppointmentConfirmation($appointment))
    ->attach($icsFile, [
        'as' => 'appointment.ics',
        'mime' => 'text/calendar',
    ]);
```

#### 4.2 Google Calendar API Integration
**Direct Add to Calendar**:
```
https://calendar.google.com/calendar/render?action=TEMPLATE&text=Стрижка&dates=20260415T110000Z/20260415T120000Z&details=Запис+до+салону&location=Хрещатик+25
```

**Features**:
- One-click add to Google Calendar
- Automatic sync
- Reminders managed by Google

#### 4.3 Microsoft Graph API (Outlook)
**OAuth 2.0 Integration**:
- User authorizes app
- Create events in user's Outlook calendar
- Manage reminders
- Two-way sync (optional)

#### 4.4 Apple Calendar (CalDAV)
**Implementation**:
- .ics file download
- Email attachment
- WebDAV protocol for sync

### Calendar Event Features
- **Title**: Service name + Salon name
- **Description**: Appointment details, master info
- **Location**: Salon address + Google Maps link
- **Reminders**: 
  - 24 hours before
  - 1 hour before
  - 15 minutes before
- **Attendees**: Client email, master email
- **Status**: CONFIRMED / TENTATIVE / CANCELLED
- **Recurrence**: For recurring appointments (future)

### API Endpoints
```
GET  /api/appointments/{id}/calendar/ics       - Download .ics file
POST /api/appointments/{id}/calendar/google    - Add to Google Calendar
POST /api/appointments/{id}/calendar/outlook   - Add to Outlook
GET  /api/calendar/subscribe                   - Subscribe to all appointments (webcal://)
```

---

## 5. Additional Communication Channels

### 5.1 WhatsApp Business API ⭐ **Recommended**
**Why**: Найпопулярніший месенджер в Україні

**Features**:
- Verified business account
- Rich media messages
- Message templates (pre-approved)
- Quick replies
- Interactive buttons
- Payment integration (future)

**Implementation**:
- **Provider**: Twilio, MessageBird, 360dialog
- **Message Templates** (require Facebook approval):
  - Appointment confirmation
  - Reminder
  - Cancellation

**Example**:
```
✅ Beauty Place

Ваш запис підтверджено!

📅 15 квітня, 14:00
💇 Стрижка + укладка
👤 Анна Петренко

📍 Хрещатик, 25
[Переглянути на карті]

Бажаєте щось змінити?
[Перенести] [Скасувати]
```

**Cost**: ~$0.005-0.015 per message

---

### 5.2 SMS (via Twilio) ✅ **Essential**
**Why**: Універсальний канал, працює на всіх телефонах

**Use Cases**:
- OTP для авторизації
- Критичні нагадування
- Backup channel якщо інші не працюють

**Example**:
```
Beauty Place: Нагадуємо, завтра 15.04 о 14:00 у вас запис до Анни (Стрижка). Підтвердіть: beautysalon.com/c/ABC123
```

**Cost**: ~$0.01-0.02 per SMS (Ukraine)

---

### 5.3 Web Push Notifications 🔔
**Why**: Працюють на desktop і mobile без додатку

**Features**:
- Browser notifications (Chrome, Firefox, Safari)
- Rich notifications з зображеннями
- Action buttons
- Works offline (service workers)

**Implementation**:
- **Service**: OneSignal, Firebase Cloud Messaging, Pusher Beams
- **Protocol**: Web Push API

**Example**:
```
Beauty Place 🎨
Нагадуємо про запис завтра о 14:00
[Підтвердити] [Переглянути]
```

**User Permission**: Required
**Cost**: Free (most providers have free tier)

---

### 5.4 In-App Notifications 📱
**Why**: For mobile app users (future)

**Features**:
- Real-time updates
- Badge counts
- Sound & vibration
- Deep linking to appointment

**Implementation**:
- **iOS**: APNs (Apple Push Notification service)
- **Android**: Firebase Cloud Messaging
- **React Native**: react-native-push-notification

---

### 5.5 Voice Calls (Automated) ☎️
**Why**: For important reminders or missed appointments

**Features**:
- Text-to-Speech reminders
- Interactive Voice Response (IVR)
- Multilingual support
- Fallback for users without internet

**Implementation**:
- **Provider**: Twilio Voice API
- **Use Cases**:
  - Reminder 1 hour before appointment
  - No-show follow-up
  - Important schedule changes

**Example Script**:
```
Доброго дня! Це Beauty Place. 
Нагадуємо, що через годину у вас запис до майстра Анни.
Натисніть 1 щоб підтвердити, 2 щоб скасувати.
```

**Cost**: ~$0.02-0.04 per minute

---

### 5.6 Facebook Messenger 💬
**Why**: Popular social platform

**Features**:
- Messenger bot
- Rich cards
- Quick replies
- Persistent menu
- Customer chat plugin for website

**Implementation**:
- **Platform**: Facebook Messenger Platform
- **Webhooks**: For messages and events
- **Integration**: Facebook Page required

**Use Cases**:
- Customer support
- Booking through Messenger
- Reminders (limited by Facebook policies)

---

### 5.7 Instagram Direct 📸
**Why**: Visual platform, popular with beauty industry

**Features**:
- Direct messages
- Story replies
- Booking via DM
- Share appointments to Story

**Limitations**:
- No official bot API (manual responses or Meta Business API)
- Story mentions for marketing

**Use Cases**:
- Customer inquiries
- Sharing before/after photos
- Marketing campaigns

---

### 5.8 Chatbot on Website 💬
**Why**: Immediate assistance, AI-powered

**Features**:
- Live chat widget
- AI-powered responses (using our AI agent)
- Handoff to human support
- Proactive engagement
- Multilingual

**Implementation**:
- **Custom**: Build with React + WebSocket
- **Third-party**: Intercom, Drift, Crisp
- **AI Integration**: Use our conversational AI backend

**Example**:
```
👋 Привіт! Я AI-асистент Beauty Place. 
Допоможу записатися або відповім на питання.

Чим можу допомогти?
[🗓 Записатися] [📍 Локація] [💰 Ціни]
```

---

### 5.9 Chatbot на сайті 💻
**Why**: 24/7 підтримка без додаткових додатків

**Implementation**: Вже описано вище як частина AI агента

---

## 6. Multi-Channel Communication Strategy

### Priority Channels (MVP)
1. ✅ **Telegram** - основний месенджер
2. ✅ **Viber** - backup месенджер
3. ✅ **Email** - офіційні підтвердження
4. ✅ **Calendar Integration** (.ics files)
5. ✅ **SMS** - критичні повідомлення

### Recommended Additional Channels
1. ⭐ **WhatsApp Business** - якщо бюджет дозволяє
2. 🔔 **Web Push** - для web клієнтів
3. 💬 **Website Chatbot** - AI assistant

### Future Enhancements
- Voice calls for VIP clients
- Facebook Messenger integration
- Instagram Direct automation
- Mobile app with push notifications

---

## 7. Communication Preferences

### User Settings
Users should be able to configure their preferences:

```typescript
interface CommunicationPreferences {
  telegram: {
    enabled: boolean;
    chatId?: string;
    notifications: {
      confirmations: boolean;
      reminders: boolean;
      marketing: boolean;
    };
  };
  viber: {
    enabled: boolean;
    phoneNumber?: string;
    notifications: {
      confirmations: boolean;
      reminders: boolean;
      marketing: boolean;
    };
  };
  email: {
    enabled: boolean;
    address: string;
    notifications: {
      confirmations: boolean;
      reminders: boolean;
      marketing: boolean;
      newsletter: boolean;
    };
  };
  sms: {
    enabled: boolean;
    phoneNumber: string;
    notifications: {
      confirmations: boolean;
      reminders: boolean;
      otp: boolean;
    };
  };
  whatsapp?: {
    enabled: boolean;
    phoneNumber?: string;
    optIn: boolean; // Required for GDPR
  };
  webPush: {
    enabled: boolean;
    subscription?: PushSubscription;
  };
  calendar: {
    autoAdd: boolean;
    preferredProvider: 'google' | 'outlook' | 'apple' | 'ics';
  };
  primaryChannel: 'telegram' | 'viber' | 'email' | 'whatsapp';
  language: 'uk' | 'ru' | 'en';
  timezone: string;
}
```

### Fallback Strategy
```
1. Try primary channel (e.g., Telegram)
2. If failed -> Try secondary (e.g., Viber)
3. If failed -> Try email
4. If critical -> SMS
5. Log all delivery attempts
```

---

## 8. Message Templates

### Template Variables
```php
[
  'client_name' => 'Іван Петренко',
  'appointment_date' => '15 квітня 2026',
  'appointment_time' => '14:00',
  'service_name' => 'Стрижка + укладка',
  'service_duration' => '60 хв',
  'service_price' => '450 грн',
  'master_name' => 'Анна Петренко',
  'salon_name' => 'Beauty Place',
  'salon_address' => 'м. Київ, вул. Хрещатик, 25',
  'salon_phone' => '+380 44 123 4567',
  'confirmation_url' => 'https://...',
  'reschedule_url' => 'https://...',
  'cancel_url' => 'https://...',
  'maps_url' => 'https://maps.google.com/...',
]
```

### Message Timing
- **Confirmation**: Immediately after booking
- **Reminder 1**: 24 hours before
- **Reminder 2**: 2 hours before
- **Reminder 3**: 15 minutes before (optional, SMS only)
- **Thank you**: 1 hour after appointment
- **Feedback request**: 24 hours after appointment
- **Re-engagement**: If no booking for 30+ days

---

## 9. GDPR & Privacy Compliance

### Consent Management
- ✅ Explicit opt-in for marketing messages
- ✅ Opt-out link in every message
- ✅ Data retention policy
- ✅ Right to be forgotten
- ✅ Export user data

### Rate Limiting
- Max 3 messages per day (excluding critical)
- No marketing messages after 21:00
- Respect "Do Not Disturb" hours

---

## 10. Monitoring & Analytics

### Metrics to Track
- **Delivery Rate**: % messages successfully delivered
- **Open Rate**: Email opens, message reads
- **Click Rate**: Link clicks
- **Response Rate**: User interactions
- **Channel Preference**: Which channels users prefer
- **Cost per Channel**: Compare channel efficiency
- **No-show Rate**: By communication channel

### Dashboard Widgets (Filament)
- Channel usage statistics
- Delivery success rate
- Cost comparison
- User preferences distribution

---

## 11. Implementation Priority

### Phase 1 (MVP) - 2 weeks
- [x] Email with .ics calendar files
- [x] Telegram bot (basic notifications)
- [x] Viber bot (basic notifications)
- [x] SMS via Twilio (critical only)

### Phase 2 - 2 weeks
- [ ] Telegram AI chat booking
- [ ] Viber rich media
- [ ] Google Calendar direct integration
- [ ] WhatsApp Business (if approved)

### Phase 3 - 2 weeks
- [ ] Web Push notifications
- [ ] Microsoft Outlook integration
- [ ] Website chatbot widget
- [ ] Voice call reminders

### Phase 4 - Future
- [ ] Facebook Messenger
- [ ] Instagram automation
- [ ] Mobile app push notifications
- [ ] Advanced AI across all channels

---

## 12. Cost Estimation

| Channel | Setup Cost | Per Message Cost | Monthly (1000 msg) |
|---------|-----------|------------------|---------------------|
| Email (Mailgun) | Free | $0.0005 | $0.50 |
| Telegram | Free | Free | $0 |
| Viber | Free | $0.003-0.01 | $3-10 |
| SMS (Twilio) | Free | $0.01-0.02 | $10-20 |
| WhatsApp | $0 | $0.005-0.015 | $5-15 |
| Web Push | Free | Free | $0 |
| Voice Calls | Free | $0.02-0.04/min | varies |

**Total Monthly Cost** (1000 clients, mixed channels): ~$20-50

---

## 13. Technical Stack

### Backend (Laravel)
```php
// Notification Channels
- laravel/slack-notification-channel
- laravel-notification-channels/telegram
- laravel-notification-channels/viber
- laravel-notification-channels/webpush
- twilio/sdk (SMS & WhatsApp)
- spatie/laravel-calendar-links
- spatie/icalendar-generator
```

### External Services
- **Telegram**: Bot API
- **Viber**: REST API
- **Email**: Mailgun, SendGrid, AWS SES
- **SMS**: Twilio
- **WhatsApp**: Twilio, 360dialog
- **Push**: Firebase Cloud Messaging, OneSignal
- **Calendar**: Google Calendar API, Microsoft Graph API

---

## Next Steps
1. Choose priority channels
2. Set up development accounts (Telegram Bot, Viber, Mailgun)
3. Implement notification infrastructure
4. Create message templates
5. Test delivery across channels
6. Monitor and optimize
