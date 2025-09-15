import mongoose from "mongoose";
import { Note } from "../models/note.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/custom_error.js";

export const createNote = asyncHandler(async(req,res,next) => {
    if(!req.body)return next(new ApiError("All fields are required",400))
    const {title,description} = req.body;
    if(!title || !description){
        return next(new ApiError("All fields are required",400))
    }
    const user = await User.findById(req.user.id)
    if(user.role != "admin" && user.plan !="pro"){
        const notesCount = await Note.countDocuments({createdBy:req.user.id})
        if(notesCount >= 3){
            return next(new ApiError("You have reached the limit of notes",400))
        }
    }
    const note = await Note.create({
        title,
        description,
        company:user.company,
        createdBy:req.user.id
    })
    return res.status(201).json({
        success:true,
        message:"Note created successfully",
        note
    })
})

export const getAllNotes = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [notes, totalNotes] = await Promise.all([
        Note.find({ company: req.user.company })
            .populate({
                path: "createdBy",
                select: "name email"
            })
            .skip(offset)
            .limit(limit),
        Note.countDocuments({ company: req.user.company })
    ]);

    const totalPages = Math.ceil(totalNotes / limit);

    return res.status(200).json({
        success: true,
        message: "Notes fetched successfully",
        notes,
        pagination: {
            page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    });
});


export const getNote = asyncHandler(async(req,res,next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [notes,totalNotes] = await Promise.all([
        Note.find({company:req.user.company,createdBy:req.user.id}).skip(offset).limit(limit),
        Note.countDocuments({company:req.user.company,createdBy:req.user.id})
    ])
    const totalPages = Math.ceil(totalNotes / limit);
    return res.status(200).json({
        success:true,
        message:"Note fetched successfully",
        notes,
        pagination:{
            page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    })
})

export const updateNote = asyncHandler(async(req,res,next) => {
    const {noteId} = req.params
    if(!req.body){
        return next(new ApiError("All fields are required",400))
    }
    const {title,description} = req.body
    if(!noteId || !mongoose.Types.ObjectId.isValid(noteId)){
        return next(new ApiError("Invalid noteId",400))   
    }
    const note = await Note.findOne({_id:noteId,company:req.user.company,createdBy:req.user.id})
    if(!note){
        return next(new ApiError("Note not found",404))
    }
    note.title = title || note.title
    note.description = description || note.description
    await note.save()
    return res.status(200).json({
        success:true,
        message:"Note updated successfully",
        note
    })  
})  

export const deleteNote = asyncHandler(async(req,res,next) => {
    const {noteId} = req.params
    if(!noteId || !mongoose.Types.ObjectId.isValid(noteId)){
        return next(new ApiError("Invalid noteId",400))   
    }
    const deleted = await Note.deleteOne({_id:noteId,company:req.user.company,createdBy:req.user.id})
    if(deleted.deletedCount === 0){
        return next(new ApiError("Note not found",404)) 
    }
    return res.status(200).json({
        success:true,
        message:"Note deleted successfully"
    })
})