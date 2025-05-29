const express = require('express');
const router  = express.Router();
const ctrl    = require('../controllers/tagsController');

router.get('/',      ctrl.getAllTags);
router.get('/:id',   ctrl.getTagById);
router.post('/',     ctrl.createTag);
router.put('/:id',   ctrl.updateTag);
router.delete('/:id',ctrl.deleteTag);

module.exports = router; 