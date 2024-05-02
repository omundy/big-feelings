// route.js - Add endpoints to the API

// 👉 import functions from database.js here (Chapter 10)
import db from "./database.js";

const routes = async (server, options) => {
  // endpoint > test
  server.get("/api", async function (request, reply) {
    reply.send({ message: "hello" });
  });

  // 👉 add endpoint to retrieve data here (Chapter 10) ...

  // endpoint > get all the rows in the database
  server.get("/api/feelings", async function (request, reply) {
    let data = await db.getAll();
    return data;
  });

  // 👈

  // ROUTES FOR THE TUTORIAL

  // endpoint > post a row to the database
  server.post("/api/feeling", async function (request, reply) {
    console.log("POST -> /api/feeling", request.body);

    let feeling = request.body.feeling;
    let color = request.body.color;
    let lat = request.body.lat || "";
    let lng = request.body.lng || "";

    let sql = `INSERT INTO Feelings (feeling,color,lat,lng) 
               VALUES ("${feeling}","${color}","${lat}","${lng}");`;
    let result = await db.runQuery(sql);
    let data = await db.getAll();
    return data;
  });

  // TEST ROUTES
  // - endpoints accessed directly and then redirect browser back to index.html
  // - turn these off in public version

  // remove all database entries
  server.get("/clearData", async function (request, reply) {
    await db.deleteAll();
    reply.redirect("/");
  });

  // 👉 add test data endpoint here (Chapter 10) ...
  
  // add test data
  server.get("/addTestData", async function (request, reply) {
    await db.addTestData();
    reply.redirect("/");
  });
  
  // 👈
};
export default routes;
