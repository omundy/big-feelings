// routes.js - Add endpoints to the API

//////////////////////////////////////
////////////// INIT //////////////////
//////////////////////////////////////

// import express, create router
import express from 'express';
var router = express.Router();

// 👉 import database reference here (Chapter 10 wiki) ...
import db from "./database/mongodb.js";
// 👈

//////////////////////////////////////
//////////// GET ROUTES //////////////
//////////////////////////////////////

router.get("/api", async (req, res) => {
    res.send({ message: "hello" });
});


// 👉 add test data endpoint here (Chapter 10 wiki) ...

// // endpoint > add test data
// router.get("/addOneTest", async function (request, reply) {
//     await db.addOneTest();
//     reply.redirect("/");
// });

// 👈


// 👉 add endpoint to retrieve data here (Chapter 10 wiki) ...

// endpoint > get all the rows in the database
router.get("/api/feelings", async function (req, res) {
    if (!db) throw new Error('Database not found');
    let result = [];
    try {
        result = await db.getAll();
    } catch (err) {
        result = [];
        throw new Error('Error getting feelings: ', err);
    }
    res.json(result);
});

// 👈




//////////////////////////////////////
//////////// POST ROUTES /////////////
//////////////////////////////////////

// endpoint > post a row to the database
router.post("/api/feeling", async function (req, res) {
    let result = [];
    let data = [];
    try {
        // console.log("POST -> /api/feeling", req.body);
        let doc = {
            "feeling": req.body.feeling,
            "color": req.body.color,
            "lat": req.body.lat || "",
            "lng": req.body.lng || "",
            "datetime": new Date()
        }
        result = await db.addOne(doc);
        data = await db.getAll();
    } catch (err) {
        result = { message: err }
    }
    res.json(data);
});


export default router;