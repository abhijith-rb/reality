const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController')

router.post('/register',authCtrl.createUser)
// router.post('/login',authCtrl.userAuth)
router.post('/login',authCtrl.handleLogin)
// router.post('/refresh-token',authCtrl.regenerateToken)
router.get('/refresh-token',authCtrl.handleRefreshToken)
// router.delete('/logout',authCtrl.logout)
router.delete('/logout',authCtrl.handleLogout)
router.post('/genotp',authCtrl.genOtp)
router.post('/verifyotp',authCtrl.verifyOtp)

router.post('/createotpformail',authCtrl.createOtpForMail)
router.post('/verifyemail',authCtrl.verifyEmail)
router.post('/updatepwd/:id',authCtrl.updatePwd)

router.post('/google-auth',authCtrl.googleAuth)
// router.get('/verifytoken',authCtrl.verifyToken, authCtrl.tokenVerifier)

module.exports = router;