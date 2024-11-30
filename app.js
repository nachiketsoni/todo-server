import express from "express";
import helmet from "helmet";
import cors from "cors";
import httpStatus from "http-status";
import _ from "lodash";
import routes from "./routes";
import { swaggerOptions } from "./swagger";
import { limiter } from "./config/rateLimit";
const app = express();
const http = require("http");
export const server = http.createServer(app);
const path = require("path");

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

const swaggerJSDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");


app.options("*", cors());
app.use(cors({
    origin: "*",  // Your frontend domain
    methods: ["GET", "POST", "PUT", "DELETE"],  // Allowed HTTP methods
    credentials: true  // Allow cookies or authentication credentials if needed
  }));

app.use(helmet.hidePoweredBy());
app.use(limiter);

app.get("/swagger.json", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerJSDoc(swaggerOptions));
});

app.use(
  "/docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerJSDoc(swaggerOptions))
);
// set security HTTP headers
app.use(helmet());


// parse json request body
app.use(express.json({ limit: "50mb" }));

// parse urlencoded request body
app.use(express.urlencoded({ extended: true, limit: "50mb" }));



app.set("view engine", "ejs");

app.set("views", __dirname);

// api routes
app.use("/api", routes);

process.on('uncaughtException', async (error) => {
  console.log("error", error)

  process.exit(1); // Exit the process after sending the Slack message
});
// send back a 404 error for any unknown api request
app.use((req, res) => {
  return res.sendStatus(httpStatus.NOT_IMPLEMENTED);
});

app.use((req, res, next) => {
  if (!req.locals) req.locals = {};
  next();
});
