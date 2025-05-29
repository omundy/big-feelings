/**
 *   MongoDB (Simple) - Owen Mundy 2025
 */

//////////////////////////////////////
////////////// PARAMS ////////////////
//////////////////////////////////////

// cluster > database > table
const dbName = "bigFeelings"; // i.e. "database"
const collectionName = "feelings"; // i.e. "table"


//////////////////////////////////////
////////////// DATABASE //////////////
//////////////////////////////////////

// https://github.com/vercel/mongodb-starter/blob/main/lib/mongodb.ts
// https://github.com/mongodb-developer/jumpstart-series/blob/quick-demo/lib/mongodb.js
// https://github.com/mongodb-developer/nextjs-with-mongodb/blob/main/lib/mongodb.ts

// import mongo driver
import { MongoClient } from 'mongodb';
// import dotenv utility
import { } from 'dotenv/config';
//console.log("test", process.env.MONGODB_URI)

// confirm the .env file contains the MONGODB_URI variable
if (!process.env.MONGODB_URI) {
    throw new Error('Invalid/Missing environment variable: "MONGODB_URI"');
}
// save your MongoDB connection string
const uri = process.env.MONGODB_URI;

// module-scoped variables
let client, clientPromise, database, collection;

// create db connection
async function connectToDatabase() {
    try {
        // create MongoDB client, and scoped promise
        client = new MongoClient(uri, {});
        clientPromise = await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
        // create database reference
        database = await client.db(dbName);
        collection = await database.collection(collectionName);
    } catch (err) { console.log("Problem connecting to database", err) }
}
connectToDatabase();

// close connection when server finishes/errors
process.on('SIGINT', async function () {
    await client.close();
    console.log('Database disconnected on app termination');
    process.exit(0);
});





//////////////////////////////////////
/////////// PUBLIC FUNCTIONS /////////
//////////////////////////////////////

const db = {
    connect: async () => {
        return connectToDatabase();
    },
    dbExists: async () => {
        return await client.db("admin").command({ ping: 1 });
    },
    // runQuery: async (sql) => {
    //     return runQuery(sql);
    // },
    // getOne: async () => {
    //     return allQuery(`SELECT * FROM ${table} LIMIT 1;`);
    // },
    getAll: getAll,
    deleteAll: async () => {
        return clearData();
    },
    addTestData: async () => {
        return addTestData();
    },
    addTestRow: async () => {
        return addTestRow();
    },
};
export default db;

//////////////////////////////////////
///////////// FUNCTIONS //////////////
//////////////////////////////////////

async function getAll() {
    try {
        const feelings = await collection.find({}).toArray();
        // console.log(feelings)
        return feelings;
    } catch (err) { console.log("Problem with getAll()", err) }
}


//////////////////////////////////////
////////////// DEBUGGING /////////////
//////////////////////////////////////

async function addTestData() {
    try {
        // Create new documents          
        const data = [{
            "feeling": "Totz Bored",
            "color": "#FF2E24",
            "latitude": 32.067665100,
            "longitude": 34.776332855,
            "datetime": new Date(2025, 5, 7),  // May 7, 1954                                                                                                                                  
        }]
        // Insert the documents into the specified collection        
        return await addTestRow(data);
    } catch (err) { console.error("Problem with addTestData()", err) }
}

// Add a new test row
async function addTestRow(data) {
    // console.log(data);
    try {
        // Insert the documents into the specified collection        
        const response = database.collection(collectionName).insertMany(data);
        return response;
    } catch (err) { console.log("Problem with addTestRow()", err) }
}



// //////////////////////////////////////
// /////////////// HELPERS //////////////
// //////////////////////////////////////

// import * as fs from "fs";
// const colors = JSON.parse(fs.readFileSync("./public/colors.json"));
// const testGeo = JSON.parse(fs.readFileSync("./data/test-geo.json"));
// // console.log(colors);

// // creates data for a row
// async function creatTestData() {
//     let data = colors[Math.floor(Math.random() * colors.length)];
//     let geo = randomLatLng() || "";
//     data.latitude = geo.latitude || "";
//     data.longitude = geo.longitude || "";
//     return data;
// }

// function randomLatLng() {
//     // too random
//     // data.lat = randomNumber(-60,60);
//     // data.lng = randomNumber(-140,150);
//     return testGeo[Math.floor(Math.random() * testGeo.length)];
// }

// function randomNumber(min, max) {
//     min = Number(min);
//     max = Number(max);
//     return Math.random() * (max - min) + min;
// }
