import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

import { UserModel } from "../models";

export const registrationUser = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const alreadyRegistered = await UserModel.find({ login: req.body.login });
    if (alreadyRegistered.length) {
      res.status(400).json({ message: "Логин уже зарегистрирован" });
    } else {
      const salt = await bcrypt.genSalt(6);
      const passwordHash = await bcrypt.hash(req.body.password, salt);
      const newUser = new UserModel({
        login: req.body.login,
        password: passwordHash,
      });
      newUser.save();
      res.status(200).json({ message: "Регистрация прошла успешно" });
    }
  } else {
    res.status(400).json(errors.array());
  }
};

export const authUser = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    try {
      const user = await UserModel.findOne({
        login: req.body.login,
      });
      if (!user) {
        res.status(404).json({ message: "Пользователь не найден" });
      }

      const isValidPassword = await bcrypt.compare(
        req.body.password,
        user._doc.password
      );

      if (isValidPassword) {
        const token = jwt.sign({ _id: user._id }, process.env.SECRET_WORD, {
          expiresIn: "1d",
        });
        const { password, ...userInfo } = user._doc;
        res.json({ ...userInfo, token });
      } else {
        res.status(400).json({ message: "Не правильный логин или пароль" });
      }
      newAuth.token = jwt.sign(newAuth, "admin_amanat_advisory");
      res.json(newAuth);
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(400).send("Не правильный логин или пароль ");
  }
};

export const checkAuth = (req, res, next) => {
  const token = (
    req.headers["authorization"] ||
    req.headers["Authorization"] ||
    ""
  ).replace(/Bearer\s?/, "");
  const accessDenied = () => res.status(403).send("Отказано в доступе");

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.SECRET_WORD);
      if (decoded._id) {
        req.userId = decoded._id;
        next();
      } else {
        return accessDenied();
      }
    } catch (error) {
      return accessDenied();
    }
  } else {
    return accessDenied();
  }
};
