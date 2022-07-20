import path from "path";
import { connect } from "./db";
import minimist from "minimist";

const args = minimist(process.argv.slice(2));
export const setup = async function () {
  if (args["env"] === "local") {
    require("dotenv").config({
      path: path.resolve(process.cwd(), ".env.local"),
    });
  } else {
    require("dotenv").config();
  }
  await connect();
};
