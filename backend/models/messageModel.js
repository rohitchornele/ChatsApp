import mongoose, { Schema } from 'mongoose';

const messageModel = new Schema(
    {
        sender: {
            type: mongoose.Schema.Types.ObjectId,  
            ref: "User"
        },
        content: { type: String, trim: true},
        chat: {
            type: mongoose.Schema.Types.ObjectId,  
            ref: "Chat"
        },
    },
    {
        timeStamps: true
    }
);

export const Message = mongoose.model("Message", messageModel)