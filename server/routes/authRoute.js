const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController')

router.post('/register',authCtrl.createUser)
router.post('/login',authCtrl.userAuth)
router.post('/refresh-token',authCtrl.regenerateToken)
router.delete('/logout',authCtrl.logout)
router.post('/genotp',authCtrl.genOtp)
router.post('/verifyotp',authCtrl.verifyOtp)
router.post('/updatepwd/:id',authCtrl.updatePwd)

// router.get('/verifytoken',authCtrl.verifyToken, authCtrl.tokenVerifier)

module.exports = router;