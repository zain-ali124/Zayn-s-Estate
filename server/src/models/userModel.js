import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      required: true,
      unique: true,
      trim: true,
      type: String,
    },
    email: {
      required: true,
      unique: true,
      type: String,
      lowercase: true,
    },
    password: {
      required: true,
      type: String,
      select: false,
      lowerCase: true,
    },
    avatar:{
        type:String,
        default:"https://cdn.pixabay.com/photo/2023/02/18/11/00/icon-7797704_640.png"
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);