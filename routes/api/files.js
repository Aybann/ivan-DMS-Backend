const express = require('express');
const router = express.Router();
const filesController = require('../../controllers/filesController');
const fileUpload = require('express-fileupload')
const filesPayloadExists = require('../../middleware/filesPayloadExist')
const fileSizeLimiter = require('../../middleware/fileSizeLimiter')
const fileExtLimiter = require('../../middleware/fileExtLimiter')
const verifyRoles = require('../../middleware/verifyRoles');
const ROLES_LIST = require('../../config/roles_list');

router.route('/')
  .get(filesController.getAllFiles)
  .post(
        fileUpload({createParentPath: true}),
        filesPayloadExists,
        // fileExtLimiter(['.doc', '.pdf', '.ppt']),
        // fileSizeLimiter,
        // verifyRoles(ROLES_LIST.User),
        filesController.createNewFile
  )
  
router.route('/:id')
  .get(filesController.getFile)
  .put(filesController.updateFile)
  .delete(filesController.deleteFile);

router.route('/removeTag/:id') 
  .put(filesController.removeAllTag);
  
module.exports = router;