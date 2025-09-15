import mongoose from "mongoose";

const noteSchema = new mongoose.Schema({
    title:{
        type:String,
        required:[true,"Title is required"]
    },
    description:{
        type:String,
        required:[true,"Description is required"]
    },
    company:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Company is required"],
        ref:"company"
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        required:[true,"Created by is required"],
        ref:"user"
    }

},{timestamps:true});

export const Note = mongoose.model("note",noteSchema)