import mongoose from "mongoose";
import { Invite } from "../models/invite.model.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/custom_error.js";
import { User } from "../models/user.model.js";
import "dotenv/config"
export const createInvite = asyncHandler(async(req,res,next) => {
    if(!req.body){
        return next(new ApiError("All fields are required",400))
    }
    const {email,plan,role} = req.body;
    if(!email)return next(new ApiError("All fields are required"))
    if(email === req.user.email){
        return next(new ApiError("You cannot invite yourself",400))
    }
    const invitationExist = await Invite.findOne({email,companyCode:req.user.companyCode})
    if(invitationExist){
        return next(new ApiError("User already exist with this email in company",400));
    }
    const invitation = await Invite.create({
        companyCode:req.user.companyCode.toString(),
        email,
        plan,
        role,
        invitedBy:req.user.id,
        url:"abc"
    })
    const url = `${process.env.VITE_FRONTEND_URL}/invite?invitationId=${invitation._id}&companyCode=${req.user.companyCode}&email=${email}`
    invitation.url = url
    await invitation.save()
    return res.status(201).json({
        success:true,
        message:"Invitation Created",
        invitation
    })
})

export const deleteInvite = asyncHandler(async(req,res,next) => {
    const {inviteId} = req.params
    if(!inviteId || !mongoose.Types.ObjectId.isValid(inviteId)){
        return next(new ApiError("Invalid inviteId",400))
    }
    const deleted = await Invite.deleteOne({_id:inviteId,companyCode:req.user.companyCode});
    if(deleted.deletedCount === 0){
        return next(new ApiError("Invitation does not exist",404))
    }
    return res.status(200).json({
        success:true,
        message:"Invitation deleted"
    })
})


export const changeUser = asyncHandler(async(req,res,next) => {
     const {user_id} = req.params;
     if(!req.body)return next(new ApiError("All fields are required",400))
     const {role,plan} = req.body
    if(!user_id || !mongoose.Types.ObjectId.isValid(user_id)){
        return next(new ApiError("Invalid user_id",400))
    }
    if(req.user.id === user_id){
        return next(new ApiError("You cannot change your own role",400))
    }
    const user = await User.findOne({_id:user_id,companyCode:req.user.companyCode})
    if(!user){
        return next(new ApiError("User not found",404));
    }
    user.role = role || user.role;
    user.plan = plan || user.plan;
    await user.save();
    return res.status(200).json({
        success:true,
        message:"Role changed successfully"
    }) 

})

export const deleteUser = asyncHandler(async(req,res,next) => {
    const {user_id} = req.params
     if (req.user.id === user_id) {
        return next(new ApiError("You cannot delete yourself", 400));
    }
    if(!user_id || !mongoose.Types.ObjectId.isValid(user_id)){
        return next(new ApiError("Invalid user_id",400))
    }
    const deleted = await User.deleteOne({_id:user_id,companyCode:req.user.companyCode})
    if(deleted.deletedCount === 0){
        return next(new ApiError("User not found",404))
    }
    return res.status(200).json({
        success:true,
        message:"User deleted successfully"
    })
})

export const getAllUsers = asyncHandler(async(req,res,next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [users,totalUsers] = await Promise.all([
        User.find({companyCode:req.user.companyCode})
            .skip(offset)
            .limit(limit).select("-password -companyCode -company"),
            User.countDocuments({companyCode:req.user.companyCode})
    ])
    const totalPages = Math.ceil(totalUsers / limit);
    return res.status(200).json({
        success:true,
        message:"Users fetched successfully",
        users,  
        pagination: {
            page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    })
})


export const getAllInvites = asyncHandler(async(req,res,next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const [invites,totalInvites] = await Promise.all([
        Invite.find({companyCode:req.user.companyCode})
            .skip(offset)
            .limit(limit).populate({path:"invitedBy",select:"name email"}).select("-companyCode"),
            Invite.countDocuments({companyCode:req.user.companyCode})   
    ])
    const totalPages = Math.ceil(totalInvites / limit); 
    return res.status(200).json({
        success:true,
        message:"Invites fetched successfully",
        invites,
        pagination:{
            page,
            limit,
            hasNext: page < totalPages,
            hasPrev: page > 1
        }
    })
})



