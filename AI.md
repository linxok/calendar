# AI Agent Integration Specification

## 1. Overview

The AI Agent is an intelligent layer integrated into the beauty salon booking system that provides:
- User behavior analysis and pattern recognition
- Predictive recommendations for services and optimal booking times
- Intelligent customer support and automated responses
- Business insights and optimization suggestions
- Multi-model AI provider support with flexible model selection

---

## 2. AI Agent Roles & Use Cases

### 2.1 Customer Intelligence Agent
**Primary Functions:**
- Analyze booking history and patterns
- Predict next service based on user behavior
- Recommend optimal booking times based on user preferences
- Identify customer segments (frequent, seasonal, new, at-risk)
- Personalized service recommendations

**Examples:**
- "Based on your previous appointments, you might need a haircut in 3-4 weeks"
- "You usually book on weekends at 10 AM — would you like to see available slots?"
- "Customers who get haircuts often add hair treatment — would you like to try it?"

---

### 2.2 Smart Booking Assistant
**Primary Functions:**
- Natural language booking interface
- Conversational appointment scheduling
- Understand user intent and context
- Handle complex requests ("I need a haircut next Friday afternoon with Maria")
- Multi-turn conversations for booking refinement

**Examples:**
- User: "I need a haircut next week"
- AI: "I found 3 available slots with your preferred master Anna: Tuesday 2 PM, Wednesday 11 AM, Friday 4 PM. Which works best?"

---

### 2.3 Customer Support Agent
**Primary Functions:**
- Answer FAQs about services, pricing, policies
- Handle booking inquiries
- Provide service information
- Assist with rescheduling and cancellations
- Escalate to human support when needed

**Examples:**
- "What is your cancellation policy?"
- "How long does hair coloring take?"
- "Can I reschedule my appointment?"

---

### 2.4 Business Intelligence Agent
**Primary Functions:**
- Analyze salon performance metrics
- Identify peak hours and low-traffic periods
- Recommend optimal pricing strategies
- Forecast demand and resource needs
- Detect anomalies (unusual cancellation rates, booking drops)
- Master performance analysis

**Examples:**
- "Your bookings drop by 30% on Mondays — consider offering a promotion"
- "Master Anna has 85% occupancy rate — you might need another stylist"
- "Coloring services increased 20% this month — stock up on supplies"

---

### 2.5 Marketing & Retention Agent
**Primary Functions:**
- Identify at-risk customers (haven't booked in X weeks)
- Generate personalized re-engagement messages
- Suggest promotions for specific customer segments
- Create upsell opportunities
- Analyze campaign effectiveness

**Examples:**
- "20 customers haven't booked in 2+ months — send re-engagement offer"
- "Customers who book haircuts also book coloring 40% of the time within 2 weeks"
- "Offer loyalty discount to top 10% of customers"

---

### 2.6 Master Assistant Agent
**Primary Functions:**
- Provide master with daily schedule summary
- Suggest optimal break times
- Alert about upcoming appointments
- Recommend service combinations
- Track master performance trends

**Examples:**
- "Your schedule is 90% full today. Optimal break: 1-2 PM"
- "You have 3 new clients this week — review their preferences"
- "Your average appointment time for haircuts is 35 min vs salon average 30 min"

---

### 2.7 Quality Assurance Agent
**Primary Functions:**
- Detect potential booking conflicts before they happen
- Validate appointment feasibility
- Monitor service quality signals
- Identify scheduling inefficiencies
- Suggest schedule optimizations

**Examples:**
- "This booking creates a tight schedule — consider adding 10 min buffer"
- "Master will need to rush between appointments — suggest rescheduling"
- "No-show rate increased for late evening slots — consider confirmation calls"

---

### 2.8 Content Generation Agent
**Primary Functions:**
- Generate appointment confirmation messages
- Create personalized notification templates
- Write social media content suggestions
- Generate service descriptions
- Create email marketing content

**Examples:**
- "Hi Maria! Your haircut appointment with Anna is confirmed for Friday, April 10 at 3 PM. We look forward to seeing you!"
- "New service alert: Try our keratin treatment — perfect for smoothing and shine"

---

## 3. Multi-Model AI Architecture

### 3.1 Supported AI Providers

| Provider | Models | Use Cases | Cost Tier |
|----------|--------|-----------|-----------|
| **OpenAI** | GPT-4, GPT-4 Turbo, GPT-3.5 Turbo | Conversational AI, recommendations, content generation | Premium |
| **Anthropic** | Claude 3.5 Sonnet, Claude 3 Opus, Claude 3 Haiku | Customer support, analysis, business insights | Premium |
| **Google** | Gemini 1.5 Pro, Gemini 1.5 Flash | Multi-modal analysis, predictions | Mid-tier |
| **Mistral** | Mistral Large, Mistral Medium | Business intelligence, analytics | Mid-tier |
| **Cohere** | Command, Command-R+ | Text generation, embeddings | Mid-tier |
| **Local/Open Source** | Llama 3, Mixtral, Phi-3 | Privacy-focused, cost optimization | Budget |

### 3.2 Model Selection Strategy

**Routing Logic:**
- **Complex reasoning**: GPT-4, Claude 3.5 Sonnet
- **Fast responses**: GPT-3.5 Turbo, Gemini Flash, Claude Haiku
- **Embeddings**: OpenAI ada-002, Cohere embed
- **Privacy-sensitive data**: Local models
- **Budget constraints**: Mistral, Llama 3

### 3.3 Provider Configuration

```json
{
  "providers": [
    {
      "id": "openai",
      "name": "OpenAI",
      "enabled": true,
      "apiKey": "sk-...",
      "models": [
        {
          "id": "gpt-4-turbo",
          "name": "GPT-4 Turbo",
          "contextWindow": 128000,
          "costPer1kTokens": {"input": 0.01, "output": 0.03}
        },
        {
          "id": "gpt-3.5-turbo",
          "name": "GPT-3.5 Turbo",
          "contextWindow": 16000,
          "costPer1kTokens": {"input": 0.0005, "output": 0.0015}
        }
      ]
    },
    {
      "id": "anthropic",
      "name": "Anthropic",
      "enabled": true,
      "apiKey": "sk-ant-...",
      "models": [
        {
          "id": "claude-3-5-sonnet-20241022",
          "name": "Claude 3.5 Sonnet",
          "contextWindow": 200000,
          "costPer1kTokens": {"input": 0.003, "output": 0.015}
        }
      ]
    },
    {
      "id": "local",
      "name": "Local Models",
      "enabled": true,
      "endpoint": "http://localhost:11434",
      "models": [
        {
          "id": "llama3:8b",
          "name": "Llama 3 8B",
          "contextWindow": 8192,
          "costPer1kTokens": {"input": 0, "output": 0}
        }
      ]
    }
  ],
  "defaultProvider": "openai",
  "fallbackProvider": "local"
}
```

---

## 4. AI Features Architecture

### 4.1 User Behavior Analysis Pipeline

```
┌─────────────────┐
│  User Actions   │
│  (bookings,     │
│   cancels,      │
│   preferences)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Data Collection │
│   & Storage     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Feature Eng.   │
│  (patterns,     │
│   frequencies,  │
│   time series)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  AI Analysis    │
│  (embedding +   │
│   clustering)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Insights &     │
│  Predictions    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Recommendations │
│    to User      │
└─────────────────┘
```

### 4.2 Recommendation Engine

**Input Features:**
- Booking history (services, frequency, masters, time preferences)
- Service duration patterns
- Seasonal trends
- Demographic data (optional)
- Cancellation behavior
- Response to notifications

**Output:**
- Next service prediction with confidence score
- Optimal booking time suggestions
- Master recommendations
- Service bundle suggestions
- Churn risk score

**Algorithm:**
1. User embedding generation (vector representation)
2. Similar user clustering (collaborative filtering)
3. Time-series forecasting (next booking prediction)
4. LLM-based reasoning (context-aware recommendations)

### 4.3 Conversational AI Flow

```
User Input (text/voice)
    ↓
Intent Recognition (AI classification)
    ↓
Entity Extraction (service, date, time, master)
    ↓
Context Retrieval (user history, availability)
    ↓
AI Response Generation
    ↓
Action Execution (book, reschedule, cancel)
    ↓
Confirmation & Follow-up
```

---

## 5. Data Model Extensions for AI

### 5.1 New Tables

#### ai_providers
```sql
CREATE TABLE ai_providers (
  id UUID PRIMARY KEY,
  provider_key VARCHAR(50) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  api_key_encrypted TEXT,
  config JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### ai_models
```sql
CREATE TABLE ai_models (
  id UUID PRIMARY KEY,
  provider_id UUID REFERENCES ai_providers(id),
  model_key VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  context_window INTEGER,
  cost_per_1k_input DECIMAL(10,6),
  cost_per_1k_output DECIMAL(10,6),
  enabled BOOLEAN DEFAULT true,
  capabilities JSON,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(provider_id, model_key)
);
```

#### user_behavior_analytics
```sql
CREATE TABLE user_behavior_analytics (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  feature_vector JSON,
  cluster_id INTEGER,
  booking_frequency VARCHAR(20),
  preferred_masters JSON,
  preferred_services JSON,
  preferred_time_slots JSON,
  average_interval_days INTEGER,
  last_booking_date DATE,
  churn_risk_score DECIMAL(5,4),
  lifetime_value DECIMAL(10,2),
  analyzed_at TIMESTAMP DEFAULT NOW(),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### ai_recommendations
```sql
CREATE TABLE ai_recommendations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  recommendation_type VARCHAR(50),
  service_id UUID REFERENCES services(id),
  master_id UUID REFERENCES master_profiles(id),
  suggested_date DATE,
  suggested_time_slots JSON,
  confidence_score DECIMAL(5,4),
  reasoning TEXT,
  status VARCHAR(20) DEFAULT 'pending',
  accepted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);
```

#### ai_conversations
```sql
CREATE TABLE ai_conversations (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  channel VARCHAR(20),
  started_at TIMESTAMP DEFAULT NOW(),
  ended_at TIMESTAMP,
  status VARCHAR(20) DEFAULT 'active',
  metadata JSON
);
```

#### ai_messages
```sql
CREATE TABLE ai_messages (
  id UUID PRIMARY KEY,
  conversation_id UUID REFERENCES ai_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20),
  content TEXT,
  model_used VARCHAR(100),
  tokens_used INTEGER,
  intent VARCHAR(50),
  entities JSON,
  created_at TIMESTAMP DEFAULT NOW()
);
```

#### ai_insights
```sql
CREATE TABLE ai_insights (
  id UUID PRIMARY KEY,
  insight_type VARCHAR(50),
  category VARCHAR(50),
  title VARCHAR(255),
  description TEXT,
  data JSON,
  severity VARCHAR(20),
  actionable BOOLEAN DEFAULT true,
  status VARCHAR(20) DEFAULT 'new',
  created_at TIMESTAMP DEFAULT NOW(),
  acknowledged_at TIMESTAMP
);
```

#### ai_usage_logs
```sql
CREATE TABLE ai_usage_logs (
  id UUID PRIMARY KEY,
  provider VARCHAR(50),
  model VARCHAR(100),
  feature VARCHAR(50),
  user_id UUID REFERENCES users(id),
  tokens_input INTEGER,
  tokens_output INTEGER,
  cost DECIMAL(10,6),
  latency_ms INTEGER,
  status VARCHAR(20),
  error_message TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

## 6. AI API Endpoints

### 6.1 AI Provider Management

#### GET /api/admin/ai/providers
List configured AI providers.

#### POST /api/admin/ai/providers
Add or configure AI provider.
```json
{
  "providerKey": "openai",
  "name": "OpenAI",
  "apiKey": "sk-...",
  "enabled": true,
  "config": {}
}
```

#### PUT /api/admin/ai/providers/:id
Update provider configuration.

#### GET /api/admin/ai/models
List available AI models across all providers.

#### PUT /api/admin/ai/models/:id
Enable/disable model or update cost settings.

---

### 6.2 User Recommendations

#### GET /api/ai/recommendations
Get personalized recommendations for current user.
```json
Response: {
  "recommendations": [
    {
      "id": "uuid",
      "type": "next_service",
      "service": {
        "id": "uuid",
        "name": "Haircut"
      },
      "suggestedDate": "2026-04-15",
      "suggestedTimeSlots": ["10:00", "14:00", "16:00"],
      "master": {
        "id": "uuid",
        "name": "Anna"
      },
      "confidence": 0.87,
      "reasoning": "Based on your booking pattern, you typically get a haircut every 4-5 weeks. Your last appointment was 4 weeks ago."
    }
  ]
}
```

#### POST /api/ai/recommendations/:id/accept
Accept a recommendation and create booking.

#### POST /api/ai/recommendations/:id/dismiss
Dismiss a recommendation.

---

### 6.3 Conversational AI

#### POST /api/ai/chat
Send message to AI assistant.
```json
Request: {
  "message": "I need a haircut next Friday",
  "conversationId": "uuid (optional)"
}

Response: {
  "conversationId": "uuid",
  "response": "I found 3 available slots for haircut on Friday, April 12: 10:00 AM, 2:00 PM, and 4:30 PM. Which time works best for you?",
  "intent": "book_appointment",
  "entities": {
    "service": "haircut",
    "date": "2026-04-12",
    "suggestedSlots": ["10:00", "14:00", "16:30"]
  },
  "suggestions": [
    "10:00 AM",
    "2:00 PM",
    "4:30 PM"
  ]
}
```

#### GET /api/ai/conversations
Get user conversation history.

#### DELETE /api/ai/conversations/:id
End conversation.

---

### 6.4 Business Intelligence

#### GET /api/admin/ai/insights
Get AI-generated business insights.
```json
Response: {
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
      }
    }
  ]
}
```

#### POST /api/admin/ai/insights/generate
Trigger manual insight generation.

#### PATCH /api/admin/ai/insights/:id
Acknowledge or dismiss insight.

---

### 6.5 Analytics

#### GET /api/admin/ai/analytics/users/:userId
Get AI analysis for specific user.

#### GET /api/admin/ai/analytics/cohorts
Get customer segmentation and cohort analysis.

#### GET /api/admin/ai/analytics/predictions
Get demand forecasts and predictions.

#### GET /api/admin/ai/usage
Get AI usage statistics and costs.

---

## 7. AI Processing Workflows

### 7.1 Daily Batch Analysis
**Schedule:** Every night at 2 AM
```
1. Pull all bookings from last 24 hours
2. Update user behavior analytics
3. Recalculate churn risk scores
4. Generate recommendations for next week
5. Identify at-risk customers
6. Generate business insights
7. Update embeddings and clusters
```

### 7.2 Real-Time Event Processing
**Triggers:**
- New booking created → Update user profile, trigger confirmation
- Booking cancelled → Update analytics, check churn risk
- User visits site → Load recommendations
- User sends message → Process with conversational AI

### 7.3 Weekly Business Review
**Schedule:** Every Monday at 6 AM
```
1. Analyze previous week performance
2. Generate master performance reports
3. Identify trends and anomalies
4. Create marketing recommendations
5. Forecast next week demand
6. Send digest to administrators
```

---

## 8. Privacy & Security

### 8.1 Data Handling
- **User consent**: Explicit opt-in for AI analysis
- **Data minimization**: Only use necessary data
- **Anonymization**: Remove PII when possible
- **Retention**: Delete old analytics data after 12 months

### 8.2 AI Provider Security
- **API keys**: Encrypted at rest
- **Data transmission**: TLS/HTTPS only
- **Provider isolation**: No cross-provider data sharing
- **Fallback**: Use local models for sensitive data

### 8.3 Compliance
- **GDPR**: Right to explanation for AI decisions
- **Data portability**: Export AI-generated recommendations
- **Right to deletion**: Remove all AI analytics on request

---

## 9. Configuration & Customization

### 9.1 AI Feature Toggles
```json
{
  "aiFeatures": {
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
  }
}
```

### 9.2 Model Routing Rules
```json
{
  "routingRules": [
    {
      "feature": "chat",
      "condition": "messageLength < 100",
      "model": "gpt-3.5-turbo"
    },
    {
      "feature": "chat",
      "condition": "messageLength >= 100",
      "model": "claude-3-5-sonnet"
    },
    {
      "feature": "recommendations",
      "model": "gpt-4-turbo"
    },
    {
      "feature": "insights",
      "model": "claude-3-opus"
    },
    {
      "feature": "embeddings",
      "model": "text-embedding-ada-002"
    }
  ]
}
```

---

## 10. Performance & Optimization

### 10.1 Caching Strategy
- **Recommendations**: Cache for 24 hours
- **User embeddings**: Cache for 7 days
- **Business insights**: Cache for 24 hours
- **Conversation context**: Cache for session duration

### 10.2 Rate Limiting
- **Per user**: 20 AI requests/hour for chat
- **Per admin**: 100 AI requests/hour for insights
- **Batch processing**: No limits

### 10.3 Cost Optimization
- **Use cheaper models** for simple tasks
- **Batch processing** for analytics
- **Local models** for embeddings
- **Response caching** to avoid duplicate calls
- **Smart routing** based on complexity

---

## 11. Monitoring & Metrics

### Key Metrics
- **AI response accuracy**: User acceptance rate of recommendations
- **Conversation completion rate**: % of chats that result in booking
- **Cost per interaction**: Average spend on AI per user interaction
- **Latency**: Response time for AI features
- **Model performance**: Comparison across providers
- **Business impact**: Revenue from AI-recommended bookings

### Dashboards
- AI usage and costs
- Recommendation acceptance rates
- Conversation analytics
- Model performance comparison
- Business insight outcomes

---

## 12. Implementation Phases

### Phase 1: Foundation
- AI provider abstraction layer
- Multi-model configuration
- Basic analytics collection

### Phase 2: Recommendations
- User behavior analysis
- Recommendation engine
- Next service prediction

### Phase 3: Conversational AI
- Chat interface
- Intent recognition
- Booking via conversation

### Phase 4: Business Intelligence
- Insight generation
- Performance analytics
- Forecasting

### Phase 5: Advanced Features
- Marketing automation
- Quality assurance
- Content generation

---

## 13. Future Enhancements

- **Voice interface**: Speech-to-text booking
- **Image analysis**: Style recommendations from photos
- **Sentiment analysis**: Customer satisfaction tracking
- **A/B testing**: AI-driven optimization experiments
- **Automated scheduling**: AI suggests optimal master schedules
- **Dynamic pricing**: AI-based demand pricing
- **Multi-language support**: Real-time translation
- **Integration with CRM**: Enhanced customer profiles
