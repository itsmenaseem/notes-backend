import mongoose from "mongoose";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/async_handler.js";
import { ApiError } from "../utils/custom_error.js";

export const createCompany = asyncHandler(async (req, res, next) => {
    if (!req.body) {
        return next(new ApiError("All fields are required", 400));
    }
    console.log(req.body);
    
    const { companyName, companyCode, name, email, password } = req.body;

    if (!companyName || !companyCode || !name || !email || !password) {
        return next(new ApiError("All fields are required", 400));
    }
    const companyExists = await Company.findOne({
            $or: [{ companyName }, { companyCode }],
        });

        if (companyExists) {
            return next(new ApiError("Company name or Company code already exists", 400));
        }

    try {

        const company = await Company.create({ companyName, companyCode });

        const user = await User.create({
                    name,
                    email,
                    password,
                    companyCode,
                    role: "admin",
                    plan: "pro",
                    company: company._id,
                });


        const newUser = user.toObject();
        delete newUser.password;

        const accessToken = user.getAccessToken();

        return res.status(201).json({
            success: true,
            message: "Company created successfully",
            user: newUser,
            company:company,
            user:newUser,
            accessToken,
        });
    } catch (error) {
        await Company.deleteOne({ companyName, companyCode });
        await User.deleteOne({ email });
        next(new ApiError(error.message, 500));
    }
});


export const getCompanyInfo = asyncHandler(async (req, res, next) => {
    const { search } = req.params;
    const company = await Company.findOne({
        $or: [{ companyName:search.toString() }, { companyCode:search.toString() }],
    });
    if (!company) {
        return next(new ApiError("Company not found", 404));
    }
    if(company.companyCode.toString() != req.user.companyCode.toString()){
        return next(new ApiError("You are not authorized to view this company", 401));
    }
    return res.status(200).json({
        success: true,
        message: "Company info fetched successfully",
        company
    });

})

