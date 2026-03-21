const Story = require('../models/Story');

const getStories = async (req, res) => {
  try {
    const stories = await Story.find({ expiresAt: { $gt: new Date() } })
      .populate('author', 'firstName lastName profilePic role branch')
      .sort({ createdAt: -1 });
    res.json(stories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const createStory = async (req, res) => {
  const { imageUrl, caption, music } = req.body;
  if (!imageUrl) return res.status(400).json({ message: 'Image is required for a story' });
  try {
    const story = await Story.create({
      author: req.user._id,
      imageUrl,
      caption,
      music
    });
    const populated = await Story.findById(story._id)
      .populate('author', 'firstName lastName profilePic role branch');
    res.status(201).json(populated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (!story.viewers.includes(req.user._id)) {
      story.viewers.push(req.user._id);
      await story.save();
    }
    res.json({ viewers: story.viewers.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);
    if (!story) return res.status(404).json({ message: 'Story not found' });
    if (story.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }
    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { getStories, createStory, viewStory, deleteStory };
