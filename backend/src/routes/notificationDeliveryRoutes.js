const router = require('express').Router();
const { protect, authorize } = require('../middleware/auth');
const controller = require('../controllers/notificationDeliveryController');

router.use(protect, authorize('admin'));
router.get('/', controller.list);
router.post('/:id/retry', controller.retry);

module.exports = router;
