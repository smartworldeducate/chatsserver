const { sequelize } = require('../config/database');
const { DataTypes } = require('sequelize');

// Users
const users = sequelize.define(
  'users',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name: { type: DataTypes.STRING, allowNull: true },
    phoneNumber: { type: DataTypes.STRING, allowNull: true, unique: false },
    profileImage: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue:
        'https://www.pngitem.com/pimgs/m/146-1468479_my-profile-icon-blank-profile-picture-circle-hd.png',
    },
    about: { type: DataTypes.STRING, allowNull: false, defaultValue: '' },
    selectedCountry: { type: DataTypes.JSONB, allowNull: true },
  },
  { timestamps: true }
);

// Conversations
const conversations = sequelize.define(
  'conversations',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    isGroup: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    name: { type: DataTypes.STRING, allowNull: true },
    lastMessage: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    lastMessageBy: { type: DataTypes.INTEGER, allowNull: true, references: { model: 'users', key: 'id' } },
    lastMessageAt: { type: DataTypes.DATE, allowNull: true },
  },
  { timestamps: true }
);

// Messages
const messages = sequelize.define(
  'messages',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    conversationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'conversations', key: 'id' } },
    sender: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
    type: { type: DataTypes.ENUM('text'), allowNull: false, defaultValue: 'text' },
    content: { type: DataTypes.TEXT, allowNull: false, defaultValue: '' },
    status: { type: DataTypes.ENUM('sent', 'delivered', 'read'), allowNull: false, defaultValue: 'sent' },
  },
  { timestamps: true }
);

// Conversation Participants (junction)
const conversationParticipants = sequelize.define(
  'conversation_participants',
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    conversationId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'conversations', key: 'id' } },
    userId: { type: DataTypes.INTEGER, allowNull: false, references: { model: 'users', key: 'id' } },
  },
  { timestamps: true, indexes: [{ unique: true, fields: ['conversationId', 'userId'] }] }
);

// Associations
users.hasMany(messages, { foreignKey: 'sender', as: 'sentMessages' });
messages.belongsTo(users, { foreignKey: 'sender', as: 'senderUser' });

conversations.hasMany(messages, { foreignKey: 'conversationId', as: 'messages' });
messages.belongsTo(conversations, { foreignKey: 'conversationId' });

conversations.belongsTo(users, { foreignKey: 'lastMessageBy', as: 'lastMessageUser' });

conversations.belongsToMany(users, {
  through: conversationParticipants,
  as: 'participants',
  foreignKey: 'conversationId',
  otherKey: 'userId',
});
users.belongsToMany(conversations, {
  through: conversationParticipants,
  as: 'conversations',
  foreignKey: 'userId',
  otherKey: 'conversationId',
});

module.exports = {
  sequelize,
  users,
  conversations,
  messages,
  conversationParticipants,
};