const express = require('express');
const router = express.Router();
const {
  createPost, getPosts, getPostById, getUserPosts,
  likePost, commentPost, deleteComment,
  savePost, getSavedPosts, deletePost, votePoll
} = require('../controllers/postController');
const { createEvent, registerForEvent, getEventRegistrants, getAllEvents } = require('../controllers/eventController');
const { createGroup, getMyGroups, joinGroup } = require('../controllers/groupController');
const { getStories, createStory, viewStory, deleteStory } = require('../controllers/storyController');
const { getNotifications, getUnreadCount, markAsRead, markOneAsRead, deleteNotification } = require('../controllers/notificationController');
const { getClubs, createClub, joinClub, getCommittees, createCommittee } = require('../controllers/clubController');
const { protect, authorize } = require('../middleware/authMiddleware');

// Posts
router.route('/posts')
  .get(protect, getPosts)
  .post(protect, createPost);

router.get('/posts/saved', protect, getSavedPosts);
router.get('/posts/user/:userId', protect, getUserPosts);
router.get('/posts/:id', protect, getPostById);
router.delete('/posts/:id', protect, deletePost);
router.post('/posts/:id/like', protect, likePost);
router.post('/posts/:id/comment', protect, commentPost);
router.delete('/posts/:id/comment/:commentId', protect, deleteComment);
router.post('/posts/:id/save', protect, savePost);
router.post('/posts/:id/vote', protect, votePoll);

// Stories
router.route('/stories')
  .get(protect, getStories)
  .post(protect, createStory);

router.post('/stories/:id/view', protect, viewStory);
router.delete('/stories/:id', protect, deleteStory);

// Notifications
router.get('/notifications', protect, getNotifications);
router.get('/notifications/unread-count', protect, getUnreadCount);
router.put('/notifications/mark-all-read', protect, markAsRead);
router.put('/notifications/:id/read', protect, markOneAsRead);
router.delete('/notifications/:id', protect, deleteNotification);

// Events
router.route('/events')
  .get(protect, getAllEvents)
  .post(protect, authorize('faculty', 'admin'), createEvent);

router.post('/events/:id/register', protect, registerForEvent);
router.get('/events/:id/registrations', protect, authorize('faculty', 'admin'), getEventRegistrants);

// Groups
router.route('/groups')
  .get(protect, getMyGroups)
  .post(protect, createGroup);

router.post('/groups/:id/join', protect, joinGroup);

// Clubs
router.route('/clubs')
  .get(protect, getClubs)
  .post(protect, authorize('faculty', 'admin'), createClub);

router.post('/clubs/:id/join', protect, joinClub);

// Committees
router.route('/committees')
  .get(protect, getCommittees)
  .post(protect, authorize('faculty', 'admin'), createCommittee);

module.exports = router;
