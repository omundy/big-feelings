// routes-testing.js 
// - Adds TESTING / EXAMPLE endpoints to the API
// - Endpoints are accessed directly and then browser is redirected back to index.html
// - DO NOT MAKE THIS PUBLIC!

//////////////////////////////////////
////////////// INIT //////////////////
//////////////////////////////////////

import express from 'express';
var testRouter = express.Router();
import db from "./database/mongodb.js";



//////////////////////////////////////
//////////// TEST ROUTES /////////////
//////////////////////////////////////

testRouter.get("/test", async (req, res) => {
    res.send(testView("/test", `<pre>${JSON.stringify({ "message": "hello" }, null, 2)}</pre>`));
});
testRouter.get("/test/getDatabaseStats", async (req, res) => {
    const result = await db.getDatabaseStats();
    res.send(testView("/test/getDatabaseStats", `<pre>${JSON.stringify(result, null, 2)}</pre>`));
});
testRouter.get("/test/getIndexes", async (req, res) => {
    const result = await db.getIndexes();
    res.send(testView("/test/getIndexes", `<pre>${JSON.stringify(result, null, 2)}</pre>`));
});
testRouter.get("/test/getMaxId", async (req, res) => {
    const result = await db.getMaxId();
    //  console.log(Number(result[0]));
    res.send(testView("/test/getMaxId", `<pre>${JSON.stringify(result, null, 2)}</pre>`));
});
testRouter.get("/test/pingDatabase", async (req, res) => {
    let result;
    try {
        result = await db.pingDatabase();
    }
    catch (err) {
        console.log("Problem with getAll()", err);
        result = err;
    }
    res.send(testView("/test/pingDatabase", `<pre>${JSON.stringify(result, null, 2)}</pre>`));
});


//////////////////////////////////////
/////////// ERROR ROUTES /////////////
//////////////////////////////////////

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


//////////////////////////////////////
//////////// FIND ROUTES /////////////
//////////////////////////////////////

// get entry by id
testRouter.get("/test/findById/:id", async function (req, res) {
    let output = "";
    try {
        const result = await db.findById(req.params.id);
        if (!result) throw new Error('No data received');
        output = await formatResult(result);
    } catch (err) {
        output = err
    }
    res.send(testView(`/test/findById(${req.params.id})`, output));
});
// get all entries
testRouter.get("/test/getOne", async (req, res) => {
    let output = "";
    try {
        const result = await db.getOne();
        if (!result) throw new Error('No data received');
        output = await formatResult(result);
    } catch (err) {
        output = err
    }
    res.send(testView("/test/getOne()", output));
});
// get all entries
testRouter.get("/test/getAll", async (req, res) => {
    let result;
    let all = await getAll();
    res.send(testView("", all));
});
// reused to "show all after operations" 
async function getAll() {
    let result;
    let output = "";
    try {
        result = await db.getAll();
        if (!result) throw new Error('No data received');
        output += `<h3>/test/getAll() (${result.length})</h3>`;
        output += await formatResult(result);
    } catch (err) {
        output = err
    }
    return output;
}
// format all results the same
async function formatResult(result) {
    let output = "";
    try {
        if (!result) throw new Error('No data received');
        console.log("result.length", result.length);
        result.forEach(element => {
            output += `<a href="/test/findById/${element._id}">🤔</a> <a href="/test/deleteById/${element._id}">❌</a> <pre class="inline">${JSON.stringify(element)}</pre><br>`
        });
    } catch (err) {
        output = err
    }
    return output;
}


//////////////////////////////////////
///////////// ADD ROUTES /////////////
//////////////////////////////////////

// add one test entry
testRouter.get("/test/addOneTest", async (req, res) => {
    let response = await db.addOneTest();
    let all = await getAll();
    res.send(testView("/test/addOneTest()", `<pre>${JSON.stringify(response)}</pre>${all}`));
});
// add n test entries
testRouter.get("/test/addManyTest", async (req, res) => {
    let response = await db.addManyTest(10)
    let all = await getAll();
    res.send(testView("/test/addManyTest(10)", `<pre>${JSON.stringify(response)}</pre>${all}`));
});

//////////////////////////////////////
/////////// DELETE ROUTES ////////////
//////////////////////////////////////

// remove n database entries
testRouter.get("/test/delete10PastRows", async function (req, res) {
    let response = await db.deletePastRows(10);
    let all = await getAll();
    res.send(testView("/test/delete10PastRows()", `<pre>${JSON.stringify(response)}</pre>${all}`));
});
// remove n database entries
testRouter.get("/test/delete100PastRows", async function (req, res) {
    let response = await db.deletePastRows(100);
    let all = await getAll();
    res.send(testView("/test/delete100PastRows()", `<pre>${JSON.stringify(response)}</pre>${all}`));
});
// remove all database entries
testRouter.get("/test/deleteAll", async function (req, res) {
    let response = await db.deleteAll();
    let all = await getAll();
    res.send(testView("/test/deleteAll()", `<pre>${JSON.stringify(response)}</pre>${all}`));
});
// deleteById
testRouter.get("/test/deleteById/:id", async function (req, res) {
    let response = await db.deleteById(req.params.id);
    let all = await getAll();
    res.send(testView(`/test/deleteById(${req.params.id})`, `<pre>${JSON.stringify(response)}</pre>${all}`));
});


export default testRouter;


//////////////////////////////////////
/////////////// VIEW /////////////////
//////////////////////////////////////

const testingEndpoints = [
    ' ✅',
    '/api',
    '/api/feelings',
    ' 🤔',
    '/test',
    '/test/pingDatabase',
    '/test/getDatabaseStats',
    '/test/getIndexes',
    '/test/getMaxId',
    ' 🔍',
    // '/test/findById/?', // needs id to work, linked in getAll
    '/test/getOne',
    '/test/getAll',
    ' ➕',
    '/test/addOneTest',
    '/test/addManyTest',
    '- 😵',
    '/test/error',
    '/test/dberror',
    '/test/dberrorcaught',
    ' ❌',
    '/test/delete10PastRows',
    '/test/delete100PastRows',
    '/test/deleteAll',
    // '/test/deleteById/?', // needs id to work, linked in getAll
];

/**
 * Returns a test view (HTML) with links to the testingEndpoints
 */
const testView = (title, str) => {
    let links = `<html><head>
        <style>
            body{font:16px Arial; margin: 1rem;} 
            span{display:inline-block;margin-right:.5rem;}
            pre{font-size:14px;}
            pre.inline{font-size:14px;display:inline-block;}
        </style></head><body><div> `
    testingEndpoints.forEach((str) => {
        if (str[0] == "/")
            links += `<span><a href="${str}">${str}</a></span>`;
        else if (str[0] == " ")
            links += `<span>${str}</span>`;
        else
            links += `<br><span>${str}</span>`;
    })
    links += `</div> <h3>${title}</h3>${str}</body></html>`;
    return links;
}

