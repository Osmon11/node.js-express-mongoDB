import express from "express";
import {
  deleteNewsFeed,
  getNewsFeed,
  setNewsFeed,
  updateNewsFeed,
} from "../controllers/NewsFeed";
import { upload } from "../utils";
import { checkAuth } from "../controllers";
import { setValidation, updateValidation } from "../validator/newsFeed";

const newsFeedRouter = express.Router();

newsFeedRouter.get("/", getNewsFeed);
newsFeedRouter.delete("/", checkAuth, deleteNewsFeed);
newsFeedRouter.post(
  "/",
  checkAuth,
  upload.single("image"),
  setValidation,
  setNewsFeed
);
newsFeedRouter.put(
  "/",
  checkAuth,
  upload.single("image"),
  updateValidation,
  updateNewsFeed
);

export { newsFeedRouter };
