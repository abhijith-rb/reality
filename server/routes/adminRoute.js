const express = require('express');
const router = express.Router();
const adminCtrl = require('../controllers/adminController')
const jwt = require('jsonwebtoken');
const adminChecker = require("../middlewares/adminChecker");
const verifyJWT = require('../middlewares/verifyJWT');

router.post('/adduser', verifyJWT, adminChecker,  adminCtrl.addUser)
router.get('/getallusers', verifyJWT, adminChecker,  adminCtrl.getAllUsers)
router.get('/getuser/:id', verifyJWT, adminChecker,  adminCtrl.getSpecificUser)
router.post('/updateuser/:id', verifyJWT, adminChecker,  adminCtrl.updateUser)

router.post('/addbanner', verifyJWT, adminChecker, adminCtrl.uploadSingle.single('image'), adminCtrl.addBanner)
router.get('/getallbanners', verifyJWT, adminChecker,  adminCtrl.getAllBanners)
router.get('/getbanner/:id', verifyJWT, adminChecker,  adminCtrl.getSpecificBanner)
router.post('/updatebanner/:id', verifyJWT, adminChecker, adminCtrl.uploadSingle.single('image'), adminCtrl.updateBanner)
router.delete('/deletebanner/:id', verifyJWT, adminChecker,  adminCtrl.deleteBanner)
router.get('/search-banner', verifyJWT, adminChecker,  adminCtrl.searchBanners)

router.put('/blockuser/:id', verifyJWT, adminChecker, adminCtrl.blockUser)
router.put('/unblockuser/:id', verifyJWT, adminChecker, adminCtrl.unblockUser)
router.get('/search', verifyJWT, adminChecker,  adminCtrl.searchUsers)

router.get('/carddeets', verifyJWT, adminChecker, adminCtrl.getCardDeets)
router.get('/piedeets', verifyJWT, adminChecker,  adminCtrl.getPieDeets)
router.get('/graphdata', verifyJWT, adminChecker,  adminCtrl.getListChart)

module.exports = router;