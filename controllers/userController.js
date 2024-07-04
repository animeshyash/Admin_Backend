import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const signUp = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Kindly fill up all the Details",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already Exists. Please Log in",
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const data = await User.create({
      firstName,
      lastName,
      email,
      password: hashPassword,
      role: "user",
    });

    const user = await User.findOne({ email });

    const token = jwt.sign(
      {
        email: user.email,
        id: user._id,
        name: user.firstName + " " + user.lastName,
      },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: "24h",
      }
    );

    user.token = token;
    user.password = undefined;

    const options = {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };

    return res.cookie("token", token, options).status(201).json({
      success: true,
      message: "Signed up Successfully",
      token,
      user,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Sign up Failed",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Kindly fill all the Details",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exist. Please Sign Up",
      });
    }

    if (await bcrypt.compare(password, user.password)) {
      const token = jwt.sign(
        {
          email: user.email,
          id: user._id,
          name: user.firstName + " " + user.lastName,
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );

      user.token = token;
      user.password = undefined;

      const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };

      return res.cookie("token", token, options).status(200).json({
        success: true,
        message: "Logged in Successfully",
        token,
        user,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password",
      });
    }
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "Login Failed",
      error,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});

    return res.status(200).json({
      success: true,
      message: "Posts Fetched Successfully",
      users,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid User",
      });
    }

    await User.findByIdAndDelete(userId);

    return res.status(200).json({
      success: true,
      message: "User deleted Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User deletion Failed",
      error,
    });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { firstName, lastName, role } = req.body;

    if (!firstName || !lastName || !role) {
      return res.status(400).json({
        success: false,
        message: "Kindly fill up all the Details",
      });
    }

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Invalid User",
      });
    }

    await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        role,
      },
      { new: true }
    );

    return res.status(200).json({
      success: true,
      message: "Data updated Successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: "User updation Failed",
      error,
    });
  }
};
