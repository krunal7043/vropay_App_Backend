const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: function () {
        return this.loginType === "oauth";
      },
    },
    loginType: {
      type: String,
      enum: ["email", "oauth"],
      required: true,
    },
    googleId: {
      type: String,
      required: function () {
        return this.loginType === "oauth";
      },
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
    },
    otpExpires: {
      type: Date,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["male", "female", "don't want to disclose"],
    },
    profession: {
      type: String,
      enum: ["student", "working professional", "business owner"],
    },
    interests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Interest'
    }],
    difficulty: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advance"]
    },
    community: {
      type: String,
      enum: ["In", "Out"]
    },
    notifications: {
      type: String,
      enum: ["Allowed", "Not allowed"]
    },
    profileImage: {
      type: String
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);
