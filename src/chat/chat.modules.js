const models = require('../models');

class chat_module {
  static async create_conversation(req) {
    const { participantIds, isGroup = false, name } = req.body;
    if (!Array.isArray(participantIds) || participantIds.length < 2) {
      const err = new Error('participantIds must include at least two user IDs');
      err.status_code = 400; err.type = 'ValidationError';
      throw err;
    }

    const conversation = await models.conversations.create({
      participants: participantIds,
      isGroup,
      name,
    });
    return conversation.toObject();
  }

  static async list_conversations(req) {
    const rawLimit = Number(req.query.limit);
    const rawPage = Number(req.query.page);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20;
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 0;

    const userId = req.query.userId;
    const query = userId ? { participants: userId } : {};

    const [items, count] = await Promise.all([
      models.conversations
        .find(query, { __v: 0 }, { lean: true, sort: { updatedAt: -1 }, skip: page * limit, limit })
        .populate('participants', '_id name profileImage'),
      models.conversations.countDocuments(query),
    ]);

    return { items, count, page, limit };
  }

  static async create_message(req) {
    const { conversationId } = req.params;
    const { sender, content, type = 'text' } = req.body;

    if (!conversationId || !sender || !content) {
      const err = new Error('conversationId, sender and content are required');
      err.status_code = 400; err.type = 'ValidationError';
      throw err;
    }

    const message = await models.messages.create({ conversationId, sender, content, type });

    await models.conversations.findByIdAndUpdate(conversationId, {
      lastMessage: content,
      lastMessageBy: sender,
      lastMessageAt: new Date(),
    });

    // Emit event via attached io (if present)
    if (req.app?.get('io')) {
      req.app.get('io').to(`conv:${conversationId}`).emit('chat:message', message.toObject());
    }
    return message.toObject();
  }

  static async list_messages(req) {
    const { conversationId } = req.params;
    const rawLimit = Number(req.query.limit);
    const rawPage = Number(req.query.page);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 50;
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 0;

    const query = { conversationId };
    const [items, count] = await Promise.all([
      models.messages
        .find(query, { __v: 0 }, { lean: true, sort: { createdAt: -1 }, skip: page * limit, limit })
        .populate('sender', '_id name profileImage'),
      models.messages.countDocuments(query),
    ]);

    return { items, count, page, limit };
  }
}

module.exports = chat_module;
