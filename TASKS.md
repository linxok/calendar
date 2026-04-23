# Development Tasks Breakdown

## Project Structure

```
calendar/
├── backend/                # Laravel 11 Backend + Admin
│   ├── app/
│   │   ├── Models/         # Eloquent models
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── Api/    # API controllers
│   │   │   │   └── Admin/  # Admin controllers
│   │   │   ├── Requests/   # Form requests (validation)
│   │   │   ├── Resources/  # API resources (transformers)
│   │   │   └── Middleware/ # Custom middleware
│   │   ├── Services/       # Business logic layer
│   │   │   ├── Booking/
│   │   │   ├── AI/
│   │   │   └── Notification/
│   │   ├── Repositories/   # Data access layer (optional)
│   │   ├── Events/         # Laravel events
│   │   ├── Listeners/      # Event listeners
│   │   ├── Jobs/           # Queue jobs
│   │   ├── Filament/       # Filament admin resources
│   │   │   ├── Resources/
│   │   │   ├── Pages/
│   │   │   └── Widgets/
│   │   └── Observers/      # Model observers
│   ├── database/
│   │   ├── migrations/     # Database migrations
│   │   ├── factories/      # Model factories
│   │   └── seeders/        # Database seeders
│   ├── routes/
│   │   ├── api.php         # API routes
│   │   ├── web.php         # Web routes
│   │   └── console.php     # Console routes
│   ├── config/             # Configuration files
│   ├── tests/
│   │   ├── Feature/        # Feature tests
│   │   └── Unit/           # Unit tests
│   ├── storage/
│   ├── public/
│   ├── composer.json
│   └── artisan
├── frontend/               # Next.js 14 Frontend
│   ├── src/
│   │   ├── app/            # Next.js App Router
│   │   │   ├── (public)/   # Public routes
│   │   │   ├── (auth)/     # Auth routes
│   │   │   └── layout.tsx
│   │   ├── components/     # React components
│   │   │   ├── ui/         # shadcn/ui components
│   │   │   ├── booking/
│   │   │   ├── calendar/
│   │   │   └── ai/
│   │   ├── lib/            # Utilities
│   │   │   ├── api.ts      # API client
│   │   │   ├── utils.ts
│   │   │   └── validators.ts
│   │   ├── hooks/          # Custom React hooks
│   │   ├── store/          # Zustand stores
│   │   ├── types/          # TypeScript types
│   │   └── styles/         # Global styles
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   └── next.config.js
├── docs/
│   ├── API.md
│   ├── DATABASE.md
│   ├── AI.md
│   └── TASKS.md
└── README.md
```

---

## Phase 1: Project Setup & Infrastructure

### Task 1.1: Initialize Backend Project (Laravel)
**Priority:** High  
**Estimate:** 2 hours

- [ ] Install Laravel 11.x via Composer
- [ ] Configure `.env` file (database, cache, queue)
- [ ] Install Laravel Sanctum for API authentication
- [ ] Install Laravel Filament 3.x for admin panel
- [ ] Set up PostgreSQL connection
- [ ] Configure Redis for cache and queues
- [ ] Install Laravel Pint for code formatting
- [ ] Install Pest PHP for testing
- [ ] Set up Laravel Telescope (development)
- [ ] Configure CORS

**Key Packages:**
```bash
composer require laravel/sanctum
composer require filament/filament:"^3.0"
composer require predis/predis
composer require --dev laravel/pint
composer require pestphp/pest --dev --with-all-dependencies
composer require laravel/telescope --dev
```

---

### Task 1.2: Initialize Frontend Project (Next.js)
**Priority:** High  
**Estimate:** 3 hours

- [ ] Initialize Next.js 14+ project with TypeScript
- [ ] Install shadcn/ui CLI and configure
- [ ] Set up Tailwind CSS
- [ ] Install TanStack Query
- [ ] Install Zustand for state management
- [ ] Install React Hook Form + Zod
- [ ] Configure ESLint and Prettier
- [ ] Set up environment variables
- [ ] Configure API client with axios
- [ ] Set up path aliases in tsconfig

**Key Commands:**
```bash
pnpm create next-app@latest frontend --typescript --tailwind --app --src-dir
cd frontend
pnpm dlx shadcn-ui@latest init
pnpm add @tanstack/react-query zustand
pnpm add react-hook-form zod @hookform/resolvers
pnpm add axios date-fns lucide-react
pnpm add recharts
pnpm add -D @types/node
```

---

### Task 1.3: Database Setup
**Priority:** High  
**Estimate:** 2 hours

- [ ] Install PostgreSQL 15+
- [ ] Create database
- [ ] Configure Laravel database connection in `.env`
- [ ] Test connection with `php artisan migrate:status`
- [ ] Set up Redis for cache and queues
- [ ] Configure queue connection
- [ ] Document database setup in README

---

### Task 1.4: Docker Configuration (Optional)
**Priority:** Medium  
**Estimate:** 2 hours

- [ ] Create Dockerfile for backend
- [ ] Create Dockerfile for frontend
- [ ] Create docker-compose.yml
- [ ] Configure PostgreSQL in Docker
- [ ] Test Docker setup
- [ ] Document Docker usage

---

## Phase 2: Database & Models (Laravel)

### Task 2.1: Create Laravel Migrations
**Priority:** High  
**Estimate:** 4 hours

- [ ] `php artisan make:migration create_users_table` (extend default)
- [ ] `php artisan make:migration create_master_profiles_table`
- [ ] `php artisan make:migration create_services_table`
- [ ] `php artisan make:migration create_working_schedules_table`
- [ ] `php artisan make:migration create_appointments_table`
- [ ] `php artisan make:migration create_notification_logs_table`
- [ ] `php artisan make:migration create_booking_settings_table`
- [ ] Add indexes, foreign keys, and constraints
- [ ] Test migrations: `php artisan migrate` and `migrate:rollback`

---

### Task 2.2: Create Eloquent Models
**Priority:** High  
**Estimate:** 4 hours

- [ ] Extend User model with roles and relationships
- [ ] `php artisan make:model MasterProfile -m`
- [ ] `php artisan make:model Service -m`
- [ ] `php artisan make:model WorkingSchedule -m`
- [ ] `php artisan make:model Appointment -m`
- [ ] `php artisan make:model NotificationLog -m`
- [ ] `php artisan make:model BookingSetting -m`
- [ ] Define relationships (hasMany, belongsTo, etc.)
- [ ] Add fillable/guarded properties
- [ ] Add casts for JSON fields and dates
- [ ] Create model factories for testing

---

### Task 2.3: Create Seeders
**Priority:** Medium  
**Estimate:** 2 hours

- [ ] `php artisan make:seeder UserSeeder` (admin user)
- [ ] `php artisan make:seeder ServiceSeeder`
- [ ] `php artisan make:seeder BookingSettingSeeder`
- [ ] `php artisan make:seeder MasterSeeder` (dev/test)
- [ ] `php artisan make:seeder AppointmentSeeder` (dev/test)
- [ ] Update DatabaseSeeder to call all seeders
- [ ] Test: `php artisan db:seed`

---

## Phase 3: Authentication & Authorization (Laravel)

### Task 3.1: Setup Laravel Sanctum
**Priority:** High  
**Estimate:** 3 hours

- [ ] Publish Sanctum config and migrations
- [ ] Add HasApiTokens trait to User model
- [ ] Configure Sanctum middleware in api routes
- [ ] Set up CORS for frontend
- [ ] Add role field to users table migration
- [ ] Implement password hashing (Laravel default)
- [ ] Configure rate limiting for auth routes
- [ ] Test token generation and validation

---

### Task 3.2: Authorization with Policies and Gates
**Priority:** High  
**Estimate:** 3 hours

- [ ] `php artisan make:policy AppointmentPolicy`
- [ ] `php artisan make:policy MasterProfilePolicy`
- [ ] `php artisan make:policy ServicePolicy`
- [ ] Create role-based middleware (admin, master, client)
- [ ] Define Gates for complex permissions
- [ ] Add authorization to controllers
- [ ] Write policy tests with Pest

---

### Task 3.3: Auth API Endpoints
**Priority:** High  
**Estimate:** 3 hours

- [ ] `php artisan make:controller Api/AuthController`
- [ ] POST /api/auth/register (with FormRequest validation)
- [ ] POST /api/auth/login (with throttling)
- [ ] POST /api/auth/logout (revoke tokens)
- [ ] GET /api/users/me (with API Resource)
- [ ] PUT /api/users/me (with FormRequest)
- [ ] Create API Resources for user transformations
- [ ] Write Feature tests for auth flow

---

## Phase 4: Core Business Logic (Laravel Services)

### Task 4.1: Master Management Service
**Priority:** High  
**Estimate:** 4 hours

- [ ] Create `app/Services/MasterService.php`
- [ ] Implement CRUD operations
- [ ] Add master-service associations (many-to-many)
- [ ] Create `app/Http/Requests/MasterRequest.php` for validation
- [ ] Implement search/filter with query scopes
- [ ] Create `app/Http/Resources/MasterResource.php`
- [ ] Write unit tests with Pest

---

### Task 4.2: Service Management
**Priority:** High  
**Estimate:** 3 hours

- [ ] Create `app/Services/ServiceManagementService.php`
- [ ] Implement service CRUD operations
- [ ] Add activation/deactivation with soft deletes
- [ ] Create `app/Http/Requests/ServiceRequest.php`
- [ ] Implement filter logic with Eloquent scopes
- [ ] Create `app/Http/Resources/ServiceResource.php`
- [ ] Write unit tests

---

### Task 4.3: Working Schedule Management
**Priority:** High  
**Estimate:** 5 hours

- [ ] Create `app/Services/ScheduleService.php`
- [ ] Implement schedule CRUD operations
- [ ] Add break time management (JSON cast in model)
- [ ] Create custom validation rules for time conflicts
- [ ] Use Carbon for time parsing and formatting
- [ ] Create `app/Http/Requests/ScheduleRequest.php`
- [ ] Write comprehensive tests

---

### Task 4.4: Availability Calculation Engine
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create `app/Services/AvailabilityService.php`
- [ ] Implement time slot generation algorithm
- [ ] Query master working schedules with Eloquent
- [ ] Check existing appointments with query optimization
- [ ] Apply break times from JSON field
- [ ] Apply buffer time rules from settings
- [ ] Cache availability results with Redis
- [ ] Optimize with database indexes
- [ ] Write performance tests

---

### Task 4.5: Appointment Booking Logic
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create `app/Services/BookingService.php`
- [ ] Implement appointment creation with DB transactions
- [ ] Create custom validation rules for conflicts
- [ ] Fire `AppointmentCreated` event
- [ ] Apply minimum notice rule (config-based)
- [ ] Apply max bookings per day constraint
- [ ] Use Carbon to calculate end time
- [ ] Implement appointment editing with validation
- [ ] Implement cancellation with cancellation window check
- [ ] Create `app/Observers/AppointmentObserver.php`
- [ ] Write comprehensive tests

---

### Task 4.6: Notification System
**Priority:** Medium  
**Estimate:** 8 hours

- [ ] Create `app/Services/NotificationService.php`
- [ ] Create `app/Notifications/AppointmentConfirmed.php` (Laravel Notification)
- [ ] Create `app/Notifications/AppointmentReminder.php`
- [ ] Implement SMS channel with Twilio
- [ ] Implement email channel (Laravel Mail)
- [ ] Implement Telegram channel (custom)
- [ ] Implement push notification channel (FCM)
- [ ] Create notification templates with Blade
- [ ] Use Laravel Queues for async sending
- [ ] Create `app/Jobs/SendAppointmentNotification.php`
- [ ] Log notifications to database
- [ ] Handle failures with retry logic
- [ ] Write tests with notification fakes

---

## Phase 5: API Endpoints (Laravel Controllers)

### Task 5.1: Master Endpoints
**Priority:** High  
**Estimate:** 4 hours

- [ ] `php artisan make:controller Api/MasterController`
- [ ] GET /api/masters (index with filtering)
- [ ] GET /api/masters/{id} (show)
- [ ] POST /api/admin/masters (store with FormRequest)
- [ ] PUT /api/admin/masters/{id} (update)
- [ ] DELETE /api/admin/masters/{id} (destroy)
- [ ] Use MasterResource for transformations
- [ ] Add middleware for admin routes
- [ ] Write Feature tests with Pest

---

### Task 5.2: Service Endpoints
**Priority:** High  
**Estimate:** 3 hours

- [ ] `php artisan make:controller Api/ServiceController`
- [ ] GET /api/services (index with ServiceResource)
- [ ] GET /api/services/{id} (show)
- [ ] POST /api/admin/services (store with ServiceRequest)
- [ ] PUT /api/admin/services/{id} (update)
- [ ] DELETE /api/admin/services/{id} (soft delete)
- [ ] Write Feature tests

---

### Task 5.3: Schedule Endpoints
**Priority:** High  
**Estimate:** 3 hours

- [ ] `php artisan make:controller Api/ScheduleController`
- [ ] GET /api/masters/{master}/schedule (index)
- [ ] POST /api/admin/masters/{master}/schedule (store)
- [ ] DELETE /api/admin/masters/{master}/schedule/{schedule} (destroy)
- [ ] Create ScheduleResource
- [ ] Write Feature tests

---

### Task 5.4: Availability Endpoints
**Priority:** High  
**Estimate:** 2 hours

- [ ] `php artisan make:controller Api/AvailabilityController`
- [ ] GET /api/availability (with query validation)
- [ ] Use AvailabilityService
- [ ] Cache results with Redis
- [ ] Create AvailabilityResource
- [ ] Write Feature tests

---

### Task 5.5: Appointment Endpoints
**Priority:** High  
**Estimate:** 5 hours

- [ ] `php artisan make:controller Api/AppointmentController`
- [ ] GET /api/appointments (index with pagination)
- [ ] GET /api/appointments/{id} (show)
- [ ] POST /api/appointments (store with AppointmentRequest)
- [ ] PUT /api/appointments/{id} (update)
- [ ] PATCH /api/appointments/{id}/status (updateStatus)
- [ ] DELETE /api/appointments/{id} (destroy/cancel)
- [ ] Create AppointmentResource and AppointmentCollection
- [ ] Use route model binding
- [ ] Write Feature tests

---

### Task 5.6: Calendar View Endpoints
**Priority:** High  
**Estimate:** 4 hours

- [ ] `php artisan make:controller Api/CalendarController`
- [ ] GET /api/calendar/day (with query params)
- [ ] GET /api/calendar/week
- [ ] GET /api/calendar/month
- [ ] Optimize queries with eager loading
- [ ] Cache calendar views with Redis (15 min TTL)
- [ ] Create CalendarResource
- [ ] Write Feature tests

---

### Task 5.7: Admin Settings Endpoints
**Priority:** Medium  
**Estimate:** 2 hours

- [ ] `php artisan make:controller Api/Admin/SettingsController`
- [ ] GET /api/admin/settings
- [ ] PUT /api/admin/settings (with SettingsRequest)
- [ ] Use config cache for performance
- [ ] Write Feature tests

---

### Task 5.8: Notification Endpoints
**Priority:** Low  
**Estimate:** 2 hours

- [ ] `php artisan make:controller Api/Admin/NotificationController`
- [ ] GET /api/admin/notifications (index with pagination)
- [ ] POST /api/admin/notifications/send (dispatch job)
- [ ] Create NotificationResource
- [ ] Write Feature tests

---

## Phase 6: Frontend - Authentication & Layout (Next.js)

### Task 6.1: Authentication Pages
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create `src/app/(auth)/login/page.tsx`
- [ ] Create `src/app/(auth)/register/page.tsx`
- [ ] Install shadcn/ui form components (`pnpm dlx shadcn-ui@latest add form input button`)
- [ ] Create Zod schemas for validation
- [ ] Implement React Hook Form integration
- [ ] Create `src/lib/api/auth.ts` API client
- [ ] Implement token storage (httpOnly cookies or localStorage)
- [ ] Create auth middleware for protected routes
- [ ] Add redirect logic with Next.js navigation
- [ ] Style with shadcn/ui + Tailwind

---

### Task 6.2: Main Layout Components
**Priority:** High  
**Estimate:** 5 hours

- [ ] Create `src/components/layout/header.tsx`
- [ ] Create `src/components/layout/sidebar.tsx`
- [ ] Create `src/components/layout/footer.tsx`
- [ ] Create `src/app/(dashboard)/layout.tsx`
- [ ] Install shadcn/ui navigation components
- [ ] Add responsive design with Tailwind breakpoints
- [ ] Create user dropdown menu with shadcn/ui
- [ ] Add route-based active state highlighting
- [ ] Use Lucide React icons

---

### Task 6.3: State Management Setup
**Priority:** High  
**Estimate:** 3 hours

- [ ] Create `src/store/auth-store.ts` (Zustand)
- [ ] Create `src/store/booking-store.ts`
- [ ] Create `src/store/calendar-store.ts`
- [ ] Add persist middleware for auth state
- [ ] Create custom hooks: `useAuth()`, `useBooking()`, `useCalendar()`
- [ ] Set up TanStack Query provider in root layout
- [ ] Create query client configuration

---

## Phase 7: Laravel Filament Admin Panel

### Task 7.1: Filament Setup & Configuration
**Priority:** High  
**Estimate:** 3 hours

- [ ] Run `php artisan filament:install --panels`
- [ ] Configure admin panel theme
- [ ] Create admin user with seeder
- [ ] Set up navigation menu structure
- [ ] Configure widgets dashboard
- [ ] Customize branding and colors

---

### Task 7.2: Filament Resources - Core Entities
**Priority:** High  
**Estimate:** 6 hours

- [ ] `php artisan make:filament-resource User`
- [ ] `php artisan make:filament-resource MasterProfile`
- [ ] `php artisan make:filament-resource Service`
- [ ] `php artisan make:filament-resource WorkingSchedule`
- [ ] Configure form schemas with Filament form builder
- [ ] Configure table columns with sorting/filtering
- [ ] Add relationship managers
- [ ] Implement custom actions

---

### Task 7.3: Filament Resources - Appointments
**Priority:** High  
**Estimate:** 4 hours

- [ ] `php artisan make:filament-resource Appointment`
- [ ] Create custom appointment form with service/master selection
- [ ] Add calendar view widget
- [ ] Implement status change actions
- [ ] Add filters (date range, master, status)
- [ ] Create custom table actions (confirm, cancel)
- [ ] Add appointment creation modal

---

### Task 7.4: Filament Widgets & Dashboard
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Create stats overview widget (total bookings, revenue, occupancy)
- [ ] Create chart widget for booking trends
- [ ] Create latest appointments widget
- [ ] Create upcoming appointments widget
- [ ] Add master performance widget
- [ ] Configure dashboard layout

---

### Task 7.5: Filament Settings Page
**Priority:** Medium  
**Estimate:** 2 hours

- [ ] Create custom Filament page for booking settings
- [ ] Add form for minimum notice, cancellation window, buffer time
- [ ] Add notification channel toggles
- [ ] Implement save functionality
- [ ] Add validation

---

## Phase 8: Frontend - Booking Flow (Next.js)

### Task 8.1: Public Booking Page
**Priority:** High  
**Estimate:** 8 hours

- [ ] Create booking flow container
- [ ] Step 1: Service selection component
- [ ] Step 2: Master selection component
- [ ] Step 3: Date selection component
- [ ] Step 4: Time slot selection component
- [ ] Step 5: Contact form (if not authenticated)
- [ ] Step 6: Confirmation component
- [ ] Add step navigation
- [ ] Integrate with availability API
- [ ] Add loading states
- [ ] Add error handling
- [ ] Style with TailwindCSS

---

### Task 7.2: Booking Confirmation & Success
**Priority:** Medium  
**Estimate:** 3 hours

- [ ] Create booking summary component
- [ ] Create success page
- [ ] Add booking details display
- [ ] Add actions (cancel, reschedule)
- [ ] Style with TailwindCSS

---

## Phase 8: Frontend - Calendar Views

### Task 8.1: Calendar Day View
**Priority:** High  
**Estimate:** 5 hours

- [ ] Create DayView component
- [ ] Display time slots vertically
- [ ] Show appointments
- [ ] Add date navigation
- [ ] Add master filter
- [ ] Integrate with calendar API
- [ ] Add click handlers for appointments
- [ ] Style with TailwindCSS

---

### Task 8.2: Calendar Week View
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create WeekView component
- [ ] Display 7-day grid
- [ ] Show appointments in time slots
- [ ] Add week navigation
- [ ] Add master filter
- [ ] Integrate with calendar API
- [ ] Handle appointment overflow
- [ ] Style with TailwindCSS

---

### Task 8.3: Calendar Month View
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Create MonthView component
- [ ] Display calendar grid
- [ ] Show appointment count per day
- [ ] Add month navigation
- [ ] Add day click handler
- [ ] Integrate with calendar API
- [ ] Style with TailwindCSS

---

### Task 8.4: Calendar View Switcher
**Priority:** Medium  
**Estimate:** 2 hours

- [ ] Create view toggle component
- [ ] Add day/week/month tabs
- [ ] Persist view preference
- [ ] Add smooth transitions

---

## Phase 9: Frontend - Admin Panel

### Task 9.1: Master Management Page
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create master list component
- [ ] Create master form component
- [ ] Add create/edit master modal
- [ ] Add delete confirmation
- [ ] Add search and filters
- [ ] Integrate with master API
- [ ] Add validation
- [ ] Style with TailwindCSS

---

### Task 9.2: Service Management Page
**Priority:** High  
**Estimate:** 5 hours

- [ ] Create service list component
- [ ] Create service form component
- [ ] Add create/edit service modal
- [ ] Add delete confirmation
- [ ] Add search and filters
- [ ] Integrate with service API
- [ ] Add validation
- [ ] Style with TailwindCSS

---

### Task 9.3: Schedule Management Page
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create schedule editor component
- [ ] Display weekly schedule grid
- [ ] Add time range inputs
- [ ] Add break time management
- [ ] Add save/cancel actions
- [ ] Integrate with schedule API
- [ ] Add validation
- [ ] Style with TailwindCSS

---

### Task 9.4: Appointment Management Page
**Priority:** Medium  
**Estimate:** 6 hours

- [ ] Create appointment list component
- [ ] Add filters (date, master, status)
- [ ] Create appointment form modal
- [ ] Add create/edit/cancel actions
- [ ] Add appointment details view
- [ ] Integrate with appointments API
- [ ] Add validation
- [ ] Style with TailwindCSS

---

### Task 9.5: Settings Page
**Priority:** Low  
**Estimate:** 4 hours

- [ ] Create settings form
- [ ] Add booking rules inputs
- [ ] Add notification channel toggles
- [ ] Integrate with settings API
- [ ] Add validation
- [ ] Style with TailwindCSS

---

## Phase 10: Frontend - Master Dashboard

### Task 10.1: Master Schedule View
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Create master dashboard layout
- [ ] Display personal schedule
- [ ] Show today's appointments
- [ ] Show upcoming appointments
- [ ] Add appointment details modal
- [ ] Integrate with appointments API
- [ ] Style with TailwindCSS

---

### Task 10.2: Master Availability Management
**Priority:** Low  
**Estimate:** 3 hours

- [ ] Create availability editor (if permitted)
- [ ] Allow marking time off
- [ ] Display current schedule
- [ ] Integrate with schedule API
- [ ] Style with TailwindCSS

---

## Phase 11: Shared Components & UI

### Task 11.1: Core UI Components
**Priority:** High  
**Estimate:** 6 hours

- [ ] Button component
- [ ] Input component
- [ ] Select component
- [ ] Modal component
- [ ] Card component
- [ ] Badge component
- [ ] Spinner/Loader component
- [ ] Alert/Toast component
- [ ] Add component variants
- [ ] Style with TailwindCSS

---

### Task 11.2: Form Components
**Priority:** High  
**Estimate:** 4 hours

- [ ] FormField wrapper
- [ ] DatePicker component
- [ ] TimePicker component
- [ ] PhonInput component
- [ ] Autocomplete component
- [ ] Integrate with react-hook-form
- [ ] Add validation display
- [ ] Style with TailwindCSS

---

### Task 11.3: Calendar Components
**Priority:** High  
**Estimate:** 5 hours

- [ ] TimeSlot component
- [ ] AppointmentCard component
- [ ] DateNavigator component
- [ ] Legend component
- [ ] EmptyState component
- [ ] Style with TailwindCSS

---

## Phase 12: Testing

### Task 12.1: Backend Unit Tests
**Priority:** High  
**Estimate:** 8 hours

- [ ] Test models
- [ ] Test services (business logic)
- [ ] Test utilities
- [ ] Test validation schemas
- [ ] Aim for 80%+ coverage

---

### Task 12.2: Backend Integration Tests
**Priority:** High  
**Estimate:** 8 hours

- [ ] Test auth endpoints
- [ ] Test master endpoints
- [ ] Test service endpoints
- [ ] Test appointment endpoints
- [ ] Test calendar endpoints
- [ ] Use test database

---

### Task 12.3: Frontend Unit Tests
**Priority:** Medium  
**Estimate:** 6 hours

- [ ] Test utilities
- [ ] Test hooks
- [ ] Test store logic
- [ ] Use Vitest

---

### Task 12.4: Frontend Component Tests
**Priority:** Medium  
**Estimate:** 6 hours

- [ ] Test form components
- [ ] Test booking flow
- [ ] Test calendar views
- [ ] Use React Testing Library

---

### Task 12.5: E2E Tests
**Priority:** Low  
**Estimate:** 8 hours

- [ ] Set up Playwright or Cypress
- [ ] Test booking flow
- [ ] Test admin workflows
- [ ] Test master workflows
- [ ] Test authentication

---

## Phase 13: Deployment & DevOps

### Task 13.1: Backend Deployment
**Priority:** High  
**Estimate:** 4 hours

- [ ] Set up production database
- [ ] Configure environment variables
- [ ] Deploy to hosting (Heroku, Railway, DigitalOcean, etc.)
- [ ] Run migrations
- [ ] Seed initial data
- [ ] Set up monitoring
- [ ] Configure logging

---

### Task 13.2: Frontend Deployment
**Priority:** High  
**Estimate:** 3 hours

- [ ] Build production bundle
- [ ] Configure environment variables
- [ ] Deploy to hosting (Vercel, Netlify, etc.)
- [ ] Set up custom domain (optional)
- [ ] Configure CORS

---

### Task 13.3: CI/CD Pipeline
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Set up GitHub Actions or GitLab CI
- [ ] Add lint checks
- [ ] Add test runs
- [ ] Add automatic deployment
- [ ] Add environment-based deployments

---

## Phase 14: Documentation & Polish

### Task 14.1: API Documentation
**Priority:** Medium  
**Estimate:** 3 hours

- [ ] Complete API.md
- [ ] Add request/response examples
- [ ] Add error codes reference
- [ ] Generate Swagger/OpenAPI spec (optional)

---

### Task 14.2: User Documentation
**Priority:** Low  
**Estimate:** 4 hours

- [ ] Create user guide
- [ ] Add screenshots
- [ ] Document booking flow
- [ ] Document admin workflows
- [ ] Create FAQ

---

### Task 14.3: Developer Documentation
**Priority:** Medium  
**Estimate:** 3 hours

- [ ] Update README.md
- [ ] Add setup instructions
- [ ] Add development guidelines
- [ ] Document architecture
- [ ] Add troubleshooting guide

---

### Task 14.4: UI Polish
**Priority:** Low  
**Estimate:** 6 hours

- [ ] Add animations and transitions
- [ ] Improve loading states
- [ ] Add empty states
- [ ] Improve error messages
- [ ] Add tooltips
- [ ] Improve mobile responsiveness
- [ ] Add accessibility improvements (ARIA labels, keyboard navigation)

---

## Phase 10: Communication Channels & Notifications

### Task 10.1: Communication Infrastructure Setup
**Priority:** High  
**Estimate:** 4 hours

- [ ] Install Laravel notification packages
- [ ] `composer require laravel-notification-channels/telegram`
- [ ] `composer require laravel-notification-channels/viber`
- [ ] `composer require twilio/sdk` (SMS & WhatsApp)
- [ ] `composer require spatie/laravel-calendar-links`
- [ ] `composer require spatie/icalendar-generator`
- [ ] Configure notification channels in `config/services.php`
- [ ] Set up Telegram bot (@BotFather)
- [ ] Set up Viber bot
- [ ] Configure Twilio account
- [ ] Set up Mailgun/SendGrid

---

### Task 10.2: Database Migrations for Communication
**Priority:** High  
**Estimate:** 3 hours

- [ ] Create `user_communication_preferences` migration
- [ ] Create `communication_logs` migration
- [ ] Create `telegram_bot_users` migration
- [ ] Create `viber_bot_users` migration
- [ ] Create `calendar_subscriptions` migration
- [ ] Run migrations
- [ ] Create model factories and seeders

---

### Task 10.3: Eloquent Models for Communication
**Priority:** High  
**Estimate:** 3 hours

- [ ] Create `UserCommunicationPreference` model
- [ ] Create `CommunicationLog` model
- [ ] Create `TelegramBotUser` model
- [ ] Create `ViberBotUser` model
- [ ] Create `CalendarSubscription` model
- [ ] Define relationships with User model
- [ ] Add casts for JSON fields

---

### Task 10.4: Laravel Notifications
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create `AppointmentConfirmation` notification
- [ ] Create `AppointmentReminder` notification
- [ ] Create `AppointmentCancellation` notification
- [ ] Implement `toTelegram()` method
- [ ] Implement `toViber()` method
- [ ] Implement `toMail()` method
- [ ] Implement `toTwilio()` (SMS) method
- [ ] Create notification templates (Blade for email)
- [ ] Add multi-channel routing logic
- [ ] Implement fallback strategy

---

### Task 10.5: Telegram Bot
**Priority:** High  
**Estimate:** 8 hours

- [ ] Create `TelegramBotController`
- [ ] Implement webhook handler
- [ ] Create bot commands (/start, /book, /myappointments)
- [ ] Implement conversation state machine
- [ ] Create inline keyboards for quick actions
- [ ] Implement account linking flow
- [ ] Add rich message formatting
- [ ] Handle button callbacks
- [ ] Test bot interactions
- [ ] Set webhook URL

---

### Task 10.6: Viber Bot
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create `ViberBotController`
- [ ] Implement webhook handler
- [ ] Create rich card templates
- [ ] Implement quick replies
- [ ] Create carousel for services
- [ ] Implement account linking
- [ ] Handle user events
- [ ] Test bot interactions
- [ ] Set webhook URL

---

### Task 10.7: Email Notifications with Calendar Files
**Priority:** High  
**Estimate:** 5 hours

- [ ] Create responsive email templates (Blade + MJML)
- [ ] Implement confirmation email template
- [ ] Implement reminder email template
- [ ] Implement marketing newsletter template
- [ ] Create `.ics` file generator service
- [ ] Attach calendar files to emails
- [ ] Add "Add to Calendar" buttons (Google, Outlook)
- [ ] Test email rendering across clients
- [ ] Configure email queue

---

### Task 10.8: SMS Notifications
**Priority:** Medium  
**Estimate:** 3 hours

- [ ] Create `SmsService` with Twilio
- [ ] Implement SMS templates
- [ ] Add phone number validation
- [ ] Implement rate limiting for SMS
- [ ] Add cost tracking
- [ ] Configure SMS for critical notifications only
- [ ] Test SMS delivery

---

### Task 10.9: WhatsApp Business Integration
**Priority:** Medium  
**Estimate:** 6 hours

- [ ] Set up WhatsApp Business API (Twilio/360dialog)
- [ ] Create message templates (require Facebook approval)
- [ ] Implement opt-in flow (GDPR compliance)
- [ ] Create `WhatsAppService`
- [ ] Implement template-based messages
- [ ] Handle delivery receipts
- [ ] Add interactive buttons
- [ ] Test WhatsApp delivery

---

### Task 10.10: Calendar Integration
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create `CalendarService`
- [ ] Implement iCalendar (.ics) generation
- [ ] Create Google Calendar add link generator
- [ ] Implement Microsoft Graph API integration (OAuth)
- [ ] Create webcal:// feed endpoint
- [ ] Generate subscription tokens
- [ ] Implement calendar feed updates
- [ ] Add calendar download endpoints to API
- [ ] Test with different calendar apps

---

### Task 10.11: Web Push Notifications
**Priority:** Medium  
**Estimate:** 5 hours

- [ ] Set up Firebase Cloud Messaging
- [ ] Create service worker for push
- [ ] Implement push subscription API
- [ ] Create `WebPushService`
- [ ] Implement notification payloads
- [ ] Add action buttons to notifications
- [ ] Handle notification clicks
- [ ] Test across browsers

---

### Task 10.12: Communication Preferences API
**Priority:** High  
**Estimate:** 4 hours

- [ ] Create `CommunicationPreferenceController`
- [ ] GET /api/users/me/communication-preferences
- [ ] PUT /api/users/me/communication-preferences
- [ ] Implement channel preference toggles
- [ ] Add "Do Not Disturb" hours
- [ ] Create preference validation
- [ ] Write feature tests

---

### Task 10.13: Notification Routing & Fallback
**Priority:** High  
**Estimate:** 4 hours

- [ ] Create `NotificationRouter` service
- [ ] Implement channel priority logic
- [ ] Add fallback chain (Telegram → Viber → Email → SMS)
- [ ] Check user preferences before sending
- [ ] Implement retry logic
- [ ] Log all notification attempts
- [ ] Track delivery success/failure rates

---

### Task 10.14: Broadcast Notifications (Admin)
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Create `BroadcastController`
- [ ] POST /api/admin/notifications/broadcast
- [ ] Implement recipient filtering
- [ ] Add scheduling for broadcasts
- [ ] Create broadcast job for queue
- [ ] Track broadcast statistics
- [ ] Calculate costs per channel
- [ ] Add Filament resource for broadcasts

---

### Task 10.15: Communication Analytics Dashboard
**Priority:** Low  
**Estimate:** 4 hours

- [ ] Create Filament widget for channel stats
- [ ] Show delivery rates by channel
- [ ] Display costs by channel
- [ ] Chart user channel preferences
- [ ] Track engagement metrics (opens, clicks)
- [ ] Show failed deliveries
- [ ] Add export functionality

---

### Task 10.16: Frontend - Communication Settings
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Create communication preferences page
- [ ] Build channel toggle switches (shadcn/ui)
- [ ] Add notification type checkboxes
- [ ] Implement Telegram account linking
- [ ] Implement Viber account linking
- [ ] Add calendar preferences
- [ ] Show linked accounts
- [ ] Test preferences save/load

---

### Task 10.17: Testing & Optimization
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Write feature tests for all channels
- [ ] Test notification delivery
- [ ] Test fallback mechanism
- [ ] Load test with 1000+ concurrent notifications
- [ ] Optimize queue performance
- [ ] Test email rendering
- [ ] Verify calendar file compatibility
- [ ] Document setup procedures

---

## Phase 15: AI Integration

### Task 15.1: AI Provider Infrastructure
**Priority:** High  
**Estimate:** 8 hours

- [ ] Create AI provider abstraction layer
- [ ] Implement provider factory pattern
- [ ] Add OpenAI integration
- [ ] Add Anthropic integration
- [ ] Add Google Gemini integration
- [ ] Add Mistral integration
- [ ] Add local model support (Ollama)
- [ ] Implement provider configuration management
- [ ] Add API key encryption/decryption
- [ ] Create provider health check
- [ ] Write unit tests

---

### Task 15.2: AI Database Setup
**Priority:** High  
**Estimate:** 4 hours

- [ ] Create migration for ai_providers table
- [ ] Create migration for ai_models table
- [ ] Create migration for user_behavior_analytics table
- [ ] Create migration for ai_recommendations table
- [ ] Create migration for ai_conversations table
- [ ] Create migration for ai_messages table
- [ ] Create migration for ai_insights table
- [ ] Create migration for ai_usage_logs table
- [ ] Add indexes and constraints
- [ ] Create seed data for default AI providers

---

### Task 15.3: AI Models Layer
**Priority:** High  
**Estimate:** 5 hours

- [ ] AIProvider model with CRUD
- [ ] AIModel model with CRUD
- [ ] UserBehaviorAnalytics model
- [ ] AIRecommendation model
- [ ] AIConversation model
- [ ] AIMessage model
- [ ] AIInsight model
- [ ] AIUsageLog model
- [ ] Add model validation
- [ ] Write model tests

---

### Task 15.4: AI Service Core
**Priority:** High  
**Estimate:** 10 hours

- [ ] Create AIService base class
- [ ] Implement model routing logic
- [ ] Add response caching layer
- [ ] Implement cost tracking
- [ ] Add rate limiting per provider
- [ ] Implement fallback mechanism
- [ ] Add retry logic with exponential backoff
- [ ] Create prompt templates
- [ ] Add token counting utilities
- [ ] Write comprehensive tests

---

### Task 15.5: User Behavior Analytics Engine
**Priority:** High  
**Estimate:** 12 hours

- [ ] Create data collection pipeline
- [ ] Implement feature extraction from bookings
- [ ] Build user embedding generation
- [ ] Implement clustering algorithm (K-means)
- [ ] Calculate booking frequency patterns
- [ ] Identify preferred masters and services
- [ ] Calculate churn risk score
- [ ] Compute lifetime value
- [ ] Create batch processing job
- [ ] Add scheduled analytics updates
- [ ] Write analytics tests

---

### Task 15.6: Recommendation Engine
**Priority:** High  
**Estimate:** 12 hours

- [ ] Create recommendation service
- [ ] Implement next service prediction
- [ ] Build optimal time slot suggestion
- [ ] Add collaborative filtering
- [ ] Implement confidence score calculation
- [ ] Generate AI reasoning for recommendations
- [ ] Create recommendation expiration logic
- [ ] Add A/B testing support
- [ ] Track recommendation acceptance rates
- [ ] Optimize for performance
- [ ] Write recommendation tests

---

### Task 15.7: Conversational AI Assistant
**Priority:** High  
**Estimate:** 15 hours

- [ ] Create conversation service
- [ ] Implement intent recognition
- [ ] Build entity extraction (NER)
- [ ] Add context management
- [ ] Implement multi-turn conversation handling
- [ ] Create booking flow through chat
- [ ] Add slot filling for incomplete information
- [ ] Implement confirmation and clarification
- [ ] Add conversation history tracking
- [ ] Create action execution from chat
- [ ] Add fallback to human support
- [ ] Write conversation tests

---

### Task 15.8: Business Intelligence Agent
**Priority:** Medium  
**Estimate:** 10 hours

- [ ] Create insight generation service
- [ ] Implement scheduling analysis
- [ ] Add occupancy rate calculations
- [ ] Identify low-traffic periods
- [ ] Detect anomalies in bookings
- [ ] Generate master performance insights
- [ ] Create demand forecasting
- [ ] Implement trend detection
- [ ] Add insight prioritization
- [ ] Create scheduled insight generation
- [ ] Write insight tests

---

### Task 15.9: AI API Endpoints
**Priority:** High  
**Estimate:** 8 hours

- [ ] POST /api/admin/ai/providers
- [ ] GET /api/admin/ai/providers
- [ ] PUT /api/admin/ai/providers/:id
- [ ] GET /api/admin/ai/models
- [ ] PUT /api/admin/ai/models/:id
- [ ] GET /api/ai/recommendations
- [ ] POST /api/ai/recommendations/:id/accept
- [ ] POST /api/ai/chat
- [ ] GET /api/ai/conversations
- [ ] GET /api/admin/ai/insights
- [ ] GET /api/admin/ai/analytics/users/:userId
- [ ] GET /api/admin/ai/usage
- [ ] GET /api/admin/ai/config
- [ ] PUT /api/admin/ai/config
- [ ] Add validation and error handling
- [ ] Write integration tests

---

### Task 15.10: AI Frontend - Admin Configuration
**Priority:** Medium  
**Estimate:** 8 hours

- [ ] Create AI settings page
- [ ] Build provider configuration UI
- [ ] Add model enable/disable toggles
- [ ] Create cost tracking dashboard
- [ ] Add usage statistics visualization
- [ ] Implement feature toggles
- [ ] Style with TailwindCSS
- [ ] Add form validation
- [ ] Write component tests

---

### Task 15.11: AI Frontend - Recommendations UI
**Priority:** High  
**Estimate:** 6 hours

- [ ] Create recommendation card component
- [ ] Add recommendation list to dashboard
- [ ] Implement accept/dismiss actions
- [ ] Show confidence scores visually
- [ ] Display AI reasoning
- [ ] Add empty state for no recommendations
- [ ] Style with TailwindCSS
- [ ] Write component tests

---

### Task 15.12: AI Frontend - Chat Interface
**Priority:** High  
**Estimate:** 10 hours

- [ ] Create chat widget component
- [ ] Build message list with auto-scroll
- [ ] Add message input with send button
- [ ] Implement typing indicator
- [ ] Show suggested actions/quick replies
- [ ] Add conversation history view
- [ ] Implement voice input (optional)
- [ ] Add chat bubble animations
- [ ] Style with TailwindCSS
- [ ] Make responsive for mobile
- [ ] Write component tests

---

### Task 15.13: AI Frontend - Business Insights Dashboard
**Priority:** Medium  
**Estimate:** 8 hours

- [ ] Create insights dashboard page
- [ ] Display insight cards by category
- [ ] Add severity indicators
- [ ] Implement acknowledge/dismiss actions
- [ ] Show supporting data visualizations
- [ ] Add filtering by category and severity
- [ ] Create insight detail modal
- [ ] Style with TailwindCSS
- [ ] Write component tests

---

### Task 15.14: AI Monitoring & Observability
**Priority:** Medium  
**Estimate:** 6 hours

- [ ] Set up AI request logging
- [ ] Add performance metrics collection
- [ ] Implement cost alerting
- [ ] Create usage dashboards
- [ ] Add error tracking for AI calls
- [ ] Monitor model performance
- [ ] Track recommendation accuracy
- [ ] Set up alerts for anomalies
- [ ] Document monitoring setup

---

### Task 15.15: AI Testing & Optimization
**Priority:** Medium  
**Estimate:** 10 hours

- [ ] Write unit tests for AI services
- [ ] Create integration tests with mocked AI responses
- [ ] Test fallback mechanisms
- [ ] Performance test recommendation generation
- [ ] Load test chat interface
- [ ] Optimize caching strategies
- [ ] Reduce API call costs
- [ ] Test with different AI models
- [ ] Document test results

---

### Task 15.16: AI Documentation
**Priority:** Medium  
**Estimate:** 4 hours

- [ ] Document AI provider setup
- [ ] Create configuration guide
- [ ] Write prompt engineering best practices
- [ ] Document model selection strategy
- [ ] Add troubleshooting guide
- [ ] Create cost optimization guide
- [ ] Document privacy considerations
- [ ] Add examples and use cases

---

## Phase 16: Optional Enhancements

### Task 16.1: Analytics Dashboard
**Priority:** Low  
**Estimate:** 8 hours

- [ ] Create analytics page
- [ ] Show booking statistics
- [ ] Show revenue reports
- [ ] Show master occupancy
- [ ] Add date range filters
- [ ] Add charts (Chart.js or Recharts)

---

### Task 15.2: Recurring Appointments
**Priority:** Low  
**Estimate:** 8 hours

- [ ] Add recurring appointment model
- [ ] Implement recurrence logic
- [ ] Add recurrence UI
- [ ] Handle series editing
- [ ] Handle exceptions

---

### Task 15.3: Multi-Branch Support
**Priority:** Low  
**Estimate:** 10 hours

- [ ] Add branch/location model
- [ ] Update master-branch associations
- [ ] Add branch selection to booking flow
- [ ] Update calendar views
- [ ] Add branch management UI

---

### Task 15.4: Payment Integration
**Priority:** Low  
**Estimate:** 12 hours

- [ ] Choose payment provider (Stripe, LiqPay, etc.)
- [ ] Add payment model
- [ ] Implement payment flow
- [ ] Add deposit support
- [ ] Add refund logic
- [ ] Add payment UI

---

### Task 15.5: Client Mobile App
**Priority:** Low  
**Estimate:** 40 hours

- [ ] Set up React Native project
- [ ] Implement authentication
- [ ] Implement booking flow
- [ ] Implement appointment list
- [ ] Add push notifications
- [ ] Build for iOS and Android

---

## Summary

### Critical Path (MVP)
1. Phase 1: Project Setup
2. Phase 2: Database & Models
3. Phase 3: Authentication
4. Phase 4: Core Business Logic
5. Phase 5: API Endpoints
6. Phase 6-9: Frontend Core Features
7. Phase 12: Essential Testing
8. Phase 13: Deployment

**Estimated Core MVP Timeline:** 12-16 weeks (1 developer)

### Critical Path with AI (MVP + AI)
1. Phase 1: Project Setup
2. Phase 2: Database & Models (including AI tables)
3. Phase 3: Authentication
4. Phase 4: Core Business Logic
5. Phase 5: API Endpoints
6. Phase 6-9: Frontend Core Features
7. **Phase 15: AI Integration (recommendation engine, chat assistant, analytics)**
8. Phase 12: Essential Testing (including AI tests)
9. Phase 13: Deployment

**Estimated MVP + AI Timeline:** 18-24 weeks (1 developer)

### Task Priority Levels
- **High Priority:** Essential for MVP
- **Medium Priority:** Important but can be delayed
- **Low Priority:** Nice to have / Future enhancements

### Technology Stack
- **Backend:** Laravel 11.x, PHP 8.2+, PostgreSQL 15+
- **Admin Panel:** Laravel Filament 3.x
- **Frontend:** Next.js 14+ (App Router), React 18, TypeScript
- **UI Components:** shadcn/ui, Tailwind CSS 3.x
- **API Auth:** Laravel Sanctum
- **State Management:** Zustand, TanStack Query
- **Forms:** React Hook Form + Zod
- **Notifications:** Twilio (SMS), Laravel Mail/Mailgun (Email), Telegram Bot API, FCM (Push)
- **AI Providers:** OpenAI, Anthropic, Google Gemini, Mistral, Ollama (local)
- **AI Integration:** OpenAI PHP SDK, Anthropic PHP SDK, custom service layer
- **Caching:** Redis (Laravel Cache)
- **Queue:** Laravel Queues (Redis driver)
- **Testing:** Pest PHP (backend), Vitest + React Testing Library (frontend)
- **Code Quality:** Laravel Pint, ESLint, Prettier
- **Deployment:** 
  - Backend: Laravel Forge, DigitalOcean, AWS
  - Frontend: Vercel
  - Database: Managed PostgreSQL
  - Cache/Queue: Redis Cloud, AWS ElastiCache
