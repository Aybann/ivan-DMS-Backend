const express = require('express');
const router = express.Router();
const tagsController = require('../../controllers/tagsController');

router.route('/')
  .get(tagsController.getAllTag)
  .post(tagsController.createNewTag);
 

router.route('/:id')
  .get(tagsController.getTag)
  .put(tagsController.updateTag)
  .delete(tagsController.deleteTag);

module.exports = router;