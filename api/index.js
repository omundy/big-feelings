//////////////////////////////////////
/////////////// SERVER ///////////////
//////////////////////////////////////

// create express server
import express from "express";
const app = express();

// make all files inside /public available using static
import path from "path";
import { URL } from "url";
const __filename = new URL("", import.meta.url).pathname;
const __dirname = new URL(".", import.meta.url).pathname;
app.use(express.static(path.join(__dirname, '../public')));


app.use(express.json());


import bodyParser from "body-parser";
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true // support hierarchical data
}));

import morganBody from 'morgan-body';
morganBody(app, { logAllReqHeader: true, maxBodyLength: 5000 });

app.use(function (error, req, res, next) {
    console.log(req)
    next();
});


// allow access to all 
import cors from 'cors';
app.use(cors());

// add a separate file for routes
import router from './routes.js';
app.use('/', router);
import testRouter from './routes-testing.js';

// import dotenv utility to load saved password strings
import dotenv from 'dotenv';
try {
    let basePath = "";
    dotenv.config({ path: basePath + '.env' })
    if (!process.env.NODE_ENV)
        throw new Error('NODE_ENV environment variable is missing!');
    // console.log(process.env.NODE_ENV);
    if (process.env.NODE_ENV == "test")
        app.use('/', testRouter); 
} catch (err) {
    throw new Error("Problem getting .env file")
}








// start server
app.listen(3000, () => console.log("Your app is listening at: http://localhost:3000."));

// export app for vercel
export default app;
