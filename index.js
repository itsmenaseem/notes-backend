import express from "express"
import cookiesParser from "cookie-parser"
import cors from "cors"
import "dotenv/config"
import { connectToDB } from "./config/db.config.js"
import { notFoundMiddleware } from "./middlewares/not-found.middleware.js"
import { errorMiddleware } from "./middlewares/error.middlerware.js"
import authRouter from "./routes/auth.route.js"
import adminRouter from "./routes/admin.route.js"
import companyRouter from "./routes/company.route.js"
import noteRouter from "./routes/note.route.js"
import { adminMiddleware, authMiddleware } from "./middlewares/auth.middleware.js"
import { mainRateLimter } from "./middlewares/rate-limit.middleware.js"


const app = express()
const corsOptions = {
  origin: process.env.VITE_FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS',"PATCH"],
  allowedHeaders: ['Content-Type', 'Authorization']
};
app.set("trust proxy", 1);
app.use(cors(corsOptions));
app.use(express.json())
app.use(express.urlencoded())
app.use(cookiesParser())
app.use(mainRateLimter)

app.use("/api/v1/auth",authRouter)
app.use("/api/v1/admin",authMiddleware, adminMiddleware, adminRouter)
app.use("/api/v1/company",companyRouter)
app.use("/api/v1/note",authMiddleware,noteRouter)


app.get("/health",(req,res)=>{
    return res.status(200).json({
        success:true,
        status:"OK"
    })
})

// Catch-all for 404 Not Found errors
app.use(notFoundMiddleware)

app.use(errorMiddleware)

const PORT = process.env.PORT || 5000



async function startServer(){
    try {
        await connectToDB()
        app.listen(PORT,()=>{
            console.log("Server is listening on PORT: ",PORT);
        })
    } catch (error) {
        console.error(error.message)
        process.exit(1)
    }
}

startServer()
