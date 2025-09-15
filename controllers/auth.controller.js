import { Company } from "../models/company.model.js";
import { Invite } from "../models/invite.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async_handler.js"
import { ApiError } from "../utils/custom_error.js";
import { verifyToken } from "../utils/jwt-verification.js";
import mongoose from "mongoose";
import "dotenv/config";

export const signup = asyncHandler(async (req, res, next) => {
    if (!req.body) return next(new ApiError("All fields are required", 400));

    const { invitationId, companyCode, name, email, password } = req.body;
    if (!invitationId || !companyCode || !name || !email || !password) {
        return next(new ApiError("All fields are required", 400));
    }
    if(!mongoose.Types.ObjectId.isValid(invitationId)){
        return next(new ApiError("Invalid invitation"))
    }
    const companyExists = await Company.findOne({ companyCode });
    if (!companyExists) {
        return next(new ApiError("Invalid company code", 400));
    }
    const invitation = await Invite.findOne({
        _id:invitationId,
        companyCode,
        email
    })
    if (!invitation) {
        return next(new ApiError("Invalid invitation code", 400));
    }
    if (invitation.status == "accepted") {
        return next(new ApiError("Invitation already accepted", 400));
    }
    const user = await User.create({
        name,
        email,
        password,
        companyCode,
        role: invitation.role,
        plan: invitation.plan,
        company: companyExists._id
    })
    invitation.status = "accepted";
    await invitation.save();
    const accessToken = user.getAccessToken();
    const newUser = user.toObject();
    delete newUser.password;
    return res.status(201).json({
        success: true,
        message: "User created successful",
        user: newUser,
        accessToken,
    });

})


export const login = asyncHandler(async (req, res, next) => {
    if (!req.body) return next(new ApiError("All fields are required", 400));
    const { email, password, companyCode } = req.body;
    if (!email || !password || !companyCode) {
        return next(new ApiError("All fields are required", 400));
    }
    const user = await User.findOne({ email, companyCode });
    if (!user) {
        return next(new ApiError("Invalid email or password or company code", 400));
    }
    const isMatch = user.comparePassword(password);
    if (!isMatch) {
        return next(new ApiError("Invalid email or password or company code", 400));
    }
    const accessToken = user.getAccessToken();
    const newUser = user.toObject();
    delete newUser.password;
    return res.status(200).json({
        success: true,
        message: "Login successful",
        user: newUser,
        accessToken,
    });

})


export const logout = asyncHandler(async (req, res, next) => {
    res.clearCookie("refreshToken");
    return res.status(200).json({
        success: true,
        message: "Logout successful",
    });
})


export const getProfile = asyncHandler(async (req, res, next) => {

    const user = await User.findById(req.user.id).populate({path:"company",select:"companyName"}).select("-password")
    if(!user){
        return next(new ApiError("User not found",404))
    }
    return res.status(200).json({
            success: true,
            message: "Info fetched successfully",
            user,
        });
  
})

