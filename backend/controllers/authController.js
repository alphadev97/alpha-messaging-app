import { UserModel } from "../models/User.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  const { username, password } = req.body;

  const newUser = await UserModel.create({ username, password });

  jwt.sign(
    { userId: newUser._id },
    process.env.JWT_SECRET_KEY,
    {},
    (err, token) => {
      if (err) throw err;

      res.cookie("token", token).status(201).json({
        id: newUser._id,
        username,
        message: "User is created successfully!",
      });
    }
  );

  try {
    await newUser.save();
    res.status(201).json({ message: "User is created successfully" });
  } catch (error) {
    next(error);
  }
};

export const profile = (req, res, next) => {
  const { token } = req.cookies;
  try {
    jwt.verify(token, process.env.JWT_SECRET_KEY, {}, (err, userData) => {
      if (err) throw err;

      res.json(userData);
    });
  } catch (error) {
    next(error);
  }
};
