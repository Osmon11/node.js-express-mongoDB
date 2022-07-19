import { ImageModel } from "../models";

export const getImage = async (req, res) => {
  let image = await ImageModel.findOne({ id: req.query.imageId });
  if (image) {
    res.writeHead(200, {
      "Content-Type": image.type,
      "Content-Length": image.data.length,
    });
    res.end(image.data);
  } else {
    await ImageModel.deleteMany({ id: null });
    res.status(404).send("Запрос не верный");
  }
};
