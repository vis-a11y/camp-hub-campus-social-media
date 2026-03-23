const Event = require('../models/Event');

const createEvent = async (req, res) => {
  const { title, description, date, time, location, image, type, capacity, tags } = req.body;

  try {
    const event = await Event.create({
      title,
      description,
      date,
      time: time || '',
      location,
      image: image || '',
      type: type || 'Academic Hub',
      organizer: req.user._id,
      capacity: capacity || 0,
      tags: tags || [],
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const registerForEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Signal Node Not Found' });

    if (event.registrations.includes(req.user._id)) {
      return res.status(400).json({ message: 'Peer already synchronized' });
    }

    if (event.capacity > 0 && event.registrations.length >= event.capacity) {
      return res.status(400).json({ message: 'Node capacity reached' });
    }

    event.registrations.push(req.user._id);
    await event.save();
    res.json({ message: 'Synchronization successful', registrations: event.registrations.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getEventRegistrants = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('registrations', 'firstName lastName email role branch');
    if (!event) return res.status(404).json({ message: 'Signal Node Not Found' });

    res.json(event.registrations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find()
      .populate('organizer', 'firstName lastName email role profilePic')
      .sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createEvent,
  registerForEvent,
  getEventRegistrants,
  getAllEvents,
};
