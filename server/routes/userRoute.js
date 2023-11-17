const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.get('/getallproperties', userCtrl.getAllProps)
router.get('/getproperty/:id', userCtrl.getSpecificProperty)
router.get('/search-property', userCtrl.searchProperties)
router.get('/prop-search', userCtrl.propSearch)
router.get('/find-user/:id', userCtrl.findUser)

router.get('/getfavs/:id',userCtrl.authenticateToken, userCtrl.getFavorites)
router.get('/getdetails',userCtrl.authenticateToken, userCtrl.getDetails)
router.post('/uploadimg/:id',userCtrl.authenticateToken, userCtrl.uploadSingle.single('image'), userCtrl.uploadImg)
router.post('/addproperty',userCtrl.authenticateToken, userCtrl.upload.array("images"), userCtrl.addProperty)
router.post('/updateproperty/:id',userCtrl.authenticateToken, userCtrl.upload.array("images"), userCtrl.updateProperty)
router.get('/deleteproperty/:id',userCtrl.authenticateToken, userCtrl.deleteProperty)
router.delete('/deleteimg/:id',userCtrl.authenticateToken, userCtrl.deleteImg)
router.get('/getuserprops/:id',userCtrl.authenticateToken, userCtrl.getUserProps)

router.post('/subscribe/:id/to',userCtrl.authenticateToken, userCtrl.createSubscription)
router.put('/unsubscribe/:id',userCtrl.authenticateToken, userCtrl.unsubscribe)
router.get('/get-subscription-data/:id',userCtrl.authenticateToken, userCtrl.getSubscriptionData)
router.post('/verifypayment',userCtrl.authenticateToken, userCtrl.checkVerified)
router.put('/payment-failure',userCtrl.authenticateToken, userCtrl.FailedPayment)

router.put('/likeprop',userCtrl.authenticateToken, userCtrl.likeProp)
router.put('/addview', userCtrl.authenticateToken, userCtrl.addView)

router.get("/ownerdashboard/:id", userCtrl.authenticateToken, userCtrl.getOwnerPropDeets)

router.put('/editprofile/:id',userCtrl.authenticateToken,userCtrl.uploadSingle.single('image'), userCtrl.editProfile)
router.put('/changepwd/:id',userCtrl.authenticateToken, userCtrl.changePwd)

router.get('/getbanner',userCtrl.getBanner);

router.get('/get-slots/:id',userCtrl.authenticateToken, userCtrl.getSlots)
router.post('/put-slots',userCtrl.authenticateToken, userCtrl.updateSlots)

router.post('/create-visit',userCtrl.authenticateToken, userCtrl.CreateVisit)
router.get('/get-visit',userCtrl.authenticateToken, userCtrl.getVisit)
router.delete('/cancel-visit',userCtrl.authenticateToken, userCtrl.cancelVisit)
router.get('/get-visitors/:id', userCtrl.authenticateToken, userCtrl.getVisitors)

module.exports = router;