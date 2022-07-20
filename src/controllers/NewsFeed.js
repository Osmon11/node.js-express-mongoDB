import fs from "fs";
import { validationResult } from "express-validator";
import { uuidV4 as uuid } from "mongodb/lib/core/utils";

import { NewsModel } from "../models/NewsFeed";
import { ImageModel } from "../models";

const imageUrlSplitter = "?imageId=";

export const getNewsFeed = async (req, res) => {
  try {
    let newsFeed = [];
    if (Boolean(req.query.id)) {
      newsFeed = await NewsModel.find({ _id: req.query.id }).exec();
    } else {
      newsFeed = await NewsModel.find();
    }
    return res.send(newsFeed);
  } catch (error) {
    res.status(400).send(error);
  }
};

export const deleteNewsFeed = async (req, res) => {
  try {
    let news = await NewsModel.findOne({ _id: req.query.id });
    await ImageModel.deleteOne({
      id: news.imageUrl.split(imageUrlSplitter)[1],
    });
    await NewsModel.deleteOne({ _id: news.id });

    let newsFeed = await NewsModel.find();
    res.send(newsFeed);
  } catch (err) {
    res.status(400).send(err);
  }
};

export const setNewsFeed = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const url = `${req.protocol}://${req.get("host")}`;
    const file = req.file;
    try {
      let data = fs.readFileSync(file.path);
      if (data.length) {
        await new ImageModel({
          id: file.filename,
          type: file.mimetype,
          data,
        }).save();
        await new NewsModel({
          title: req.body.title,
          subtitle: req.body.subtitle,
          content: req.body.content,
          imageName: file.originalname,
          imageUrl: `${url}/image${imageUrlSplitter}${file.filename}`,
        }).save();
        let newsFeed = await NewsModel.find();
        res.send(newsFeed);
      } else {
        res.status(400).json({ error: "Не удалось прочитать image" });
      }
    } catch (error) {
      res.status(400).send(error);
    }
  } else {
    res.status(400).json(errors.array());
  }
};

export const updateNewsFeed = async (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    const url = req.protocol + "://" + req.get("host");
    const file = req.file;
    try {
      let data = "",
        updateData = {
          title: req.body.title,
          subtitle: req.body.subtitle,
          content: req.body.content,
        };
      if (file) {
        data = fs.readFileSync(file.path);
      }
      if (data.length) {
        await ImageModel.updateOne(
          { id: req.body.imageUrl.split(imageUrlSplitter)[1] },
          {
            type: file.mimetype,
            data,
          }
        );
        updateData.imageName = file.originalname;
      }
      await NewsModel.updateOne({ _id: req.query.id }, updateData);
      let newsFeed = await NewsModel.find();
      res.send(newsFeed);
    } catch (error) {
      console.log(error);
      res.status(400).send(error);
    }
  } else {
    res.status(400).json(errors.array());
  }
};
