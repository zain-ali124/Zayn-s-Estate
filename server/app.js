import express, { json } from 'express'
import authRoute from "./src/routes/authRoutes.js"
import userRoutes from "./src/routes/userRoutes.js"
import propertyRouter from "./src/routes/propertyRoutes.js"
import cors from "cors"
const app = express()

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));
app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth", authRoute)
app.use("/api/user", userRoutes)
app.use("/api/property", propertyRouter)

export default app;