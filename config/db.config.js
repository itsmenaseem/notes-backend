import { connect } from "mongoose";

import "dotenv/config"

export async function connectToDB(){
    try {
        const connection = await connect(process.env.MONGO_URI)
        console.log("mongodb connected successfully at host : ",connection.connection.host);
    } catch (error) {
        console.error(error.message)
        process.exit(1);
    }
}