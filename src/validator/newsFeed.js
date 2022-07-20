import { body } from "express-validator";

export const setValidation = [
  body("title", "Поле title не корректный").isLength({ min: 3 }),
  body("subtitle", "Поле subtitle не корректный").isLength({ min: 3 }),
  body("content", "Поле content не корректный").isLength({ min: 3 }),
];

export const updateValidation = [
  body("title", "Поле title не корректный").isLength({ min: 3 }),
  body("subtitle", "Поле subtitle не корректный").isLength({ min: 3 }),
  body("content", "Поле content не корректный").isLength({ min: 3 }),
  body("imageUrl", "Поле imageUrl не корректный").isLength({ min: 10 }),
];
