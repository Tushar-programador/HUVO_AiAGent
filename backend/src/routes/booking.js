const express = require('express');

function createBookingRouter({ store, booking }) {
  const router = express.Router();

  router.post('/booking', (req, res) => {
    const { conversation_id, customer_name, date, time, force } = req.body || {};
    if (!conversation_id || !date || !time) {
      return res.status(400).json({ error: 'conversation_id, date, and time are required' });
    }

    const state = store.getOrCreateConversation(conversation_id);
    const result = booking.attemptBooking({ date, time, force });

    if (result.success) {
      store.updateConversation(conversation_id, {
        name: customer_name || state.name,
        site_visit_status: 'confirmed',
        site_visit_date: date,
        site_visit_time: time,
        booking_id: result.booking_id,
        conversation_status: 'site_visit_confirmed',
      });
      return res.json({ success: true, booking_id: result.booking_id });
    }

    store.updateConversation(conversation_id, { site_visit_status: 'failed' });
    return res.json({ success: false, reason: result.reason });
  });

  return router;
}

module.exports = { createBookingRouter };
