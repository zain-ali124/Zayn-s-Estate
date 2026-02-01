import express from "express"

const router = express.Router();
import uploadMiddleware from "../middlewares/uploadMiddleware.js"
import { signin, signup } from "../controllers/authController.js";

router.post('/signup', uploadMiddleware.single("avatar"), signup);
router.post('/signin', signin)

export default router;