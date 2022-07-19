import { body } from "express-validator";

export const authValidation = [
  body("login", "Логин должен быть email").isEmail(),
  body("password", "Пароль должен быть мин. 6 и мак. 16 символов").isLength({
    min: 6,
    max: 16,
  }),
];

export const registrationValidation = [
  body("login", "Логин должен быть email").isEmail(),
  body("password", "Пароль должен быть мин. 6 и мак. 16 символов").isLength({
    min: 6,
    max: 16,
  }),
];
