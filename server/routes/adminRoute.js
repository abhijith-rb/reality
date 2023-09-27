const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController')
const jwt = require('jsonwebtoken');

router.post('/adduser',adminCtrl.authenticateToken, adminCtrl.addUser)
router.get('/getallusers',adminCtrl.authenticateToken, adminCtrl.getAllUsers)
router.get('/getuser/:id',adminCtrl.authenticateToken, adminCtrl.getSpecificUser)
router.post('/updateuser/:id',adminCtrl.authenticateToken, adminCtrl.updateUser)

router.post('/addbanner',adminCtrl.authenticateToken,adminCtrl.uploadSingle.single('image'), adminCtrl.addBanner)
router.get('/getallbanners',adminCtrl.authenticateToken, adminCtrl.getAllBanners)
router.get('/getbanner/:id',adminCtrl.authenticateToken, adminCtrl.getSpecificBanner)
router.post('/updatebanner/:id',adminCtrl.authenticateToken,adminCtrl.uploadSingle.single('image'), adminCtrl.updateBanner)
router.delete('/deletebanner/:id',adminCtrl.authenticateToken, adminCtrl.deleteBanner)
router.get('/search-banner',adminCtrl.authenticateToken, adminCtrl.searchBanners)

router.put('/blockuser/:id',adminCtrl.authenticateToken,adminCtrl.blockUser)
router.put('/unblockuser/:id',adminCtrl.authenticateToken,adminCtrl.unblockUser)
router.get('/search',adminCtrl.authenticateToken, adminCtrl.searchUsers)

router.get('/carddeets',adminCtrl.authenticateToken,adminCtrl.getCardDeets)
router.get('/piedeets',adminCtrl.authenticateToken, adminCtrl.getPieDeets)
router.get('/graphdata',adminCtrl.authenticateToken, adminCtrl.getListChart)

module.exports = router;