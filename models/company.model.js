import mongoose from "mongoose"

const companySchema = new mongoose.Schema({
    companyName:{
        type:String,
        required:[true,"Company name is required"],
        unique:[true,"Company name should be unique"]
    },
    address:String,
    companyCode:{
        type:String,
        required:[true,"Company Code is required"],
        unique:[true,"Company Code should be unique"]
    }
},{timestamps:true});

export const Company = mongoose.model("company",companySchema)



