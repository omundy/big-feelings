// routes.js - Add endpoints to the API

//////////////////////////////////////
////////////// INIT //////////////////
//////////////////////////////////////

// import express, create router
import express from 'express';
var router = express.Router();

// import database reference
import db from "./database/mongodb.js";


//////////////////////////////////////
//////////// GET ROUTES //////////////
//////////////////////////////////////

router.get("/api", async (req, res) => {
    res.send({ message: "hello" });
});

// 👉 add endpoint to retrieve data here (Chapter 10 wiki) ...

// get all the rows in the database
router.get("/api/feelings", async function (req, res) {
    let result = [];
    try {
        result = await db.getAll();
        if (!result) throw new Error('No data received');
    } catch (err) {
        result = []
    }
    res.json(result);
});

// 👈


// 👉 add test data endpoint here (Chapter 10 wiki) ...

// // add test data
// router.get("/addOneTest", async function (request, reply) {
//     await db.addOneTest();
//     reply.redirect("/");
// });

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
            "id": randomStr() + randomStr(),
            "datetime": new Date()
        }
        result = await db.addOne(doc);
        data = await db.getAll();
    } catch (err) {
        result = { message: err }
    }
    res.json(data);
});
const randomStr = () => Math.random().toString(36).slice(-5);


export default router;