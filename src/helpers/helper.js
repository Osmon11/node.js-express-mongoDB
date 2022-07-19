import moment from "moment";

export const parseRequestBody = (reqBody) => {
  let body = {};
  Object.entries(reqBody).forEach((obj) => {
    body[obj[0]] = JSON.parse(obj[1]);
  });
  return body;
};

export const normalizeDate = (date) => {
  let _date = moment(date).format("DD.MM.YYYY");
  return moment(_date, "DD.MM.YYYY").toDate();
};
