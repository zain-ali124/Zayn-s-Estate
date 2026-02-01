import express from "express";
import { getProfile, updateProfile } from "../controllers/userController.js";
import { protect, adminOnly } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();


router.get('/profile', protect, getProfile);

router.get('/admin', protect, adminOnly, (req, res ) => {
    res.json({ success:true, message: "Admin access"})
})
router.put('/profile', protect, upload.single("avatar"), updateProfile)



export default router;