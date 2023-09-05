const io = require("socket.io")(8900, {
    cors:{
        origin:"http://localhost:3000",
    },
});

let users = [];

const addUser = (userId, socketId)=>{
    !users.some(user=> user.userId === userId) &&
    users.push({userId, socketId})
    console.log({userId, socketId})
}
const removeUser = (socketId)=>{
    users = users.filter(user=> user.socketId !== socketId)
}
const getUser = (userId)=>{
    console.log(users)
    return users.find(user=> user.userId === userId)
}

io.on("connection", (socket)=>{
    //when connect
    console.log("A connection established")

    //take userId from user and socketId 
    socket.on("addUser", (userId)=>{
        console.log("An user Added")
        addUser(userId, socket.id)
        io.emit("getUsers", users)
        console.log(socket.id)
    })

    //send and get message
    socket.on("sendMessage",({senderId,receiverId,text})=>{
        const user = getUser(receiverId);
        if(user){
            io.to(user?.socketId).emit("getMessage", {
                senderId:senderId,
                text:text,
            })

        }
        console.log(user)
        console.log(receiverId)
        console.log(text)
    })

    //when disconnect
    socket.on("disconnect", ()=>{
        console.log("a user disconnected")
        removeUser(socket.id)
        io.emit("getUsers", users)
    })
})