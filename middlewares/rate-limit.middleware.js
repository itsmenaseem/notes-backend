
import {rateLimit} from "express-rate-limit";


export const mainRateLimter = rateLimit({
    windowMs:15*60*1000,
    max:400,
})

export const authRateLimter = rateLimit({
    windowMs:15*60*1000,
    max:80,
})