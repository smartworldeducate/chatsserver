const chat_module = require('./chat.modules');
const { sendSuccess, sendError } = require('../utils/responses');

class chat_controller extends chat_module {
  static create_conversation = async (req, res) => {
    try {
      const data = await super.create_conversation(req);
      sendSuccess(res, data, 'Conversation created', 201);
    } catch (error) {
      sendError(res, error);
    }
  };

  static list_conversations = async (req, res) => {
    try {
      const data = await super.list_conversations(req);
      sendSuccess(res, data, 'Conversations fetched');
    } catch (error) {
      sendError(res, error);
    }
  };

  static create_message = async (req, res) => {
    try {
      const data = await super.create_message(req);
      sendSuccess(res, data, 'Message sent', 201);
    } catch (error) {
      sendError(res, error);
    }
  };

  static list_messages = async (req, res) => {
    try {
      const data = await super.list_messages(req);
      sendSuccess(res, data, 'Messages fetched');
    } catch (error) {
      sendError(res, error);
    }
  };
}

module.exports = chat_controller;
