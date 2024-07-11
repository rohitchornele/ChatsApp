import mongoose, { Schema } from "mongoose";

import bcrypt from "bcrypt";

const userSchema = new Schema(
    {
        name : {
            type : String,
            required : true,
            trim : true,
        },
        email: {
            type : String,
            required : true,
            unique : true,
            lowercase : true,
            trim : true,
        },
        password : {
            type : String,
            required : [true, 'Password is required']
        },
        avatar : {
            type : String,    //cloudinary url
            default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
        }
    },
    {
        timestamps: true
    }
);



userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password)
}


userSchema.pre('save', async function (next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10)
    next();
})

export const User = mongoose.model("User", userSchema);