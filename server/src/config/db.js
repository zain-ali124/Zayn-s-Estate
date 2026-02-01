import mongoose from "mongoose";
import dotenv from "dotenv"
dotenv.config();

const dbConnecting = async () => {
     try {
        mongoose.connect(process.env.MONGO_URI).then(()=>{
        console.log("Database has been connecting")
    })
     } catch (error) {
        console.log(error)
     }

    }
export default dbConnecting
