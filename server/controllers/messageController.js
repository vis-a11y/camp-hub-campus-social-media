const Message = require('../models/Message');
const User = require('../models/User');
const Chat = require('../models/Chat');

exports.allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate('sender', 'firstName lastName profilePic email')
      .populate('chat');
    res.json(messages);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.sendMessage = async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) return res.status(400).json({ message: 'Invalid data' });

  try {
    let message = await Message.create({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });

    message = await message.populate('sender', 'firstName lastName profilePic');
    message = await message.populate('chat');
    message = await User.populate(message, {
      path: 'chat.users',
      select: 'firstName lastName profilePic email',
    });

    await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
    res.json(message);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
