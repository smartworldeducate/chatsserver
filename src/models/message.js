const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema(
  {
    conversationId: { type: mongoose.Schema.Types.ObjectId, ref: 'conversations', required: true, index: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true, index: true },
    type: { type: String, enum: ['text'], default: 'text' },
    content: { type: String, trim: true, default: '' },
    status: { type: String, enum: ['sent', 'delivered', 'read'], default: 'sent', index: true },
  },
  { timestamps: true }
);

MessageSchema.index({ conversationId: 1, createdAt: -1 });

module.exports = mongoose.model('messages', MessageSchema);
