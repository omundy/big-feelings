// nodemon mongodb-test.js

import db from "./mongodb.js";

async function run() {
    try {
        console.log("db.getOne()", await db.getOne());
    } catch (err) {
        console.error("db.getOne() ERROR", err)
    }
    // try {
    //     console.log("db.getAll()", await db.getAll());
    // } catch (err) {
    //     console.error("db.getAll() ERROR", err)
    // }
}
run()