const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/userController');
const verifyJWT = require('../middlewares/verifyJWT');

router.get('/getallproperties', userCtrl.getAllProps)
router.get('/getproperty/:id', userCtrl.getSpecificProperty)
router.get('/search-property', userCtrl.searchProperties)
router.get('/prop-search', userCtrl.propSearch)
router.get('/find-user/:id', userCtrl.findUser)

router.get('/getfavs/:id', verifyJWT, userCtrl.getFavorites)
router.get('/getdetails', verifyJWT, userCtrl.getDetails)
router.post('/uploadimg/:id', verifyJWT, userCtrl.uploadSingle.single('image'), userCtrl.uploadImg)
router.post('/addproperty', verifyJWT, userCtrl.upload.array("images"), userCtrl.addProperty)
router.post('/updateproperty/:id', verifyJWT, userCtrl.upload.array("images"), userCtrl.updateProperty)
router.get('/deleteproperty/:id', verifyJWT, userCtrl.deleteProperty)
router.delete('/deleteimg/:id', verifyJWT, userCtrl.deleteImg)
router.get('/getuserprops/:id', verifyJWT, userCtrl.getUserProps)

router.post('/subscribe/:id/to', verifyJWT, userCtrl.createSubscription)
router.put('/unsubscribe/:id', verifyJWT, userCtrl.unsubscribe)
router.get('/get-subscription-data/:id', verifyJWT, userCtrl.getSubscriptionData)
router.post('/verifypayment', verifyJWT, userCtrl.checkVerified)
router.put('/payment-failure', verifyJWT, userCtrl.FailedPayment)

router.put('/likeprop', verifyJWT, userCtrl.likeProp)
router.put('/addview',  verifyJWT, userCtrl.addView)

router.get("/ownerdashboard/:id",  verifyJWT, userCtrl.getOwnerPropDeets)

router.put('/editprofile/:id', verifyJWT,userCtrl.uploadSingle.single('image'), userCtrl.editProfile)
router.put('/changepwd/:id', verifyJWT, userCtrl.changePwd)

router.get('/getbanner',userCtrl.getBanner);

router.get('/get-slots/:id', verifyJWT, userCtrl.getSlots)
router.post('/put-slots', verifyJWT, userCtrl.updateSlots)

router.post('/create-visit', verifyJWT, userCtrl.CreateVisit)
router.get('/get-visit', verifyJWT, userCtrl.getVisit)
router.delete('/cancel-visit', verifyJWT, userCtrl.cancelVisit)
router.get('/get-visitors/:id',  verifyJWT, userCtrl.getVisitors)

module.exports = router;