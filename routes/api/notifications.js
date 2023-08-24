const express = require('express');
const router = express.Router();
const notificationsController = require('../../controllers/notificationsController');

router.route('/')
  .get(notificationsController.getNotifications)
  .post(notificationsController.createNotifications);
 
router.route('/:id')
  .delete(notificationsController.deleteNotification);

module.exports = router;