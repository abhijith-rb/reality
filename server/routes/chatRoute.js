const router = require('express').Router();
const chatCtrl = require("../controllers/chatController")

//add new conversation
router.post('/conversation',chatCtrl.addConv)

//get all conversations of a user
router.get('/conversation/:id',chatCtrl.getAllConvsOfUser)

//get conversation btw 2 users
router.get('/find/:firstUserId/:secondUserId',chatCtrl.getSpecificConversation)

//post new message
router.post("/message",chatCtrl.addMsg)

//get all messages in a conversation
router.get("/message/:id",chatCtrl.getAllMsgs)

module.exports = router;