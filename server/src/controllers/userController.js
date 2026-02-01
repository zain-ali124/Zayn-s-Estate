import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import ImageKit from "../config/imagekit.js";
import imagekit from "../config/imagekit.js";

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const user = req.user;
    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

//Update Profile

export const updateProfile = async (req, res) => {
  try {
    const user = req.user;
    const { name, email, password } = req.body;

    if (name) user.name = name;
    if (email) user.email = email;

    // ✅ password hashing
    if (password) {
      user.password = await bcrypt.hash(password, 10);
    }

    // ✅ avatar upload
    if (req.file) {
      const result = await imagekit.upload({
        file: req.file.buffer,
        fileName: req.file.originalname,
        folder: "avatars",
      });

      user.avatar = result.url;
    }

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
}