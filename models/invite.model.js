import mongoose from "mongoose";

const inviteSchema = new mongoose.Schema({
    companyCode:{
        type:String,
        required:[true,"Company code is required"],
        ref:"company"
    },
    email:{
        type:String,
        required:[true,"Email is required"]
    },
    role:{
        type:String,
        enum:["admin","user"],
        default:"user"
    },
    plan:{
        type:String,
        required:[true,"Plan is required"],
        enum:["free","pro"],
        default:"free"
    },
    status:{
        type:String,
        enum:["pending","accepted"],
        default:"pending"
    },
    invitedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user"
    },
    url:{
        type:String,
        required:[true,"Url is required"]
    }
},{timestamps:true});

export const Invite = mongoose.model("invite",inviteSchema)