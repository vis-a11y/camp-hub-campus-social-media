const Chat = require('../models/Chat');
const User = require('../models/User');

exports.accessChat = async (req, res) => {
  const { userId } = req.body;
  if (!userId) return res.status(400).json({ message: 'UserId not provided' });

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  }).populate('users', '-password').populate('latestMessage');

  isChat = await User.populate(isChat, {
    path: 'latestMessage.sender',
    select: 'firstName lastName profilePic email',
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    try {
      const createdChat = await Chat.create({
        chatName: 'sender',
        isGroupChat: false,
        users: [req.user._id, userId],
      });
      const fullChat = await Chat.findById(createdChat._id).populate('users', '-password');
      res.status(200).json(fullChat);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
};

exports.fetchChats = async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate('users', '-password')
      .populate('groupAdmin', '-password')
      .populate('latestMessage')
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: 'latestMessage.sender',
          select: 'firstName lastName profilePic email',
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
