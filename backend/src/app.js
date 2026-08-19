const express = require('express');
const cors = require('cors');
const env = require('./config/env');
const store = require('./state/conversationStore');
const bookingService = require('./services/bookingService');
const { createLLMClient } = require('./llm/client');
const { loadSystemPrompt } = require('./llm/promptLoader');
const { createConversationService } = require('./services/conversationService');
const { createChatRouter } = require('./routes/chat');
const { createBookingRouter } = require('./routes/booking');
const { createAnalyticsRouter } = require('./routes/analytics');

function createApp(overrides = {}) {
  const app = express();
  app.use(cors({ origin: env.FRONTEND_URL }));
  app.use(express.json());

  const deps = {
    store: overrides.store || store,
    booking: overrides.booking || bookingService,
    llmClient: overrides.llmClient || createLLMClient(),
    systemPrompt: overrides.systemPrompt || loadSystemPrompt(),
  };

  const conversationService = createConversationService({
    store: deps.store,
    llmClient: deps.llmClient,
    systemPrompt: deps.systemPrompt,
    booking: deps.booking,
  });

  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  app.use(createChatRouter({ conversationService }));
  app.use(createBookingRouter({ store: deps.store, booking: deps.booking }));
  app.use(createAnalyticsRouter({ store: deps.store }));

  app.post('/reset/:conversation_id', (req, res) => {
    res.json(deps.store.resetConversation(req.params.conversation_id));
  });

  return app;
}

module.exports = { createApp };
