//////////////////////////////////////
/////////////// SERVER ///////////////
//////////////////////////////////////

// server.js - Create fastify server instance, import routes

// import fastify
import Fastify from "fastify";
// create fastify server
const server = Fastify({
  logger: false, // set true to see all requests
  ignoreTrailingSlash: true, // clean urls
  ignoreDuplicateSlashes: true,
});

// enable CORS for fastify, will only accept requests from glitch.com
import cors from "@fastify/cors";
server.register(cors, { origin: ["https://glitch.com", "*"] });

// make all files inside /public available using static
import fastifyStatic from "@fastify/static";
import path from "path";
import { URL } from "url";
const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL(".", import.meta.url).pathname;
server.register(fastifyStatic, {
  root: path.join(__dirname, "public"),
});

// add a separate file for routes
import routes from "./routes.js";
server.register(routes);

// run the server and report out to the logs
server.listen(
  { port: process.env.PORT, host: "0.0.0.0" },
  function (err, address) {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Your app is listening on ${address}`);
  }
);
