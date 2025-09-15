import { User } from "../models/user.model.js";
import { ApiError } from "../utils/custom_error.js"
import { verifyToken } from "../utils/jwt-verification.js";

export   function  authMiddleware(req,res,next){
    const authHeader = req.headers.authorization
    
    if(!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new ApiError("Unauthorized",401));
    }
    const token = authHeader.split(" ")[1]
    const decoded = verifyToken("access",token)
    if(!decoded){
        return next(new ApiError("Unauthorized",401));
    }
    req.user = decoded
    next()
}

export  async function adminMiddleware(req,res,next){
    if(req.user.role != "admin"){
        return next(new ApiError("You are not authorized to perform this action",403))
    }
    
    const user = await User.findById(req.user.id)
    if(user.role != "admin"){
        return next(new ApiError("Your role have been changed please login again",403))
    }
    next()
}