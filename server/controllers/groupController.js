const Group = require('../models/Group');

const createGroup = async (req, res) => {
  const { name, type, description, memberIds, activeHours, isAiGenerated } = req.body;
  try {
    const group = await Group.create({
      name,
      type: type || 'course',
      description,
      incharge: req.user._id,
      members: [req.user._id, ...(memberIds || [])],
      activeHours: activeHours || [],
      isAiGenerated: isAiGenerated || false,
    });
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({ members: req.user._id })
      .populate('members', 'firstName lastName role branch profilePic')
      .populate('incharge', 'firstName lastName');
    res.json(groups);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);
    if (!group) return res.status(404).json({ message: 'Cluster Hub Not Found' });

    if (group.members.includes(req.user._id)) {
      return res.status(400).json({ message: 'Peer already synchronized to cluster' });
    }

    group.members.push(req.user._id);
    await group.save();
    res.json({ message: 'Synchronization successful', members: group.members.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createGroup,
  getMyGroups,
  joinGroup,
};
