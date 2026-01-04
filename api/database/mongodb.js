/**
 *  mongodb.js - A simple database connection script and interface for MongoDb (customized for Big Feelings)
 *  MIT Owen Mundy 2025
 */

//////////////////////////////////////
///////////// SETTINGS ///////////////
//////////////////////////////////////

// Mongo Atlas is structured like: cluster > database > collection
const databaseName = "bigFeelings";
const collectionName = "feelings"; // in a relational db a collection == table

// relative path to root - leave empty for production | "../../" to run file directly
let basePath = "";


//////////////////////////////////////
//////////// ENVIRONMENT /////////////
//////////////////////////////////////

// import dotenv utility to load saved password strings
import dotenv from 'dotenv'
try {
    dotenv.config({ path: basePath + '.env' })
    // confirm the .env file contains the MONGODB_URI variable
    if (!process.env.MONGODB_URI)
        throw new Error('MONGODB_URI environment variable is missing!');
} catch (err) {
    throw new Error("Problem getting .env file")
}
// save your MongoDB connection string
const uri = process.env.MONGODB_URI;


//////////////////////////////////////
////////////// CONNECT ///////////////
//////////////////////////////////////

// import mongo driver
import { MongoClient, ServerApiVersion } from 'mongodb';

// module-scoped variables
let clientPromise, database, collection;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// Create remote connection to database server
async function connectToDatabase() {
    try {
        // create MongoDB client, and scoped promise
        // client = new MongoClient(uri, {});
        clientPromise = await client.connect();
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Connected to MongoDB!");
        // save database reference
        database = await client.db(databaseName);
        // save collection reference (effectively the table)
        collection = await database.collection(collectionName);
    } catch (err) { console.log("Problem connecting to database", err) }
}
await connectToDatabase();




//////////////////////////////////////
/////////// PUBLIC FUNCTIONS /////////
//////////////////////////////////////

let db;
try {
    db = {
        pingDatabase: async () => {
            return await client.db("admin").command({ ping: 1 });
        },
        getDatabaseStats: async () => await database.command({ dbStats: 1 }),
        getOne: getOne,
        getAll: getAll,
        addOne: addOne,
        dberror: async () => new Error('A test error thrown in mongodb.js'),
        // TESTS
        deleteAll: deleteAll,
        deletePastRows: deletePastRows,
        addOneTest: addOneTest,
        addManyTest: addManyTest,
        collection: async () => collection
    };
} catch (err) { console.log("Problem creating db", err) }
export default db;

//////////////////////////////////////
//////////// DB FUNCTIONS ////////////
//////////////////////////////////////

// db > get one data (via API)
async function getOne() {
    // return await collection.find({}).toArray();
    try {
        const findOneQuery = { feeling: "WTF?" };
        const feelings = await collection.findOne(findOneQuery);
        // console.log(feelings)
        return feelings;
    } catch (err) { console.log("Problem with getAll()", err) }
}
// db > get all data (via API)
async function getAll() {
    // return await collection.find({}).toArray();
    try {
        const feelings = await collection.find({}).toArray();
        // console.log(feelings)
        return feelings;
    } catch (err) { console.log("Problem with getAll()", err) }
}
// db > add data from form (via API)
async function addOne(doc) {
    try {
        let docs = []
        docs.push(doc)
        console.log("✅ addOne() - SUCCESS");
        // Insert the documents into the specified collection        
        return await insertDocuments(docs);
    } catch (err) { console.error("Problem with addOne()", err) }
}
// db > add data
async function insertDocuments(docs) {
    // console.log(docs);
    try {
        // Insert the documents into the specified collection        
        const response = await database
            .collection(collectionName)
            .insertMany(docs, { ordered: false }, function (err, docs) {
                console.log("✅ insertDocuments()", err, docs);
            });
        return response;
    } catch (err) { console.log("Problem with insertDocuments()", err) }
}


//////////////////////////////////////
////////////// TESTING ///////////////
//////////////////////////////////////

const exampleDoc = {
    "feeling": "Totz Bored",
    "color": "#FF2E24",
    "lat": 32.067665100,
    "lng": 34.776332855,
    "datetime": new Date(2025, 5, 7),  // May 7, 2025                                                                                                                                  
};

// db > add random data 
async function addOneTest() {
    try {
        let docs = [];
        // docs.push(exampleDoc);
        docs.push(creatTestDocument());
        let result = await insertDocuments(docs);
        console.log("✅ addOneTest() - SUCCESS");
        return result;
    } catch (err) { console.error("Problem with addOneTest()", err) }
}

// db > add multiple random data 
async function addManyTest(count = 50) {
    try {
        let docs = [];
        // Create new documents   
        for (let i = 0; i < count; i++) {
            docs.push(await creatTestDocument());
        }
        let result = await insertDocuments(docs);
        console.log("✅ addManyTest() - SUCCESS");
        return result;
    } catch (err) { console.error("Problem with addManyTest()", err) }
}

// Deletes all data in the table
async function deleteAll() {
    database.collection(collectionName).deleteMany({})
    console.log("✅ Table is empty");
}
async function deletePastRows(limit = 1) {
    database.collection(collectionName).find({}).limit(limit).forEach(function(doc) {
        database.collection(collectionName).deleteOne({_id: doc._id});
    })
    console.log(`✅ ${limit} have been deleted`);
}





//////////////////////////////////////
/////////////// HELPERS //////////////
//////////////////////////////////////

import * as fs from "fs";
let colors;
try {
    // uses fs because this directory is outside the /api
    colors = JSON.parse(fs.readFileSync(basePath + "public/assets/data/colors.json"));
}
catch (err) {
    throw new Error('Cant import colors');
}



import testGeo from "../data/test-geo.js";

// creates data for a row
function creatTestDocument() {
    let data = colors[Math.floor(Math.random() * colors.length)];
    let testGeo = randomLatLng() || "";
    data._id = randomStr() + randomStr();
    data.lat = Number(testGeo.latitude || ""); // convert to number
    data.lng = Number(testGeo.longitude || "");
    data.datetime = new Date();
    // console.log("creatTestDocument()", data);
    return data;
}

const randomStr = () => Math.random().toString(36).slice(-5);
const randomLatLng = () => testGeo[Math.floor(Math.random() * testGeo.length)];

// these numbers are too random
function randomLatLngNumbers() {
    data.lat = randomNumber(-60, 60);
    data.lng = randomNumber(-140, 150);
}

function randomNumber(min, max) {
    min = Number(min);
    max = Number(max);
    return Math.random() * (max - min) + min;
}
