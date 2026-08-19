const RESPOND_TOOL_NAME = 'respond_to_customer';

const RESPOND_TOOL_SCHEMA = {
  type: 'function',
  function: {
    name: RESPOND_TOOL_NAME,
    description:
      'Reply to the customer and report the conversation state extracted from this turn.',
    parameters: {
      type: 'object',
      properties: {
        reply: { type: 'string' },
        detected_language: { type: 'string', enum: ['en', 'hi', 'hinglish'] },
        primary_intent: {
          type: 'string',
          enum: [
            'property_inquiry', 'price_inquiry', 'configuration_inquiry', 'budget_discussion',
            'location_inquiry', 'buying_timeline', 'self_use', 'investment', 'site_visit_request',
            'callback_request', 'busy', 'not_interested', 'opt_out', 'human_agent_request',
            'general_unknown', 'conversation_completion',
          ],
        },
        extracted_fields: {
          type: 'object',
          properties: {
            name: { type: ['string', 'null'] },
            configuration: { type: ['string', 'null'] },
            budget: { type: ['string', 'null'] },
            purpose: { type: ['string', 'null'] },
            location_preference: { type: ['string', 'null'] },
            timeline: { type: ['string', 'null'] },
          },
          required: ['name', 'configuration', 'budget', 'purpose', 'location_preference', 'timeline'],
        },
        interest_level: { type: 'string', enum: ['high', 'medium', 'low', 'unknown'] },
        wants_site_visit: { type: 'boolean' },
        site_visit_date: { type: ['string', 'null'] },
        site_visit_time: { type: ['string', 'null'] },
        follow_up_required: { type: 'boolean' },
        follow_up_time: { type: ['string', 'null'] },
        human_escalation: { type: 'boolean' },
        communication_opt_out: { type: 'boolean' },
        objection_detected: {
          type: ['string', 'null'],
          enum: ['price', 'location', 'think_about_it', 'send_details', null],
        },
        unanswered_question: { type: 'boolean' },
        conversation_complete: { type: 'boolean' },
      },
      required: [
        'reply', 'detected_language', 'primary_intent', 'extracted_fields', 'interest_level',
        'wants_site_visit', 'follow_up_required', 'human_escalation', 'communication_opt_out',
        'unanswered_question', 'conversation_complete',
      ],
    },
  },
};

module.exports = { RESPOND_TOOL_NAME, RESPOND_TOOL_SCHEMA };
