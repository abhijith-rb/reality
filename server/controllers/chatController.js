const Conversation = require("../models/ConvModel");
const Message = require("../models/MsgModel")
// const ObjectId = require("mongoose").ObjectId

const chatCtrl = {};

chatCtrl.addConv = async(req,res)=>{
    const senderId = req.body.senderId;
    const receiverId = req.body.receiverId;
    try {
        const existingConv = await Conversation.findOne(
            {members:{$all:[senderId,receiverId]}}
        )

        if(existingConv){
            console.log("22222222222222")
            console.log(existingConv)
            return res.status(200).json(existingConv)
        }

        const newConversation = new Conversation({
            members:[senderId,receiverId]
        })

        const SavedConversation = await newConversation.save();
        console.log(SavedConversation)
        res.status(200).json(SavedConversation)
    } catch (error) {
        console.log(error)
        res.status(500).json("Something went wrong")
    }
}


chatCtrl.getAllConvsOfUser = async(req,res)=>{
    const userId = req.params.id;
    try{
        const conversations = await Conversation.find({
            members:{$in:[userId]}
        })
        console.log(conversations)
        res.status(200).json(conversations)
    }
    catch(error){
        console.log(error)
        res.status(500).json(error)
    }
}

chatCtrl.getSpecificConversation = async(req,res)=>{
    const firstUserId = req.params.firstUserId;
    const secondUserId = req.params.secondUserId;

    try {
        const conversation = await Conversation.findOne({
            members:{$all:[firstUserId,secondUserId]}
        })

        res.status(200).json(conversation);
    } catch (error) {
        console.log(error)
        res.status(500).json(error)
    }
}

chatCtrl.addMsg = async(req,res)=>{
    const msg = req.body;
    const conversationId = msg.conversationId;
    const lastMessage = msg.text;
    const newMessage = new Message(msg)

    try {
        const savedMessage = await newMessage.save()
        await Conversation.findByIdAndUpdate(conversationId,{
            $set:{lastMessage}
        })
        res.status(200).json(savedMessage)
    } catch (err) {
        res.status(500).json(err)
    }

}

chatCtrl.getAllMsgs = async(req,res)=>{
    const conversationId = req.params.id;
    console.log("*****************")
    console.log(conversationId)
    try{
        const messages = await Message.find({
            conversationId:conversationId
        })

        res.status(200).json(messages)
    }catch(err){
        res.status(500).json(err)
    }
}

module.exports = chatCtrl