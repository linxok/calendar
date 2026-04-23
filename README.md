# Calendar Booking Specification for a Beauty Salon

## 1. Product Summary
Build a calendar-based booking system for a beauty salon where clients can reserve time slots with specific masters. The system must support both public client booking and internal staff booking.

## 2. Product Goal
Create a reliable scheduling experience that helps:
- clients find and book available time slots
- salon staff manage master availability and appointments
- prevent double bookings and schedule conflicts
- keep appointments organized by date, time, service, and master

## 3. Scope
### In scope
- calendar view by day, week, and month
- appointment creation, editing, cancellation, and rescheduling
- master-specific schedules
- working hours and breaks
- service duration management
- validation against overlapping appointments
- notifications via SMS, email, Telegram, and push
- role-based access for client, master, and administrator
- **AI agent integration with multi-model support**
- **intelligent recommendations and predictive analytics**
- **conversational booking assistant**
- **business intelligence and insights**

### Out of scope for the first version
- online payments and deposits
- multiple salon branches
- recurring appointments

## 4. Confirmed Requirements
- **Users**: clients, masters, and administrators
- **Booking channels**: public client booking and internal staff booking
- **Master selection**: client chooses a specific master
- **Services**: haircut, coloring, manicure, and other services
- **Duration model**: duration depends on the service type
- **Branches**: only one salon location in the first version
- **Notifications**: SMS, email, Telegram, push
- **Payment model**: no payment or deposit in the first version
- **Booking rules**: minimum notice, cancellation window, buffer time, booking limits
- **Access control**: role-based permissions
- **AI Integration**: multi-model AI support with configurable providers (OpenAI, Anthropic, Google, Mistral, local models)
- **AI Features**: user behavior analysis, predictive recommendations, conversational assistant, business intelligence

## 5. Core User Roles
### Client
- views available time slots
- selects service, master, date, and time
- creates, reschedules, or cancels own bookings if allowed by rules

### Master
- views own schedule and availability
- sees assigned appointments
- manages working time only if permitted by administrator

### Administrator
- manages masters, services, schedules, and bookings
- creates and edits bookings on behalf of clients
- configures working hours, breaks, buffers, and booking rules
- configures AI providers and models
- reviews AI-generated insights and recommendations

### AI Agent
- analyzes user behavior and booking patterns
- generates personalized service and time recommendations
- provides conversational booking assistance
- generates business intelligence insights
- assists with marketing and customer retention
- supports masters with schedule optimization
- ensures quality through conflict detection and validation

## 6. Main User Flows
### 6.1 Public client booking
1. Client opens booking page.
2. Client selects service.
3. Client selects master.
4. System shows available dates and time slots.
5. Client chooses a slot and submits booking.
6. System validates rules and creates the appointment.
7. System sends notifications.

### 6.2 Internal staff booking
1. Administrator opens internal calendar.
2. Administrator selects master, service, date, and time.
3. System checks availability.
4. Administrator creates booking for a client.

### 6.3 Rescheduling
1. User opens an existing appointment.
2. User selects a new date/time.
3. System checks conflicts and booking rules.
4. Appointment is updated and notifications are sent.

### 6.4 Cancellation
1. User opens a booking.
2. User requests cancellation.
3. System checks cancellation window.
4. Appointment is canceled if permitted.
5. Notifications are sent.

### 6.5 AI-Powered Booking (Conversational)
1. Client opens chat interface or sends message.
2. Client describes need in natural language (e.g., "I need a haircut next Friday").
3. AI Agent analyzes intent and extracts entities (service, date, preferences).
4. AI Agent retrieves available slots and user history.
5. AI Agent suggests optimal options based on patterns.
6. Client confirms selection via conversation.
7. System creates booking and sends confirmation.

### 6.6 AI Recommendation Flow
1. Client logs in or visits booking page.
2. System displays personalized recommendations from AI.
3. Client views suggested services, times, and masters.
4. Client clicks on recommendation to view details.
5. Client accepts recommendation or continues manual booking.
6. System creates booking if accepted.

## 7. Functional Requirements
### Core Booking
- show available time slots based on master working hours, breaks, and existing appointments
- prevent overlapping bookings for the same master
- support service-specific durations
- support booking limits and minimum notice rules
- support cancellation windows and buffer intervals
- support appointment editing and cancellation by authorized users
- store master schedules separately from appointments
- send notifications through configured channels
- keep all calendar data editable only by authorized roles

### AI Features
- support multiple AI providers with configurable models (OpenAI, Anthropic, Google, Mistral, local)
- analyze user booking patterns and behavior
- generate personalized service recommendations with confidence scores
- predict optimal booking times based on user history
- provide conversational AI interface for natural language booking
- extract intent and entities from user messages
- generate business intelligence insights automatically
- identify at-risk customers and retention opportunities
- track AI usage, costs, and performance metrics
- cache AI responses to optimize costs
- support fallback to local models for privacy-sensitive data

## 8. Business Rules
- a master cannot have overlapping appointments
- a booking must fit within the master working hours
- buffer time must be reserved before and/or after appointments if configured
- a booking cannot be created if it violates the minimum notice rule
- cancellation must respect the allowed cancellation window
- services determine appointment length
- only one salon location exists in the first version

## 9. Suggested Data Model
### User
- id
- name
- phone
- email
- role
- status

### MasterProfile
- id
- userId
- specialization
- activeStatus

### Service
- id
- name
- durationMinutes
- priceOptional
- activeStatus

### WorkingSchedule
- id
- masterId
- dayOfWeek
- startTime
- endTime
- breaks

### Appointment
- id
- clientId
- masterId
- serviceId
- startAt
- endAt
- status
- source
- notes

### NotificationLog
- id
- appointmentId
- channel
- status
- sentAt

### AIProvider
- id
- providerKey
- name
- apiKeyEncrypted
- enabled
- config

### AIModel
- id
- providerId
- modelKey
- name
- contextWindow
- costPer1kInput
- costPer1kOutput
- enabled

### UserBehaviorAnalytics
- id
- userId
- featureVector
- clusterId
- bookingFrequency
- preferredMasters
- preferredServices
- churnRiskScore
- analyzedAt

### AIRecommendation
- id
- userId
- recommendationType
- serviceId
- masterId
- suggestedDate
- suggestedTimeSlots
- confidenceScore
- reasoning
- status

### AIConversation
- id
- userId
- channel
- startedAt
- status

### AIMessage
- id
- conversationId
- role
- content
- modelUsed
- tokensUsed
- intent

### AIInsight
- id
- insightType
- category
- title
- description
- data
- severity
- actionable

## 10. Validation Rules
- reject appointments that overlap on the same master
- reject appointments outside working hours
- reject appointments inside breaks
- reject appointments shorter or longer than the service duration
- reject bookings that violate minimum notice
- reject cancellations outside the allowed window

## 11. UI/UX Requirements
- intuitive scheduling flow with minimal steps
- clear available and unavailable time slots
- responsive layout for desktop and mobile
- readable day, week, and month views
- consistent status indicators for appointments
- fast booking experience with clear validation feedback

## 12. MVP Definition
The first version should include:

### Core Booking Features
- user roles and access control
- single salon location
- public and internal booking
- master selection by client
- services with fixed durations per service type
- daily schedule and appointment calendar
- appointment creation, editing, and cancellation
- conflict prevention
- notifications

### AI Features (MVP Phase)
- AI provider configuration (support for OpenAI, Anthropic, local models)
- user behavior tracking and analytics
- basic recommendations (next service prediction)
- conversational booking assistant
- business insights dashboard
- AI usage monitoring and cost tracking

### AI Features (Post-MVP)
- advanced customer segmentation
- marketing automation
- master performance optimization
- quality assurance automation
- content generation
- multi-language support

## 13. Open Questions
- exact rescheduling rules for each role
- whether recurring appointments are needed later
- whether analytics/reporting should be added later
- supported language(s)
- timezone handling strategy
- whether self-service client registration is required

## 14. Draft Implementation Prompt
Design and implement an AI-powered calendar booking system for a beauty salon with public client booking and internal staff booking.

The system must:

### Core Features
- support clients, masters, and administrators
- allow the client to choose a master, service, date, and time
- calculate appointment duration by service type
- prevent overlapping bookings for the same master
- respect working hours, breaks, buffers, minimum notice, and cancellation windows
- support appointment creation, editing, cancellation, and rescheduling
- provide calendar views for day, week, and month
- send notifications via SMS, email, Telegram, and push
- work for a single salon location in the first version
- exclude payment/deposit handling for now

### AI Integration
- support multiple AI providers with flexible model selection (OpenAI, Anthropic, Google Gemini, Mistral, local models)
- analyze user booking behavior and patterns
- generate personalized service and time recommendations with confidence scores
- provide conversational AI assistant for natural language booking
- extract booking intent and entities from user messages
- generate business intelligence insights automatically
- identify customer segments and churn risk
- track AI usage, costs, and performance metrics
- implement caching and cost optimization strategies
- support fallback to local models for privacy and cost control

## 15. Technology Stack

### Backend (Laravel 11)
- **Framework**: Laravel 11.x
- **Database**: PostgreSQL 15+
- **ORM**: Eloquent
- **API Auth**: Laravel Sanctum
- **Admin Panel**: Laravel Filament 3.x
- **Queue**: Laravel Queues (Redis driver)
- **Cache**: Redis
- **AI Integration**: Custom service layer with OpenAI PHP SDK, Anthropic PHP SDK
- **Testing**: Pest PHP

### Frontend (Modern React Stack)
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **UI Library**: React 18+
- **Styling**: Tailwind CSS 3.x
- **Component Library**: shadcn/ui
- **State Management**: Zustand
- **Data Fetching**: TanStack Query (React Query)
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns
- **Icons**: Lucide React
- **Charts**: Recharts
- **Testing**: Vitest + React Testing Library

### DevOps & Tools
- **Version Control**: Git
- **Package Manager (Backend)**: Composer
- **Package Manager (Frontend)**: pnpm
- **Code Quality**: Laravel Pint, ESLint, Prettier
- **CI/CD**: GitHub Actions
- **Deployment**: 
  - Backend: Laravel Forge / DigitalOcean / AWS
  - Frontend: Vercel
  - Database: Managed PostgreSQL (DigitalOcean, AWS RDS)
  - Cache/Queue: Redis Cloud / AWS ElastiCache

### External Services

#### Communication Channels (Priority Order)
1. **Telegram Bot** - Telegram Bot API (primary messenger)
2. **Viber Bot** - Viber REST API (secondary messenger)
3. **Email** - Mailgun / SendGrid / AWS SES
4. **Calendar Integration** - Google Calendar API, Microsoft Graph API, iCalendar (.ics)
5. **SMS** - Twilio (critical notifications & OTP)
6. **WhatsApp Business** - Twilio / 360dialog (recommended)
7. **Web Push** - Firebase Cloud Messaging / OneSignal
8. **Voice Calls** - Twilio Voice API (optional, for VIP)

#### AI Providers
- OpenAI, Anthropic, Google Gemini, Mistral, Ollama (local)

#### Additional Integrations
- **Maps**: Google Maps API (location sharing)
- **Analytics**: Google Analytics, Mixpanel
- **Monitoring**: Sentry, Laravel Telescope

## 16. Suggested Next Step
After confirming the remaining implementation details, break this specification into technical tasks, data structures, API endpoints, and UI screens.
