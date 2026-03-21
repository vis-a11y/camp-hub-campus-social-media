const Club = require('../models/Club');
const Committee = require('../models/Committee');

const getClubs = async (req, res) => {
  try {
    const clubs = await Club.find().populate('members', 'firstName lastName profilePic branch role');
    res.json(clubs);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createClub = async (req, res) => {
  try {
    const { name, description, category, department } = req.body;
    const club = await Club.create({
      name,
      description,
      category: category || 'Academic',
      department: department || 'General',
      admins: [req.user._id],
      members: [req.user._id]
    });
    res.status(201).json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const joinClub = async (req, res) => {
  try {
    const club = await Club.findById(req.params.id);
    if (!club) return res.status(404).json({ message: 'Club not found' });
    if (!club.members.includes(req.user._id)) {
      club.members.push(req.user._id);
      await club.save();
    }
    res.json(club);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getCommittees = async (req, res) => {
  try {
    const committees = await Committee.find().populate('members', 'firstName lastName profilePic branch role');
    res.json(committees);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const Chat = require('../models/Chat');

const createCommittee = async (req, res) => {
  try {
    const { name, description, department, head, incharge, logo, pictures } = req.body;
    
    const newChat = await Chat.create({
      chatName: `${name} Committee`,
      isGroupChat: true,
      users: [req.user._id],
      groupAdmin: req.user._id
    });

    const committee = await Committee.create({
      name,
      description,
      department: department || 'General',
      head: head || '',
      incharge: incharge || '',
      logo: logo || '',
      pictures: pictures || [],
      chatGroup: newChat._id,
      admins: [req.user._id],
      members: [req.user._id]
    });
    res.status(201).json(committee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getClubs, createClub, joinClub, getCommittees, createCommittee };
