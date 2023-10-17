import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import UserModel from "../models/User.js";

export const register = async (req, res) => {
  try {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(req.body.password, salt);

    const doc = new UserModel({
      fullName: req.body.fullName,
      email: req.body.email,
      passwordHash: hash,
      avatarUrl: req.body.avatarUrl ?? "",
    });

    const user = await doc.save();

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretTwitter",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.send({
      userData,
      token,
    });
  } catch (err) {
    res.status(404).json("Something went wrong: " + err);
  }
};

export const login = async (req, res) => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    console.log(user);

    if (!user) {
      throw new Error("Не удалось найти пользователя с данным email.");
    }

    const isValidPass = await bcrypt.compare(
      req.body.password,
      user.passwordHash
    );

    if (!isValidPass) {
      throw new Error("Пароли не совпадают.");
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      "secretTwitter",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...userData } = user._doc;

    res.json({ userData, token });
  } catch (error) {
    console.log(error);
    res.status(400).json("Не удалось залогиниться");
  }
};

export const getMe = async (req, res) => {
    try {
      const user = await UserModel.findById(req.userId);
  
      if (!user){
        throw new Error("Не удалось найти пользователя.");
      }
  
      const {passwordHash, ...userData} = user._doc;
  
      res.send({...userData})
    } catch (error) {
      return res.status(403).json("Something wrong with authorization. Can`t find a user")
    }
  }
