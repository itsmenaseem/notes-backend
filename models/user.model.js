import mongoose from "mongoose";
import bcryptjs from "bcryptjs"
import jwt from "jsonwebtoken"
import "dotenv/config"
import validator from "validator"

const userSchema =  new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Name is required"],
        trim:true
    },
    email:{
        type:String,
        required:[true,"Email is required"],
        validate:{
            validator:validator.isEmail,
            message:"Invalid email"
        }
    },
    password:{
        type:String,
        required:[true,"Password is required"]
    },
    company:{
        type:String,
        required:[true,"Company is required"],
        ref:"company"
    }
    ,
    companyCode:{
        type:String,
        required:[true,"Company Code is required"],
    },
    role:{
        type:String,
        required:[true,"Role is required"],
        enum:["admin","user"],
        default:"user"
    },
    plan:{
        type:String,
        enum:["free","pro"],
        default:"pro"
    }
},{timestamps:true});


userSchema.pre("save", function(next){
    if(this.isModified("password")){
        this.password = bcryptjs.hashSync(this.password,10)
    }
    next()
})

userSchema.methods.comparePassword = function(password){
    return bcryptjs.compareSync(password,this.password)
}

userSchema.methods.getAccessToken = function(){
    const payload = {
        id:this._id,
        email:this.email,
        role:this.role,
        plan:this.plan,
        company:this.company,
        companyCode:this.companyCode
    }

    return jwt.sign(payload,process.env.JWT_ACCESS_TOKEN,{expiresIn:"1d"})
}



export const User = mongoose.model("user",userSchema)

