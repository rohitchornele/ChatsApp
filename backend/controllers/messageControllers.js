import asyncHandler from "express-async-handler";
import { Message } from "../models/messageModel.js";
import { User } from "../models/userModel.js";
import { Chat } from "../models/chatModel.js"


const sendMessage = asyncHandler( async (req, res) => {
    const {content, chatId } = req.body;

    if(!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    };
    
    let newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    };

    // console.log(newMessage)

    try {
        let message = await Message.create(newMessage);
        
        message = await message.populate('sender', 'name avatar');
        message = await message.populate('chat');
        // console.log(message)
        message = await User.populate(message, {
            path: 'chat.users',
            select: 'name avatar email chat'
        });

        await Chat.findByIdAndUpdate(req.body.chatId, {
            latestMessage : message,
        })

        res.json(message)

        

    } catch (error) {
        res.status(200);
        throw new Error(error.message)
    }
})

const allMessages = asyncHandler( async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
        .populate('sender', 'name avatar email')
        .populate('chat');

        res.json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
})

export { sendMessage, allMessages }