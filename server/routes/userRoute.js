const express = require('express')
const router = express.Router();
const userCtrl = require('../controllers/userController');

router.get('/getallproperties', userCtrl.getAllProps)
router.get('/getproperty/:id', userCtrl.getSpecificProperty)
router.get('/search-property', userCtrl.searchProperties)
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
router.post('/verifypayment',userCtrl.authenticateToken, userCtrl.checkVerified)

router.put('/likeprop',userCtrl.authenticateToken, userCtrl.likeProp)

module.exports = router;