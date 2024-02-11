const express = require("express");
const fs = require("fs");
const app = express();
const axios = require("axios");

const port = process.env.LISTEN_PORT || 3000;
const msConfigPath = process.env.CONFIG_PATH || "./ms-config.json";

let msConfData = fs.readFileSync(msConfigPath);
let msConf = JSON.parse(msConfData);

function sendResponse(res, element) {
  res.setHeader("Content-Type", "application/json");
  res.status(element.responseCode);
  res.send(JSON.stringify(element.responseBody));
}

async function callExternalService(req, res, element) {
  const xHeaders = Object.keys(req.headers)
    .filter((key) => key.toLowerCase().startsWith("x"))
    .reduce((obj, key) => {
      obj[key] = req.headers[key];
      return obj;
    }, {});

  xHeaders["Content-Type"] = "application/json";

  try {
    const response = await axios.get(element.externalService, {
      headers: xHeaders,
    });
    res.setHeader("Content-Type", "application/json");
    res.send(response.data);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

app.use((req, res, next) => {
  const xHeaders = Object.keys(req.headers)
    .filter((key) => key.toLowerCase().startsWith("x"))
    .reduce((obj, key) => {
      obj[key] = req.headers[key];
      return obj;
    }, {});
  console.log(
    `${new Date().toISOString()} - ${req.method} ${
      req.originalUrl
    } - x-headers: ${JSON.stringify(xHeaders)}`
  );
  next();
});

msConf.routes.forEach((element) => {
  if (element.method.toUpperCase() === "GET") {
    app.get(element.path, (req, res) => {
      if (element.externalService) {
        callExternalService(req, res, element);
      } else {
        sendResponse(res, element);
      }
    });
  } else if (element.method.toUpperCase() === "POST") {
    app.post(element.path, (req, res) => {
      if (element.externalService) {
        callExternalService();
      } else {
        sendResponse(res, element);
      }
    });
  }
});

app.listen(port, () => {
  console.log(`App [ ${msConf.msName} ] listening on port ${port}`);
});
