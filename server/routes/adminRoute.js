const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController')
const jwt = require('jsonwebtoken');

router.post('/adduser',adminCtrl.authenticateToken, adminCtrl.addUser)
router.get('/getallusers',adminCtrl.authenticateToken, adminCtrl.getAllUsers)
router.get('/getuser/:id',adminCtrl.authenticateToken, adminCtrl.getSpecificUser)
router.post('/updateuser/:id',adminCtrl.authenticateToken, adminCtrl.updateUser)
router.put('/blockuser/:id',adminCtrl.authenticateToken,adminCtrl.blockUser)
router.put('/unblockuser/:id',adminCtrl.authenticateToken,adminCtrl.unblockUser)
router.get('/search',adminCtrl.authenticateToken, adminCtrl.searchUsers)

module.exports = router;