const mongoose = require('mongoose');

const ConversationSchema = new mongoose.Schema(
  {
    participants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'users', index: true, required: true }],
    isGroup: { type: Boolean, default: false },
    name: { type: String, trim: true },
    lastMessage: { type: String, default: '' },
    lastMessageBy: { type: mongoose.Schema.Types.ObjectId, ref: 'users' },
    lastMessageAt: { type: Date, index: true },
  },
  { timestamps: true }
);

ConversationSchema.index({ participants: 1, updatedAt: -1 });

module.exports = mongoose.model('conversations', ConversationSchema);
