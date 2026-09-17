const router = require('express').Router();
const { protect } = require('../middleware/auth');
const chat = require('../controllers/chatController');

router.use(protect);
router.get('/stream', chat.stream);
router.get('/contacts', chat.getContacts);
router.get('/messages/:userId', chat.getMessages);
router.post('/messages', chat.sendMessage);
router.put('/messages/:userId/read', chat.markRead);
router.get('/assistant', chat.getAssistantMessages);
router.post('/assistant', chat.sendAssistantMessage);

module.exports = router;
