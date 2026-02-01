import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ImageKit from "../config/imagekit.js";

//signup controller

export const signup = async (req, res) => {
  try {
    const { name, email, password, avatar, role } = req.body;
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists." });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      avatar,
      role
    });
    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );
    res.status(201).json({
      success: true,
      newUser: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        role: newUser.role,
      },
      token,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const signin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Check if user exists
    const userExist = await User.findOne({ email }).select("+password");
    if (!userExist) {
      return res.status(401).json({ message: "User does not exist" });
    }

    // 2️⃣ Compare password
    const isMatch = await bcrypt.compare(password, userExist.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Email or password is wrong" });
    }

    // 3️⃣ Generate JWT token
    const token = jwt.sign(
      { id: userExist._id, role: userExist.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 4️⃣ Send response
    res.status(200).json({
      success: true,
      user: {
        id: userExist._id,
        name: userExist.name,
        email: userExist.email,
        avatar: userExist.avatar,
        role: userExist.role,
      },
      token
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message
    });
  }
};