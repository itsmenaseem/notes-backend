
import jwt from "jsonwebtoken"
import "dotenv/config"


export function verifyToken(type,token){
    try {
        const decoded = jwt.verify(token,process.env.JWT_ACCESS_TOKEN) 
        return decoded
    } catch (error) {
        console.error(error.message);
        return null;
    }
}