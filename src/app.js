import "module-alias/register";

import { setup } from "./utils";
setup();

import ip from "ip";
import cors from "cors";
import morgan from "morgan";
import express from "express";
import minimist from "minimist";
import bodyParser from "body-parser";

import {
  _settings,
  slidesRouter,
  imageRouter,
  authRouter,
  newsFeedRouter,
} from "./routes";

const app = express();
const port = process.env.PORT;

app.use(express.static("public/"));
app.use(cors({ origin: "*" }));
app.use(morgan("tiny"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
app.use("/auth", authRouter);
app.use("/slides", slidesRouter);
app.use("/image", imageRouter);
app.use("/news-feed", newsFeedRouter);

app.get("/", (_req, res, next) => {
  try {
    return res.send("Amanat Advisory");
  } catch (error) {
    next(error);
  }
});

// app.use("/_settings", _settings);
app.use((error, _req, res, next) => {
  if (error) {
    morgan(":method :url :status :res[content-length] - :response-time ms");
    console.error(error);
    res.status(500).send(["Something went wrong 😔. Context:", error.message]);
  } else {
    next();
  }
});

app.get("/debug", function (_req, res) {
  fs.readFile("public/info.log", "utf-8", (err, data) => {
    if (err) return res.send(err);
    let objs = data
      .split(/\n/gm)
      .filter((e) => e.length)
      .map((e) => {
        let items = e.replace(/\r/gm, "").split(/\:\t/gm);
        return {
          timestamp: items[0],
          message: items[1],
          context: JSON.parse(items[2]),
        };
      });
    return res.send(objs);
  });
});
app.get("/line-debug", function (_req, res) {
  fs.readFile("public/warn.log", "utf-8", (err, data) => {
    if (err) return res.send(err);
    return res.send(data);
  });
});

let ipAddress = "localhost";

const args = minimist(process.argv.slice(2));
if (args["shared"]) {
  ipAddress = ip.address();
  app.listen(port, ipAddress, () => {
    console.log(`App is listening on ${ipAddress}:${port}`);
  });
}

app.listen(port, () => {
  console.log(`App is listening on ${ipAddress}:${port}`);
});
