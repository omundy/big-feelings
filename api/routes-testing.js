// routes-testing.js - Add TESTING endpoints to the API

//////////////////////////////////////
////////////// INIT //////////////////
//////////////////////////////////////

import express from 'express';
var testRouter = express.Router();
import db from "./database/mongodb.js";



//////////////////////////////////////
//////////// TEST ROUTES /////////////
//////////////////////////////////////

// - These endpoints are accessed directly and then browser is redirected back to index.html
// - DO NOT MAKE THIS PUBLIC!

testRouter.get("/test", async (req, res) => {
    res.send(testView("/test", "Hello from Express on Vercel"));
});

testRouter.get('/test/error', async function (req, res) {
    // Express will catch this on its own.
    throw new Error('This is a test error thrown in the route handler');
})
testRouter.get('/test/dberror', async function (req, res) {
    let result = await db.dberror();
    res.send(testView("/test/dberror", result));
})
testRouter.get('/test/dberrorcaught', async function (req, res) {
    let result;
    try {
        result = await db.dberror();
    }
    catch (err) {
        result = err;
    }
    res.send(testView("/test/dberrorcaught", `dberrorcaught... ${JSON.stringify(result)}`));
})

testRouter.get("/test/pingDatabase", async (req, res) => {
    let result;
    try {
        result = await db.pingDatabase();
    }
    catch (err) {
        console.log("Problem with getAll()", err);
        result = err;
    }
    res.send(testView("/testConnection", `Database connection is... ${JSON.stringify(result)}`));
});

testRouter.get("/test/getAll", async (req, res) => {
    let result;
    let output = "";
    try {
        result = await db.getAll()
        console.log("result", result);
        if (!result) throw new Error('No data received');
        result.forEach(element => {
            output += `<pre>${JSON.stringify(element)}</pre>`
        });
    } catch (err) {
        output = err
    }
    res.send(testView("/test/getAll()", output));
});

testRouter.get("/test/addOneTest", async (req, res) => {
    let response = await db.addOneTest()
    res.send(testView("/test/addOneTest()", `<pre>${JSON.stringify(response)}</pre>`));
});

testRouter.get("/test/addManyTest", async (req, res) => {
    let response = await db.addManyTest()
    res.send(testView("/test/addManyTest()", `<pre>${JSON.stringify(response)}</pre>`));
});

// remove old database entries
testRouter.get("/test/delete10PastRows", async function (req, res) {
    let response = await db.deletePastRows(10);
    res.send(testView("/test/delete10PastRows()", `<pre>${JSON.stringify(response)}</pre>`));
});
testRouter.get("/test/delete100PastRows", async function (req, res) {
    let response = await db.deletePastRows(100);
    res.send(testView("/test/delete100PastRows()", `<pre>${JSON.stringify(response)}</pre>`));
});

// remove all database entries
testRouter.get("/test/deleteAll", async function (req, res) {
    let response = await db.deleteAll();
    res.send(testView("/test/deleteAll()", `<pre>${JSON.stringify(response)}</pre>`));
});


const testingEndpoints = [
    '/',
    '/test',
    '/test/error',
    '/test/dberror',
    '/test/dberrorcaught',
    '/test/pingDatabase',
    '/test/getAll',
    '/test/addOneTest',
    '/test/addManyTest',
    '/test/delete10PastRows',
    '/test/delete100PastRows',
    '/test/deleteAll',
    '/api',
    '/api/feelings'
]

/**
 * Returns a test view (HTML) with links to the testingEndpoints
 */
const testView = (title, str) => {
    let links = `<html><head><style>body{font:16px Arial; margin: 1rem;"</style></head><body><div> <a href="/">Home</a>`
    testingEndpoints.forEach((link) => {
        links += ` <a href="${link}">${link}</a> `
    })
    links += `</div> <h3>${title}</h3>${str}</body></html>`;
    return links;
}




export default testRouter;