const express = require('express');
const controller = require('./chat.controller');

const router = express.Router();

// conversations
router.post('/conversations', controller.create_conversation);
router.get('/conversations', controller.list_conversations);

// messages
router.post('/conversations/:conversationId/messages', controller.create_message);
router.get('/conversations/:conversationId/messages', controller.list_messages);

module.exports = router;
