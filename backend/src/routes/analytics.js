const express = require('express');
const { buildAnalytics } = require('../services/analyticsService');

function createAnalyticsRouter({ store }) {
  const router = express.Router();

  router.get('/analytics/:conversation_id', (req, res) => {
    const state = store.getConversation(req.params.conversation_id);
    if (!state) {
      return res.status(404).json({ error: 'Conversation not found' });
    }
    res.json(buildAnalytics(state));
  });

  return router;
}

module.exports = { createAnalyticsRouter };
