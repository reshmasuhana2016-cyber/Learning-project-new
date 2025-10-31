import express from "express";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
const router = express.Router();
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fetchuser from "../middlewere/fetchuser.js";

router.get("/get", fetchuser, async (req, res) => {
  try {
    let userId = req.user.id; // ✅ fixed here
    let user = await User.findById(userId).select("-password");
    if (!user) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Please authenticate using valid token",
        });
    }
    return res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    return res.status(500).json("Internal Server Error");
  }
});

router.post(
  "/createuser",
  [
    body("name", "Enter a  valid name").isLength({ min: 3 }),
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, errors: validationErrors.array() });
    }

    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({
          success: false,
          message: "Sorry user with email already exists",
        });
      }

      const salt = await bcrypt.genSalt(10);
      const secpass = await bcrypt.hash(req.body.password, salt);

      const newuser = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secpass,
      });

      const data = {
        user : {
           id: newuser.id
        }
      };

      

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      console.log(authToken);
      return res.status(200).json({
        success: true,
        token: authToken,
        message: "User Created Successfull",
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }
);

router.post(
  "/login",
  [
    body("email", "Enter a valid email").isEmail(),
    body("password", "Password is required").isLength({ min: 5 }),
  ],
  async (req, res) => {
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Please try to login with correct credentals ",
          });
      }

      const passwordcompare = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!passwordcompare) {
        return res
          .status(400)
          .json({
            success: false,
            message: "Please try to login with correct credentals",
          });
      }

      const data = {
        user : {
           id: user.id
        }
      };
console.log("JWT_SECRET at signing:", process.env.JWT_SECRET);

      const authToken = jwt.sign(data, process.env.JWT_SECRET);
      console.log(authToken);
      return res
        .status(200)
        .json({
          success: true,
          token: authToken,
          message: "Logged in Successfully",
        });
    } catch (error) {
      console.error(error);
      return res.status(500).json("Internal Server Error");
    }
  }
);

export default router;
