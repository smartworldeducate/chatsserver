const models = require('../models');

class chat_module {
  static async create_conversation(req) {
    const { participantIds, isGroup = false, name } = req.body;
    if (!Array.isArray(participantIds) || participantIds.length < 2) {
      const err = new Error('participantIds must include at least two user IDs');
      err.status_code = 400; err.type = 'ValidationError';
      throw err;
    }

    const conversation = await models.conversations.create({ isGroup, name });
    const bulk = participantIds.map((userId) => ({ conversationId: conversation.id, userId }));
    await models.conversationParticipants.bulkCreate(bulk, { ignoreDuplicates: true });
    return conversation.toJSON();
  }

  static async list_conversations(req) {
    const rawLimit = Number(req.query.limit);
    const rawPage = Number(req.query.page);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 20;
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 0;
    const offset = page * limit;

    const userId = req.query.userId;

    const { rows, count } = await models.conversations.findAndCountAll({
      include: [
        {
          model: models.users,
          as: 'participants',
          through: { attributes: [] },
          attributes: ['id', 'name', 'profileImage'],
          ...(userId ? { where: { id: userId } } : {}),
        },
        { model: models.users, as: 'lastMessageUser', attributes: ['id', 'name', 'profileImage'] },
      ],
      order: [['updatedAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return { items: rows, count, page, limit };
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

    await models.conversations.update(
      { lastMessage: content, lastMessageBy: sender, lastMessageAt: new Date() },
      { where: { id: conversationId } }
    );

    if (req.app?.get('io')) {
      req.app.get('io').to(`conv:${conversationId}`).emit('chat:message', message.toJSON());
    }
    return message.toJSON();
  }

  static async list_messages(req) {
    const { conversationId } = req.params;
    const rawLimit = Number(req.query.limit);
    const rawPage = Number(req.query.page);
    const limit = Number.isFinite(rawLimit) && rawLimit > 0 ? rawLimit : 50;
    const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 0;
    const offset = page * limit;

    const { rows, count } = await models.messages.findAndCountAll({
      where: { conversationId },
      include: [{ model: models.users, as: 'senderUser', attributes: ['id', 'name', 'profileImage'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
      distinct: true,
    });

    return { items: rows, count, page, limit };
  }
}

module.exports = chat_module;
