import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { User } from "../models/user.models.js";

const createUser = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const isUserExist = await User.findOne({ email });
    if (isUserExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const [salt, hashedPassword] = await Promise.all([
      bcrypt.genSalt(10),
      bcrypt.hash(password, 10),
    ]);

    const user = new User({ fullName, email, password: hashedPassword });
    await user.save();

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "720h" }
    );

    return res.status(201).json({
      user: { id: user._id, fullName: user.fullName, email: user.email },
      accessToken,
      message: "Registration Successful",
    });
  } catch (error) {
    console.log("Error in createUser: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and Password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const accessToken = jwt.sign(
      { id: user._id, email: user.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "720h" }
    );

    return res.status(200).json({
      user: { id: user._id, fullName: user.fullName, email: user.email },
      accessToken,
      message: "Login Successful",
    });
  } catch (error) {
    console.log("Error in loginUser: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUser = async (req, res) => {
  try {
    
    const user = req.user;
    
    const isUser = await User.findOne({ _id: user._id });
    if (!isUser) {
      return res.status(404).json({ message: "User not found" });
    }
    

    return res.status(200).json({
      user: {
        _id: isUser._id,
        fullName: isUser.fullName,
        email: isUser.email,
        createdOn: isUser.createdOn,
      },
      message: "",
    });
  } catch (error) {
    console.log("Error in getUser: ", error);

    res.status(500).json({ message: "Internal Server Error" });
  }
};

export { createUser, loginUser, getUser };
