const express = require('express')
const router = express.Router();
const blogCtrl = require('../controllers/blogController')

router.post('/',blogCtrl.uploadSingle.single('image'), blogCtrl.createBlog)

router.put('/:id',blogCtrl.uploadSingle.single('image'), blogCtrl.updateBlog)

router.delete('/:id', blogCtrl.deleteBlog)

router.get('/:id', blogCtrl.getBlog)

router.get('/', blogCtrl.getAllBlogs)

module.exports = router;
